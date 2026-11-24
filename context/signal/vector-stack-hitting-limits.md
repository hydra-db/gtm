---
title: Team on a vector-only stack is hitting relationship and time limits
description: Prospects arrive when vector or Postgres retrieval returns stale or unlinked context, or say publicly they are moving from a vector DB to knowledge graphs. Seen independently on four accounts' calls.
confidence: validated
references:
  - icp/hydradb
  - icp/tiering-rubric
  - motion/signal-feedback-outreach
  - jtbd/memory-that-tracks-change
  - jtbd/connect-context-across-sources
  - persona/ai-engineering-leader
  - client/context-platform-graph-migration
  - client/consumer-marketplaces-customer-memory
  - client/fintech-internal-agents-poc
  - client/itsm-platform-memory-evaluation
---

_confidence: hypothesis (we think so) | validated (seen twice, independently) |
proven (measured, repeatable). Outreach plays may only cite validated or proven
files. Start at hypothesis and earn the upgrade._

_validated: four different accounts on separate calls (2026-04-05 to 2026-09-22) described the same limit._

## Source

Discovery calls (internal). Public proxies: engineering blogs, posts, job descriptions or forum threads mentioning pgvector or a vector DB plus "stale", "temporal", "entity linking", "knowledge graph"; engagement with graph or memory content; public complaints about graph DB cost or scale.

## Definition

Company runs agents on Postgres/pgvector, document-database vectors or a vector DB AND publicly discusses (or says on a call) one of: stale answers, missing relationships across sources, temporal changes, moving to a graph. Language to match: "company brain", "institutional knowledge", "precedent", "ontology", "knowledge graph", "agent memory" (builders use these more than "context graph").

## Weight

high

## ICP fit

- [[icp/hydradb]]: matches "decisions depend on relationships between entities across systems" and the vector-database tech signals.

## Recommended play

- [[motion/signal-feedback-outreach]] when the signal is public and dated.
- On a call: offer a POC on their own queries vs their current stack (one prospect asked for pgvector vs HydraDB).

## Why it matters

Independent occurrences: a context-management platform ("Vector similarity search is failing for their use case", 2026-07-07), a consumer marketplace (Postgres plus vector with "Stale/irrelevant notifications", 2026-09-22), a fintech (document-database vectors where "information doesn't connect well across data sources", 2026-08-27), an ITSM platform (flat relational memories, "no graph layer", 2026-04-05). A prospect said "vectorDB isn't enough and we need knowledge graphs for our agents to work" (2026-10-15). HydraDB's pitch is written for this moment: "If you are moving away from vectorDB to knowledge graphs because you think it adds to improved accuracy at scale then HydraDB is built for you!" (2026-10-15). Nishkarsh's description of the buyer (2026-11-04): companies "fed up with vector databases" and agent builders "looking to adopt a graph retrieval".

Internal: customer call recap, 2026-07-07 ; customer call recap, 2026-09-22 ; customer call recap, 2026-08-27 ; customer call recap, 2026-04-05 ; team discussion, 2026-10-15 ; founder note, 2026-10-15 ; founder note, 2026-11-04

Merged from staging: calls/signal/vector-stack-hitting-relational-limits, the intent parts of product1/signal/moving-from-vector-db-to-knowledge-graphs and product2/signal/graph-memory-hiring-and-vector-db-fatigue.

## False positives

- Single-source similarity search that works fine (the ITSM platform's single-source knowledge search already scored well).
- Engineers liking graph content out of curiosity (paper-night attendees, students).
- Memory, context or graph vendors (they write the most about context graphs; disqualify).
- Simple chat-over-docs RAG; one-shot lookup agents; no in-house engineering.
