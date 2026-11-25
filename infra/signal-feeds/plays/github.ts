import { definePlay, defineWorkflow } from "@cargo-ai/cdk";
import { z } from "zod";

import { playsFolder } from "../../gtm-factory/folders";
import { tamCandidates } from "../../gtm-factory/models/tam-candidates";
import { github, githubApi } from "../connectors";
import { githubSignals } from "../models/github-signals";
import { signalFeedInputs } from "../models/signal-feed-inputs";
import { githubWindow } from "../scripts/github-window";
import { pickGithubPeople } from "../scripts/pick-github-people";
import { resolveGithubEmployer } from "../scripts/resolve-github-employer";
import { githubWindowHours, maxGithubPeoplePerRepo } from "../settings";

// One run per watched repo, every 12 hours. Reads the repo's new issue and
// pull request authors from the last 12 hours (GitHub REST), and its
// discussion authors and commenters from the same window (GitHub GraphQL, the
// 20 discussions most recently updated with their last 10 comments), looks
// each person up (Cargo's GitHub connector), and keeps only people whose
// profile names a real company: a github_signals row and the company to the
// ICP gate (plays/post-own-repo-people.ts posts our own repos' to #visitors).
// Stars are read by their own play (plays/github-stars.ts). Discussions need
// an authenticated call: if GITHUB_TOKEN ever stops being sent as
// "Bearer <token>", that call fails and is skipped (continueOnFailure) and the
// run reads issues and pull requests only. `hours` overrides the window for a
// test run; the play never sets it.
export const watchRepo = defineWorkflow(
  "signal_feeds_github_workflow",
  {
    input: z.object({
      value: z.string(),
      kind: z.string().optional(),
      hours: z.number().optional(),
    }),
    output: z.object({ result: z.string() }),
    uses: { githubApi, github },
    imports: {
      githubSignals,
      tamCandidates,
      githubWindow,
      pickGithubPeople,
      resolveGithubEmployer,
      githubWindowHours,
      maxGithubPeoplePerRepo,
    },
  },
  ({ input, uses, model }) => {
    const span = githubWindow({ repo: input.value, hours: input.hours || githubWindowHours });
    // bodyFormat is required by the action but missing from its generated type.
    const issues = uses.githubApi.call({
      url: span.issuesUrl,
      method: "get",
      bodyFormat: "json",
    } as { url: string; method: "get" }, { retry: 3, continueOnFailure: true });
    const discussions = uses.githubApi.call({
      url: span.graphqlUrl,
      method: "post",
      bodyFormat: "json",
      bodyJson: span.discussionsBody,
    } as { url: string; method: "post" }, { retry: 3, continueOnFailure: true });
    const picked = pickGithubPeople({
      issues,
      discussions,
      since: span.since,
      repo: input.value,
      maxPeople: maxGithubPeoplePerRepo,
    });

    for (const person of picked.people as unknown as Iterable<(typeof picked.people)[number]>) {
      const user = uses.github.getUser(
        { userName: person.login },
        { retry: 2, continueOnFailure: true },
      );
      const employer = resolveGithubEmployer({ user });
      if (employer.known) {
        model.upsert({
          modelUuid: githubSignals.uuid,
          matchingColumnSlug: "key",
          matchingValue: person.key,
          mappings: [
            { columnSlug: "key", value: person.key },
            { columnSlug: "repo", value: input.value },
            { columnSlug: "repo_kind", value: input.kind || "primitive" },
            { columnSlug: "action", value: person.action },
            { columnSlug: "url", value: person.url },
            { columnSlug: "occurred_at", value: person.occurred_at },
            { columnSlug: "login", value: person.login },
            { columnSlug: "person_name", value: employer.person_name },
            { columnSlug: "person_url", value: `https://github.com/${person.login}` },
            { columnSlug: "person_bio", value: employer.person_bio },
            { columnSlug: "company_name", value: employer.company_name },
            { columnSlug: "company_domain", value: employer.company_domain },
            { columnSlug: "seen_at", value: new Date() },
          ],
        });
        model.upsert({
          modelUuid: tamCandidates.uuid,
          matchingColumnSlug: "key",
          matchingValue: employer.candidate_key,
          mappings: [
            { columnSlug: "key", value: employer.candidate_key },
            { columnSlug: "name", value: employer.company_name },
            { columnSlug: "domain", value: employer.company_domain },
            { columnSlug: "signal_source", value: "github_signals" },
            { columnSlug: "signal_detail", value: `${person.action} on ${input.value}: ${person.url}` },
            { columnSlug: "last_signal_at", value: new Date() },
          ],
        });
      }
    }
    return { result: "done" };
  },
);

// Every watched repo (signal_feed_inputs rows with feed "github") at 02:37 and
// 14:37 UTC. 0 credits: GitHub's REST API and Cargo's GitHub connector are
// free; the github_api connector's rate limit (600 calls an hour, spread)
// stretches one sweep of two calls a repo over a few minutes.
export const githubEvery12h = definePlay("signal_feeds_github_12h", {
  name: "Signal feeds: GitHub repos, every 12 hours",
  description:
    "For every watched repo: new issue and PR authors, discussion authors and commenters at real companies into github_signals, and their companies to the ICP gate.",
  folder: playsFolder,
  model: signalFeedInputs,
  workflow: watchRepo,
  filter: {
    conjonction: "and",
    groups: [
      {
        conjonction: "and",
        conditions: [
          { kind: "string", columnSlug: "feed", operator: "is", values: ["github"] },
        ],
      },
    ],
  },
  schedule: { type: "cron", cron: "37 2,14 * * *" },
  isEnabled: true,
  runCreationRule: "always",
  changeKinds: ["added", "updated", "unchanged"],
});
