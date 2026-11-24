---
title: Agent memory layers (Mem0, Zep/Graphiti, Supermemory, Letta, Cognee, Honcho)
description: Battlecard for the crowded "memory for agents" category. HydraDB's stance as of 2026-11-24 is not to compete as a memory company but as what you build your own memory on. Numbers are point-in-time public readings and must be re-checked before quoting.
references:
  - objection/hydradb-is-just-another-memory-layer
  - insight/2026-11-23-agent-memory-is-a-crowded-category
  - insight/2026-11-24-own-your-context-teach-dont-pitch
  - insight/2026-07-25-company-brain-over-agent-memory
  - insight/2026-09-30-agents-choose-their-own-tools
  - alternative/vector-databases
  - alternative/postgres-and-one-engine-databases
  - global/positioning
  - icp/hydradb
---

## Profile

Substitute. Products sold as "memory" for agents. In January 2026 an advisor noted that the established
memory products were dominating developer mindshare while HydraDB (then Cortex) was absent from agent
memory conversations. The internal ICP doc (2026-11-11) lists memory layers (Zep, Mem0, Letta, Cognee) as
a sign that a team "has the problem and may be shopping." Honcho also comes up.

Public positioning, as read from public sources (point in time, not verified by the team):

| Product | How it positions |
| --- | --- |
| Mem0 | agent memory layer |
| Supermemory | agent memory |
| Zep | agent memory and context built on a temporal knowledge graph combining business data, documents and conversations (open-source Graphiti engine) |
| Cognee | open-source agent memory engine combining relational, vector and graph storage in one engine |
| Letta (formerly MemGPT) | platform for stateful agents with built-in tiered memory |

Zep overlaps most directly with Mem0, Supermemory and the memory use case of HydraDB, and appears in most
"Mem0 alternatives" roundups. Letta is a full agent runtime, so it overlaps with HydraDB less directly than
a pure memory or storage product.

Draft content once framed HydraDB "as a mem0 alternative"; Nishkarsh rejected that framing on 2026-11-24.

## Pricing

Not tracked.

## Strengths

- Developer mindshare and published papers (Mem0 and Zep papers trending in April 2026).
- They own the search term; third-party roundups compare these names against each other.
- Simple story and fast adoption: one API for remember and recall, "add memory to your agent".
- Some products (Honcho, for example) have a clean design that buyers like for single-agent use.

## Weaknesses

- You rent someone else's memory model. Nishkarsh (2026-11-24): "if you talk to 100 devs all 90 will tell
  you 'we want to own their memory'" (his estimate, not a survey).
- Single-agent scope: some products are built as a memory layer for one personalised agent, which does
  not fit multi-agent setups that need org and per-user isolation.
- How an agent evaluating tools might see one, in the founder's imagined path: "seems like a harness more
  than infra. I have a harness - let's look for alternatives" (2026-09-30).
- Temporal reasoning: HydraDB reports 91 vs 60 for one memory layer on BEAM 1M temporal reasoning
  (measured score; see [[proof/performance-and-cost-claims]]).
- Distribution is largely organic and roundup-driven, so it is contestable.
- Brand noise: a generic product name can be drowned out on video platforms by unrelated content.

## Wedge

"we're not a memory company. we're the company that lets you build memory on top of us." / "build your
mem0" (Nishkarsh, 2026-11-24). Memory is one use case; company brain, ontologies and multi-source context
are others. Earlier versions of the same line: HydraDB is "foundational tech for agent memory, company
brains, and AI context infrastructure", not just a memory product (2026-07-25); "a fast graph engine
purpose built for AI use cases like agent memory, ontologies, company brains" (2026-07-07). Where a memory
product stores conversations, HydraDB links them to business data across sources, shared across agents and
isolated per user and org.

For a team already on a memory product: offer to backfill their existing data and migrate quickly, so they
run their own memory layer instead of renting one.

Advisor's point (2026-07-21): a custom memory layer matters for what it enables: a much better user
experience from understanding the user or organization better, and higher retention. Memory is the means;
retention is the outcome.

## Loses when

- The buyer wants a drop-in chat-memory SDK in an afternoon and nothing else, or a finished memory
  product with no appetite to assemble anything (inference, not a recorded loss).
- The buyer needs memory for one personal agent only.
- The buyer wants a full agent runtime (Letta's lane).
- Buyers want a named logo and a case study to prove "why us over managed memory" (2026-07-22). Until
  case studies are public, this is the gap.

## Battlecard

- Don't fight on "memory". Ask what the agent needs to know that is not in the conversation (tickets,
  docs, CRM, prior fixes). That is where a memory layer stops.
- Ask whether memories must be shared across agents, isolated per user and org, and updated when facts
  change. If yes, a single-agent memory layer will not cover it.
- Ask whether they want a memory feature or a context layer they own. Offer backfill and a fast migration.
- Lead with an outcome (retention, fewer repeat questions).
- Users of these tools are a sourcing signal: they have the problem and may be shopping.
- Treat public numbers as directional. Re-check before quoting funding anywhere.
- Never pitch as "X alternative". LinkedIn: never name these products; say "memory layers" or "memory APIs".

## Source

- Internal: team discussion, 2026-11-23 (competitor tracking)
- Internal: team discussion, 2026-11-21 (competitor tracking)
- Internal: founder note, 2026-07-21 (advisor feedback)
- Internal: founder note, 2026-07-07 (positioning)
- Internal: team discussion, 2026-01-22 (advisor feedback)
- Internal: founder note, 2026-09-30
- Internal: team discussion, 2026-07-22
- Internal: team discussion, 2026-04-27 (paper digest)
- Internal: founder note, 2026-07-24
- Internal: sales notes, 2026-11-11 (ICP doc)
- Internal: founder note, 2026-11-24
