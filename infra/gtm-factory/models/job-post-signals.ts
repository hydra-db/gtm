import { defineModel } from "@cargo-ai/cdk";

import { modelsFolder } from "../folders";

type Row = { account_domain?: string | null; date_posted?: string | null };

// Job posts at working-list companies that mention graph, memory or context
// work (theirStack), with the hiring manager when known. Filled outside code
// and adopted here (`cargo-ai project import model:job_post_signals
// 2b070d24-8342-42f1-96fc-513ccf32fd2b`), so its rows stay.
//
// `config.columns` is the live list, column for column: a deploy that finds a
// different config RESETS the model, which on a native model drops its rows.
//
// It unifies as an account event on the company domain, dated the day the job
// was posted, so readiness-scoring weighs each post.
export const jobPostSignals = defineModel("job_post_signals", {
  name: "job_post_signals",
  kind: "native",
  extractSlug: "defineCustom",
  description:
    "Job posts at working-list companies that mention graph, memory or context work (theirStack), with the hiring manager when known. The signal and signal person for outreach.",
  config: {
    columns: [
      { slug: "key", type: "string" },
      { slug: "account_domain", type: "string" },
      { slug: "company", type: "string" },
      { slug: "job_title", type: "string" },
      { slug: "url", type: "string" },
      { slug: "date_posted", type: "string" },
      { slug: "location", type: "string" },
      { slug: "matching_phrases", type: "string" },
      { slug: "hiring_manager_name", type: "string" },
      { slug: "hiring_manager_title", type: "string" },
      { slug: "hiring_manager_linkedin_url", type: "string" },
      { slug: "source", type: "string" },
      { slug: "found_at", type: "date" },
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
        record.account_domain ? record.account_domain : null,
    },
    {
      kind: "computed",
      slug: "event_at",
      type: "date",
      label: "Event at",
      description: "The day the job was posted: the date of its Account Events row.",
      expression: (record: Row) =>
        record.date_posted ? record.date_posted : null,
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
