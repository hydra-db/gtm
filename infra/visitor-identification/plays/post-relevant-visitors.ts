import { definePlay, defineWorkflow } from "@cargo-ai/cdk";
import { z } from "zod";

import { slack } from "../../shared/connectors/slack";
import { playsFolder } from "../folders";
import { websiteVisitors } from "../models/companies";

// #visitors, resolved to its id through the Slack connector's autocomplete
// (listChannels) on 2026-11-24. An id, not a name: names collide. Locked here
// so no run can post anywhere else.
const slackChannelId = "C0CMJ11QKTJ";

// One relevant visiting company: one Slack message. It says what is known, a
// company, never a person: a visit means someone on that company's network
// read hydradb.com.
const postRelevantVisitor = defineWorkflow(
  "post_relevant_visitor",
  {
    input: z.object({
      name: z.string().optional(),
      website: z.string().optional(),
      industry: z.string().optional(),
      size: z.string().optional(),
      last_seen: z.string().optional(),
      computed__relevance: z.string(),
      lookup__tmf_funding_stage: z.string().optional(),
    }),
    output: z.object({ status: z.enum(["posted"]) }),
    uses: { slack },
    imports: { slackChannelId },
  },
  ({ input, uses }) => {
    uses.slack.postMessage({
      channelId: slackChannelId,
      format: "markdown",
      disableUnfurling: true,
      body: `*${input.name} (${input.website}) visited hydradb.com* (${input.computed__relevance === "working_list" ? "on the working list" : "passed the ICP gate"})\n${input.industry}, ${input.size}, funding stage ${input.lookup__tmf_funding_stage}. Last seen ${input.last_seen}.\nCompany-level: someone on this company's network read the site. It does not say who.`,
    });

    return { status: "posted" as const };
  },
);

// Posts each visiting company that is relevant: on the working list, or past
// the ICP gate (`relevance` on the companies model). Every other visitor stays
// in the model, unposted.
//
// `changeKinds: ["added"]`: a company is posted once, when it first shows up
// as relevant (its first visit, or a later visit once it qualifies). A return
// visit by a company already posted creates no run.
//
// Hourly at :40, after Snitcher's 30-minute fetch has had time to land rows.
// Ships disabled: enabling is the operator's call. Enabling from the project
// skips the rows already relevant, so only new visitors are posted.
export const postRelevantVisitors = definePlay("post_relevant_visitors", {
  description:
    "Posts each website-visiting company on the working list or past the ICP gate to #visitors, once.",
  folder: playsFolder,
  model: websiteVisitors,
  workflow: postRelevantVisitor,
  filter: {
    conjonction: "and",
    groups: [
      {
        conjonction: "and",
        conditions: [
          {
            kind: "string",
            columnSlug: websiteVisitors.columns.computed__relevance,
            operator: "is",
            values: ["working_list", "icp_qualified"],
          },
        ],
      },
    ],
  },
  isEnabled: true,
  runCreationRule: "noConcurrency",
  changeKinds: ["added"],
  schedule: { type: "cron", cron: "40 * * * *" },
});
