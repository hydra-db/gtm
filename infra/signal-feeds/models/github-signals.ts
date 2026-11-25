import { defineModel } from "@cargo-ai/cdk";

import { modelsFolder } from "../../gtm-factory/folders";

type Row = { company_domain?: string | null; occurred_at?: string | null };

// One row per person who opened an issue or pull request, or started or
// commented on a discussion on, a watched repo in the last window (plays/github.ts), kept only when their
// GitHub profile names a real company (company field, work email domain, or a
// blog on the company's domain). Replaces the Dayly feed into oss_signals.
// Unified as an account event on the company domain, dated by the activity.
export const githubSignals = defineModel("github_signals", {
  name: "github_signals",
  kind: "native",
  extractSlug: "defineCustom",
  description:
    "New issue and pull request authors, discussion authors and commenters on watched GitHub repos, at real companies only, resolved from their GitHub profiles.",
  config: {
    columns: [
      { slug: "key", type: "string" },
      { slug: "repo", type: "string" },
      { slug: "repo_kind", type: "string" },
      { slug: "action", type: "string" },
      { slug: "url", type: "string" },
      { slug: "occurred_at", type: "string" },
      { slug: "login", type: "string" },
      { slug: "person_name", type: "string" },
      { slug: "person_url", type: "string" },
      { slug: "person_bio", type: "string" },
      { slug: "company_name", type: "string" },
      { slug: "company_domain", type: "string" },
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
      description: "When the issue, pull request, discussion or comment happened: the date of its Account Events row.",
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
