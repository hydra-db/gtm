---
title: "Show me the numbers on my workload"
description: Heads of AI ask for latency and accuracy benchmarks and peer references before a deep dive; generic speed claims do not move them. Answer with a golden dataset of their own queries and targets set before the POC.
references:
  - insight/2026-04-05-buyers-pay-for-accuracy-not-speed
  - insight/2026-07-25-benchmark-ranges-not-single-numbers
  - insight/2026-11-01-benchmark-leads-expire
  - insight/2026-08-05-pocs-need-a-fixed-scope-and-clock
  - objection/we-already-run-a-graph-database
  - proof/performance-and-cost-claims
---

## Objection

- A services firm's Head of AI: latency benchmarks are "critical" before a deep dive (2026-09-30).
- An agent startup benchmarked HydraDB against a general-purpose graph database on raw traversal latency
  (2026-07-07).
- A regulated-industry prospect wanted "2-3 use cases with golden datasets" (2026-09-30).
- A customer asked for "benchmark docs" and the request sat unfulfilled for weeks (2026-03-31). Lesson:
  have them ready.

## Root cause

Every vendor claims speed. Buyers have already been burned by retrieval that looked good in demos.
One enterprise software buyer: "Latency matters but accuracy comes first."

## Stage

discovery

## Response

"Give us your queries, the ones that work and the ones that don't, and we'll move the number you already
track."

## Full response

HydraDB's standard move is a golden dataset: "queries that perform well + queries that don't, to benchmark
improvement", with the goal of "measurable progress (e.g. 30 -> 70 -> 90 accuracy)" (2026-04-06).
Set targets before the POC, as a target error rate the buyer already tracks; targets, not results. Point to public, reproducible benchmark repos (graph DB, accuracy, ingestion latency; 2026-10-15;
benchmarks.hydradb.com) with method and dataset stated. Offer a peer technical contact only where that
account has agreed. Never offer an evaluator as a reference.

## Proof

- [[proof/performance-and-cost-claims]]: measured scores with a stated dataset are usable; speed and cost
  multiples are not. Do not use any speed or cost multiple in public posts until a published benchmark
  exists.

## Followup

Ask for their current baseline and the metric their agents are judged on.

## Push back vs concede

Concede that the burden of proof is on HydraDB. Push back on single headline numbers from any vendor,
including HydraDB: ask for percentiles, hardware and workload.

## Source

- Internal: sales notes, 2026-09-30
- Internal: customer call recap, 2026-07-07
- Internal: customer call recap, 2026-04-05 and 2026-04-06
- Internal: team discussion, 2026-10-15 (public benchmark repos)
- Internal: team discussion, 2026-03-31
