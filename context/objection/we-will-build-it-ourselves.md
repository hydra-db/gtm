---
title: "We'll build our own graph / memory layer in-house"
description: "Build-vs-buy objection from strong engineering teams. Counter-evidence: a strong infrastructure engineering team chose HydraDB over building in-house; the founder's stance is to help them build on HydraDB, starting from the open-source core."
references:
  - objection/data-residency-and-self-hosting
  - alternative/postgres-and-one-engine-databases
  - insight/2026-11-24-own-your-context-teach-dont-pitch
  - insight/2026-11-15-open-source-as-distribution
  - proof/performance-and-cost-claims
  - proof/open-source-momentum
---

## Objection

"We have strong engineers; we'll build this ourselves." Heard as a threat in April 2026 ("they'll build it
themselves if HydraDB can't deliver") and in October 2026 from a prospect comparing HydraDB against fully
fledged companies.

## Root cause

Control (deployment, compliance) and a belief that a graph layer is a weekend project.

## Stage

discovery | negotiation

## Response

"You can. A team of senior infrastructure engineers looked at that and chose us."

## Full response

1. Acknowledge their capability.
2. Proof: a customer team of senior infrastructure engineers chose HydraDB over building in-house
   (2026-07-24). In posts, say "a team of senior infrastructure engineers"; never name the company or
   their former employer (no reference permission).
3. Reframe as building on HydraDB: "we will help you build your own event intelligence solution"
   (2026-10-22). The core is open source (ELv2 since 2026-11-15), so "build" can start from it.
4. Cost of ownership: object storage economics and a fast migration.

## Proof

- Build-vs-buy decision by a senior engineering team (2026-07-24), anonymous only.
- [[proof/open-source-momentum]] for the open-source core.
- [[proof/performance-and-cost-claims]] (no multiples in public).

## Followup

Ask what they would build first and offer to prototype that on HydraDB.

## Push back vs concede

Concede if their need is a narrow, static index. Push back when they need scale, ontology construction and
multi-source context.

## Source

- Internal: team discussion, 2026-04-11
- Internal: team discussion, 2026-07-24
- Internal: sales notes, 2026-10-22
- Internal: founder note, 2026-07-21
