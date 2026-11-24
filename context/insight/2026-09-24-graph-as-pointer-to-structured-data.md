---
title: The graph should point to tables, not swallow them
description: Founder design choice (2026-09-24) for structured data. Keep SQL and spreadsheets in a SQL store and let the graph point agents to the right table; raw metrics stay out of the graph.
confidence: hypothesis
references:
  - insight/2026-07-25-company-brain-over-agent-memory
  - insight/2026-10-23-big-vendors-ship-ontology-kits-for-sql
  - insight/2026-08-06-paper-reading-nights
---

## Claim

Company brain = graph for relationships + vectors for unstructured text + SQL for structured data, with
the graph as the index.

## Evidence

- Nishkarsh: "We can use the graph to be a pointer to the table and an agent can read the table for
  answers. Essentially the context graph we generate becomes the brain of the company and unstructured
  data comes from vector and structured data comes from sql". Internal: founder note, 2026-09-24
- Customer need: a fintech asked for schema and numerical data handling from its data warehouse.
  Internal: customer call recap, 2026-09-16
- Team note: time-series metrics should not be ingested into the graph because it would do nothing but
  add noise. Internal: team discussion, 2026-11-18

## Implication

Answer "can you handle our warehouse data?" with the pointer pattern, not "we ingest everything". It also
separates HydraDB from big-vendor kits that turn SQL schemas into ontologies.

## Use in messaging

Contrarian post: "Don't put your spreadsheets in a knowledge graph. Make the graph point to them."
