---
title: Account tiering rubric
description: What A, B, C and disqualified mean for HydraDB, and what evidence may decide each one. The account-scoring agent reads this file and the ICP on every judgment.
references:
  - icp/hydradb
---

# Account tiering rubric

Written on 2026-11-24, when Cargo's account-scoring replaced our own ICP gate (the
`tam_score_candidates` play and `infra/gtm-factory/scripts/score.ts`). It carries
the gate's rules over unchanged: the same in-scope test, the same disqualifiers,
the same score out of 10. Only the output changed, from a status plus a number
to a tier A, B, C or disqualified with a written reason.

Every tier is decided against [[icp/hydradb]]. A tier that cannot name the line
it came from is a guess.

## Step 1: in scope or disqualified

**In scope** means the company's AI agents act across each customer's systems
and need a memory of entities, relationships and past decisions. All four of
these must hold:

1. The agents take actions or make decisions, not only Q&A or search over
   documents.
2. Those decisions depend on relationships between entities (accounts, tickets,
   contracts, code, assets, claims) across several of the customer's systems.
3. The product improves from past decisions per customer (precedent, overrides,
   exceptions, feedback, memory), **or** there is public graph or agent-memory
   evidence (see Step 2).
4. It is a B2B product serving many customers, each with its own data and
   context (anything but a clear "no" passes).

In-scope use cases: support and CX; legal and contracts; fintech and
compliance (KYC/KYB); SRE and incident response; coding and code review; sales
and RevOps; security; insurance claims, healthcare billing and procurement;
other cross-system agents.

**Agent-framework and LLM-infrastructure vendors that ship their own agents
are in scope** (operator, 2026-11-24). They are not disqualified for being
infrastructure; they pass or fail the four tests above like everyone else.

**Disqualified** when any of these is true (first match wins, and the
rationale names it):

| Disqualifier | What it looks like |
| --- | --- |
| Memory, context or graph vendor | Sells memory, context, vector or graph databases or infrastructure itself. These are competitors (Zep, Mem0, Letta, Cognee, Neo4j, Graphiti and the like). |
| Chat-over-docs RAG | The product answers questions over documents and takes no action. |
| One-shot lookup agent | The agent fetches or looks something up once, with no running judgment across systems. |
| Services or consultancy | No product of its own: agencies, consultancies, dev shops. |
| Not AI-native | No AI agent product at all. |
| Must-have missing | Agents do not act across each customer's systems, or there is neither memory of past decisions nor a graph or memory signal. |
| Outside the US | Headquartered outside the US and under 500 people. |
| Too early | Under 10 people. |
| Bad record | Dead domain, acquired, or the sourced record is about a different company. |

When a disqualifier is uncertain and the must-haves hold, do not disqualify:
tier on the score and say in the rationale what would need to be true for it
to be disqualified.

## Step 2: the score out of 10 (in-scope companies only)

The same points as the ICP's scoring section and the old gate:

| Points | Signal |
| --- | --- |
| 3 | Agents make cross-system decisions per tenant (every in-scope company has these) |
| 2 | Graph or agent-memory evidence: uses or hires for Neo4j, Memgraph, FalkorDB, Neptune, Graphiti, knowledge graph, ontology, agent memory, Zep, Mem0, Letta, Cognee, GraphRAG, or job posts naming them |
| 2 | Series B or later announced in the last 12 months |
| 1 | Headquartered in the San Francisco Bay Area |
| 1 | Uses context-graph language publicly about its own product: context graph, company brain, institutional knowledge, knowledge graph, agent memory, precedent, ontology |
| 1 | Warm path: a YC company (we are in the YC network) |

## Step 3: the tier

| Tier | What it means | The bar |
| --- | --- | --- |
| `A` | Work it now | In scope and a score of 7 or more ("work 7+ first", from the ICP), or in scope, Bay Area and a graph or memory signal now (the old gate's tier 1) |
| `B` | Worth a sequence, not a rep | In scope and a score of 5 or 6 |
| `C` | In the market, not in the motion yet | In scope and a score of 3 or 4: the agents fit, nothing else is visible yet |
| `disqualified` | Do not spend another credit or rep-hour | Any line of the disqualifier table in Step 1 |

## Evidence rules

- **Judge on the sourced facts first.** Name, domain, description, headcount,
  HQ, latest round and YC batch come with the row when known. If they settle
  the tier, settle it and stop.
- **Search at most once, to resolve one doubt** that would change the tier:
  usually whether the agents act across systems, or whether there is graph or
  memory evidence. A search that could not change the tier is wasted.
- **Record where the deciding fact came from** in the evidence URL. Empty when
  the sourced facts alone decided it.
- **Never invent a fact.** An unknown round is not "Series B"; an unknown HQ is
  not "Bay Area". Score what is known.
- **The rationale is two sentences**: the Step 1 verdict and the Step 2 points
  that decided the tier, by name.
