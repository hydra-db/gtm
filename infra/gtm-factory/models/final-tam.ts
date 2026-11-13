import { defineModel } from "@cargo-ai/cdk";

import { modelsFolder } from "../folders";

type Row = { domain?: string | null };

// The list to work: every company that passed the ICP gate, one row per domain,
// with its score out of 10 and its tier. Unified into Accounts on the domain.
export const finalTam = defineModel("final_tam", {
  name: "final_tam",
  kind: "native",
  extractSlug: "defineCustom",
  description:
    "Companies that passed the ICP gate (context/icp/hydradb.md): score out of 10, tier, use case, evidence and source.",
  config: {
    columns: [
      { slug: "domain", type: "string" },
      { slug: "name", type: "string" },
      { slug: "website", type: "string" },
      { slug: "linkedin_url", type: "string" },
      { slug: "source", type: "string" },
      { slug: "source_detail", type: "string" },
      { slug: "yc_batch", type: "string" },
      { slug: "use_case", type: "string" },
      { slug: "what_they_do", type: "string" },
      { slug: "icp_score", type: "number" },
      { slug: "tier", type: "number" },
      { slug: "tier_label", type: "string" },
      { slug: "bay_area", type: "string" },
      { slug: "hq_city", type: "string" },
      { slug: "hq_country", type: "string" },
      { slug: "employee_count", type: "number" },
      { slug: "latest_round", type: "string" },
      { slug: "latest_round_date", type: "string" },
      { slug: "series_b_plus_last_12_months", type: "string" },
      { slug: "graph_signal", type: "string" },
      { slug: "graph_evidence", type: "string" },
      { slug: "vector_or_agent_stack", type: "string" },
      { slug: "context_language", type: "string" },
      { slug: "learns_from_past_decisions", type: "string" },
      { slug: "warm_path", type: "string" },
      { slug: "verdict", type: "string" },
      { slug: "scored_at", type: "date" },
    ],
  },
  additionalColumns: [
    {
      kind: "computed",
      slug: "match_domain",
      type: "string",
      label: "Match domain",
      description: "The domain, or null when there is none, so empty values never merge.",
      expression: (record: Row) => (record.domain ? record.domain : null),
    },
  ],
  unification: {
    source: "custom",
    type: "account",
    uniqueColumns: [{ slug: "computed__match_domain", reference: "domain" }],
  },
  folder: modelsFolder,
});
