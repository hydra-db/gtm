---
title: "We already run Neo4j, we like it, and everything is written in Cypher"
description: The incumbent-graph objection, from sales discovery with Neo4j users and Cypher-heavy prospects. Answer with the agent-first difference and low switching cost (Bolt, Cypher, their own queries proved first), never with speed.
references:
  - alternative/general-purpose-graph-databases
  - insight/2026-10-13-better-neo4j-is-a-losing-position
  - objection/graph-databases-cost-too-much
  - objection/show-me-the-benchmarks
  - proof/performance-and-cost-claims
  - icp/hydradb
---

## Objection

- Not quoted verbatim. Discovery on a Neo4j account (2026-10-21): real effort invested, they love it, and
  its limitation is that cost limits movement.
- An agent startup (2026-07-07): "Strong preference for a Cypher-compatible interface: different graph DBs
  have diverging query languages, making migration friction high".

## Root cause

Sunk effort plus genuine satisfaction. Predefined queries are production logic, so rewriting them is the
real switching cost, more than data migration. Teams are often fine ingesting JSON "(source, destination,
relation)" but want "full control over defining which properties go on nodes vs. edges". The pain is
usually not quality; it is that cost "limits movement": they cannot expand usage.

## Stage

discovery | demo

## Response

"Keep what you love about it. Send us the queries you run today; we'll prove them on HydraDB before you
change a line. Then the question is what the cost stops you from doing next."

## Full response

- Acknowledge the love, the effort and the lock-in. Do not argue the tool is bad.
- Reframe around the compelling event ("future state") that the current cost blocks.
- Position HydraDB as "a different kind of Neo4j that is primarily built for agents" (Nishkarsh,
  2026-10-13), with the graph built automatically from their sources.
- Lower switching risk: HydraDB accepts Bolt connections so a stock GDS client connects, with GDS
  PageRank and betweenness (2026-11-04); "we work directly with neo4j drivers" (2026-10-15); BYOG lets
  graph-native users query their graph directly in Cypher (2026-11-21).
- Validate on their own queries before their deadline, with a short recurring sync (15 minutes, once or
  twice a week).
- Do not lead with "20% faster" (advisor, 2026-07-21), and quote no multiple: see
  [[proof/performance-and-cost-claims]].

## Proof

- One customer moved off a general-purpose graph database against a fixed deadline after sharing
  predefined queries and sample data (mid 2026). Anonymous only; no public reference.

## Followup

Ask for the compelling event and its date, and for the top 20 queries by volume with today's latency.

## Push back vs concede

- Concede when the value is hand-written Cypher over a hand-modeled schema with no agent in the loop.
- Concede that full Cypher compatibility matters to Cypher-heavy teams and that HydraDB's Cypher support
  was still maturing in late 2026; push back that most agent queries are predefined patterns that can be
  validated quickly.

## Source

- Internal: sales notes, 2026-10-21
- Internal: founder note, 2026-10-13 and 2026-10-15
- Internal: engineering notes, 2026-11-04
- Internal: team discussion, 2026-07-21 (advisor feedback)
- Internal: customer call recap, 2026-07-07
- Internal: team discussion, 2026-11-21 (BYOG)
