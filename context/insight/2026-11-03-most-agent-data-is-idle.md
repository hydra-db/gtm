---
title: Most agent context collections sit idle, so pick infrastructure whose cost follows active data
description: HydraDB's internal decision (2026-11-03) not to migrate its search engine, because most tenant collections are idle and a node-priced engine would spend more on per-tenant overhead than on data.
confidence: hypothesis
references:
  - alternative/vector-databases
  - objection/graph-databases-cost-too-much
---

## Claim

Multi-tenant agent context is mostly cold. Infrastructure priced by nodes and heap wastes money on it;
infrastructure priced by active data fits. And swapping engines rarely fixes operational problems.

## Evidence

- Internal: engineering notes, 2026-11-03, on HydraDB's own shared tier:
  - The shared tier holds thousands of small tenant databases. One index per database in a node and
    heap priced engine would spend far more memory on per-shard overhead than the data itself occupies.
  - HydraDB fuses several retrieval lanes per query, more than the alternative engine allowed in one
    hybrid query.
  - The right cost model follows active data, and about 90% of collections are idle.
  - Keyword ranking is a small part of the final ranking weight.
  - "Our problems are how we run [the engine], not [the engine] itself."
  - Switching would cost a lot (re-indexing every tenant) and fix none of the above.

The 90% figure is an internal reading as of 2026-11-03. Do not publish tenant counts, data volumes or
infrastructure details.

## Implication

Many small, mostly idle tenant databases is the natural shape of agent context (one per user, agent or
customer). Cost models should scale with use, not tenant count. For buyers: be suspicious of an
infrastructure migration pitched as a fix for operational pain.

## Use in messaging

Founder or engineering post: "We almost migrated our search engine. The math said we'd pay more for
overhead than for data." Ending: "Before you migrate, check whether the problem is the tool or how you run it." No
incident details in public.
