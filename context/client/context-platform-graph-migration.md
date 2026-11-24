---
title: Context-management platform moving off a graph database (Jul 2026)
description: A context-management platform moved its graph onto HydraDB because vector similarity failed for its use case and it needed a working graph store within about a week to onboard its own first paying customer.
reference_permission: no
references:
  - jtbd/memory-that-tracks-change
  - signal/vector-stack-hitting-limits
  - proof/performance-and-cost-claims
---

## Profile

A context-management platform storing user preferences, memories and relationships in a graph. No permission to name. Say "a context-management platform".

## Use case

Graph store under their memory product. Nodes "hold rich JSON (not just entities): e.g. user preferred Puma for running shoes until November, then switched to Nike". Edges also hold multiple memories. Multi-hop traversal capped at 3 hops. Queries are mostly predefined Cypher; an LLM sometimes composes Cypher.

## Outcome

Chose HydraDB on 2026-07-07 against a hard deadline about a week out, tied to onboarding their own first paying customer. Benchmark result not recorded.

## Story

They were on a general-purpose graph database with raw Cypher. "Vector similarity search is failing for their use case, graph is the required path forward." Pain points: choosing starting nodes for traversal, latency spikes when fanning out "from 10 entities at once", and filtering after traversal, which pulls "too much irrelevant data". HydraDB went live for them the same day on one version and moved them to the next a day later so they could hit the deadline. Do not quote any speed multiple from this account.

## Quotes

- On pre-filtering a graph: "can't ask for a book if you don't know the library"
- "Strong preference for a Cypher-compatible interface: different graph DBs have diverging query languages, making migration friction high" (call summary)

## Related

[[jtbd/memory-that-tracks-change]], [[signal/vector-stack-hitting-limits]].

Sources: Internal: customer call recap, 2026-07-07
