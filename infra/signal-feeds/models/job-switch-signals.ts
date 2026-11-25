import { defineModel } from "@cargo-ai/cdk";

import { modelsFolder } from "../../gtm-factory/folders";

type Row = { company_domain?: string | null; occurred_at?: string | null };

// One row per new decision-maker who joined a working-list company
// (models/cargo-signals.ts, copied here by plays/job-switches.ts, which also
// posts each one to #gtm-engine). Unified as an account event on the company
// domain, dated when the signal fired.
export const jobSwitchSignals = defineModel("job_switch_signals", {
  name: "job_switch_signals",
  kind: "native",
  extractSlug: "defineCustom",
  description:
    "New decision-makers (CTO, VP Eng, Head of AI, AI platform leads) who joined a working-list company (Cargo Signals).",
  config: {
    columns: [
      { slug: "key", type: "string" },
      { slug: "person_name", type: "string" },
      { slug: "person_title", type: "string" },
      { slug: "person_url", type: "string" },
      { slug: "company_name", type: "string" },
      { slug: "company_domain", type: "string" },
      { slug: "company_linkedin_url", type: "string" },
      { slug: "detail", type: "string" },
      { slug: "occurred_at", type: "string" },
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
