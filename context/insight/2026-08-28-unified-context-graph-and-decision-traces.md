---
title: One graph per tenant, with decision traces
description: Applied AI direction (2026-08-28) to merge knowledge, memory, preferences and decision traces into one graph, with a trace shape of Agent, Activity, Evidence, Outcome.
confidence: hypothesis
references:
  - insight/2026-10-23-search-context-memory-framework
  - alternative/cloud-ontology-accelerators
  - insight/2026-11-11-context-graph-builders-avoid-the-term
---

## Claim

Separate "knowledge" and "memory" stores are an artificial split; agents need one graph that also records
why decisions happened.

## Evidence

- Applied AI summary: move from separate knowledge and memory collections to one unified graph per
  tenant; proposed trace structure Agent, Activity, Evidence, Outcome; chain decisions by linking an
  earlier outcome to the next activity it motivates; explicit "why did this happen?" queries can be
  handled through graph traversal, while implicit semantic queries remain harder. The LLM stage makes only
  about 7 to 8% of dedupe decisions. Internal: engineering notes, 2026-08-28
- Customer pull: a prospect building an IT service agent wanted to infer decision trees from historical
  ticket activity. Internal: customer call recap, 2026-04-05
- Nishkarsh, on how HydraDB differs from big-vendor ontology kits: "modeling decision traces, user
  preferences, etc". Internal: founder note, 2026-10-23

## Implication

"Why did the agent do that?" is answerable by traversal; a differentiator for regulated buyers.
"Context graph" is internal and vendor language; Nishkarsh dislikes it, so posts should say "one graph"
or the buyer's words.

## Use in messaging

Engineering-experiment post: what we learned building decision traces, including what is still hard
(implicit semantic queries).
