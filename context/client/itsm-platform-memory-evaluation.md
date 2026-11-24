---
title: ITSM platform evaluating memory and a ticket graph (2026)
description: An ITSM platform that came inbound after HydraDB's funding news, wanting memory, a users-assets-tickets graph and architecture advice on top of an already strong search stack. Evaluation only; not a customer.
reference_permission: no
references:
  - jtbd/memory-that-tracks-change
  - jtbd/connect-context-across-sources
  - signal/inbound-after-news-or-graph-buzz
  - signal/vector-stack-hitting-limits
  - persona/ai-engineering-leader
---

## Profile

An ITSM platform (employees raise IT tickets for laptops, VPN, access) with an AI assistant on top. Knowledge ingestion from wikis and document stores had been live for years. Not a public reference; in posts say "an ITSM platform".

## Use case

Three use cases, in their framing:
1. Knowledge ingestion with permissions mirrored from the source and filtered at search time.
2. User and agent memory: a small set of facts per user stored flat in a relational database, deduplicated by a batch job, with "no graph layer, no derived intelligence". They wanted HydraDB "to both store memories and extract/derive learnings from raw traces"; "open issues saved as memories should update when resolved".
3. Graph for tickets: "infer decision trees from historical ticket activity to guide agents on next-best-action". Few tickets per user per year, but "steps per ticket are high and complex".

## Outcome

Evaluation stage only. A golden query list (positive and negative) was requested. No result recorded.

## Story

They came in because of HydraDB's funding announcement, had previously explored graph databases, and had tried another memory product that was "not tuned to their use case". Their search already scored around 90% on internal benchmarks using hybrid keyword plus vector search, entity mapping as a boost rather than a filter, and re-ranking.

What they lacked: memory across sessions, a graph linking ticket to user to asset ("here's your latest ticket for this issue"), and personalised rather than org-wide knowledge. Their AI lead wanted HydraDB to "remove the Permutation and combination of various retrieval strategies and help them decide better", i.e. recommend an architecture, not hand over docs.

## Quotes

- "Latency matters but accuracy comes first"
- "agents treated as workforce, memories act as SOPs that agents can propose updates to for human admin approval"
- "today's extractions should inform tomorrow's extraction logic"
- Agent success measured on "first response time, resolution time, ticket deflection, survey scores"

## Related

[[jtbd/memory-that-tracks-change]], [[signal/inbound-after-news-or-graph-buzz]].

Sources: Internal: customer call recap, 2026-04-05 ; Internal: customer call recap, 2026-04-06
