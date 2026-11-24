---
title: Meeting note-taker app, longitudinal memory
description: A meeting note-taker app whose users ask longitudinal questions ("how's my swimming going?"); Nishkarsh's go-to example of graph traversal beating vector search. Not cleared for naming.
reference_permission: no
references:
  - proof/graph-retrieval-examples
  - jtbd/memory-that-tracks-change
---

## Profile

A meeting note-taker app, onboarded in July 2026, with a case study in progress. No agreement to be named. Describe as "a meeting note-taker app".

## Use case

Long-running personal memory: questions whose answer is a sequence of events over weeks, not one mention.

## Outcome

No metric recorded. The value is the qualitative example below.

## Story

A user mentions coming last in a swim meet; weeks later, lessons, "a 20% improvement, a trophy". Asked "how's my swimming going?", vector or SQL search might surface the stale "came last" result, while graph traversal "follows the connected path in one retrieval". "every new conversation attaches to the existing graph, so its understanding compounds instead of starting from zero." (Nishkarsh, 2026-07-21)

## Quotes

- "answers with the full arc, not a fragment." (Nishkarsh, 2026-07-21)

## Related

[[proof/graph-retrieval-examples]], [[jtbd/memory-that-tracks-change]].

Sources: Internal: founder note, 2026-07-21
