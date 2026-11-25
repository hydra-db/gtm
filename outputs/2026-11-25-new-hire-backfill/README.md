---
title: New-hire detection backfill
description: Route the seven new hires the first new_hires sync loaded before the route play ran.
outcome: pending
date: 2026-11-25
serves: readiness scoring signal coverage
---

## What ran

- Batch `2026-11-25-new-hire-backfill` ([`backfill.ts`](backfill.ts)): the play
  `new_hire_detection_route` over seven `new_hires` rows that started in
  10/2026 or 11/2026. The first sync (on the merge of #45) loaded all 14
  people in the search while the play was set to skip existing rows, so
  these were never routed. The three public enterprises (JPMorganChase,
  Takeda, Accenture) are left out: enterprise_parked keeps them off the
  working list.
- Cost estimate (live prices 2026-11-25): 0.25 company lookup, 0.5 to 3 for
  the email, 0.1 to verify, per person. About 8 credits typical, at most
  about 20.
- Trigger: the merge that adds this entry.
- Context used: none.

## Headline result

- Pending.

## Where the full data lives

- The `new_hire_signals`, `tam_candidates`, `final_tam_contacts` and
  `email_checks` models in Cargo.

## What we learned (candidate for context/)

- The "Find work email from LinkedIn URL" tool can return a verified address
  at a previous employer for someone who just changed jobs. Check the domain.
