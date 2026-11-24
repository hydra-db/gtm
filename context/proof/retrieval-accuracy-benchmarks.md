---
title: Retrieval accuracy benchmarks (temporal reasoning 91 vs 60, 88.7 across 511,958 documents, LongMemEval-s, FinanceBench) and a customer accuracy lift
description: HydraDB's benchmark scores with their stated datasets (BEAM 1M, EnterpriseRAG, CodeWiki, FinanceBench, LongMemEval-s) and an anonymised customer's agent accuracy going from below 50% to 85%.
confidence: hypothesis
references:
  - proof/performance-and-cost-claims
  - proof/graph-retrieval-examples
  - client/ai-services-agent-accuracy
  - jtbd/connect-context-across-sources
  - jtbd/memory-that-tracks-change
---

_confidence: hypothesis (we think so) | validated (seen twice, independently) |
proven (measured, repeatable). Outreach motions may only cite validated or proven
files. Start at hypothesis and earn the upgrade._

## Type

benchmark

## Content

### Benchmark scorecard (website, 2026-11-01)

Each card "leads with the kind of question it tests, in plain words, and the score becomes the proof":

- **Company brain (EnterpriseRAG):** questions answered across 511,958 internal documents, many of them "duplicated, outdated or contradictory". Score: 88.7.
- **Code (CodeWiki):** "how does this library parse a string?", where the answer only exists across many files. Score: 90.73.
- **Memory (BEAM 1M):** what changed and in what order, over a million tokens of history. Temporal reasoning: 91 vs 60 for a named memory-layer competitor. Overall: 82 vs 74. Founder guidance: lead with temporal reasoning (91 vs 60) "instead of the overall 82 vs 74".
- **Finance:** "Why did margins recover in Q3?", traced back to the original filings. Score: 91.4% Recall@10.

### Earlier internal benchmarks (2026-09-09)

"HydraDB achieves up to 90.79% accuracy on LongMemEval-s and 91.4% Recall@10 on FinanceBench, with sub-200 ms recall for production applications. We're happy to share the benchmark methodology and results."

The FinanceBench 91.4% Recall@10 figure was relayed by two different people (2026-09-09 and 2026-11-01), both from HydraDB's own write-ups. Same underlying source, so the file stays hypothesis.

### Customer accuracy lift (anonymised)

"We helped [an AI services company] improve agent accuracy from below 50% to 85%" and "achieve 85% agent accuracy with sub-200 ms latency." Labelled "not published, but safe to use in a copy" (2026-09-09). Not a public reference; never name the company.

## Source

- Internal: team discussion, 2026-11-01 (wording comes from HydraDB's own benchmark write-ups)
- Internal: sales notes, 2026-09-09 (internal benchmarks and customer lift)
- Internal: founder note, 2026-07-25 (commitment to publish datasets and methodology)

## Client

[[client/ai-services-agent-accuracy]] (reference_permission: no; describe as "an AI services company").

## Context

Backs "graphs keep agent accuracy at scale" and the claim that time and change (temporal reasoning) is where graphs clearly win. These are scores on stated datasets, so they may be used with the dataset named; the original write-ups (on hydradb.com) would justify `proven`.

## Use cases

- Proof-point post: "91 vs 60 on temporal reasoning (BEAM 1M)". Do not name the competitor; say "the memory layer we tested against" only if the write-up supports it, otherwise give HydraDB's number.
- Objection "vector search is good enough": the 511,958-document company-brain set with duplicated, outdated and contradictory documents (88.7).
- Anonymised customer post: "below 50% to 85% agent accuracy".
- Do not use "4x improve in agent recall" (no measurement; see [[proof/performance-and-cost-claims]]).
