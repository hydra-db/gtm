---
title: Healthcare companies building agents on HydraDB (2026)
description: Two healthcare companies using HydraDB as the context layer for internal agents; healthcare is called out by Nishkarsh as a segment "doing really well" (Sep 2026). Not public references.
reference_permission: no
references:
  - jtbd/company-brain
  - jtbd/connect-context-across-sources
  - persona/ai-engineering-leader
  - global/positioning
---

## Profile

Two healthcare companies, one in digital health and one in mental health, both running HydraDB for internal agents. Neither is cleared to name. Describe as "a healthcare company". Do not lead content with either as a case study.

## Use case

- Company A: an internal "army of agents" powered by HydraDB, aiming to become an AI-native healthcare firm.
- Company B: "a unified context layer for your agents" (Nishkarsh's recap), in a dedicated deployment, moving to general availability in September 2026. Query patterns offered: "just graph --> tool calls to fetch all docs, graph + vectors, graph --> graph --> graph".

## Outcome

No metric recorded.

## Story

Nishkarsh, 2026-09-10: "Health care for us seems to be doing really well right now." and "Graphs are the best way for us to help agents coordinate & collect context".

Company B's engineer found chat data was not helpful on its own, only "in conjunction to some primary data object", so HydraDB proposed modelling the data objects from their own schemas. Lesson: conversations are context around a record, not the record. A shared checklist also asked them what the search failed to do that made them build their own skill on top, which is the right question to ask any customer who builds a workaround.

## Quotes

- Customer feedback (paraphrased by Nishkarsh): chat data is "not helpful independently but in conjunction to some primary data object"

## Related

[[jtbd/company-brain]], [[jtbd/connect-context-across-sources]].

Sources: Internal: founder note, 2026-09-10 ; Internal: customer call recap, 2026-08-27 ; Internal: engineering notes, 2026-09-10
