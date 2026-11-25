import { defineModel } from "@cargo-ai/cdk";

import { modelsFolder } from "../../gtm-factory/folders";

type Row = { domain?: string | null; detected_at?: string | null };

// One row per company theirStack says uses a graph database, a vector database
// or an agent framework we track (settings.ts, techAdoptionSlugs), written by
// plays/tech-adoption.ts. `tools_matched` is the tracked tools found there,
// `first_seen` the earliest date theirStack first saw one of them.
//
// Unified as an account event on the domain, dated the day we found it (an
// adoption first seen years ago would weigh nothing on its own date), so
// readiness-scoring weighs it (tech_adoption_signals in its settings.ts).
export const techAdoptionSignals = defineModel("tech_adoption_signals", {
  name: "tech_adoption_signals",
  kind: "native",
  extractSlug: "defineCustom",
  description:
    "Companies that use a graph database, vector database or agent framework (Neo4j, Pinecone, LangGraph and others), from theirStack technographics, weekly.",
  config: {
    columns: [
      { slug: "key", type: "string" },
      { slug: "company", type: "string" },
      { slug: "domain", type: "string" },
      { slug: "linkedin_url", type: "string" },
      { slug: "tools_matched", type: "string" },
      { slug: "first_seen", type: "string" },
      { slug: "source", type: "string" },
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
      description: "The day the feed found the company: the date of its Account Events row.",
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
