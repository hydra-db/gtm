import { defineConnector } from "@cargo-ai/cdk";

// Clay: the last step of the enrichment waterfall, after LinkedIn. Binds the
// workspace's existing connector (connected 2026-11-25 with HydraDB's own
// Clay API key, so it bills Clay, not Cargo credits). Only `searchCompanies`
// is used: the integration lists no routines to pick from.
export const clay = defineConnector("clay", {
  integration: "clay",
  default: true,
});
