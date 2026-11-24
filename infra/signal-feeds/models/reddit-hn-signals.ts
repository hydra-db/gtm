import { defineModel } from "@cargo-ai/cdk";

import { modelsFolder } from "../../gtm-factory/folders";

type Row = { company_domain?: string | null; posted_at?: string | null };

// One row per Reddit or Hacker News post or comment that matched a listening
// keyword (plays/reddit-hn.ts). Forum authors rarely say where they work, so
// company_domain is set only when the post itself names a company (a Show HN
// or "we built" post linking its own site); the rest stay as signals with no
// account. Unified as an account event on the company domain, dated when the
// post went up, so readiness-scoring weighs each one.
export const redditHnSignals = defineModel("reddit_hn_signals", {
  name: "reddit_hn_signals",
  kind: "native",
  extractSlug: "defineCustom",
  description:
    "Reddit and Hacker News posts and comments on a listening keyword, one row per post, with the company only when the post names one.",
  config: {
    columns: [
      { slug: "key", type: "string" },
      { slug: "platform", type: "string" },
      { slug: "keyword", type: "string" },
      { slug: "kind", type: "string" },
      { slug: "post_url", type: "string" },
      { slug: "title", type: "string" },
      { slug: "post_text", type: "string" },
      { slug: "posted_at", type: "string" },
      { slug: "engagement", type: "number" },
      { slug: "author", type: "string" },
      { slug: "author_url", type: "string" },
      { slug: "community", type: "string" },
      { slug: "linked_url", type: "string" },
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
      description: "When the post went up: the date of its Account Events row.",
      expression: (record: Row) =>
        record.posted_at ? record.posted_at : null,
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
