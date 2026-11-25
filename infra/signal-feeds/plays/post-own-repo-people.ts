import { definePlay, defineWorkflow } from "@cargo-ai/cdk";
import { z } from "zod";

import { playsFolder } from "../../gtm-factory/folders";
import { slack } from "../../shared/connectors/slack";
import { githubSignals } from "../models/github-signals";
import { visitorsChannelId } from "../settings";

// One person at a real company who opened an issue or pull request, or started
// or commented on a discussion, on one of our own repos: one line in #visitors.
const postOwnRepoPerson = defineWorkflow(
  "signal_feeds_post_own_repo_person",
  {
    input: z.object({
      login: z.string(),
      person_name: z.string().optional(),
      company_name: z.string().optional(),
      company_domain: z.string().optional(),
      repo: z.string(),
      action: z.string(),
      url: z.string().optional(),
    }),
    output: z.object({ status: z.enum(["posted"]) }),
    uses: { slack },
    imports: { visitorsChannelId },
  },
  ({ input, uses }) => {
    uses.slack.postMessage({
      channelId: visitorsChannelId,
      format: "markdown",
      disableUnfurling: true,
      body: `*${input.person_name}* (<https://github.com/${input.login}|${input.login}>) at *${input.company_name}* ${input.company_domain}: ${input.action} on ${input.repo}\n${input.url}`,
    });
    return { status: "posted" as const };
  },
);

// Every new github_signals row on our own repos (repo_kind own), once, hourly
// at :52. Every row there is already a person at a real company.
export const postOwnRepoPeople = definePlay("signal_feeds_post_own_repo_people", {
  name: "Signal feeds: our repos' people to #visitors",
  description:
    "Posts each new person at a real company who opened an issue, PR or discussion on hydra-db/hydradb or hydra-db/selfgraph to #visitors, once.",
  folder: playsFolder,
  model: githubSignals,
  workflow: postOwnRepoPerson,
  filter: {
    conjonction: "and",
    groups: [
      {
        conjonction: "and",
        conditions: [
          { kind: "string", columnSlug: "repo_kind", operator: "is", values: ["own"] },
        ],
      },
    ],
  },
  schedule: { type: "cron", cron: "52 * * * *" },
  isEnabled: true,
  runCreationRule: "noConcurrency",
  changeKinds: ["added"],
});
