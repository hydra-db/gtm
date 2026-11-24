---
title: Graph retrieval examples (the swim-meet arc and the Tampa query)
description: Two concrete examples that show why connected, time-ordered context beats isolated chunks: a note-taker user's progress arc that vector search would fragment, and a benchmark query answered with no keyword match.
confidence: hypothesis
references:
  - client/meeting-notes-app-longitudinal-memory
  - jtbd/memory-that-tracks-change
  - jtbd/connect-context-across-sources
  - proof/retrieval-accuracy-benchmarks
  - global/positioning
---

_confidence: hypothesis (we think so) | validated (seen twice, independently) |
proven (measured, repeatable). Outreach motions may only cite validated or proven
files. Start at hypothesis and earn the upgrade._

## Type

case

## Content

**1. The swim-meet arc (Nishkarsh, 2026-07-21), about a meeting note-taker app he was onboarding:**

"a user mentions coming last in a swim meet. Weeks later: summer lessons, a 20% improvement, a trophy. Now they ask the app, "how's my swimming going?" Vector or SQL search pulls mentions with no ordering, and might surface the stale "came last" result. A graph traversal follows the connected path in one retrieval: came last, joined lessons, improved 20%, won a trophy. The app answers with the full arc, not a fragment. And every new conversation attaches to the existing graph, so its understanding compounds instead of starting from zero."

In posts, replace the app's name with "a meeting note-taker app". This is the founder's illustration of the use case, not a logged production query.

**2. The Tampa query (evaluation log review, 2026-03-14):** one evaluation query was "What did [a person in the dataset] take to the beach in Tampa?" The team "couldn't find any explicit reference to "Tampa" in the underlying documents. Despite that, HydraDB was still able to retrieve the relevant context and correctly infer the answer as "film camera." This held true even when the graph context was disabled". The team's read: "the model essentially had to infer the relevant passage based on surrounding semantic context rather than a direct keyword match", and with graph context enabled "HydraDB would have had an even clearer relational signal to connect the entities involved". Note: the result held with the graph off, so it is evidence for retrieval quality, not for the graph specifically.

## Source

- Internal: founder note, 2026-07-21
- Internal: engineering notes, 2026-03-14

## Client

[[client/meeting-notes-app-longitudinal-memory]] (reference_permission: no; say "a meeting note-taker app").

## Context

The cleanest plain-English illustration of temporal, multi-hop retrieval in the corpus. Supports "similarity is not relevance" and "graph memory compounds".

## Use cases

- Explainer post on temporal context ("what changed, when, why"): "Vector search would have surfaced 'came last'."
- Objection answer to "vector search is enough for memory".
