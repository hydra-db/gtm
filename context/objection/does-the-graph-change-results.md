---
title: "Turning the graph on didn't change my search results"
description: A technical customer A/B-tested graph context on vs off in November 2026 and saw identical ranks. Honest handling, the root cause HydraDB confirmed (graph read after ranking), and the fix in progress, not shipped as of 2026-11-24.
references:
  - insight/2026-11-20-similar-wording-is-not-applicability
  - insight/2026-07-26-fast-mode-beats-thinking-mode
  - objection/show-me-the-benchmarks
  - objection/vector-search-is-enough
---

## Objection

From a technical customer running its own A/B test (anonymous phrasing): graph context on vs off returned
the same documents "with or without the graph, identical ranks", and "the graph slice only described
chunks the search had already returned." After adding a custom extraction instruction: "The graph did
change ... Search results stayed the same." (2026-11-18 to 2026-11-20)

## Root cause

Real product gap, confirmed by HydraDB's own root-cause analysis on 2026-11-20: in fast mode, graph
context was read after ranking, and thinking mode followed document links after ranking too, returning
them as supplemental context. So graph knowledge could not lift a missing document into the top results.

## Stage

demo | post-sale evaluation

## Response

"You're right, and here's exactly why: the graph was being read after ranking. We're moving it before
ranking."

## Full response

Acknowledge with their numbers. Reframe the problem: similar wording is not the same as "this clause
governs that document" ([[insight/2026-11-20-similar-wording-is-not-applicability]]). Proof: the
root-cause analysis and the plan (use graph references before the final cut, and extract references with
their direction and the passage that states them). Next step: rerun their exact query set.

## Proof

- Internal root-cause analysis and fix plan, 2026-11-20. Not public.

## Followup

Ask for their scripts and raw results and agree on a pass bar before re-testing.

## Push back vs concede

Concede. Do not argue that the graph "works" when their test shows identical ranks. Do not quote an
internal number the customer could not reproduce. Use the customer's numbers. Do not claim the fix has
shipped until it has.

## Source

- Internal: customer call recap, 2026-11-18
- Internal: customer call recap, 2026-11-20
- Internal: engineering notes, 2026-11-20
