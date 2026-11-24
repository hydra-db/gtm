---
title: HydraDB product surface and open-source model (Apr to Nov 2026)
description: What HydraDB is made of and what it ships (retrieval modes, llm_prompt, connectors, selfgraph, MCP tools, pg_hydradb, Go ingestion, self-hosted SLMs), which parts are open source.
references:
  - global/positioning
  - global/company-timeline
  - proof/self-hosted-slms-in-production
  - proof/performance-and-cost-claims
  - jtbd/surface-every-dependent-document
---

## Summary

Hosted HydraDB (search, connectors, memories, knowledge graph) runs on an open-source graph core (ELv2), with an open-source agent graph framework (selfgraph) as the on-ramp. Enterprise adds on-prem models, connectors and support.

## Detail

### How it works (engineering facts)

- Two retrieval modes: "vector (fast ~20ms) & graph (thinking ~200ms)" (Internal: engineering notes, 2026-09-28). Product names: "fast mode" and "thinking mode" (2026-10-25).
- Every POST /query returns `data.llm_prompt`: "the full result rendered as one Markdown string, ready to inject into a model call". "Never an empty string: zero matches return an explicit no-results message naming any filter that constrained the search." "TL;DR for agents: query, take data.llm_prompt, put it in the context. Done." (Internal: engineering notes, 2026-09-23)
- Direction (2026-08-28): "one unified context graph per tenant", storing "knowledge, memories, user preferences, and decision traces together as a single source of truth", unifying "graph, semantic, and lexical/BM25 layers". Entity dedupe is "heuristic, then semantic, then LLM; the LLM stage accounts for only about 7 to 8% of dedupe decisions" (Internal: engineering notes, 2026-08-28).
- Structured data idea (2026-09-24): "We can use the graph to be a pointer to the table and an agent can read the table for answers." (Internal: founder note, 2026-09-24)
- Multi-tenancy: tenants per use case, sub-tenants per end customer; metadata filtering preferred over physical isolation per tenant (Internal: engineering notes, 2026-04-23).
- Three public benchmark tracks: graph DB (github.com/hydra-db/benchmark), accuracy, ingestion latency (Internal: engineering notes, 2026-10-15).

### Shipped, September 2026 (public changelog posted 2026-10-04)

Permission-aware search (carries access rules from Google Drive, Slack, Jira); eight new connectors (Microsoft Teams, Outlook, SharePoint, Gong, Avoma, Guru, Discord, Typeform); `llm_prompt` on every query; custom extraction instructions; redesigned dashboard; on-prem SLMs for KG extraction included in Enterprise: "nothing extra to pay. The models are included." (Internal: public post, 2026-10-04)

### Shipped, late Oct to 2026-11-24

- **selfgraph** (github.com/hydra-db/selfgraph), "our agent graph framework". "It's already on Github" (2026-11-17). Intent: get every dev who has "ever thought of graphs" through selfgraph first, "then we get them with hydradb perf" (2026-11-15). Analogy: "what next.js is to vercel. selfgraph (framework) is to hydradb" (2026-11-06). (Internal: founder note, 2026-11-06 to 2026-11-17)
- **MCP database tools** (2026-11-03): 6 tools added to the MCP server (create, delete, readiness, stats, schema inspect, schema update), mirrored in the CLI, the Claude Code plugin and the OpenClaw plugin (Internal: engineering notes, 2026-11-03).
- **Connector edge linking** (2026-11-11): edges for 9 connectors (Okta, Figma, Datadog, PagerDuty, Google Calendar, Mixpanel, LaunchDarkly, Typeform, Gong); every change verified end to end with before/after edge checks (Internal: engineering notes, 2026-11-11).
- **API simplification** (2026-11-12): "Either ingest text or use connectors API" (Internal: engineering notes, 2026-11-12).
- **Ingestion**: major ingestion services migrated from Python to Go (Internal: engineering notes, 2026-11-19 to 2026-11-22).
- **pg_hydradb** Postgres extension live in the OSS repo (2026-11-15). **Self-hosted SLMs** live on prod (2026-11-19).

### Open-source model

- What is open: the core graph database (github.com/hydra-db/hydradb, from 2026-08-12), open-glean (2026-09-17), selfgraph, pg_hydradb. License: ELv2 as of 2026-11-15 (changed on 2026-11-03); the July 2026 plan was AGPL plus a commercial license. See [[global/company-timeline]].
- What is not: the managed platform layer and the Context Digestion Layer (CDL) (Internal: founder note, 2026-07-25).
- How OSS is used in sales: for companies that say no to outreach, point them at the open-source project so "they can at least try us out for free" (Internal: founder note, 2026-08-12). OSS and hosted have different functionality and usage shapes; coding agents default to the OSS project.


## Source

Engineering notes, founder notes, team discussions and HydraDB's public changelog, 2026-04-23 to 2026-11-24; dates inline. Third-party vendor names in the stack are kept out of this file; do not name vendors in posts.
