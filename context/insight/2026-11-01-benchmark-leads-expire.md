---
title: Benchmark leaderboard leads expire in weeks; a number without a workload is not proof
description: HydraDB's own landing-page review (2026-11-01) dropped its leaderboard-margin line because others passed it, and flagged its homepage cost multiple as having no workload behind it. Durable claims are question-first benchmarks with a stated workload and method.
confidence: hypothesis
references:
  - insight/2026-07-25-benchmark-ranges-not-single-numbers
  - objection/show-me-the-benchmarks
  - proof/performance-and-cost-claims
---

## Claim

In agent memory and context, a leaderboard lead is rented, not owned. The durable claims are question-first
benchmarks with a stated workload and method.

## Evidence

- Internal: team discussion, 2026-11-01. A teardown of another search company's public site, done for
  HydraDB's landing page, concluded:
  - benchmarks should lead with the question, with the score as the proof; HydraDB dropped its old
    leaderboard-margin line because others had passed it.
  - the other company showed cost for a stated workload with the method linked; HydraDB's homepage cost
    multiple had no workload behind it.
  - their graph page used one question where keyword search finds nothing, semantic search finds nothing,
    and the graph finds the cause.
- Internal: engineering notes, 2026-07-23. Plan: for each internal benchmark, publish a blog on the
  existing benchmarks, why they fall short, and what HydraDB intends to measure.
- Related, Internal: team discussion, 2026-11-15. Different pages used different cost multiples,
  unreconciled (see [[proof/performance-and-cost-claims]]).

## Implication

Do not cite the old leaderboard margin or any cost multiple publicly. Publish benchmarks as worked
questions with the dataset and method linked.

## Use in messaging

Honest founder post: "We deleted our best benchmark number from our homepage. Someone beat it." Strong
because it is self-critical. Do not name the leaderboard or competitors.
