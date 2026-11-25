---
title: Backfill 30 days of #signups
description: A one-time read of the last 30 days of #signups into the signups model, with no #sales posts for anything older than 48 hours.
outcome: pending
date: 2026-11-25
serves: readiness scoring signal coverage
---

## What ran

- Play: none. [`backfill.ts`](backfill.ts) runs the #signups read workflow
  (`infra/signal-feeds/plays/signups.ts`) once over 31 one-day windows ending
  2026-11-26 00:00 UTC. The routing play skips any signup older than 48 hours,
  so only the last two days reach #sales.
- Trigger: the merge that adds `infra/signal-feeds/models/signups.ts`.
- Context used: `infra/signal-feeds/settings.ts` (`signupsChannelId`).

## Headline result

- Pending.

## Where the full data lives

- The `signups` model in Cargo.

## What we learned (candidate for context/)

- Nothing yet.
