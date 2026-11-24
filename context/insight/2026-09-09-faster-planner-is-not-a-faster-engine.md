---
title: A faster query planner did not make a faster engine
description: Engineering result from 2026-09-09. HydraDB's new query engine cut 20-hop latency 22% but made ordered queries about 29x slower, because the cheaper planner skipped statistics reads.
confidence: hypothesis
references:
  - insight/2026-07-25-benchmark-ranges-not-single-numbers
  - insight/2026-11-19-agents-run-our-engineering-loop
  - proof/performance-and-cost-claims
---

## Claim

Optimising one stage of a database (planning) can regress the whole system; benchmark every query class
before calling something an upgrade.

## Evidence

- Engineering TL;DR: "The new engine is not faster across the board. Basic lookups and writes: roughly
  unchanged. 20-hop queries: client p50 improved from 7.90 ms to 6.19 ms, about 22% lower latency.
  Ordered/keyset queries: approximately 29x slower in the new engine, despite correct results. Planning:
  the new physical planner is much cheaper, but it skips statistics reads. Faster planning does not
  guarantee faster execution. Conclusion: Fix the new engine's ordered-index scans and limit handling
  before treating it as a performance upgrade." Internal: engineering notes, 2026-09-09
- A statistics-based query planner was later built, suggesting the fix direction. Internal: engineering
  notes, 2026-10-16

These are internal before/after measurements on HydraDB's own engine, not comparisons with another
product. Never present them as a speed claim against anyone else.

## Implication

Shows engineering honesty; supports the ranges-not-single-numbers stance.

## Use in messaging

Behind-the-scenes post: "Our new engine made 20-hop graph queries 22% faster. It also made ordered queries
29x slower."
