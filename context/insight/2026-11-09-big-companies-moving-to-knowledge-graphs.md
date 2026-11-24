---
title: Big companies are moving to knowledge graphs and ontologies for agents, and the infra wave will follow
description: Within weeks, AWS and NVIDIA released public ontology tooling and the team tracked several large tech companies moving toward knowledge graphs for agents. Nishkarsh expects a graph-infrastructure wave, the way open-source LLMs created inference hosts.
confidence: validated
references:
  - insight/2026-10-23-big-vendors-ship-ontology-kits-for-sql
  - insight/2026-10-23-search-context-memory-framework
  - insight/2026-11-11-context-graph-builders-avoid-the-term
  - insight/2026-08-03-buyers-now-pull-graphs
  - alternative/cloud-ontology-accelerators
  - global/positioning
---

## Claim

Large companies are adopting knowledge graphs and ontologies for their agents now, which creates room for a
dedicated infrastructure provider. Nishkarsh's thesis: everyone building agents will adopt context,
knowledge or memory graphs, and that rush will create a graph-infra category, as open-source LLM adoption
did for inference hosts.

## Evidence

Two independent observations by different people:
- Internal: founder note, 2026-10-23. Nishkarsh: "big companies are already coming in hard": AWS and
  NVIDIA released public ontology repos within the same 48 hours.
- Internal: team discussion, 2026-11-09. A team member: "lately a lot of big companies have started taking
  knowledge graphs and ontologies seriously for their ai agents, and they're either building them in or
  talking about them in some way", citing several large tech companies' public posts and talks.

The thesis and supporting lines (Nishkarsh):
- Internal: founder note, 2026-10-29: "Everybody will be adopting (context/knowledge/memory) graphs - it's
  like how people rushed to adopt OSS LLMs and that gave birth to [inference hosts]. Same is going to
  happen here."
- Internal: founder note, 2026-11-09: "That's exactly why we need to move fast here."
- Internal: founder note, 2026-11-24: "we see the benefits and rest of the companies are now catching with
  different terms - context graph, sales graphs, etc etc"
- Category line history: "Essentially a 'turbopuffer' for graphs is required to make agents work"
  (Internal: founder note, 2026-09-10); a reservation on 2026-10-14 that the Turbopuffer comparison
  "won't work for 80% of the audience"; latest framing 2026-11-24, "turbopuffer for graphDBs" (see
  [[global/positioning]]).

Validated for the adoption trend (two people, independent observations). The "infra wave" part is
Nishkarsh's thesis only.

## Implication

Timing argument for buyers and investors: the category is forming now. Position HydraDB as the infra layer
of that category, not a feature. Only public launches (like the AWS and NVIDIA repos) may be named; never imply a big company is evaluating
HydraDB.

## Use in messaging

- Post hook: "In 48 hours, two of the biggest companies in tech open-sourced ontology tooling for agents."
- Market-thesis post: "Open-source LLMs created inference clouds. Knowledge graphs for agents will create
  their own infra layer." Naming the inference-host analogy is fine.
