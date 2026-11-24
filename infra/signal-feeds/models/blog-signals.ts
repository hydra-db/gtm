import { defineModel } from "@cargo-ai/cdk";

import { modelsFolder } from "../../gtm-factory/folders";

type Row = { company_domain?: string | null; published_at?: string | null };

// One row per blog post published on a listening keyword (plays/blogs.ts),
// found by Exa. The company is the site's own domain; posts on shared hosts
// (Medium, Substack, dev.to) keep no company. Unified as an account event on
// the company domain, dated when the post was published.
export const blogSignals = defineModel("blog_signals", {
  name: "blog_signals",
  kind: "native",
  extractSlug: "defineCustom",
  description:
    "Engineering blog posts on a listening keyword (Exa), one row per post, with the company that published it.",
  config: {
    columns: [
      { slug: "key", type: "string" },
      { slug: "keyword", type: "string" },
      { slug: "kind", type: "string" },
      { slug: "url", type: "string" },
      { slug: "title", type: "string" },
      { slug: "author", type: "string" },
      { slug: "published_at", type: "string" },
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
      description: "When the post was published: the date of its Account Events row.",
      expression: (record: Row) =>
        record.published_at ? record.published_at : null,
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
