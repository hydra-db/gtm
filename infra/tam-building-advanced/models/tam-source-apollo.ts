import { defineModel } from "@cargo-ai/cdk";

import { apollo } from "../connectors/apollo";
import { sourceRefreshSchedule } from "../../tam-building/settings";
import { modelsFolder } from "../folders";

// The second census: Apollo's own database, searched with the same brief as
// Sales Navigator. Two independent enumerations of one market are what the
// coverage estimate in references/run.md is computed from.
//
// Apollo has no industry taxonomy: industries are keyword tags, which over-
// and under-match. That is acceptable here because nothing is trusted from the
// source's label: every company is classified from its own description in the
// profile play. Size the pool with a small `limit` first; there is no free count.
//
// NO SCHEDULE, ON PURPOSE: every sync re-bills every returned record.
// REFRESHED ONCE EVERY TWO WEEKS, by operator decision (2026-11-24), only
// while `refreshEnabled` in infra/tam-building/settings.ts is true. Each run
// re-bills every returned record (see that file for the per-run cost).
export const tamSourceApollo = defineModel("tam_source_apollo", {
  name: "TAM source: Apollo",
  connector: apollo,
  extractSlug: "fetchOrganizations",
  schedule: sourceRefreshSchedule,
  description:
    "TAM source 3 of 4: Apollo organizations for the same brief, the second census.",
  folder: modelsFolder,

  // Into Accounts on the domain and the LinkedIn page, declared for the same
  // reason as AI Ark's.
  unification: {
    source: "custom",
    type: "account",
    uniqueColumns: [
      { slug: "primary_domain", reference: "domain" },
      { slug: "linkedin_url", reference: "linkedinHandle" },
      { slug: "linkedin_url", reference: "linkedinId" },
    ],
  },

  // PLACEHOLDER: the same brief in Apollo's filters. Employee ranges are
  // strings in Apollo's "min,max" form; locations are free text.
  config: {
    filters: {
      q_organization_keyword_tags: ["ai agents", "agentic ai"],
      organization_num_employees_ranges: [
        "21,50",
        "51,100",
        "101,200",
        "201,500",
        "501,1000",
        "1001,2000",
      ],
      organization_locations: ["United States"],
    },
    limit: 1000,
  },
});
