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

// Cargo's email waterfall (22e6559a-2a70-4bef-8237-bcfb0ff9183b): verifyEmail
// at 0.1 credits an address. find-contacts verifies each new contact's email
// with it and writes the result to email_checks, which daily outreach reads.
export const waterfall = defineConnector("waterfall", {
  integration: "waterfall",
  default: true,
});
