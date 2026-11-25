---
title: Seed the tech-adoption driver row
description: The signal_feed_inputs row the weekly graph and vector tool adopters search runs over, plus a 3-company live test of that search.
outcome: pending
date: 2026-11-25
serves: readiness scoring signal coverage
---

## What ran

- Play: none. An inline workflow in [`seed.ts`](seed.ts) writes the one
  `tech_adoption` row of `signal_feed_inputs`, which the play
  `signal_feeds_tech_adoption_weekly`
  (`infra/signal-feeds/plays/tech-adoption.ts`) runs over.
- Trigger: the merge that adds `infra/signal-feeds/models/tech-adoption-signals.ts`.
- After the merge: one live run of the play's workflow capped at 3 companies
  (1.5 credits), to confirm rows land in `tech_adoption_signals` and
  `tam_candidates`.
- Context used: none.

## Headline result

- Pending. Slug lookup before the build: 4 theirStack searchTechnologies
  calls (2 credits), free catalog checks, and one 1-company probe of the full
  search with its domain exclusions (0.5 credits, 3,317 domains excluded).

## Where the full data lives

- The `signal_feed_inputs`, `tech_adoption_signals` and `tam_candidates`
  models in Cargo.

## What we learned (candidate for context/)

- theirStack's catalog has no FalkorDB, Zep or Zilliz slug; TigerGraph is
  `tigergraph-db`.
