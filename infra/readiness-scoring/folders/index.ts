import { defineFolder } from "@cargo-ai/cdk";

// Every resource this skill deploys is filed under a folder named after the
// skill, not under a shared "GTM" one, so "what put this here" is answered by
// looking. Folders are per-kind, and this skill now deploys only a play: its
// models are the workspace's own (Account Events, Unify Accounts) and the
// signal models other pipelines already file.
export const playsFolder = defineFolder("readiness_scoring_plays", {
  kind: "play",
  name: "Readiness scoring",
});
