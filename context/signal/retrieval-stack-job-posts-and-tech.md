---
title: Job posts or tech stack naming graph, vector, memory or RAG tools
description: Hiring for AI, agent or retrieval engineers with graph DBs, vector DBs, memory layers, RAG or ontology work in the job description, or a detected stack that includes them. Proposed in outbound proposals and the internal prospect pipeline; not yet tied to a closed deal.
confidence: hypothesis
references:
  - icp/hydradb
  - icp/tiering-rubric
  - motion/signal-feedback-outreach
  - persona/ai-engineering-leader
  - global/gtm-channel-map
---

_confidence: hypothesis (we think so) | validated (seen twice, independently) |
proven (measured, repeatable). Outreach plays may only cite validated or proven
files. Start at hypothesis and earn the upgrade._

## Source

Job boards (LinkedIn, Greenhouse, Ashby, Built In SF, Workday, Indeed, Wellfound, Lever, the YC job board), technographics, GitHub contributors to graph and memory projects, YC company search.

## Definition

Any of:
- AI engineer job posts naming a graph database (Neo4j, dgraph, ApertureDB, AWS Neptune, FalkorDB, Memgraph) (outbound proposal, 2026-08-14).
- Job descriptions naming "vector databases, embeddings, RAG, knowledge graphs, Pinecone, Weaviate, Qdrant, pgvector, LangChain or LlamaIndex": the internal scan found 2,939 such JDs (2026-11-09).
- Job posts mentioning graph, memory or ontology terms ("strongest signal", 2026-11-11 ICP analysis).
- Hiring titles: "AI Platform Engineer, ML Infrastructure Engineer, Agent Engineer, Applied AI Engineer, Staff Engineer, AI Infrastructure" (2026-08-16 GTM brief).
- Tech in use: graph DBs (Neo4j, Memgraph, FalkorDB, Neptune, Graphiti), vector DBs (Pinecone, Weaviate, Qdrant, Turbopuffer, pgvector), memory layers (Zep, Mem0, Letta, Cognee).

## Weight

high for graph, memory or ontology job posts; medium for retrieval-tool JDs and tech in use.

## ICP fit

- [[icp/hydradb]] (tech signals section; "runs an agent harness" when the JD describes agent infrastructure)

## Recommended play

- [[motion/signal-feedback-outreach]] (job post is one of its dated triggers).
- Contextual outreach: "We literally reach out to the AI natives with contextual reach out about oh I know that you use PineCone and I am also YC please advise" (Nishkarsh, 2026-11-05).

## Why it matters

A team hiring to build retrieval is about to choose, or re-choose, its context stack. A team hiring for a graph DB already believes in graphs; the question is which one.

Internal: sales notes, 2026-08-14 ; sales notes, 2026-08-18 ; sales notes, 2026-09-11 ; team discussion, 2026-11-09 ; founder note, 2026-11-11 ; sales notes, 2026-08-16 ; founder note, 2026-11-05

Merged from staging: calls/signal/graph-db-job-posts-and-tech, gtm/signal/job-posts-naming-retrieval-stack, the hiring and tech parts of product1/signal/moving-from-vector-db-to-knowledge-graphs and product2/signal/graph-memory-hiring-and-vector-db-fatigue.

## False positives

- Graph DB used for non-agent analytics workloads.
- Consultancies and agencies hiring for client work.
- Generic JDs that list every AI buzzword; generic "AI engineer" postings with no retrieval scope.
- Memory, context or graph vendors hiring for their own product.
