---
title: Vector similarity breaks when memory is about change and relationships; relevance is not relationship
description: Several prospects independently found vector-only retrieval fails on "what changed" and "what is linked" questions. HydraDB's own argument, that vector search finds what is relevant but does not link records, is now backed by those customer statements.
confidence: validated
references:
  - alternative/vector-databases
  - alternative/postgres-and-one-engine-databases
  - objection/vector-search-is-enough
  - insight/2026-10-19-day-30-agent-degradation
  - insight/2026-11-20-similar-wording-is-not-applicability
  - motion/signal-feedback-outreach
  - icp/hydradb
---

## Claim

Embeddings find similar text; agents need the current state of linked things. Vector search answers "what
looks like this?"; agents increasingly need "what is connected to this?" (same customer, same ticket, the
fix that followed). That gap is where teams move to a graph, and until they do, the linking ends up as
hand-written glue code.

## Evidence

Prospects, anonymised:
- An agent-memory startup: vector similarity search was failing for their use case and a graph was the
  required path forward; memory like "user preferred one running-shoe brand until November, then switched
  to another". Internal: customer call recap, 2026-07-07
- A consumer marketplace on Postgres plus vectors got price updates for items already sold, and was
  missing temporal relationships and entity linkages. Internal: customer call recap, 2026-09-22
- A sales-tooling startup: a deal value changed from $1K to $40K and retrieval kept the old one.
  Internal: customer call recap, 2026-09-22
- A prospect on a call: "vectorDB isn't enough and we need knowledge graphs for our agents to work".
  Internal: customer call recap, 2026-10-15

HydraDB's own framing of the same point:
- Outbound draft: vector search "finds what's relevant, but it doesn't link records together, so tying a
  customer's past tickets and fixes to the request in front of the agent has to happen in your code", and
  "a customer who emails today and opens a chat tomorrow expects [the agent] to remember both."
  Internal: sales notes, 2026-10-13
- Nishkarsh: "Relations are important because they unlock the ability to search across disparate data
  sources which are completely disconnected and fragmented. Your AI is also only as smart as the context
  it has access to." Internal: founder note, 2026-10-09
- Landing page reference example: "one question, keyword search finds nothing, semantic finds nothing,
  graph finds the cause." Internal: team discussion, 2026-11-01

## Implication

Lead with a time-or-relationship failure the buyer recognises, with one worked example (an email plus a
chat from the same customer), not with "graph" or abstract claims.

## Use in messaging

- Contrarian post: "Your agent's memory isn't wrong. It's out of date." Anonymised examples: a sold car
  still getting price alerts, a shoe-brand switch, a $1K deal that became $40K.
- Hook: "Your customer emailed Tuesday and opened a chat Wednesday. Your agent met two strangers."
- Never name the prospects or the vector database.
