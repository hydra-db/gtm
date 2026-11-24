---
title: Vector databases (Pinecone, Milvus, Qdrant, turbopuffer and similar)
description: Battlecard for the vector store most target teams already run. HydraDB's stated stance is keep it and add the links it cannot store, not rip and replace; an unresolved internal tension says some teams should replace it.
references:
  - objection/vector-search-is-enough
  - insight/2026-07-07-vector-similarity-fails-on-relational-memory
  - insight/2026-10-19-day-30-agent-degradation
  - insight/2026-11-03-most-agent-data-is-idle
  - insight/2026-11-15-buyers-reach-past-the-add-on-slot
  - alternative/agent-memory-layers
  - alternative/postgres-and-one-engine-databases
  - alternative/general-purpose-graph-databases
  - global/positioning
  - icp/hydradb
---

## Profile

Status quo for almost every AI team that already ships retrieval. Pinecone is the most named one in
HydraDB's outbound and competitive notes; outbound copy (2026-10-13) targets support-AI products that run
on a vector database. Pinecone publicly positions as a managed serverless vector database with dense,
sparse and full-text search, hosted embeddings and BYOC, and third-party memory roundups list it as the
default storage layer under agent memory stacks. turbopuffer is also tracked. Users of these tools are a
target list for outbound.

Positioning note: Nishkarsh's latest category line is "turbopuffer for graphDBs" (2026-11-24), after an
earlier reservation on 2026-10-14 about "why the turbopuffer pitch won't work for 80% of the audience".
See [[global/positioning]].

## Pricing

Not discussed. Unknown.

## Strengths

- Already installed. The buyer has paid the migration cost once and does not want to pay it again.
- Good at relevance: "pinecone finds what's relevant" (HydraDB's own outbound copy, 2026-10-13).
- Mature, fast similarity search; well funded and the default in third-party "memory stack" roundups.
- HydraDB itself uses vector search as one lane of its hybrid retrieval, fusing several lanes per query.
  Honest admission that vector search is necessary.

## Weaknesses

- Relevance is not relationship: "pinecone finds what's relevant, but it doesn't link records together,
  so tying a customer's past tickets and fixes to the request in front of the agent has to happen in your
  code" (outbound draft, 2026-10-13). The linking becomes glue code the buyer owns.
- Customer-facing version: "a customer who emails today and opens a chat tomorrow expects [the agent] to
  remember both. that only works if the agent sees one customer with one history. pinecone finds what's
  relevant to each message, but it doesn't connect them." (2026-10-13)
- Unordered and stale results: "Vector or SQL search pulls mentions with no ordering, and might surface
  the stale 'came last' result" (founder, 2026-07-21, the swim-meet example).
- Agents "can't work with isolated chunks of information" (founder, 2026-09-10).
- Decay at scale: teams find out by day 30 ([[insight/2026-10-19-day-30-agent-degradation]]).

## Wedge

Run alongside, not instead. The website FAQ (per the 2026-11-01 landing page review) says keep your
vector DB, so HydraDB's framing is keep and add, explicitly rejecting a "replace elastic + pinecone +
neo4j" framing. Sales copy: "hydradb sits next to pinecone and gives every agent each customer's full
history" and "Hydradb can bolt onto the work you've done on pinecone"; "Every new agent you add has it
from day one, instead of your team wiring it up for each one" (2026-10-13). The offered experiment: "one
... agent runs on hydradb, next to pinecone, and pinecone stays as it is. you pick a set of real requests
and compare the answers side by side."

Unresolved tension (human to settle): Nishkarsh on 2026-11-03, about a public agent-memory example:
"Still uses pinecone that's what we need to change", and on 2026-10-30 teams were reported considering
HydraDB as their primary database ([[insight/2026-11-15-buyers-reach-past-the-add-on-slot]]). Add-on vs
replace is not decided.

Best buyer: a team whose agent must join records across channels or sources (support history, tickets,
fixes), where the joining is hand-written code today.

## Loses when

- The workload is single-hop semantic lookup over one corpus. Nothing needs linking.
- The team has no appetite to add a second system, even side by side.
- (Inference, not observed in a lost deal) cost-sensitive teams already happy with relevance quality.

## Battlecard

- Do not say "replace". Say "keep your vector DB, add the links it cannot store".
- Trap question: "Where in your code do you tie a customer's past tickets to the current request?" (from
  the 2026-10-13 sequence: "is that something [you] handle in code today?").
- Offer the side-by-side experiment on real requests, not a benchmark.
- Landmine: HydraDB uses a vector engine internally. If asked, own it: vector search is one lane of
  retrieval, the graph is what links the results.
- Use the swim-meet example: a user came last in a swim meet, weeks later won a trophy; similarity search
  returns the first fact.
- LinkedIn: never name the vendor. Say "your vector database".

## Source

- Internal: sales notes, 2026-10-13 (outbound drafts)
- Internal: team discussion, 2026-11-01 (landing page review)
- Internal: founder note, 2026-11-03 ("Still uses pinecone")
- Internal: engineering notes, 2026-11-03 (hybrid retrieval lanes)
- Internal: team discussion, 2026-11-23 and 2026-11-21 (competitor tracking)
- Internal: founder note, 2026-07-21 (swim-meet example)
- Internal: founder note, 2026-09-10
- Internal: founder note, 2026-10-30 (primary database report)
