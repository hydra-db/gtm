---
title: Publish latency as ranges with methodology, not one headline number
description: Founder's stated rule for HydraDB benchmarks (percentiles, hardware, workload, public datasets, quote the low end), plus an early-2026 note that benchmark publication is essential for credibility.
confidence: validated
references:
  - insight/2026-11-01-benchmark-leads-expire
  - insight/2026-09-09-faster-planner-is-not-a-faster-engine
  - objection/show-me-the-benchmarks
  - objection/graph-databases-cost-too-much
  - proof/performance-and-cost-claims
---

## Claim

For a database, one latency number is either an overclaim or an underclaim; credibility comes from
reproducible methodology.

## Evidence

- Nishkarsh: "a range, imo, is actually more accurate than one number. speed varies a lot by query type
  and hop depth, so collapsing that to a single number risks overclaiming or underclaiming depending on
  which slice you picked." Rules: nail the methodology first (percentiles, hardware, workload); if
  compressed to one number, use the lower end of the spectrum; always use percentile-based benchmarks;
  make all datasets and methodology public for full reproducibility. Internal: founder note, 2026-07-25
- Independent early-2026 note: benchmark publication is essential for credibility; publish benchmarks
  and technical papers. Internal: founder note, 2026-01-22
- An engineering result shows why: the same change made deep multi-hop queries faster and ordered
  queries much slower. Internal: engineering notes, 2026-09-09
- Nishkarsh: publish benchmark methodology on GitHub "so that everyone can replicate the results".
  Internal: founder note, 2026-11-17

## Implication

Every speed claim in content links to reproducible benchmarks and uses the low end. Until a published
benchmark exists, no speed or cost multiple appears in public posts ([[proof/performance-and-cost-claims]]).

## Use in messaging

Contrarian post: "Stop asking database vendors for their p99. Ask for their methodology." Illustrate with
the faster-on-one-query, slower-on-another example, without internal multiples.
