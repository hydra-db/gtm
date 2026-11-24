---
title: Postgres, pgvector, MongoDB vectors and one-engine databases (SurrealDB) as the status quo
description: Battlecard for "just keep it in the database we have" and "one engine for everything". Covers the build-it-yourself Postgres/pgvector/Mongo stack prospects run before HydraDB, Supabase as primary store, and SurrealDB's near-identical pitch.
references:
  - alternative/vector-databases
  - alternative/general-purpose-graph-databases
  - objection/vector-search-is-enough
  - objection/we-will-build-it-ourselves
  - insight/2026-07-07-vector-similarity-fails-on-relational-memory
  - insight/2026-11-15-buyers-reach-past-the-add-on-slot
  - insight/2026-11-23-agent-memory-is-a-crowded-category
  - icp/hydradb
---

## Profile

Status quo and build-in-house. Three shapes of the same instinct, keep everything in one database:

- Postgres (often with pgvector), MongoDB with vectors, OpenSearch hybrid search, plus batch jobs for
  dedupe. Common on calls with consumer marketplaces, fintechs and agent startups.
- Postgres or Supabase as the app's primary database, sometimes with a graph extension ("PG Graph").
  NVIDIA's open-source auto-ontology also stores its semantic model in Postgres.
- SurrealDB. Its public pitch is close to HydraDB's: SurrealDB 3.0 puts relational, document, graph,
  vector, search and agent-memory "context graphs" in one engine so teams don't have to stitch separate
  databases and vector stores together. Publicly reported funding: a Series A extension in Feb 2026
  (re-check before quoting).

Note: HydraDB is shipping its own Postgres extension (pg_hydradb live in OSS, 2026-11-15), and SelfGraph
"can create free graphs for postgres" (2026-11-06). "Keep Postgres" is becoming a path in, not only a
competitor.

## Pricing

Not tracked.

## Strengths

- Already in production, familiar, cheap to start, zero new vendor.
- Good enough for similarity lookups on a single source: one team's in-house hybrid search scored high on
  its own benchmark.
- One system to run. SurrealDB's "don't stitch separate databases" message is strong and well funded.

## Weaknesses

- Buyer phrasing from calls (anonymous): "Stale/irrelevant notifications", "Missing temporal
  relationships and entity linkages", "High maintenance overhead for schema management" (a consumer
  marketplace, 2026-09-22); "Vector similarity search is failing for their use case" (an agent startup,
  2026-07-07); "information doesn't connect well across data sources" (a fintech on MongoDB vectors).
- pgvector generally scales vertically, with higher latencies on large datasets.
- Graph on Postgres "fails at scale" (Nishkarsh, 2026-10-09; founder opinion, no benchmark cited).
- General-purpose engines do not organize the knowledge for the agent; the team still writes the
  extraction and linking (HydraDB positioning, 2026-10-13).

## Wedge

Relationships and time: who and what is linked to what, and what changed. Buyers ask for a pgvector vs
HydraDB comparison on their own use case; give them one. Against one-engine databases, compete on who builds the graph
for you and on agent-facing APIs, not on how many data models fit in one engine.

Movement in the other direction, one report only: "People have started considering switching over to
HydraDB from Supabase as their primary database." (Nishkarsh, 2026-10-30, no count).

## Loses when

- The workload is single-source similarity search and the team will not invest in a POC.
- The team's priority is fewest moving parts over context quality.
- The workload is mostly transactional app data with light AI use.

## Battlecard

- Ask: "Show me a query where the answer changed last month." Stale data and missing links are the trap
  for vector-only stacks.
- Against Postgres graph: ask what happens to their graph queries as the data grows. Do not claim a number;
  none is in evidence.
- Against SurrealDB: do not compete on "how many models in one engine".
- Offer the Postgres extension or SelfGraph when the buyer will not add a new database.
- The Supabase switch is a single mention. Do not present it as a trend publicly until a second instance
  appears.
- LinkedIn: never name these products.

## Source

- Internal: customer call recap, 2026-09-22
- Internal: customer call recap, 2026-07-07
- Internal: sales notes, 2026-08-28
- Internal: engineering notes, 2026-02-18 (pgvector scaling)
- Internal: team discussion, 2026-11-15 (Postgres extension)
- Internal: team discussion, 2026-11-23 (competitor tracking)
- Internal: founder note, 2026-10-30 (Supabase)
- Internal: founder note, 2026-10-09 (Postgres graph)
- Internal: founder note, 2026-10-13 (positioning)
- Internal: team discussion, 2026-11-06 (SelfGraph)
