---
title: '"Every question is a new question for us": the company-brain company had no data room'
description: Nishkarsh admitted on 2026-11-17 that HydraDB could not answer simple questions about itself quickly; the next day the team loaded its own docs, tickets, chat and product analytics into HydraDB as the internal company brain.
confidence: hypothesis
references:
  - insight/2026-07-25-company-brain-over-agent-memory
  - insight/2026-11-23-founder-operating-lessons
---

## Claim

A company selling a company brain discovered it lacked one for its own numbers, and dogfooding was the fix.

## Evidence

- Internal: founder note, 2026-11-17. Nishkarsh: "we dont have any data or a decently built data room at
  all. Every question is a new question for us. It took [an engineer] 2 hours to answer some of our
  simplest questions."
- Internal: team discussion, 2026-11-18. Response: shared company knowledge loaded into HydraDB from public
  docs, internal docs, shared skills, tickets, chat and product analytics; graph size stats were not
  stored anywhere, so code was written to store them.
- Internal: engineering notes, 2026-11-18. A design rule from the same week: raw metrics stay out of the
  graph ("it will do nothing").

## Implication

Honest founder story that sells the company-brain job without naming any customer.

## Use in messaging

Post for the week of 2026-11-24: the cobbler's children problem. "We sell a company brain. On 2026-11-17
it took us 2 hours to answer simple questions about our own company." Then what we connected first (docs,
tickets, Slack, product analytics). Keep internal numbers out.
