import { definePlay, defineWorkflow } from "@cargo-ai/cdk";
import { z } from "zod";

import { playsFolder } from "../../gtm-factory/folders";
import { tamCandidates } from "../../gtm-factory/models/tam-candidates";
import { github, githubApi } from "../connectors";
import { githubSignals } from "../models/github-signals";
import { githubStars } from "../models/github-stars";
import { signalFeedInputs } from "../models/signal-feed-inputs";
import { pickStars } from "../scripts/pick-stars";
import { resolveGithubEmployer } from "../scripts/resolve-github-employer";
import { starsQuery } from "../scripts/stars-query";
import { githubWindowHours, maxGithubStarsPerRepo } from "../settings";

// DISABLED: GitHub refuses repository.stargazers over GraphQL to the
// workspace's fine-grained GITHUB_TOKEN too ("Resource not accessible by
// personal access token", tested on mem0ai/mem0 and hydra-db/hydradb on
// 2026-11-25). Switch it on once GITHUB_TOKEN is a classic PAT with
// public_repo or a GitHub App token.
//
// One run per watched (primitive) repo, every 12 hours: the repo's stars from
// the last 12 hours over GitHub's GraphQL API (the REST stargazer listing is
// closed to our token since June 2026). Kept apart from plays/github.ts so the
// issue and discussion feed never depends on stargazer access. Every star
// becomes a github_stars row; the person is looked up (Cargo's GitHub
// connector) and, when their profile names a real company, becomes a
// github_signals row and the company goes to the ICP gate. Our own repos'
// stars come from Cargo's GitHub connector (plays/own-repo-stars.ts).
// `hours` overrides the window for a test run; the play never sets it.
export const watchRepoStars = defineWorkflow(
  "signal_feeds_github_stars_workflow",
  {
    input: z.object({
      value: z.string(),
      kind: z.string().optional(),
      hours: z.number().optional(),
    }),
    output: z.object({ result: z.string() }),
    uses: { githubApi, github },
    imports: {
      githubStars,
      githubSignals,
      tamCandidates,
      starsQuery,
      pickStars,
      resolveGithubEmployer,
      githubWindowHours,
      maxGithubStarsPerRepo,
    },
  },
  ({ input, uses, model }) => {
    const query = starsQuery({ repo: input.value, hours: input.hours || githubWindowHours });
    // bodyFormat is required by the action but missing from its generated type.
    const response = uses.githubApi.call({
      url: query.graphqlUrl,
      method: "post",
      bodyFormat: "json",
      bodyJson: query.body,
    } as { url: string; method: "post" }, { retry: 3 });
    const picked = pickStars({
      response,
      since: query.since,
      repo: input.value,
      maxStars: maxGithubStarsPerRepo,
    });

    for (const star of picked.stars as unknown as Iterable<(typeof picked.stars)[number]>) {
      model.upsert({
        modelUuid: githubStars.uuid,
        matchingColumnSlug: "key",
        matchingValue: star.key,
        mappings: [
          { columnSlug: "key", value: star.key },
          { columnSlug: "repo", value: input.value },
          { columnSlug: "repo_kind", value: input.kind || "primitive" },
          { columnSlug: "login", value: star.login },
          { columnSlug: "starred_at", value: star.starred_at },
          { columnSlug: "company", value: star.company },
          { columnSlug: "email", value: star.email },
          { columnSlug: "website_url", value: star.website_url },
          { columnSlug: "seen_at", value: new Date() },
        ],
      });
      const user = uses.github.getUser(
        { userName: star.login },
        { retry: 2, continueOnFailure: true },
      );
      const employer = resolveGithubEmployer({ user });
      if (employer.known) {
        model.upsert({
          modelUuid: githubSignals.uuid,
          matchingColumnSlug: "key",
          matchingValue: star.key,
          mappings: [
            { columnSlug: "key", value: star.key },
            { columnSlug: "repo", value: input.value },
            { columnSlug: "repo_kind", value: input.kind || "primitive" },
            { columnSlug: "action", value: "star" },
            { columnSlug: "url", value: `https://github.com/${input.value}` },
            { columnSlug: "occurred_at", value: star.starred_at },
            { columnSlug: "login", value: star.login },
            { columnSlug: "person_name", value: employer.person_name },
            { columnSlug: "person_url", value: `https://github.com/${star.login}` },
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
            { columnSlug: "signal_detail", value: `star on ${input.value}: https://github.com/${input.value}` },
            { columnSlug: "last_signal_at", value: new Date() },
          ],
        });
      }
    
    }
    return { result: "done" };
  },
);

// Every watched primitive repo (signal_feed_inputs rows with feed "github"
// and kind "primitive") at 02:27 and 14:27 UTC, once switched on. 0 credits:
// one GraphQL call a repo (github_api, inside its 600 an hour) and free
// profile lookups.
export const githubStarsEvery12h = definePlay("signal_feeds_github_stars_12h", {
  name: "Signal feeds: GitHub stars, every 12 hours",
  description:
    "For every watched primitive repo: new stars over GitHub GraphQL into github_stars, stargazers at real companies into github_signals and their companies to the ICP gate. Off until GITHUB_TOKEN can read stargazers.",
  folder: playsFolder,
  model: signalFeedInputs,
  workflow: watchRepoStars,
  filter: {
    conjonction: "and",
    groups: [
      {
        conjonction: "and",
        conditions: [
          { kind: "string", columnSlug: "feed", operator: "is", values: ["github"] },
          { kind: "string", columnSlug: "kind", operator: "is", values: ["primitive"] },
        ],
      },
    ],
  },
  schedule: { type: "cron", cron: "27 2,14 * * *" },
  isEnabled: false,
  runCreationRule: "always",
  changeKinds: ["added", "updated", "unchanged"],
});
