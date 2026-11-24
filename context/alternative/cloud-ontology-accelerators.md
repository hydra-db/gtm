---
title: Big-vendor ontology kits (AWS Context Ontology Accelerator, NVIDIA auto-ontology)
description: Free, open toolkits from AWS and NVIDIA, both found on 2026-10-23, that turn SQL schemas into ontologies for Text-to-SQL. A different job from HydraDB's; the response is to own the graph-creation framework developers reach for.
references:
  - insight/2026-10-23-big-vendors-ship-ontology-kits-for-sql
  - insight/2026-11-09-big-companies-moving-to-knowledge-graphs
  - alternative/enterprise-search-and-data-platforms
  - insight/2026-11-06-selfgraph-launch-and-positioning
  - icp/hydradb
---

## Profile

- AWS Context Ontology Accelerator (aws.github.io/context-ontology-accelerator), spotted by the team on
  2026-10-23.
- NVIDIA auto-ontology (github.com/NVIDIA/auto-ontology), same day. An engineer's reading of its public source:
  "Schema -> sample values -> LLM proposes concepts + attributes -> save mappings + embeddings -> resolve
  relationships". Sources: Postgres, Snowflake, Databricks, DuckDB. "Declared FKs guide relationships;
  unresolved ones use embeddings, LLM selection, and value checks." "so this is very foreign key focussed
  relationships in postgres tables." Note: "Source inspection only; pipeline not run yet."
- A teammate's summary: "Major difference is their core focus on 'Ontologies for SQL DBs' to make a strong
  natural language query -> Text-to-SQL answer pipeline".

## Pricing

Not tracked.

## Strengths

- Vendor brand and distribution. Free.
- Strong for structured warehouse data with declared foreign keys.
- They validate that ontologies for agents are a real category.

## Weaknesses

- Scoped to SQL tables and Text-to-SQL. Unstructured sources (Slack, docs, tickets) are not the focus.
- Relationships come mostly from foreign keys; inferred ones need review.

## Wedge

Different, not better. Nishkarsh's instruction: "i don't wnat to understand how are we 'better' just need
to know how are we different. For eg - modeling decision traces, user preferences, etc". HydraDB models
agent-side context (decisions, preferences, cross-source relations), not just warehouse schemas.
Strategic response: "That's exactly why we need to own the framework for graph creation - something
that's easily available, developers love, and makes a bang in the agent world." SelfGraph (launched
2026-11-06) is that framework.

## Loses when

- The buyer's whole problem is natural-language questions over a warehouse. That is what these kits target.
- The enterprise has already standardized on the vendor's stack.

## Battlecard

- Ask what fraction of the agent's needed context lives outside SQL tables.
- Do not dismiss them; cite them as proof the category is real.
- A written differentiation (different, not better) was still pending on 2026-10-23.
- LinkedIn: "big vendors" is safer than naming them, though their launches are public.

## Source

- Internal: team discussion, 2026-10-23 (AWS and NVIDIA toolkits)
- Internal: founder note, 2026-10-23 ("different not better", "own the framework")
- Internal: engineering notes, 2026-10-23 (source reading of the NVIDIA toolkit)
