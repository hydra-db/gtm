---
title: HydraDB speed, latency and cost claims (guardrails and safe numbers)
description: The rule against speed or cost multiples, the architectural cost reasoning that can be posted, and internal and customer-measured latency numbers with their caveats. No multiple here is a published benchmark.
confidence: hypothesis
references:
  - proof/retrieval-accuracy-benchmarks
  - proof/self-hosted-slms-in-production
  - global/positioning
  - global/product
  - client/context-platform-graph-migration
  - client/due-diligence-ai-dependent-documents
---

_confidence: hypothesis (we think so) | validated (seen twice, independently) |
proven (measured, repeatable). Outreach motions may only cite validated or proven
files. Start at hypothesis and earn the upgrade._

## Type

benchmark

## Content

**Do not use any speed or cost multiple in public posts until a published, reproducible benchmark exists.**

### Why the multiples are off limits (guardrail)

- Speed and cost multiples have been stated many times in pitches, drafts and copy, and they disagree with each other by more than an order of magnitude. None is backed by a published benchmark with a stated workload.
- Public website copy has itself been inconsistent (homepage, manifesto and blogs each used a different range). Do not repeat any of them.
- Unmeasured "4x recall" or "4.9x response quality" style stats: never use.
- Method rule Nishkarsh set (2026-07-25): "if you want to compress it to one number we'll use the lower end of the spectrum" and "we'll use percentile based benchmarks in any case".

### Architectural cost and design reasoning (claims, no multiple needed)

- Object storage instead of disk replication changes graph economics. Safe phrasing for posts: name no competitor and give no multiple.
- "We are currently the only graphDB that scales efficiently on top of object storage." (2026-09-10). Hypothesis; do not repeat as fact.
- "Scales horizontally, spiky workloads friendly (agentic workloads)" (2026-10-15).
- Consistency: "We guarantee strong consistency -> meaning what you read is what you have written." Compatibility: works directly with Neo4j drivers (2026-10-15).

### Internal engineering measurements (single measurements, hardware and workload not always stated)

- Storage engine: "replicated logs: p99 8ms" (2026-09-07).
- New query engine: "20-hop queries: client p50 improved from 7.90 ms to 6.19 ms, about 22% lower latency", while ordered/keyset queries got much slower in the new engine despite correct results (2026-09-09). Honest trade-off story; leave out the slowdown multiple.
- Embedding model switch: "p99 of < 50ms" (2026-09-27).
- Connector stress test: "Jira 40k (1.04M rows at ~1.5k rows/s) plus 3 concurrent connectors: PASS" (2026-10-08).
- Load test at production-like load: "it held p99 with 0 errors (p50 118 ms, p99 382 ms)" (2026-10-16).
- Chunk-exploration step for fast mode: p50 8.6 ms, p99 257.3 ms (2026-10-25). A single step, never full query latency.
- Retrieval modes: vector "~20ms", graph "thinking" "~200ms" (2026-09-28). Earlier vector search note: "~20ms (vs 100ms+ when indexes polluted)" (2026-02-18).
- Self-hosted models: multi_query / entity_extract "~420ms", embeddings "~370ms" (2026-11-16; see [[proof/self-hosted-slms-in-production]]).

### Customer-measured

- A due-diligence AI startup: "about 0.4 s a search in fast, and 2 to 4 s in thinking or auto" (2026-11-18).
- A large services company described the gain over its own GraphRAG as "minutes to seconds" (2026-09-22). Qualitative, one call.

## Source

- Internal: founder note, 2026-07-25
- Internal: founder note, 2026-09-10
- Internal: founder note, 2026-10-15
- Internal: engineering notes, 2026-02-18 to 2026-11-16
- Internal: customer call recap, 2026-09-22
- Internal: team discussion, 2026-11-18

## Client

Anonymised: [[client/context-platform-graph-migration]], [[client/due-diligence-ai-dependent-documents]] (customer latency).

## Context

Speed is part of the pitch but not the story (see [[global/positioning]]). Until a published, reproducible benchmark exists, posts may describe the architecture and the honest engineering trade-offs, not multiples.

## Use cases

- Engineering posts: fast mode vs thinking mode; "our new engine made 20-hop queries 22% faster and ordered queries far slower" as an honest-engineering story (internal measurement, say so; leave out the multiple).
- Architecture explainer: why object storage changes graph economics (no multiple, no competitor named).
- Objection answers to "graphs are too slow or expensive for agents": point to a public benchmark repo, not a number.
