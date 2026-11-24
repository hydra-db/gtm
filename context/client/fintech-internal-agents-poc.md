---
title: Fintech evaluating HydraDB for internal agents (POC, 2026)
description: A fintech evaluating HydraDB for internal support, engineering and ops agents, with success metrics agreed before the POC started. A prospect, not a customer.
reference_permission: no
references:
  - jtbd/connect-context-across-sources
  - jtbd/company-brain
  - persona/ai-engineering-leader
  - signal/vector-stack-hitting-limits
  - proof/self-hosted-slms-in-production
---

## Profile

A fintech with strict data-residency requirements. Evaluating HydraDB for internal use cases only (support, engineering, ops), not its customer-facing agents. Not a public reference; in posts say "a fintech".

## Use case

Many sources (support tickets, email, chat, issue tracker, docs, warehouse, databases, code) already enriched, embedded and stored. Their two problems, in their words:
1. "information doesn't connect well across data sources"
2. building shared data definitions across teams (sales and another team reading the same warehouse query differently) "keeps hitting the same underlying enrichment gap"

## Outcome

POC scoped in two tracks (customer success and engineering), with error-rate and tool-call reduction targets written down before the work started, and a fixed decision date. Outcome not recorded.

## Story

Data residency came before anything else, and legal review could have stalled the start. Their team offered redacted operational metrics (latencies, success rates) so scoping could begin while legal worked in parallel. Lesson: agree the success metric and the end date up front, and find something to scope while paperwork runs.

## Quotes

- "information doesn't connect well across data sources"

## Related

[[jtbd/connect-context-across-sources]], [[persona/ai-engineering-leader]], [[signal/vector-stack-hitting-limits]].

Sources: Internal: customer call recap, 2026-08-27 ; Internal: customer call recap, 2026-09-16
