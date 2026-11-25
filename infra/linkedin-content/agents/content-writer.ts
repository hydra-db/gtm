import { defineAgent } from "@cargo-ai/cdk";

import { contentWriterPrompt } from "./content-writer.prompt";
import { anthropic } from "../../gtm-factory/agents/outreach-drafter";
import { slack } from "../../shared/connectors/slack";
import { agentsFolder } from "../folders";

// The content writer: a Claude Code harness agent on a weekly cron.
//
// `harness: "claudeCode"` because the output is a file in the repository,
// delivered as a pull request. The drafts are built from context/ and the
// cadence log, which are files in the same checkout, so the agent reads them
// directly and needs no capability to reach them. The pull request is the
// review gate: a draft that overstates a result is caught by a human before
// anyone copies it into LinkedIn.
//
// `connector` and `languageModel` are required even here: the harness runs
// against Cargo's LLM proxy, which bills this connector and meters this slug.
//
// No `uses` and no `capabilities`, on purpose:
//   - nothing on LinkedIn. Publishing is the author's act. An agent that can
//     post (or like, comment, connect, message) is an agent that can speak as
//     a person in public, and the contract fails if one of those lands here.
//   - no `context` capability. The checkout already holds context/, and a
//     capability would be a second path that can write it without review.
//
// No `state`: deploy binds this project's connected state (cargo.state.json),
// whose repository holds context/ and cadence/, and the harness clones it at
// the state's directory and production branch. `cargo-ai project check` prints
// the binding; a project whose state is not connected deploys this agent
// unbound, with an empty sandbox.
// slack-heads-up adaptation: one message per run, after the pull request is
// open, to #my-agents (private). The id was resolved through the Slack
// connector's autocomplete (listChannels) on 2026-11-25, and the Cargo app is
// a member of the channel. An id, not a name: names collide.
const HEADS_UP_CHANNEL_ID = "C0CA9GSMQJV"; // #my-agents

export const contentWriter = defineAgent("linkedin_content_writer", {
  name: "LinkedIn content writer",
  description:
    "Weekly: drafts LinkedIn posts for one author from context/ and the cadence log, every claim cited, as one pull request. Never publishes.",
  color: "blue",
  harness: "claudeCode",
  connector: anthropic,
  languageModel: "claude-opus-5-5", // strongest writer; one run a week
  env: {
    // The person the posts are written as, the way they sign their name.
    CONTENT_AUTHOR: "Nishkarsh Srivastava",
  },
  triggers: [
    {
      type: "cron",
      name: "weekly",
      // 14:00 UTC every Monday: 7am PT during PDT. After web-capture's 06:00
      // run, so a merged week of web findings is already in context/.
      cron: "0 14 * * 1",
      text: "Draft this week's LinkedIn posts. Follow your system prompt exactly: one file for the ISO week, one pull request, every claim cited, nothing published.",
    },
  ],
  uses: [
    {
      ref: slack.actions.postMessage,
      config: {
        channelId: HEADS_UP_CHANNEL_ID,
        format: "markdown",
        disableUnfurling: true,
      },
    },
  ],
  systemPrompt: contentWriterPrompt,
  folder: agentsFolder,
});
