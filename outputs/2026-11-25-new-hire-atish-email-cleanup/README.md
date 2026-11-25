---
title: Clear an off-domain new-hire email
description: Remove the earlier-employer address the find-work-email tool returned for a new hire at harvey.ai, so daily outreach cannot draft to it.
outcome: pending
date: 2026-11-25
serves: readiness scoring signal coverage
---

## What ran

- Run `2026-11-25-new-hire-atish-email-cleanup` (inline workflow in
  [`cleanup.ts`](cleanup.ts)): removes the `email_checks` row for
  atish@getaida.com (verified "valid") and clears that email on his
  `final_tam_contacts` row. He stays there as the harvey.ai signal person,
  with no email, so daily outreach skips him.
- Why: in the 2026-11-25 limit-2 test of new-hire detection, the "Find work
  email from LinkedIn URL" tool returned an address at an earlier employer.
  `infra/new-hire-detection/scripts/found-email.ts` now keeps only addresses
  on the account's domain.
- Trigger: the merge that adds this entry.
- Context used: none.

## Headline result

- Pending.

## Where the full data lives

- The `final_tam_contacts` and `email_checks` models in Cargo.

## What we learned (candidate for context/)

- A just-moved person's "work email" can be the previous employer's. Check
  the domain against the account.
