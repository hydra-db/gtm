import { defineConnector } from "@cargo-ai/cdk";

// CompanyEnrich: the second step of the enrichment waterfall (0.25 credits a
// domain), after AI Ark and before LinkedIn. Binds the workspace's existing
// connector.
export const companyEnrich = defineConnector("company_enrich", {
  integration: "companyEnrich",
  default: true,
});
