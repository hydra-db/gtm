---
title: Agent memory that knows what changed
description: Buyers need agent memory that tracks change over time (preferences, deal values, ticket status, inventory, a user's progress) and keeps the history, not a pile of facts that goes stale. Four teams described the same failure four ways.
references:
  - jtbd/connect-context-across-sources
  - proof/graph-retrieval-examples
  - proof/retrieval-accuracy-benchmarks
  - signal/vector-stack-hitting-limits
  - client/context-platform-graph-migration
  - client/consumer-marketplaces-customer-memory
  - client/ai-native-crm-poc
  - client/itsm-platform-memory-evaluation
  - client/meeting-notes-app-longitudinal-memory
---

## Job

When _a fact about a user, deal or object changes_, I want _the agent's memory to update and keep the history_, so that _the agent acts on what is true now and can still explain what was true before_.

## Current solution

Flat facts in a relational database with a dedupe batch job; relational database plus vector search; a general-purpose graph database with hand-written queries.

## Gap

The same failure, described four ways by four teams:
- A context-management platform: "user preferred Puma for running shoes until November, then switched to Nike" (2026-07-07)
- A consumer marketplace: "Stale/irrelevant notifications (e.g., price updates for sold cars)" and "Missing temporal relationships" (2026-09-22)
- An AI-native CRM: "Temporal deal tracking (e.g., deal value changes from $1K to $40K)" (2026-09-22)
- An ITSM platform: "open issues saved as memories should update when resolved" (2026-04-05)

Unordered recall surfaces stale facts: the swim-meet example ("came last" vs the full arc to a trophy, 2026-07-21; [[proof/graph-retrieval-examples]]).

## Evidence

The ITSM platform also asked for derived learnings, not just storage: "today's extractions should inform tomorrow's extraction logic", with agent learnings "surfaced as drafts for admin approval". Benchmark: temporal reasoning 91 vs 60 on BEAM 1M ([[proof/retrieval-accuracy-benchmarks]]). Hero copy: HydraDB stores "how it all evolves, including what changed, when, and why" (2026-10-15).

Internal: customer call recap, 2026-07-07 ; customer call recap, 2026-09-22 ; customer call recap, 2026-04-05 ; founder note, 2026-07-21 ; team discussion, 2026-10-15

Merged from staging: calls/jtbd/agent-memory-that-updates-itself.
