import { defineFolder } from "@cargo-ai/cdk";

// Every resource this skill deploys is filed under folders named after the
// skill, so "what put this here, and what else came with it" is answered by
// looking. Folders are per-kind: the two Snitcher models, and the play that
// posts relevant visitors to Slack.
export const modelsFolder = defineFolder("visitor_identification_models", {
  kind: "model",
  name: "Visitor identification",
});

export const playsFolder = defineFolder("visitor_identification_plays", {
  kind: "play",
  name: "Visitor identification",
});
