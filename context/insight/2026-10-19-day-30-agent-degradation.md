---
title: Agents that work in the demo decay by day 30; graph natives and everyone else buy differently
description: Founder's segmentation (2026-10-19). Teams already on graph databases buy on cost, ontology engine and agent primitives; everyone else arrives after their agent degrades as users and context grow. Independently echoed by a prospect on a call.
confidence: validated
references:
  - objection/vector-search-is-enough
  - alternative/vector-databases
  - alternative/general-purpose-graph-databases
  - insight/2026-07-07-vector-similarity-fails-on-relational-memory
  - insight/2026-11-24-own-your-context-teach-dont-pitch
  - motion/signal-feedback-outreach
  - icp/hydradb
---

## Claim

Non-graph-native teams discover they need a graph only after their agent works in the demo and degrades in
production as users and context grow. Graph-native teams are a separate buyer.

## Evidence

- Internal: founder note, 2026-10-19. Nishkarsh: "they would build a demo or an agent. That agent would
  perform really well when there are fewer users and less context to handle but by day 30, when that
  agent's context has blown up, it starts answering incorrectly and ineffectively." Example: a consumer
  app that "started out as a wonderful thing that remembered everything" but degraded in quality as users
  added context and the user base grew. "these are the people ... who are coming naturally to the
  conclusion that they need something more than a vector DB and/or markdown files to maintain context."
  Two buyer types: graph natives already on Neo4j, FalkorDB and similar, vs non graph natives who are
  "slowly and steadily ... coming to the same conclusion that they need a graph to maintain accuracy at
  scale". He dislikes the term "context graph".
- Internal: sales notes, 2026-10-15. A prospect on a call: "vectorDB isn't enough and we need knowledge
  graphs for our agents to work".
- Internal: team discussion, 2026-10-15. Pitch framing: "If you are moving away from vectorDB -> knowledge
  graphs because you think it adds to improved accuracy at scale then HydraDB is built for you!"

Validated: the founder's observation and an independent prospect statement on a call point the same way.

## Implication

Two message tracks: graph natives get architecture, cost and ontology-engine arguments; everyone else gets
the day-30 accuracy story first, starting from the symptom, not graph theory.

## Use in messaging

- Hook: "Every agent demo works. Day 30 is where they break."
- Hook: "Your agent isn't getting dumber. Its context is getting bigger."
- Do not name or describe the example app beyond "a consumer app".
