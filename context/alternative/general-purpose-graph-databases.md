---
title: General-purpose graph databases (Neo4j, FalkorDB, Memgraph, Kuzu, ArangoDB, Neptune, Postgres graph)
description: Battlecard for teams that already chose "a graph database". The founder's rule is that "a better Neo4j" is a losing pitch; HydraDB is a different kind of graph, built for agents, with Bolt/Cypher compatibility to lower switching cost.
references:
  - insight/2026-10-13-better-neo4j-is-a-losing-position
  - insight/2026-10-19-day-30-agent-degradation
  - objection/we-already-run-a-graph-database
  - objection/graph-databases-cost-too-much
  - objection/show-me-the-benchmarks
  - alternative/postgres-and-one-engine-databases
  - proof/performance-and-cost-claims
  - global/positioning
  - icp/hydradb
---

## Profile

Direct competitor and the default graph database buyers already run. Neo4j is the name buyers and
HydraDB's team use as shorthand for the category. Also in view: FalkorDB (Redis/Valkey-based), Memgraph,
AWS Neptune, ArangoDB, dgraph, ApertureDB, Kuzu, Graphiti, and graph on Postgres.

Who they are for HydraDB: the "graph natives of the world" (Nishkarsh, 2026-10-19). Large companies are
evaluating general-purpose graph databases for agent context too.

Recent incumbent move: Neo4j shipped Virtual Graph to GA (public announcement, 2026-11-18). Virtualizing
a graph over existing relational data is a direction HydraDB is also exploring.

Compatibility: HydraDB speaks the Neo4j Bolt protocol, so a stock driver and GDS client can connect, with
GDS algorithms such as PageRank and betweenness (2026-11-04). Cypher support is being built against the
public GQL conformance matrix as the "north star" (2026-10-22). Do not claim full Cypher parity.

## Pricing

Not tracked. Buyer signal: for teams on a general-purpose graph database, cost often limits how far they
expand. ICP trigger: "complaints about Neo4j cost or scale" (internal ICP doc, 2026-11-11).

## Strengths

- Buyers love it, and they have invested real effort in it.
- Cypher is the language teams already write; predefined queries are production logic, so switching
  cost is real.
- Mature query language, dashboards and algorithms (GDS) that HydraDB chose to be compatible with rather
  than replace.
- Name recognition and education: "the Neo4js of the world" (Nishkarsh, 2026-10-13); many courses
  already teach it.
- Known by buyers who already understand the importance of knowledge graphs.

## Weaknesses

Stated as HydraDB's view of architectural differences, not as measured results.

- Cost and replication. Founder, 2026-10-15: data in a classic graph database is replicated on disk,
  which costs more than object storage (figures kept in [[proof/performance-and-cost-claims]]).
- Spiky agent workloads. Founder, 2026-10-15: HydraDB "Scales horizontally, spiky workloads friendly
  (agentic workloads)", which is not what classic graph databases were designed for.
- Consistency. Founder, 2026-10-15: Neo4j's default isolation is read-committed; HydraDB guarantees strong
  consistency, "meaning what you read is what you have written."
- Memory and messy data: graphs that outgrow RAM, and data that is messy rather than hand-modeled.
- Fan-out latency: teams fanning out from many entities at once can hit latency spikes and end up
  filtering after traversal.
- Postgres graph: "when PG Graph fails at scale, you might want to consider a dedicated and efficient
  infrastructure" (Nishkarsh, 2026-10-09). Founder opinion; no benchmark cited.
- Built for humans writing queries, not agents (HydraDB's positioning, 2026-10-13).

## Wedge

Not speed. An outside advisor (2026-07-21) and the founder (2026-10-13) independently warned against the
speed pitch ([[insight/2026-10-13-better-neo4j-is-a-losing-position]]). HydraDB is "a different kind of
Neo4j that is primarily built for agents" (2026-10-13). The wedge:
1. Agents are the first-class user: "our APIs & architecture is designed for agents to use effectively".
2. The graph builds itself: a built-in ontology engine organizes knowledge "automatically on behalf of
   agents so that LLMs without any heavy lifting can access the right context accurately and
   deterministically even at scale".
3. Modern storage: object storage so teams "scale cost efficiently & you're not worried about what you're
   storing".
4. Low switching cost: "we work directly with neo4j drivers with all the upside hydradb added on top"
   (2026-10-15), Bolt plus GDS (2026-11-04).
5. BYOG (bring your own graph): users coming from Neo4j, ArangoDB or FalkorDB often prefer to query their
   graph directly in Cypher rather than in natural language (2026-11-21); then offer search and connectors
   on top. Nishkarsh approved this direction on 2026-11-23.
6. SelfGraph on-ramp: "Lets make sure every agent and dev on the planet that's ever thought of graphs
   (including Neo4j) goes through self graph. We get them first and then we get them with hydradb perf"
   (Nishkarsh, 2026-11-15). SelfGraph can manage existing graphs in Neo4j (2026-11-06).

Speed and cost multiples against Neo4j are kept only in [[proof/performance-and-cost-claims]]. Do not use
any speed or cost multiple in public posts until a published benchmark exists. Internal "on par" or
"faster" remarks are unmeasured.

## Loses when

- The team's value is hand-modeled schemas and Cypher queries humans write, with no agent in the loop.
  They love the tool.
- The team is deep in Cypher and HydraDB's interface is not yet compatible for their queries.
- The buyer wants a pure graph engine with no ingestion, extraction or retrieval layer on top.
- The buyer needs a cloud HydraDB does not run on yet.
- The fight becomes raw benchmark numbers: "saying that we are just a better neo4j isn't enough"
  (Nishkarsh, 2026-10-13).

## Battlecard

- Discovery frame: future state (compelling event), existing setup, pain, the effort they put into their
  graph database, why they love it, and its limitations.
- Don't trash the incumbent. Concede it is a good database for humans; position HydraDB as one for agents.
- Ask about their storage bill and replica count; ask what isolation level their agents assume.
- Ask for their predefined Cypher queries and sample data up front and prove them on HydraDB before their
  deadline. Offer reproducible benchmarks (benchmarks.hydradb.com) on their own queries, never a headline
  multiple.
- Lead with what the graph enabled (retention, understanding the user), not "20% faster" (advisor,
  2026-07-21).
- LinkedIn: never name the vendor. Say "a general-purpose graph database".

## Source

- Internal: founder note, 2026-10-13 (positioning)
- Internal: founder note, 2026-10-15 (architecture differences, drivers)
- Internal: founder note, 2026-10-19 (graph natives)
- Internal: founder note, 2026-10-09 (Postgres graph)
- Internal: founder note, 2026-11-15 (SelfGraph goal)
- Internal: team discussion, 2026-11-21 and 2026-11-23 (BYOG)
- Internal: team discussion, 2026-07-21 (advisor feedback)
- Internal: engineering notes, 2026-11-04 (Bolt and GDS), 2026-10-22 (conformance)
- Internal: sales notes, 2026-10-21 (discovery frame), 2026-11-11 (ICP doc)
- Internal: public post, 2026-11-18 (Neo4j Virtual Graph GA)
- Internal: team discussion, 2026-11-06 (SelfGraph positioning)
