---
title: Half of new accounts went dark after onboarding, and an internal AI CS agent is what surfaced it
description: In March and April 2026 an internal customer-success agent showed roughly half of new HydraDB accounts silent for over two weeks, with questions unanswered for weeks. Anonymised lesson on activation after a launch.
confidence: hypothesis
references:
  - insight/2026-10-15-simplicity-beats-features-in-developer-infra
  - insight/2026-11-23-founder-operating-lessons
  - global/company-timeline
---

## Claim

After a launch, most new accounts stall between "got an API key" and "built something", and the failure
is usually on HydraDB's side (unanswered questions), not theirs.

## Evidence

- A daily summary from an internal customer-success agent showed about half of new accounts had gone
  quiet for more than two weeks; some had never posted a message; several received onboarding
  instructions but never engaged; one had reported an error with no follow-up for weeks.
  Internal: engineering notes, 2026-03-31
- Two weeks later the share of quiet accounts was higher, and the same error report was still
  unanswered: "This is a dropped ball." Internal: engineering notes, 2026-04-11
- Unanswered questions were listed at three to five weeks old; a group of accounts said they would try it
  and never came back. Internal: engineering notes, 2026-04-17
- A scan of all account channels found only a handful actively using the product, e.g. one that ingested
  a 300-page tax PDF and had a working graph. Internal: engineering notes, 2026-04-01
- Later focus: "Primary metric to observe is: sign ups to creating your first graph."
  Internal: team discussion, 2026-07-24

These accounts were mostly free or trial signups, not paying customers.

## Implication

Activation (first graph built) is the metric, and response time to technical questions is the lever.
Self-serve infra still needs a human or agent closing every open question within a day. Later the
founder was personally messaging new signups ([[insight/2026-11-23-founder-operating-lessons]]).

## Use in messaging

Founder-lesson post, anonymised: "Half of our new accounts went quiet within two weeks. Our own AI agent
told us why: we hadn't answered their questions." Say "accounts" or "teams that signed up", not
"customers". Never name the accounts.
