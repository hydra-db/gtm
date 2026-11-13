import { defineFolder } from "@cargo-ai/cdk";

export const modelsFolder = defineFolder("gtm_factory_models", {
  kind: "model",
  name: "GTM factory",
});

export const playsFolder = defineFolder("gtm_factory_plays", {
  kind: "play",
  name: "GTM factory",
});
