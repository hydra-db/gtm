---
title: Even very small customers now run enterprise-grade AI data reviews
description: A very small customer on an entry plan sent a multi-point AI data review in November 2026. It pushed HydraDB to run self-hosted models, which went live in production on 2026-11-19.
confidence: hypothesis
references:
  - objection/data-handling-dpa-and-retention
  - objection/data-residency-and-self-hosting
  - insight/2026-09-24-saas-customers-sit-above-your-access-boundary
  - icp/hydradb
---

## Claim

For AI infrastructure that ingests company data, sub-processor and model-provider questions now arrive
from tiny startups on entry plans, not just enterprises. Self-hosted models are becoming table
stakes for a context layer.

## Evidence

- Internal: customer call recap, 2026-11-10. A very small AI startup on an entry plan sent a multi-point
  review covering which model provider handles each step, retention, data processing terms, deletion, and
  key scoping, with a deadline.
- Internal: engineering notes, 2026-11-19. HydraDB's answer was to run its own small language models and
  embedding models so customer content for those steps does not go to an outside model provider. Self-hosted
  extraction and embedding models went live in production on 2026-11-19 (see
  [[proof/self-hosted-slms-in-production]]).
- Internal: customer call recap, 2026-08-28. A different customer's AI team asked HydraDB to switch the
  model used for one step.
- Supporting: enterprise prospects on calls asked for residency and self-hosting
  ([[objection/data-residency-and-self-hosting]]).

The "small buyer" part rests on one customer; stays hypothesis. The customer is not ICP by size; that is
the point of the observation, not a fit signal.

## Implication

Make the "which models see my data" answer a public page, not a thread. Price plans assuming compliance
questions at every tier.

## Use in messaging

Post angle: "Our smallest customer sent us our hardest security review." Do not name the customer; do not
mention gaps in HydraDB's own provider paperwork.
