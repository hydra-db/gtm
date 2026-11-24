---
title: Consumer marketplaces, customer memory at volume (2026)
description: Two consumer marketplaces. One evaluating HydraDB with more than a million memory items onboarded; one whose Postgres plus vector customer context engine sends stale notifications. Evaluations, not public references.
reference_permission: no
references:
  - proof/launch-reach-and-social-proof
  - jtbd/memory-that-tracks-change
  - signal/vector-stack-hitting-limits
---

## Profile

Two consumer marketplaces. Neither is cleared to name. Describe as "a consumer marketplace".

## Use case

- Marketplace A: agent memory at volume, 1M+ memory items onboarded during evaluation.
- Marketplace B: a "customer context engine" that aggregates customer conversations (calls, chats, human agents) to personalise sales pitches.

## Outcome

- Marketplace A: 1M+ memory items onboarded (mid 2026). Its anonymised use case became the example shown to lookalike prospects.
- Marketplace B: wanted a head-to-head POC of their Postgres plus vector setup against HydraDB on their own use case. No result recorded.

## Story

Marketplace B's stack is Postgres plus vector search. It struggles with:
- "Stale/irrelevant notifications (e.g., price updates for sold cars)"
- "Missing temporal relationships and entity linkages"
- "High maintenance overhead for schema management"

The pattern: similarity search finds the item but not whether it is still true.

## Quotes

- Example failure: "price updates for sold cars"

## Related

[[jtbd/memory-that-tracks-change]], [[signal/vector-stack-hitting-limits]], [[proof/launch-reach-and-social-proof]].

Sources: Internal: team discussion, 2026-07-24 ; Internal: customer call recap, 2026-09-22 ; Internal: sales notes, 2026-10-13
