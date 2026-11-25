import { definePlay, defineWorkflow } from "@cargo-ai/cdk";
import { z } from "zod";

import { slack } from "../../shared/connectors/slack";
import { playsFolder } from "../folders";
import { accounts } from "../models/accounts";

// The Slack channel every ready account is posted to: #gtm-engine, resolved to
// its id through the Slack connector's autocomplete (listChannels) on
// 2026-11-25 (operator decision; it was #sales). The Cargo Slack app must be a
// member of the channel.
// An id, not a name: names collide. Locked here so no run can post anywhere
// else.
const slackChannelId = "C0CLP38UH8S";

// One working-list account that just crossed `readyThreshold`: one Slack
// message with the score. Nothing is written to a CRM and nothing is sent to anyone at the
// account; what happens after the ping is the team's, or a sequencer's on
// `ready_now_accounts`.
const routeReadyAccount = defineWorkflow(
  "route_ready_account",
  {
    // Unify Accounts columns: its own, and the score this skill adds. The
    // metric is read as `metric__readiness_score`, the name the read side
    // gives an additional column.
    input: z.object({
      id: z.string(),
      domain: z.string().optional(),
      metric__readiness_score: z.number(),
    }),
    output: z.object({ status: z.enum(["posted"]) }),
    uses: { slack },
    imports: { slackChannelId },
  },
  ({ input, uses }) => {
    // Field names follow standup's locked postMessage use. Confirm them with
    // `cargo-ai project types` after the Slack connector is authorized.
    uses.slack.postMessage({
      channelId: slackChannelId,
      format: "markdown",
      disableUnfurling: true,
      body: `*${input.domain} is ready* (readiness score ${input.metric__readiness_score})\nIts recent signals crossed the ready line this hour. The events behind it are on the account's Account Events.`,
    });

    return { status: "posted" as const };
  },
);

// Routes every account on the working list that enters `ready_now`.
//
// THE FIT GATE. Only accounts with `on_working_list` = yes are posted: a
// TAM_MASTER_FINAL company at Series B or later (funding_stage B+) that passed
// the ICP gate (icp_status qualified) and is not in enterprise_parked. An
// account outside the working list is never routed, however hot it is; it
// still gets a score and a stage, and shows in the two segments.
//
// `changeKinds: ["added"]` is what makes an account posted once per climb.
// Unify Accounts is rebuilt every hour, and the play diffs the filtered rows on
// the account id, so an account that stays ready creates no run. One that
// falls below the line and climbs back is posted again, which is the point: a
// new signal brought it back.
//
// Cron at :20, after Account Events at :00 and Unify Accounts at :10, so a
// tick reads the score the same hour's events produced. Ticks with nothing added
// create nothing.
//
// Ships disabled. Enabling is the last yes after the pilot query has set the
// thresholds (references/run.md). Then execute once by hand only if the team
// wants the accounts already ready posted too: `added` does not backfill the
// rows that were ready while the play was off.
export const routeReadyAccounts = definePlay("route_ready_accounts", {
  description:
    "Posts each working-list account whose decaying readiness score just crossed the ready line to #gtm-engine, with the score.",
  folder: playsFolder,
  model: accounts,
  workflow: routeReadyAccount,
  filter: {
    conjonction: "and",
    groups: [
      {
        conjonction: "and",
        conditions: [
          {
            kind: "string",
            columnSlug: accounts.columns.computed__readiness_stage,
            operator: "is",
            values: ["ready_now"],
          },
          {
            kind: "string",
            columnSlug: accounts.columns.computed__on_working_list,
            operator: "is",
            values: ["yes"],
          },
        ],
      },
    ],
  },
  isEnabled: true,
  runCreationRule: "noConcurrency",
  changeKinds: ["added"],
  schedule: { type: "cron", cron: "20 * * * *" },
});
