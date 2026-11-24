import { defineModel } from "@cargo-ai/cdk";

import { tierColumns } from "../../account-scoring/models/tier-columns";
import { modelsFolder } from "../folders";

// Every company any source proposes, scored once. `key` is the bare domain when
// one is known, else "name:<normalised name>". A row with no `status` has not
// been through the ICP gate yet: the scoring play picks it up.
export const tamCandidates = defineModel("tam_candidates", {
  name: "tam_candidates",
  kind: "native",
  extractSlug: "defineCustom",
  description:
    "Staging list: every company a source proposed (Bookface, Clay, Cargo sourcing, social listening, OSS signals), with its ICP verdict once scored.",
  config: {
    columns: [
      { slug: "key", type: "string" },
      { slug: "name", type: "string" },
      { slug: "domain", type: "string" },
      { slug: "linkedin_url", type: "string" },
      { slug: "source", type: "string" },
      { slug: "source_detail", type: "string" },
      { slug: "signal_source", type: "string" },
      { slug: "signal_detail", type: "string" },
      { slug: "description", type: "string" },
      { slug: "yc_batch", type: "string" },
      { slug: "employee_count_hint", type: "number" },
      { slug: "added_at", type: "date" },
      { slug: "last_signal_at", type: "date" },
      { slug: "status", type: "string" },
      { slug: "reason", type: "string" },
      { slug: "icp_score", type: "number" },
      { slug: "tier", type: "number" },
      { slug: "resolved_domain", type: "string" },
      { slug: "research", type: "string" },
      { slug: "scored_at", type: "date" },
    ],
  },
  // The account-scoring tier (infra/account-scoring), which replaced the
  // research gate on 2026-11-24. The gate's own columns above stay: they hold
  // every verdict made before the swap.
  additionalColumns: tierColumns,
  folder: modelsFolder,
});
