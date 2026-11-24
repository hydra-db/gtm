---
title: '"Faster than the incumbent graph database" is a losing pitch'
description: Two independent voices, an outside advisor (2026-07-21) and the founder (2026-10-13), reject positioning HydraDB as a faster or better general-purpose graph database. The pitch is outcomes and agent-first design.
confidence: validated
references:
  - alternative/general-purpose-graph-databases
  - objection/we-already-run-a-graph-database
  - insight/2026-04-05-buyers-pay-for-accuracy-not-speed
  - insight/2026-09-30-agents-choose-their-own-tools
  - proof/performance-and-cost-claims
  - global/positioning
---

## Claim

Winning on speed against the incumbent graph database is playing catch-up. Graph infrastructure for agents
wins on what it lets the product do, and on being designed for agents as the user.

## Evidence

- Internal: team discussion, 2026-07-21. An outside advisor on launch messaging: the story is not that
  a team sped up its agent by 20% by switching graph databases, but what HydraDB enabled that no other
  tool did, how understanding the user or organization better improved the experience and retention.
- Internal: founder note, 2026-10-13. Nishkarsh: "saying that we are just a better neo4j isn't enough. The
  fear here is that we are only playing catch-up with the Neo4js of the world, which is not the right thing
  to do right now." And: "not because we're a better Neo4j but because we are a different kind of Neo4j
  that is primarily built for agents".
- Internal: founder note, 2026-10-23. Nishkarsh on two big-vendor ontology kits: he does not need to know
  how HydraDB is "better", just how it is different.
- Internal: founder note, 2026-11-24. Nishkarsh: for non-graph buyers the story is not fast graphs, "the
  story is 'own your context & memory'".

"20%" in the advisor's framing is illustrative, not a measured HydraDB result.

## Implication

Battlecards and posts compare on difference (agent-first APIs, automatic graph building, modern storage)
and on customer outcomes, never on query latency against a named incumbent. Speed and cost multiples stay
out of public posts ([[proof/performance-and-cost-claims]]).

## Use in messaging

Contrarian post hook: "Nobody switches databases for 20% faster." Ending: "What did your context layer let
your product do that it couldn't before?" Never name the incumbent.
