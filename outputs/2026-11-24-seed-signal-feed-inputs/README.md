---
title: Seed signal_feed_inputs
description: The first rows of signal_feed_inputs, the list the GitHub and job-post feeds run over.
outcome: 24 signal_feed_inputs rows written (23 GitHub repos, 1 job-post row), 0 credits.
date: 2026-11-24
serves: readiness scoring signal coverage
---

## What ran

- Play: none. An inline workflow in [`seed.ts`](seed.ts), once per row, writes
  one `signal_feed_inputs` row (`infra/signal-feeds/models/signal-feed-inputs.ts`).
- Trigger: the merge that adds `infra/signal-feeds/`.
- Context used: `infra/signal-feeds/settings.ts` (`watchedRepos`).

## Headline result

- 24 rows written on the #23 deploy (2026-11-24): 23 GitHub repos (2 own, 21
  primitives) and 1 job-post row. Cost: 0 credits.

## Where the full data lives

- The `signal_feed_inputs` model in Cargo.

## What we learned (candidate for context/)

- Nothing yet.
