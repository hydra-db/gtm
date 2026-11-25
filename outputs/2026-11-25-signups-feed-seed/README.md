---
title: Seed the #signups feed input
description: The signal_feed_inputs row the 12-hourly #signups read runs over.
outcome: pending
date: 2026-11-25
serves: readiness scoring signal coverage
---

## What ran

- Play: none. An inline workflow in [`seed.ts`](seed.ts) writes the one
  `signups` row of `signal_feed_inputs`, which the play
  `signal_feeds_signups_12h` (`infra/signal-feeds/plays/signups.ts`) runs over.
- Trigger: the merge that adds `infra/signal-feeds/models/signups.ts`.
- Context used: none.

## Headline result

- Pending.

## Where the full data lives

- The `signal_feed_inputs` model in Cargo.

## What we learned (candidate for context/)

- Nothing yet.
