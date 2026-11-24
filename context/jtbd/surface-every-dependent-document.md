---
title: Make sure no dependent document goes unturned
description: When one clause, ticket or record affects many others, agents must find every document it touches. Legal, customer support, code and healthcare are where this matters most. HydraDB does not yet do this reliably (Nov 2026).
references:
  - client/due-diligence-ai-dependent-documents
  - jtbd/connect-context-across-sources
  - global/positioning
  - global/product
---

## Job

When _a clause, ticket or record in one place governs things elsewhere in the corpus_, I want _my agent to find every document it touches_, so that _no dependency is missed in a decision the business relies on_.

## Current solution

- Rephrasing the query as what the clause reaches ("real property leases and subleases") instead of the clause's own words. A customer says this "already finds every expected document", but it needs a human or extra step to write the rephrase.
- Pure similarity search.

## Gap

Similarity ranks documents that repeat similar wording above the document the clause actually governs. Graph context read after ranking cannot rescue a missed document; the fix in progress is to use clause-specific dependencies before ranking. A customer's own A/B test showed the graph was not yet changing ranked results ([[client/due-diligence-ai-dependent-documents]]). Do not claim this job is solved.

## Evidence

- Customer: "when a clause in one document affects other documents, our agent should find every document it touches."
- Nishkarsh (2026-11-24): "customer support for ai / legal ai / code / healthcare ai - these are places where surfacing (or not surfacing) dependencies becomes critical for workflows".
- Nishkarsh (2026-11-24): graphs "let your agents crawl through the entire corpus without fail so that you can rest assured that no document went unturned to answer a query".
- Search framing (2026-10-23): "traversal, following those connections step by step to the answer. like project to blocker to owner to latest decision."

Internal: customer call recap, 2026-11-19 ; engineering notes, 2026-11-20 ; founder note, 2026-11-24 ; founder note, 2026-10-23

Merged from staging: product2/jtbd/surface-every-dependent-document.
