import { defineFolder } from "@cargo-ai/cdk";

// Everything the reply routing deploys is filed under one folder per kind,
// named after the pipeline, so its provenance is visible in the workspace.
export const modelsFolder = defineFolder("crm_routing_models", {
  kind: "model",
  name: "CRM routing",
});

export const playsFolder = defineFolder("crm_routing_plays", {
  kind: "play",
  name: "CRM routing",
});
