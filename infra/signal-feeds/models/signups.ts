import { defineModel } from "@cargo-ai/cdk";

import { modelsFolder } from "../../gtm-factory/folders";

type Row = { domain?: string | null; signed_up_at?: string | null };

// One row per product signup, read from #signups (plays/signups.ts), keyed on
// the lowercased email. `domain` is the email's domain, empty for a personal
// address (gmail, outlook, ...), so a personal signup keeps its row but never
// lands on an account. Unified as an account event on the domain, dated when
// the signup message was posted, so readiness-scoring weighs it.
export const signups = defineModel("signups", {
  name: "signups",
  kind: "native",
  extractSlug: "defineCustom",
  description:
    "Product signups from the #signups Slack channel, one row per email: who, company, title, the bot's category, source, and when.",
  config: {
    columns: [
      { slug: "key", type: "string" },
      { slug: "name", type: "string" },
      { slug: "email", type: "string" },
      { slug: "linkedin_url", type: "string" },
      { slug: "company", type: "string" },
      { slug: "title", type: "string" },
      { slug: "category", type: "string" },
      { slug: "source", type: "string" },
      { slug: "signed_up_at", type: "string" },
      { slug: "domain", type: "string" },
      { slug: "slack_ts", type: "string" },
      { slug: "seen_at", type: "date" },
    ],
  },
  additionalColumns: [
    {
      kind: "computed",
      slug: "match_domain",
      type: "string",
      label: "Match domain",
      description: "The email domain, or null for a personal address, so empty values never merge.",
      expression: (record: Row) => (record.domain ? record.domain : null),
    },
    {
      kind: "computed",
      slug: "event_at",
      type: "date",
      label: "Event at",
      description: "When the signup was posted: the date of its Account Events row.",
      expression: (record: Row) =>
        record.signed_up_at ? record.signed_up_at : null,
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
