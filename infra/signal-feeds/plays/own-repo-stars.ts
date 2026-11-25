import { definePlay, defineWorkflow } from "@cargo-ai/cdk";
import { z } from "zod";

import { playsFolder } from "../../gtm-factory/folders";
import { tamCandidates } from "../../gtm-factory/models/tam-candidates";
import { github } from "../connectors";
import { githubSignals } from "../models/github-signals";
import {
  hydradbStargazers,
  selfgraphStargazers,
} from "../models/own-repo-stargazers";
import { resolveGithubEmployer } from "../scripts/resolve-github-employer";

// One new star on our own repos: the person's GitHub profile, and when it
// names a real company, a github_signals row and the company to the ICP gate
// (plays/post-own-repo-people.ts posts it to #visitors). A personal, student
// or empty-company profile is dropped.
const starWorkflow = (slug: string) =>
  defineWorkflow(
    slug,
    {
      input: z.object({
        username: z.string(),
        starred_at: z.string().optional(),
        computed__repo: z.string(),
      }),
      output: z.object({ result: z.string() }),
      uses: { github },
      imports: { githubSignals, tamCandidates, resolveGithubEmployer },
    },
    ({ input, uses, model }) => {
      const user = uses.github.getUser({ userName: input.username }, { retry: 2 });
      const employer = resolveGithubEmployer({ user });
      if (employer.known) {
        model.upsert({
          modelUuid: githubSignals.uuid,
          matchingColumnSlug: "key",
          matchingValue: `${input.computed__repo}:star:${input.username}`,
          mappings: [
            { columnSlug: "key", value: `${input.computed__repo}:star:${input.username}` },
            { columnSlug: "repo", value: input.computed__repo },
            { columnSlug: "repo_kind", value: "own" },
            { columnSlug: "action", value: "star" },
            { columnSlug: "url", value: `https://github.com/${input.computed__repo}` },
            { columnSlug: "occurred_at", value: input.starred_at || "" },
            { columnSlug: "login", value: input.username },
            { columnSlug: "person_name", value: employer.person_name },
            { columnSlug: "person_url", value: `https://github.com/${input.username}` },
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
            { columnSlug: "signal_detail", value: `star on ${input.computed__repo}` },
            { columnSlug: "last_signal_at", value: new Date() },
          ],
        });
        return { result: "kept" };
      }
      return { result: "no_company" };
    },
  );

// Every row new to hydradb_stargazers or selfgraph_stargazers is a new
// stargazer (the GitHub extractor leaves starred_at empty, so the date cannot
// be used), at :47 after each 12-hour sync, once per person. These plays were
// created enabled, so their first deploy recorded the 13,000 existing stars as
// already seen: only stars from then on run. 0 credits.
export const hydradbNewStargazers = definePlay("signal_feeds_hydradb_new_stargazers", {
  name: "Signal feeds: new hydradb stargazers",
  description:
    "Each new stargazer of hydra-db/hydradb (a new hydradb_stargazers row) from someone at a real company: a github_signals row, and the company to the ICP gate.",
  folder: playsFolder,
  model: hydradbStargazers,
  workflow: starWorkflow("signal_feeds_hydradb_new_stargazers_workflow"),
  schedule: { type: "cron", cron: "47 2,14 * * *" },
  isEnabled: true,
  runCreationRule: "once",
  changeKinds: ["added"],
});

export const selfgraphNewStargazers = definePlay("signal_feeds_selfgraph_new_stargazers", {
  name: "Signal feeds: new selfgraph stargazers",
  description:
    "Each new stargazer of hydra-db/selfgraph (a new selfgraph_stargazers row) from someone at a real company: a github_signals row, and the company to the ICP gate.",
  folder: playsFolder,
  model: selfgraphStargazers,
  workflow: starWorkflow("signal_feeds_selfgraph_new_stargazers_workflow"),
  schedule: { type: "cron", cron: "47 2,14 * * *" },
  isEnabled: true,
  runCreationRule: "once",
  changeKinds: ["added"],
});

// Retired: these filtered on a 48-hour starred_at window that never matched,
// since the extractor leaves starred_at empty. Kept switched off rather than
// deleted (a deploy never prunes), and replaced by the two plays above under
// new slugs, so the existing stars were never counted as new.
const recentOnly = {
  conjonction: "and" as const,
  groups: [
    {
      conjonction: "and" as const,
      conditions: [
        {
          kind: "string" as const,
          columnSlug: "computed__recent_star",
          operator: "is" as const,
          values: ["yes"],
        },
      ],
    },
  ],
};

export const hydradbStars = definePlay("signal_feeds_hydradb_stars", {
  name: "Signal feeds: new hydradb stars",
  description:
    "Each new star on hydra-db/hydradb from someone at a real company: a github_signals row, and the company to the ICP gate.",
  folder: playsFolder,
  model: hydradbStargazers,
  workflow: starWorkflow("signal_feeds_hydradb_stars_workflow"),
  filter: recentOnly,
  schedule: { type: "cron", cron: "47 2,14 * * *" },
  isEnabled: false,
  runCreationRule: "once",
  changeKinds: ["added"],
});

export const selfgraphStars = definePlay("signal_feeds_selfgraph_stars", {
  name: "Signal feeds: new selfgraph stars",
  description:
    "Each new star on hydra-db/selfgraph from someone at a real company: a github_signals row, and the company to the ICP gate.",
  folder: playsFolder,
  model: selfgraphStargazers,
  workflow: starWorkflow("signal_feeds_selfgraph_stars_workflow"),
  filter: recentOnly,
  schedule: { type: "cron", cron: "47 2,14 * * *" },
  isEnabled: false,
  runCreationRule: "once",
  changeKinds: ["added"],
});
