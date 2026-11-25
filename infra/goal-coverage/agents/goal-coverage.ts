import { defineAgent } from "@cargo-ai/cdk";

import { goalCoveragePrompt } from "./goal-coverage.prompt";
import { anthropic } from "../../gtm-factory/agents/outreach-drafter";
import { slack } from "../../shared/connectors/slack";
import { agentsFolder } from "../folders";
import { goalCoverageUser } from "../users";

// Goal coverage: a Claude Code harness agent, not a streamText agent.
//
// Every Sunday it first puts last week's funnel (leads into lemlist, Engaged
// replies and stages, new Prospecting deals and their value, the SOM count,
// signups) next to the goal and its weekly targets, then answers "what does
// our goal need that this workspace has not built?". That answer has to be remembered: a scoring
// model suggested and declined last week must not come back next week. That
// memory is a file in the repository, cadence/coverage/<week>.md, edited by
// the reviewer before merging. Only an agent with a working tree can write it,
// and only a pull request lets a human decline a suggestion in writing.
//
// It reports funnel numbers against the goal; it does not grade individual
// plays or initiatives. That is weekly-planning, which runs the same Sunday
// afternoon on the week ending that day.
//
// `connector` and `languageModel` are required even here. The harness does not
// bring its own model: it runs against Cargo's LLM proxy, which bills this
// connector and meters usage against this slug.
//
// Slack is a Cargo connector action on `uses`, with `channelId` locked: a
// mistyped channel would post internal suggestions into a customer channel.
//
// No `capabilities`, on purpose. What is deployed (plays, agents, models,
// connectors, folders) and last week's counts (outreach_enrollments, signups,
// the SOM segment) are read with Cargo's own CLI, which the harness already
// has, and only the prompt can say "read, never execute". The commands are
// listed in `goal-coverage.prompt.ts` §2 and §3. The CLI is signed in as the
// `goal_coverage` service user (`runAs`), a viewer: see `../users`.
//
// Attio (the Engaged list and deals) is read over Attio's REST API with the
// workspace env var ATTIO_AUTHORIZATION, the same token crm-routing's
// `attio_api` connector sends. The harness inherits every workspace env var,
// so nothing is declared here (an agent's `env` rejects `workspaceEnv()` for
// that reason). The prompt holds it to the two `/query` read endpoints. No new
// connector, no paid action: every number is a free read.
export const goalCoverage = defineAgent("goal_coverage", {
  name: "Goal coverage",
  description:
    "Every Sunday, reports last week's funnel against the company goal and its weekly targets, then suggests at most three pipelines the workspace is missing, as a pull request and a Slack post.",
  color: "green",
  harness: "claudeCode",
  connector: anthropic,
  languageModel: "claude-sonnet-5", // the same model as weekly-planning
  // No `state`: deploy binds this project's connected state (the one
  // cargo.state.json points at), and the harness clones its repository at the
  // state's directory and production branch. `cargo-ai project check` prints
  // the binding. A project whose state is not connected deploys this agent
  // unbound, with an empty sandbox and the plan note `unbound: this project's
  // state is not connected`; connect the project before relying on it.
  runAs: goalCoverageUser,
  env: {
    // Empty on purpose: plan/company-plan.md exists, and the file wins,
    // because it is the version a human reviews.
    COVERAGE_GOAL: "",
    // IANA timezone that "last week" (Monday 00:00 to Monday 00:00) is cut
    // in. Public, so a plain string. Same zone as weekly-planning.
    COVERAGE_TIMEZONE: "America/Los_Angeles",
  },
  uses: [
    {
      ref: slack.actions.postMessage,
      config: {
        // #sales, the channel the weekly-planning note already lands in. A
        // Slack channel id, not a name. Locked so the agent cannot pick
        // another one. The Cargo Slack app must be a member of the channel.
        channelId: "C0BJY52BUTZ",
        format: "markdown",
        disableUnfurling: true,
      },
    },
  ],
  triggers: [
    {
      type: "cron",
      name: "weekly",
      // 16:17 UTC Sunday: 8:17am PT during PST, 9:17am PT during PDT.
      // Weekly planning runs Sunday 22:00 UTC (2pm PT), so the two never
      // fire at the same minute and coverage's pull request is up first.
      cron: "17 16 * * 0",
      text: "Run goal coverage. Follow your system prompt exactly: find the goal, read last week's numbers against it, read what is deployed, write this week's coverage file, open one pull request, post the report.",
    },
  ],
  systemPrompt: goalCoveragePrompt,
  folder: agentsFolder,
});
