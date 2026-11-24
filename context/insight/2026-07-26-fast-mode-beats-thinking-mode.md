---
title: Users prefer fast retrieval over a slower "thinking" mode (contested)
description: Founder heard repeatedly in July 2026 that HydraDB's thinking mode was slower and worse than fast mode; a later internal measurement showed a faster fast path with no accuracy regression. A pilot eval and a customer test point the other way in some cases.
confidence: hypothesis
references:
  - insight/2026-09-04-retrieved-is-not-read
  - insight/2026-11-20-similar-wording-is-not-applicability
  - insight/2026-04-05-buyers-pay-for-accuracy-not-speed
  - objection/does-the-graph-change-results
---

## Claim

For agent retrieval, more reasoning at query time is not automatically better: users report faster
answers as better answers. Contested by HydraDB's own evals in specific cases.

## Evidence

- Nishkarsh: "based on recent feedback we've been getting im only hearing that fast > thinking & thinking
  takes more time to return worse results". Internal: founder note, 2026-07-26
- An internal before/after on HydraDB's own fast path showed no accuracy regression and a much faster
  path; what exactly was measured is not stated. Internal: engineering notes, 2026-10-04
- Counter-evidence: on one pilot eval, switching to thinking mode raised recall@10 from about 90 to about
  97 and semantic questions from 42 to 94 ([[insight/2026-09-04-retrieved-is-not-read]]).
  Internal: engineering notes, 2026-09-04
- Nishkarsh: thinking mode still performs worse than fast mode, "in some cases, more nuance." A customer
  test the same week found graph context changed nothing in either mode
  ([[insight/2026-11-20-similar-wording-is-not-applicability]]). Internal: founder note, 2026-11-18

## Implication

Default to fast retrieval; invest in better graph structure at write time rather than reasoning at read
time. Do not claim either mode is categorically better.

## Use in messaging

Contrarian post: "Our customers told us our 'thinking' mode was slower and worse. They were mostly right."
Feedback is relayed second-hand; keep wording to what the founder said. Do not publish any internal
speed multiple.
