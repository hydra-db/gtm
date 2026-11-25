---
title: Seed the daily outreach driver row
description: The one signal_feed_inputs row (feed "outreach") the daily outreach play runs over, plus the 2-person live test of that play.
outcome: pending
date: 2026-11-24
serves: signal-led feedback outreach (context/motion/signal-feedback-outreach.md)
---

## What ran

- Play: none. An inline workflow in [`seed.ts`](seed.ts) writes one
  `signal_feed_inputs` row: key `outreach:daily`, feed `outreach`.
- Trigger: the merge that adds `infra/daily-outreach/`.
- Before the merge: one live test of the play's workflow
  (`infra/daily-outreach/workflows/daily-outreach.ts`) on 2 people, drafts
  only (no lemlist campaign set). Result below.

## Headline result

- Seed: 1 row expected. Cost: 0 credits.
- Live test (2026-11-24): 1 run, 2 people drafted at defenseunicorns.com (ready_now; signal: their 2026-11-16 Agentic AI Engineer job post), both drafts status ok, 2 `outreach_enrollments` rows with `lemlist_status` drafts_only, one per sender (Thomas, Nishkarsh). 0 Cargo credits; 2 drafter runs on the agent's own model key. The test showed an emoji in a contact name ("🦄 Jeff McCoy"): the name cleaner now drops tokens with no letters, and that ledger row was corrected by hand.

## Where the full data lives

- The `signal_feed_inputs` and `outreach_enrollments` models in Cargo.

## What we learned (candidate for context/)

- Nothing yet.
