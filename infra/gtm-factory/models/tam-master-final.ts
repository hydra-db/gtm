import { defineModel } from "@cargo-ai/cdk";

import { modelsFolder } from "../folders";

type Row = { domain?: string | null };

// TAM_MASTER_FINAL: every company we know about, in one place, before any
// narrowing. It holds the companies that passed the ICP gate (final_tam) and
// the firms from Jonah's job-post pipeline (tier 1 and tier 2), merged on the
// bare domain, with funding filled in by an enrichment waterfall
// (AI Ark, Crustdata, Aviato, then Clay as the last resort).
// The narrow working list is built from this one later.
export const tamMasterFinal = defineModel("tam_master_final", {
  name: "TAM_MASTER_FINAL",
  kind: "native",
  extractSlug: "defineCustom",
  description:
    "Every known company in one list: final_tam (passed the ICP gate) plus Jonah's job-post firms, merged by domain, with firmographics and funding from an enrichment waterfall.",
  config: {
    columns: [
      { slug: "domain", type: "string" },
      { slug: "name", type: "string" },
      { slug: "website", type: "string" },
      { slug: "linkedin_url", type: "string" },
      { slug: "description", type: "string" },
      { slug: "employee_count", type: "number" },
      { slug: "hq_city", type: "string" },
      { slug: "hq_country", type: "string" },
      { slug: "bay_area", type: "string" },
      { slug: "latest_round", type: "string" },
      { slug: "latest_round_date", type: "string" },
      { slug: "total_funding_usd", type: "number" },
      { slug: "funding_stage", type: "string" },
      { slug: "series_b_plus", type: "string" },
      { slug: "funding_source", type: "string" },
      { slug: "in_final_tam", type: "string" },
      { slug: "icp_status", type: "string" },
      { slug: "icp_score", type: "number" },
      { slug: "tier", type: "number" },
      { slug: "use_case", type: "string" },
      { slug: "graph_signal", type: "string" },
      { slug: "yc_batch", type: "string" },
      { slug: "sources", type: "string" },
      { slug: "jonah_tier", type: "string" },
      { slug: "jonah_tier1_score", type: "number" },
      { slug: "jonah_tier2_score", type: "number" },
      { slug: "jonah_keywords", type: "string" },
      { slug: "jonah_best_post", type: "string" },
      { slug: "jonah_best_post_link", type: "string" },
      { slug: "jonah_bay_area", type: "string" },
      { slug: "jonah_series_b_12m", type: "string" },
      { slug: "jonah_not_competitor", type: "string" },
      { slug: "jonah_open_engineering_posts", type: "number" },
      { slug: "jonah_owner", type: "string" },
      { slug: "enriched_by", type: "string" },
      { slug: "added_at", type: "date" },
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
