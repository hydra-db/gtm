import { defineModel } from "@cargo-ai/cdk";

import { modelsFolder } from "../../gtm-factory/folders";

type Row = { domain?: string | null; detected_at?: string | null };

// One row per new hire the play routed: a US person who started, in the last
// 30 days, a role whose title names context graphs, knowledge graphs,
// ontology or agent memory (models/new-hires.ts). Unified as an account event
// on the company domain, dated when the play detected it (the start is
// known only to the month), so it moves the account's readiness score
// (weight and half-life in infra/readiness-scoring/settings.ts, key
// `new_hire_signals`).
export const newHireSignals = defineModel("new_hire_signals", {
  name: "new_hire_signals",
  kind: "native",
  extractSlug: "defineCustom",
  description:
    "US people who started a role naming context graphs, knowledge graphs, ontology or agent memory in the last 30 days (Sales Navigator job-change search).",
  config: {
    columns: [
      { slug: "key", type: "string" },
      { slug: "person_name", type: "string" },
      { slug: "title", type: "string" },
      { slug: "linkedin_url", type: "string" },
      { slug: "company", type: "string" },
      { slug: "domain", type: "string" },
      { slug: "started_at", type: "string" },
      { slug: "keyword", type: "string" },
      { slug: "detected_at", type: "date" },
    ],
  },
  additionalColumns: [
    {
      kind: "computed",
      slug: "match_domain",
      type: "string",
      label: "Match domain",
      description: "The company domain, or null when there is none, so empty values never merge.",
      expression: (record: Row) => (record.domain ? record.domain : null),
    },
    {
      kind: "computed",
      slug: "event_at",
      type: "date",
      label: "Event at",
      description:
        "When the new hire was detected: the date of its Account Events row. The start is known only to the month, so it is not the event date.",
      expression: (record: Row) => (record.detected_at ? record.detected_at : null),
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
