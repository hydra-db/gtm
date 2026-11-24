import { defineModel } from "@cargo-ai/cdk";

import { modelsFolder } from "../folders";

type Row = { company_domain?: string | null; posted_at?: string | null };

// One row per public post that matched a listening keyword, with the company
// of whoever posted it. Unified as an ACCOUNT EVENT on the company domain,
// dated when the post went up, so readiness-scoring weighs each post. It used
// to unify as an account, which put every poster's company in Unify Accounts;
// now a post reaches an account only when another model (TAM_MASTER_FINAL,
// final_tam) holds the company. The rows here are unchanged.
export const socialListening = defineModel("social_listening", {
  name: "social_listening",
  kind: "native",
  extractSlug: "defineCustom",
  description:
    "Companies whose people posted on LinkedIn or X about a listening keyword (ICP language and competitor names), one row per post.",
  config: {
    columns: [
      { slug: "key", type: "string" },
      { slug: "platform", type: "string" },
      { slug: "keyword", type: "string" },
      { slug: "kind", type: "string" },
      { slug: "post_url", type: "string" },
      { slug: "post_text", type: "string" },
      { slug: "posted_at", type: "string" },
      { slug: "engagement", type: "number" },
      { slug: "person_name", type: "string" },
      { slug: "person_title", type: "string" },
      { slug: "person_url", type: "string" },
      { slug: "company_name", type: "string" },
      { slug: "company_domain", type: "string" },
      { slug: "company_linkedin_url", type: "string" },
      { slug: "seen_at", type: "date" },
    ],
  },
  additionalColumns: [
    {
      kind: "computed",
      slug: "match_domain",
      type: "string",
      label: "Match domain",
      description: "The company domain, or null when it is unknown.",
      expression: (record: Row) =>
        record.company_domain ? record.company_domain : null,
    },
    {
      kind: "computed",
      slug: "event_at",
      type: "date",
      label: "Event at",
      description: "When the post went up: the date of its Account Events row.",
      expression: (record: Row) => (record.posted_at ? record.posted_at : null),
    },
  ],
  unification: {
    source: "custom",
    type: "accountEvent",
    uniqueColumns: [{ slug: "computed__match_domain", reference: "domain" }],
    timeColumnSlug: "computed__event_at",
  },
  folder: modelsFolder,
});
