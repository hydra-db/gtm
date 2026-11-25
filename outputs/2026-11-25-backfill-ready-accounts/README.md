---
title: Backfill of ready accounts to #sales
description: One manual batch of Route Ready Accounts over the working-list accounts that were already ready_now when the play was switched on.
outcome: 18 accounts posted to #sales, 18 of 18 runs succeeded, 0 credits. Meetings and replies not yet attributable.
date: 2026-11-25
serves: none (plan/outcomes.md has no outcomes yet)
---

## What ran

- Play: `route_ready_accounts` (`infra/readiness-scoring/plays/route-ready-accounts.ts`), workflow `36cf29df-4164-4af3-96bd-3417fcf52918`.
- Trigger: one batch by hand on 2026-11-25 at 00:24 UTC (batch `8cd77c31-3ed7-4c23-bda1-12ab45ba1268`), over Unify Accounts filtered to `readiness_stage` ready_now and `on_working_list` yes: the play's own filter.
- Why by hand: the play runs on `changeKinds: ["added"]`, so the accounts already ready when it was switched on were never posted. The play stays on and posts new arrivals hourly at :20.

## Headline result

- 18 runs, 18 succeeded, 0 failed, 0 credits. Each run's Slack postMessage node to #sales (C0BJY52BUTZ) succeeded.
- Accounts posted: eightfold.ai, sia-partners.com, socure.com, github.blog, defenseunicorns.com, endorlabs.com, certinia.com, mercor.com, zendesk.com, datarobot.com, airwallex.com, evolutioniq.com, peregrine.io, confluent.io, floqast.com, acceldata.io, istaridigital.com, blitzy.com.

## Where the full data lives

- The batch's runs in Cargo: `cargo-ai orchestration run list --workflow-uuid 36cf29df-4164-4af3-96bd-3417fcf52918 --batch-uuid 8cd77c31-3ed7-4c23-bda1-12ab45ba1268`.

## What we learned (candidate for context/)

- github.blog is on the working list and ready_now: GitHub's blog domain, not a buyer account. Worth checking whether it should be parked.
