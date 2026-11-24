---
title: Self-hosted small language models live in production (2026-11-19)
description: HydraDB moved embedding, extraction and query-understanding calls onto its own self-hosted small models, live on prod 2026-11-19, with measured latency. Supports "own your model" and data-control answers.
confidence: hypothesis
references:
  - global/product
  - global/positioning
  - proof/performance-and-cost-claims
  - client/due-diligence-ai-dependent-documents
  - client/fintech-internal-agents-poc
---

_confidence: hypothesis (we think so) | validated (seen twice, independently) |
proven (measured, repeatable). Outreach motions may only cite validated or proven
files. Start at hypothesis and earn the upgrade._

## Type

metric

## Content

- 2026-11-19: "our self hosted slms are live on PROD", with monitoring in place.
- The self-hosted models cover chat, query rewriting, entity extraction, knowledge-graph extraction, embeddings and reranking.
- Staging verification before rollout (2026-11-16): full verify tier "186 pass, 3 warn, 3 fail, done in 3 min". multi_query / entity_extract in ~420ms; embeddings ~370ms.
- Goal set by Nishkarsh on 2026-11-19: hold the self-hosted models to frontier-model quality standards for everything they are used for.
- Since the September 2026 changelog, Enterprise has included "on-prem small language models for knowledge graph extraction", "nothing extra to pay. The models are included." (2026-10-04, public changelog)
- Do not post GPU types, node counts, hosting providers or infra cost figures.

## Source

- Internal: engineering notes, 2026-11-19
- Internal: engineering notes, 2026-11-16
- Internal: founder note, 2026-11-19
- Internal: public post, 2026-10-04 (changelog)

## Client

None directly. Accounts with data-use or data-residency requirements care about this: [[client/due-diligence-ai-dependent-documents]], [[client/fintech-internal-agents-poc]].

## Context

Supports data control (customer content no longer has to leave for third-party model APIs), the cost of graph extraction, and latency. Do not imply every customer is migrated.

## Use cases

- "This week" post: why a graph database company ended up running its own models.
- Data-control objection answers (public stance only).
- Cost-of-extraction posts, without infra numbers.
