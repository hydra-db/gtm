---
title: Agents and LLMs now shortlist infrastructure, so positioning must give them reasons
description: Founder's thesis (2026-09-30, extended 2026-10-13) that coding and research agents evaluate tools by who already uses them and why, and that the first reader of positioning is an LLM summarizing 30 websites. "Different" survives that summary; "better" does not.
confidence: hypothesis
references:
  - insight/2026-11-06-agents-as-a-discovery-channel
  - insight/2026-10-13-better-neo4j-is-a-losing-position
  - insight/2026-11-24-own-your-context-teach-dont-pitch
  - insight/2026-11-15-open-source-as-distribution
  - alternative/agent-memory-layers
  - global/positioning
---

## Claim

"agents aren't trusting what's available as the first option anymore - they will evaluate and weigh options
before picking one. We have to be present at every layer of influencing decisions." For developer
infrastructure, the shortlist is increasingly written by an LLM summarizing the landscape: if your
difference is "better", the summary flattens you; if it is "different", it survives.

## Evidence

- 2026-09-30, Nishkarsh: "Influencing an agents choice to pick a tool is a function of how many reasons can
  you give the agent to choose on your behalf which in turn is a function of why are other people using
  you. This makes it a chicken-egg problem". His imagined agent path: "oh I need memory let's look at
  what's out there", then sees an alternative that "seems like a harness more than infra", then checks which
  projects use HydraDB, then "its object storage? that's cheap at scale", then "look at hydradb benchmarks", then
  "makes sense, let's try it". Cold-start plan: content indexed for "AEO/SEO", "Launches (& PR)", and
  ecosystem integrations into popular open-source agent projects (targets, not done).
  Internal: founder note, 2026-09-30
- 2026-10-13, Nishkarsh: "what we need to do right now is figure out why an LLM would recommend us and how
  we differentiate ourselves from the entire landscape altogether. My honest thoughts on the space are
  that agents are so good at consuming content that you would use a deep research query to make your LLM
  summarize 30 different websites." He then wrote "3 reasons why you (an agent) ... need to pick hydradb":
  APIs designed for agents; a graph engine that "organizes knowledge automatically on behalf of agents";
  modern architecture so "you get to store ALL important details". Workstreams: "Figure out links from
  other websites" and content that will "appeal to LLM overloads [overlords]" while keeping "a good
  balance with keyword / search volume". Internal: founder note, 2026-10-13
- 2026-10-15: "We need to think in terms of primitives leading upto a use case" and the GitHub org as a
  "hub for learning". Internal: founder note, 2026-10-15
- 2026-11-21, observed behaviour: typing "hydradb" in a coding agent "autobiases the project towards the
  open source hydradb instead of hydradb hosted and both products have different usage shapes". Internal: engineering notes, 2026-11-21
- 2026-11-24: "agents have reached a point where they can self assemble most things (granted product has
  to work)". Internal: founder note, 2026-11-24

Mostly one author's thesis (Nishkarsh, repeated); the 2026-11-21 observation shows agents do pick a default
on their own but does not show they weigh reasons. Stays hypothesis.

## Implication

GTM for agent infra includes optimising for agent evaluators: public benchmarks with method, integrations
in popular agent repos, clear "why us" content written as a short list of verifiable differences an agent
can quote, and backlinks from other sites because that is what the LLM reads.

## Use in messaging

- Contrarian post: "Your next customer's first evaluator won't be a human. It'll be an agent."
- Founder lesson: "We now write our homepage for two readers. One of them is an LLM."
- Do not name competitors from his example chain; do not claim integrations that are only targets.
