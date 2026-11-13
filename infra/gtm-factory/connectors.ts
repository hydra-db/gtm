import { defineConnector } from "@cargo-ai/cdk";

// Web research that fills a schema: the ICP gate's one paid step.
export const parallel = defineConnector("parallel", {
  integration: "parallel",
  default: true,
});

// Public X posts, for keyword listening.
export const x = defineConnector("x", {
  integration: "x",
  default: true,
});

// Receives rows pushed from outside Cargo (the daily Dayly GitHub signal job).
export const httpIngest = defineConnector("http_ingest", {
  integration: "http",
  name: "GTM factory ingest",
  config: { headers: [] },
});
