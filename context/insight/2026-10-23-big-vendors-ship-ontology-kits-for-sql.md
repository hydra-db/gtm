---
title: AWS and NVIDIA both shipped ontology kits, and both aim them at SQL
description: On 2026-10-23 the team found an AWS and an NVIDIA toolkit for auto-building ontologies, both released within 48 hours. Both center on warehouse tables and Text-to-SQL, leaving unstructured agent context open.
confidence: hypothesis
references:
  - alternative/cloud-ontology-accelerators
  - insight/2026-11-09-big-companies-moving-to-knowledge-graphs
  - insight/2026-09-24-graph-as-pointer-to-structured-data
  - insight/2026-11-06-selfgraph-launch-and-positioning
---

## Claim

Ontologies for agents became big-vendor territory in October 2026, but the big vendors are building them
for structured data (foreign keys, Text-to-SQL), not for the messy cross-source context agents need
(decisions, preferences, conversations).

## Evidence

- Internal: team discussion, 2026-10-23. The team reviewed the publicly launched AWS Context Ontology
  Accelerator and an NVIDIA auto-ontology toolkit. Nishkarsh: both launched within the same 48 hours.
- Internal: engineering notes, 2026-10-23. The team's read of both: the relationships are foreign-key
  focused (Postgres tables), with a core focus on ontologies for SQL databases to power a natural language
  to Text-to-SQL pipeline.
- Internal: founder note, 2026-10-23. Nishkarsh: "That's exactly why we need to own the framework for graph
  creation - something that's easily available, developers love, and makes a bang in the agent world."
- Internal: team discussion, 2026-10-05. A public article on Gartner and context graphs
  (https://atlan.com/know/gartner-context-graphs/) circulated as category validation.

## Implication

Big-vendor entry validates the category. HydraDB differentiates on unstructured, agent-side context and
shipped an open framework for graph creation (SelfGraph, 2026-11-06) before the defaults are set.

## Use in messaging

Post angle: "Two of the biggest companies in AI shipped ontology tools in the same 48 hours. Both start
from a foreign key." Their launches are public, but "big vendors" is the safer wording.
