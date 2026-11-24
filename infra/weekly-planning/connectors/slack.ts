import { defineConnector } from "@cargo-ai/cdk";

// The Slack workspace the weekly note goes to. OAuth, so bound rather than
// created: `default: true` binds the workspace's existing Slack connector.
// The agent's only Slack path is `slack.actions.postMessage`, with the
// channel locked on the use in `../agents/planner.ts`.
export const slack = defineConnector("slack", {
  integration: "slack",
  default: true,
});
