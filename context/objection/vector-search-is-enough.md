---
title: "We already have a vector database; vector search is good enough"
description: The most common pushback from teams not yet using graphs. Response arc built from the founder's day-30 story, the swim-meet example, "similar isn't relevance", and the keep-it-and-add (not replace) offer.
references:
  - alternative/vector-databases
  - alternative/postgres-and-one-engine-databases
  - insight/2026-10-19-day-30-agent-degradation
  - insight/2026-07-07-vector-similarity-fails-on-relational-memory
  - insight/2026-09-04-retrieved-is-not-read
  - objection/graph-databases-cost-too-much
  - proof/performance-and-cost-claims
  - motion/signal-feedback-outreach
  - icp/hydradb
---

## Objection

"Our agent already works with Pinecone/pgvector. Why add a graph?" / "Our RAG setup works fine. Why do we
need a graph?" (paraphrases of the common pushback; no single verbatim quote recorded)

## Root cause

It does work on small, clean data during the demo. The failure appears later, as users and context grow,
and teams don't attribute it to retrieval: "by day 30, when that agent's context has blown up, it starts
answering incorrectly and ineffectively" (founder, 2026-10-19). Also a cost and complexity fear about
graphs ([[objection/graph-databases-cost-too-much]]).

## Stage

discovery

## Response

"Keep it. It works until day 30. We sit next to it and link the records your vector DB can't."

## Full response

1. Acknowledge: similarity search finds relevant chunks and is fine on a small corpus.
2. Reframe: "it doesn't link records together, so connecting a customer's tickets, plan and past fixes has
   to live in your code" (2026-10-13). Agents "can't work with isolated chunks of information"
   (2026-09-10). Name the queries similarity can't answer, from the founder's outbound copy (2026-10-19):
   temporal state ("How did this doc change over time?"), multi-hop across sources ("Which customers are
   affected by this delayed feature, and what did we promise them?"), and "Similar isn't relevance: 'What
   price did we finally agree with Acme?'".
3. Proof: the swim-meet example (vector search "might surface the stale 'came last' result", 2026-07-21);
   prospects' own words (see
   [[insight/2026-07-07-vector-similarity-fails-on-relational-memory]]); a prospect on a call: "vectorDB
   isn't enough and we need knowledge graphs for our agents to work" (2026-10-15).
4. Next step: "help you test one agent in a side by side setup" (2026-10-13) / "Open to testing on
   queries vectorDBs don't handle?" (2026-10-19).

## Proof

- [[insight/2026-07-07-vector-similarity-fails-on-relational-memory]] (validated: several prospects)
- [[insight/2026-10-19-day-30-agent-degradation]] (validated: founder plus a prospect)
- [[proof/performance-and-cost-claims]] for measured accuracy scores with a stated dataset. Do not use any
  speed or cost multiple in public posts until a published benchmark exists.
- Internal: founder note, 2026-10-19
- Internal: sales notes, 2026-10-19 (outbound copy) and 2026-10-13
- Internal: founder note, 2026-09-10 and 2026-07-21
- Internal: customer call recap, 2026-10-15

## Followup

Ask for 3 to 5 real queries their agent gets wrong today, or which agent degrades first as users grow, and
run that one side by side.

## Push back vs concede

Concede for single-hop lookups with no cross-record context and for simple chat-over-docs use cases (Q&A
over documents only is outside the ICP). Hold the line when answers depend on order in time or on links
across sources (emails, tickets, chats), or when agents act across systems.
