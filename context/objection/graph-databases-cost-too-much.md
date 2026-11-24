---
title: "Graph databases are too expensive and slow to run at scale"
description: Teams that tried graph databases worry about cost, scale and spiky agent workloads. Nishkarsh answers with object storage economics, horizontal scaling and consistency, and offers to benchmark on their workload. No multiples in public.
references:
  - alternative/general-purpose-graph-databases
  - objection/we-already-run-a-graph-database
  - objection/show-me-the-benchmarks
  - insight/2026-07-25-benchmark-ranges-not-single-numbers
  - insight/2026-11-03-most-agent-data-is-idle
  - proof/performance-and-cost-claims
---

## Objection

"We looked at graphs. They're expensive to run and don't scale for our workloads." (Paraphrase of a
common buyer concern.)

## Root cause

Traditional graph databases replicate data on disk and are sized for steady workloads; agent workloads are
spiky and multi-tenant, and most tenant data is idle ([[insight/2026-11-03-most-agent-data-is-idle]]).

## Stage

demo

## Response

"Disk replication is what makes graphs expensive. We built on object storage."

## Full response

Acknowledge the cost is real. Reframe: data "is replicated on disk", which the founder says costs several
times more than object storage; HydraDB "Scales horizontally, spiky workloads friendly (agentic
workloads)" and claims strong consistency ("what you read is what you have written") (2026-10-15). Lower
switching risk: works with existing graph drivers, and migration is fast. Next step: run public, reproducible benchmarks on their workload.

Every speed or cost multiple HydraDB people have used (several, disagreeing) lives only in
[[proof/performance-and-cost-claims]]. Do not use any speed or cost multiple in public posts until a
published benchmark exists. In a sales conversation, quote a percentile range from a stated method, low end
first ([[insight/2026-07-25-benchmark-ranges-not-single-numbers]]).

## Proof

- [[proof/performance-and-cost-claims]]
- Internal: founder note, 2026-10-15
- Internal: founder note, 2026-10-19
- Internal: founder note, 2026-07-21

## Followup

Ask for data size, query mix and hop depth, then quote a percentile range, not a single number.

## Push back vs concede

Hold the line on architecture. Concede that any single speed figure depends on query type and hop depth
(his own rule, 2026-07-25).
