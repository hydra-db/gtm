---
title: Agents now pick up most of the engineering backlog; humans make the go/no-go calls
description: In November 2026 an autonomous loop opened batches of fixes against the core DB, dropped what wasn't worth fixing, and escalated only the behaviour decisions docs don't settle. Plus deterministic-simulation invariants and agent-run root-cause analysis.
confidence: hypothesis
references:
  - insight/2026-11-14-internal-code-reviewer-beat-paid-tool
  - insight/2026-09-09-faster-planner-is-not-a-faster-engine
  - insight/2026-11-23-founder-operating-lessons
---

## Claim

The scarce resource on an AI-native database team is no longer writing fixes; it is deciding intended
behaviour.

## Evidence

- Internal: engineering notes, 2026-11-18. The next batch of 10 loop PRs spanned query parsing, query
  execution, procedures, an HTTP client and a Postgres extension. "the loop also dropped 3 as not worth
  fixing and stopped on 5 that need a go/no-go"
- Internal: engineering notes, 2026-11-19. "need help on 12 go/no-go calls from the ... loop. each one is a
  behaviour the docs dont settle ... (all other issues ... were picked up autonomously by the loop :D)"
  Example: "does a node promise one tenant can't starve another".
- Internal: engineering notes, 2026-11-02. An invariants and promises doc for deterministic simulation
  testing was written to feed the loop.
- Internal: engineering notes, 2026-10-27. An agent root-caused three failing end-to-end tests: "Product
  regression: No ... Test contract regression: Yes".
- Internal: engineering notes, 2026-11-22. An agent identified the owners of related changes across two
  codebases for the final phase of a migration.

## Implication

Founder post material on how a small team ships a database. Not a buyer claim.

## Use in messaging

Post hook: "Our backlog loop fixed 10 bugs in one batch. It asked us 12 questions. The questions were the
hard part." Do not name the loop's vendor unless that relationship is public.
