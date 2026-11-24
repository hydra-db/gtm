---
title: Similar wording is not the same as "this clause governs that document"
description: A customer test (an AI startup working on document review, 2026-11-18 to 2026-11-20) showed ranked search returning documents that repeat a clause's language instead of the documents the clause governs, and graph context arriving too late to fix it. Root cause and planned fix from HydraDB's 2026-11-20 RCA; not shipped as of 2026-11-24.
confidence: hypothesis
references:
  - objection/does-the-graph-change-results
  - insight/2026-07-07-vector-similarity-fails-on-relational-memory
  - insight/2026-09-04-retrieved-is-not-read
  - insight/2026-07-26-fast-mode-beats-thinking-mode
---

## Claim

For dependency questions ("which documents does this clause affect?"), similarity ranking picks documents
that sound like the clause, not documents the clause applies to. Graph links only help if they are used
before ranking, not appended after.

## Evidence

- Internal: customer call recap, 2026-11-18. Customer test: graph context on vs off gave "identical ranks"
  in fast mode; "the graph slice only described chunks the search had already returned"; in thinking mode
  it once re-ranked a relevant contract out of the top 20.
- Internal: customer call recap, 2026-11-19. Customer workaround: rephrasing the query as what the clause
  reaches "already finds every expected document".
- Internal: engineering notes, 2026-11-20. HydraDB RCA: "Reproduced: 7 of 12 cases passed in fast mode ...
  Cause: Fast mode reads graph context after ranking ... Fix: Discover clause-specific dependencies from
  the original files and use them before ranking."
- Internal: engineering notes, 2026-11-20. Detail: "a document that repeats similar language can score
  above the document the clause actually governs." Plan: test the reranker with an instruction to "rank
  passages that show this document satisfies the clause's conditions"; give fast mode "a bounded reference
  lookup before that cut"; have KG extraction "capture the reference, its direction, and the passage that
  states it."
- Internal: customer call recap, 2026-11-20. Customer re-test with extraction instructions: "The graph did
  change ... Search results stayed the same."
- Internal: founder note, 2026-11-19. Nishkarsh: "here is a real use case and we dont do this well."

## Implication

Honest, technical, contrarian material: "adding a graph" is not enough; where the graph enters the ranking
pipeline is what matters. Do not claim the fix has shipped.

## Use in messaging

- Post hook: "A customer turned our knowledge graph on and off. The results were identical. They were
  right."
- Never name or describe the customer beyond "an AI startup".
