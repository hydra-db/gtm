import { defineConnector } from "@cargo-ai/cdk";

// The workspace's Slack connector, declared once for every pipeline that posts
// (readiness-scoring, visitor-identification, workspace-health). It was
// authorized in the Cargo UI, not created by a deploy: `default: true` binds
// the live one, and the deploy state holds it by `cargo-ai project import
// connector:slack a6d37dd6-f0a6-47cd-a0f8-26f658b67a0e`. Its OAuth tokens are
// never declared here, so a deploy never touches them.
export const slack = defineConnector("slack", {
  integration: "slack",
  default: true,
});
