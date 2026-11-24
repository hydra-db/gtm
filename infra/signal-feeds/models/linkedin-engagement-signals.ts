import { defineModel } from "@cargo-ai/cdk";

import { modelsFolder } from "../../gtm-factory/folders";

type Row = { company_domain?: string | null; occurred_at?: string | null };

// One row per lead the three LinkedIn engagement feeds deliver
// (models/cargo-signals.ts): engagement on competitor company pages, on their
// CEOs' posts, and new connections of our founder. Copied here by
// plays/linkedin-engagement.ts so the feeds themselves stay on their default
// (contact event) unification and each lead counts once, as an account event
// on the company domain dated when the signal fired.
export const linkedinEngagementSignals = defineModel("linkedin_engagement_signals", {
  name: "linkedin_engagement_signals",
  kind: "native",
  extractSlug: "defineCustom",
  description:
    "People who engaged with competitors' or their CEOs' LinkedIn posts, or newly connected with our founder (Cargo Signals), with their company.",
  config: {
    columns: [
      { slug: "key", type: "string" },
      { slug: "feed", type: "string" },
      { slug: "signal_name", type: "string" },
      { slug: "detail", type: "string" },
      { slug: "occurred_at", type: "string" },
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
      description: "The company domain, or null when there is none, so empty values never merge.",
      expression: (record: Row) =>
        record.company_domain ? record.company_domain : null,
    },
    {
      kind: "computed",
      slug: "event_at",
      type: "date",
      label: "Event at",
      description: "When the signal fired: the date of its Account Events row.",
      expression: (record: Row) =>
        record.occurred_at ? record.occurred_at : null,
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
