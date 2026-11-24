import { defineFolder } from "@cargo-ai/cdk";

// Every resource this skill deploys is filed under folders named after the
// skill, not under a shared "GTM" one, so removing it is a bounded job.
export const modelsFolder = defineFolder("tam_building_models", {
  kind: "model",
  name: "TAM building",
});

export const playsFolder = defineFolder("tam_building_plays", {
  kind: "play",
  name: "TAM building",
});
