---
title: Ideal customer profile
description: Who HydraDB sells to, and who it does not. The tam-building-advanced sourcing filters, its categories, and the account-scoring rubric answer to this file.
---

# Ideal customer profile

Rewritten by the operator on 2026-11-13. The prior version (2026-11-10) is archived at
`icp/archive/hydradb-2026-11-10.md`.

## Problems with the original ICP

- Most companies writing publicly about "context graphs" are vendors and competitors (Neo4j, Zep,
  Pylar, Trail, ContextOS, Skan, IndyKite). Companies that build context graphs for their own
  product rarely use the term. They say "company brain," "institutional knowledge," "precedent,"
  "ontology," "knowledge graph" or "agent memory."
- Requiring SF, Series B+ and a round in the last 12 months all at once leaves very few companies.
  Use those to rank companies, not to exclude them.

## Rewritten ICP

AI-native app companies whose agents make repeated, exception-heavy judgment calls across each
customer's systems, and which are building their own memory of entities, relationships and past
decisions per customer. Typically Series A to C, 30 to 300 people, with someone who owns agent
infrastructure or retrieval.

## Must-haves

- Agents take actions or make decisions, not just Q&A over documents.
- Decisions depend on relationships between entities (accounts, tickets, contracts, code, assets)
  across systems.
- The product improves from past decisions (precedent, overrides, exceptions).
- Multi-tenant, so each customer needs its own graph. This is a guess at HydraDB's angle (object
  storage vs. Neo4j cost at scale). Test it in early calls. _hypothesis_

## Firmographic tiers

- Tier 1: Series B+ in the last 12 months, Bay Area, 50 to 300 people, has a platform team.
- Tier 2: Series A with fast growth, 20+ engineers, any US hub.
- Tier 3: larger AI-native companies (500+) with an agent platform team. Slower sales, bigger
  contracts.

## Tech signals

- Graph databases: Neo4j, Memgraph, FalkorDB, Neptune, Graphiti.
- Vector databases: Pinecone, Weaviate, Qdrant, Turbopuffer, pgvector. Turbopuffer users have
  already bought into object-storage-native infrastructure.
- Memory layers: Zep, Mem0, Letta, Cognee. They have the problem and may be shopping.
- Agent stack: LangGraph, Claude Agent SDK, Strands or a homegrown harness, plus trace tooling
  (Arize, LangSmith, Braintrust).

## Best-fit use cases

- Support and CX agents
- Legal and contracts
- Fintech and compliance (KYC/KYB)
- SRE and incident response
- Coding and code review
- Sales and RevOps
- Security
- Insurance claims, healthcare billing, procurement

## Disqualifiers

- Memory, context or graph vendors
- Simple chat-over-docs RAG
- One-shot lookup agents
- No in-house engineering

## Buyers and triggers

- Champion: staff or principal engineer owning agent memory or retrieval, or the head of AI
  platform.
- Economic buyer: CTO or VP Eng.
- Triggers: a new funding round, graph or memory job posts, engineering blog posts about memory
  problems, launching multiple agents, complaints about Neo4j cost or scale.

## Scoring (out of 10, work 7+ first)

- 3 points: agents make cross-system decisions per tenant
- 2 points: graph or memory hiring or tech in use
- 2 points: Series B+ in the last 12 months
- 1 point: Bay Area
- 1 point: uses "context graph" or "company brain" language publicly
- 1 point: warm path in

## Where to find them

- Job posts mentioning graph, memory or ontology terms (strongest signal)
- GitHub contributors to Graphiti, Neo4j and Mem0, matched to their employers
- Talks (GraphSummit, NODES, AI Engineer World's Fair) and engineering blogs
- YC company search filtered by latest round

## Sourcing filters (tam-building-advanced)

Approved by the operator on 2026-11-13. Written into every source and `infra/settings.ts`.

- Industries: Software Development; Technology, Information and Internet
- Company size: 30 to 2,000 people (covers tiers 1 to 3)
- Countries: United States
- Lookalike seeds: composio.dev, distyl.ai, smallest.ai

## Categories

In scope: Support and CX; Legal and contracts; Fintech and compliance (KYC/KYB); SRE and incident
response; Coding and code review; Sales and RevOps; Security; Insurance claims, healthcare billing
and procurement; Other cross-system agents.

Out of scope: Memory, context or graph vendor; Chat-over-docs RAG; One-shot lookup agent; Not
AI-native or services.

Unknown: Not enough information.
