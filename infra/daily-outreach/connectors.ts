import { defineConnector } from "@cargo-ai/cdk";

// The workspace's lemlist connector, authorized in the Cargo UI. `default:
// true` binds the live one (da3b0b74-35c5-47fe-a106-eedca218a586), so a deploy
// never touches its API key.
export const lemlist = defineConnector("lemlist", {
  integration: "lemlist",
  default: true,
});
