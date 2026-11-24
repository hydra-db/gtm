---
title: AI engineering leader (champion) and CTO or founders (deciders)
description: The technical people HydraDB sells to and posts for. The champion is the engineer or Head of AI who owns agents and the retrieval stack; the decider is the CTO, VP Eng or founders. Titles, KPIs, pains, channels and how we land, from calls, outbound and signups (Apr to Nov 2026).
references:
  - icp/hydradb
  - icp/tiering-rubric
  - motion/signal-feedback-outreach
  - jtbd/connect-context-across-sources
  - jtbd/memory-that-tracks-change
  - jtbd/company-brain
  - global/positioning
  - signal/retrieval-stack-job-posts-and-tech
  - signal/funded-company-engineering-visit-or-signup
  - signal/competitor-rep-linkedin-engagement
  - client/services-platform-technical-deep-dive
---

## Role

- Title: Champion: staff or principal engineer "actually building the retrieval stack today", AI/ML/Applied AI engineer, founding engineer, AI platform engineer, Head of AI / AI lead. Decider: CTO, VP or SVP Engineering, Head of Engineering, founders. At enterprises: Chief AI Officer, Head of AI / VP of AI, Chief Data Officer / Head of Data Platform, CIO, Senior Director of Platform Engineering.
- Seniority: senior IC (champion) to C-level (decider).
- Function: AI, platform and data engineering.
- Reports to: CTO or CEO (not stated on calls).

Evidence: target titles split by company size in an internal GTM brief; a LinkedIn outreach campaign to AI heads produced interested replies; signups and calls came from AI platform engineers, CTOs and founding engineers; website visitors with the "right persona" included a senior platform engineering director, called "the ideal infra decision-maker"; Heads of AI ran most discovery calls (see client files).

Internal: sales notes, 2026-08-16 ; team discussion, 2026-09-03 ; team discussion, 2026-09-08 ; team discussion, 2026-09-28 ; sales notes, 2026-10-06

## KPIs

- Agent outcomes. An ITSM prospect measured agents on "first response time, resolution time, ticket deflection, survey scores" (Internal: customer call recap, 2026-04-05).
- Agent accuracy as data grows: an AI services company's agent accuracy "from below 50% to 85%" ([[proof/retrieval-accuracy-benchmarks]]).
- Error rates and tool calls: buyers set knowledge-error and tool-call targets before a POC starts.
- Latency fit for an agent loop and infra cost at scale.

## Pains

- Similarity search returns similar but wrong documents and "falls apart as data grows"; cannot answer temporal or multi-hop questions (Internal: founder note, 2026-10-23; [[global/positioning]]).
- Agents repeat mistakes the team already fixed; knowing which fact is current.
- Agents that degrade as context grows; linking records by hand for every new agent.
- Context scattered across 5 to 10 tools; agents need many tool calls ([[jtbd/connect-context-across-sources]]).
- Too many retrieval strategies to tune: wants to "remove the Permutation and combination of various retrieval strategies and help them decide better" (ITSM prospect; Internal: customer call recap, 2026-04-06).
- Security, residency and data-processing reviews before any data moves; cloud-provider fit.
- Org churn stalls projects: "Our data engg is leaving, our audit's happening, and we're in the middle of restructuring our team as well" (a prospect; Internal: sales notes, 2026-10-06).

## Motivations

- Ship agents that work on internal knowledge: company brain, code graph, sales graph (Internal: team discussion, 2026-11-09). SMB and mid-market respond to "Company Brain/Agent Memory"; enterprise to "Ontologies/Company Brain".
- Own their memory and context rather than rent it (Nishkarsh's read; Internal: founder note, 2026-11-24).
- Want a vendor that recommends architecture, not just documentation to follow.
- Want proof on their own queries and a peer reference: one Head of AI made latency benchmarks "Critical" and asked for a technical contact at an existing account (Internal: sales notes, 2026-10-01).
- Try before talking to sales: an engineering leader "specifically mentioned that he wanted to try out our platform" (Internal: sales notes, 2026-10-19).

## Day-to-day

Builds and debugs the retrieval stack behind production agents; runs agent evals; reviews retrieval failures; writes workaround skills when search misses (one deployment's team built a skill because search fell short); fields security reviews. Reads papers and AI news on X and LinkedIn, stars repos and tests tools hands-on before a call ("Mostly Twitter, Hacker News, Reddit and alphaXiv"; Internal: team discussion, 2026-11-01).

## Preferred channels

- LinkedIn: outreach to AI heads gets replies; one LinkedIn campaign saw "23% accepts and 14% replies" (Internal: sales notes, 2026-09-23). Engagement with Nishkarsh's LinkedIn posts is a ranking signal. See [[global/linkedin-playbook]].
- X (where the launch spread), GitHub, Discord, Hacker News.
- Newsletters with technical audiences reaching "CTOs, ML and Software Engineers, data scientists, researchers and VCs".
- YC network for agent-native companies; events and dinners for engineers.
- With vendors: shared channels and short recurring syncs (15 minutes, once or twice a week).

## Common objections

- "A vector database is enough" (answer with [[proof/graph-retrieval-examples]] and [[proof/retrieval-accuracy-benchmarks]]).
- "We'll build it ourselves" (a small, strong engineering team chose not to: [[client/due-diligence-ai-dependent-documents]]).
- "Show me the benchmarks" on our data; latency.
- Data residency, data processing terms and self-hosting ([[proof/self-hosted-slms-in-production]]).
- Cypher compatibility and migration friction ([[client/context-platform-graph-migration]]).
- Already on a general-purpose graph database or an open-source graph library (an IT services prospect uses one for knowledge graphs from project documentation and another for code dependency graphs).
- "Does the graph actually change results?" ([[client/due-diligence-ai-dependent-documents]]).
- Cloud-provider fit.

## How we land

- Ask for their good and bad queries, set the metric before the POC, recommend an architecture for their pipeline, and respond fast (a senior buyer was "watching the POC closely, so response speed matters").
- Show the three questions their vector search fails on, against their own data, then hand them the open-source framework. Signups get a soft "thanks for being early" note offering 20 minutes, not a hard sell (Internal: team discussion, 2026-10-28).
- Day-30 accuracy story for non-graph-natives; ontology engine, object-storage economics and agent primitives for graph natives (no speed or cost multiples).
- Win the deciders, not only the champion. Nishkarsh: "We need to talk to CTO or closes persona." (Internal: founder note, 2026-11-04). Caution: an engineer signed up and used HydraDB, then stopped: "my founders asked me to use something else" (Internal: team discussion, 2026-10-27).
- Merged from staging: calls/persona/head-of-ai-platform-lead, gtm/persona/ai-engineering-leader, product1/persona/ai-engineering-leader, product2/persona/agent-infra-engineer-and-cto. Individual contact names removed.
