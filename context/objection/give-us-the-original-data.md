---
title: "We don't want only your structured output, give us the original data"
description: A customer wanted raw source text back alongside or instead of HydraDB's structured outputs (2026-09-23). The answer kept structure on by default and added an "original context" toggle; per-request choice matters because one product needs facts-only for memory and full text for contracts.
references:
  - insight/2026-09-24-saas-customers-sit-above-your-access-boundary
  - objection/data-handling-dpa-and-retention
---

## Objection

Customer wording not recorded. From Nishkarsh's reply (2026-09-23), the customer wanted to pull the
original source data rather than only HydraDB's structured outputs; the feature had been called "Extra
context". A day later a customer engineer stated the split: "memory recall -> facts only, no
original. Raw transcripts in context is the exact regression we fixed earlier." and "contract search ->
original text absolutely required." (2026-09-24)

## Root cause

Trust and control. Developers want to see and pass the raw text to their own model for some use cases,
and want it kept out for others. One global setting does not fit.

## Stage

post-sale (implementation)

## Response

"Keep the structured outputs, and flip one parameter when you need the original."

## Full response

- Acknowledge: "understanding the use case which is very clear to me."
- Reframe: structured outputs stay on by default because agents answer better with them, and you can
  always switch them off.
- Offer control: "we'll simply give you the optionality to pull 'original data' with a true or false
  parameter", renamed: "The nomenclature can be 'original context' instead of 'Extra context'".
- Next step: fixes "in the next 24 hours".

## Proof

- No measured number. Do not quote any quality multiple for structured outputs in posts or decks.

## Followup

Ask which use cases need the original text, so the default can be set per use case or per collection.

## Push back vs concede

Concede control (a toggle is cheap). Hold on keeping structure as the default.

## Source

- Internal: customer call recap, 2026-09-23
- Internal: customer call recap, 2026-09-24
