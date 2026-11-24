---
title: Search, context, memory, a framework for what agents need
description: Nishkarsh's 2026-10-23 framework for what agents need from a context layer, with counts from HydraDB's research of public developer posts (264 asking about similarity at scale, 334 of 362 time-related posts from this year, 237 asking why agents repeat fixed mistakes).
confidence: hypothesis
references:
  - insight/2026-11-09-big-companies-moving-to-knowledge-graphs
  - insight/2026-08-28-unified-context-graph-and-decision-traces
  - insight/2026-11-24-own-your-context-teach-dont-pitch
  - global/positioning
---

## Claim

What agents need splits into search (similarity, relations, traversal), context (entities, ontology, time,
trust) and memory (remember, recall, forget, share). Similarity covers only part of the first; graphs win
on relations, traversal, time and ontology.

## Evidence

All from one founder discussion, Internal: founder note, 2026-10-23, draft text Nishkarsh approved:
- Search: "most agents rely on similarity, which finds whatever sounds closest to the question. that's
  fine on small clean data but it falls apart as data grows, and 264 people in the research were asking
  exactly that." Fix: "relations, connecting facts across tools so a slack thread, a ticket and a crm
  record actually get joined, and then traversal ... like project to blocker to owner to latest decision."
- Context: entities, "knowing acme in the crm and ACME in slack are the same customer"; ontology; time,
  "which fact is current, what changed and why. that's the fastest growing problem we found, 334 of 362
  posts are from this year"; trust.
- Memory: "forgetting what's wrong or stale so mistakes don't come back (237 people asking why agents
  repeat mistakes their team already fixed)".
- Nishkarsh's addition: "memory is like procedure. every run becomes a procedure for the AI to follow or
  NOT to follow depending on whether or not something was right/wrong".
- Nishkarsh's priority: "let's lead with ontology, graph context, relations. big companies are already
  coming in hard".

The counts are from HydraDB's research of public developer posts, method not described. "This year" means
2026.

## Implication

Lead messaging with relations, ontology and time, not "faster vector search". Gives posts a clean
vocabulary.

## Use in messaging

- Post hook: "334 of 362 posts we found about agents and time were written in 2026." Cite counts as "in our
  research of public developer posts" only.
- Post: "Memory is a procedure, not a notebook."
- Explainer or carousel-style text post, one post per pillar.
