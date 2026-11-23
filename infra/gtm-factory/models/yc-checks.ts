import { defineModel } from "@cargo-ai/cdk";

import { modelsFolder } from "../folders";

// The YC check, one row per contact: is this person a YC founder (current or
// former), and who is the most relevant YC founder working at their company.
// Filled from a scheduled Claude session with the YC CLI (Bookface is tied to
// the founder's own login, so it cannot run inside Cargo). The Outreach
// drafter reads these fields to choose YC, warm-intro or standard copy.
export const ycChecks = defineModel("yc_checks", {
  name: "yc_checks",
  kind: "native",
  extractSlug: "defineCustom",
  description:
    "YC check per contact: YC founder or not, batch and company, plus the closest YC founder at the same company. Filled from Bookface.",
  config: {
    columns: [
      { slug: "key", type: "string" },
      { slug: "account_domain", type: "string" },
      { slug: "company", type: "string" },
      { slug: "person_name", type: "string" },
      { slug: "person_title", type: "string" },
      { slug: "person_linkedin_url", type: "string" },
      { slug: "is_yc", type: "string" },
      { slug: "yc_batch", type: "string" },
      { slug: "yc_profile_url", type: "string" },
      { slug: "yc_founders_at_company", type: "string" },
      { slug: "closest_yc_name", type: "string" },
      { slug: "closest_yc_title", type: "string" },
      { slug: "closest_yc_batch", type: "string" },
      { slug: "closest_yc_profile_url", type: "string" },
      { slug: "copy_variant", type: "string" },
      { slug: "checked_at", type: "date" },
    ],
  },
  folder: modelsFolder,
});
