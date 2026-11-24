---
title: AI assistants are becoming a discovery channel for databases; listings feed the agents, not the buyer
description: Nishkarsh's 2026-11-06 thesis that agents choosing databases from public lists will drive future revenue, HydraDB's early LLM-visibility numbers, and his same-day view that no buyer picks infrastructure because it is on a list.
confidence: hypothesis
references:
  - insight/2026-09-30-agents-choose-their-own-tools
  - insight/2026-09-10-blog-traffic-does-not-convert
  - insight/2026-07-25-benchmark-ranges-not-single-numbers
---

## Claim

Nishkarsh believes the main future driver of HydraDB revenue is AI agents discovering and recommending
databases from established public lists and content, and early data shows HydraDB moving from zero to
measurable LLM recommendations. On the same day he said listings do not win the human buyer: product
quality wins the customer and the listings follow. Reconciled: lists matter for what the LLM reads, not
for the buyer's final decision.

## Evidence

- Internal: founder note, 2026-11-06. Thesis: "I think the primary driver of all of our revenue and use
  cases moving forward will be agents discovering the best databases across all of these established
  internet lists. I want us to be at least considered for these things by these agents". He compiled a
  list of 100 places where HydraDB needs to be listed.
- Internal: team discussion, 2026-11-06. HydraDB ranked #51 on the public DB-Engines graph ranking at the
  time.
- Internal: team discussion, 2026-11-06. An advisor's idea: make it "dead-easy for the agent to get
  something going fast" (local file connection string first, cluster later), "then a bunch of blogs about
  it so the next training loop for the next frontier picks it up".
- Internal: team discussion, 2026-07-16. HydraDB's own test across about 4k prompts: recommendation share
  went from 0 to about 1% between May and June 2026; citations from 0% to about 2.5%.
- Internal: founder note, 2026-11-06, the other side: "literally no company cares about all of these
  listings. Sure, they help with visibility, but finally [a buyer] wouldn't buy from you because you were
  on this list. They would buy from you because the product actually really is very good. And then you go
  to a customer and you show them why they need to use you, and then you start getting on these lists
  anyway."
- Internal: founder note, 2026-11-17. Publish benchmark methodology on GitHub "so that everyone can
  replicate the results".

## Implication

Content now has two readers: humans and the models that recommend tools to developers' agents. Specific,
citable claims (benchmarks with methodology) serve both. Spend founder time on one customer proof over ten
directory submissions; let the listings work happen in the background.

## Use in messaging

- Contrarian post: "Your next customer won't Google you. Their coding agent will pick your database for
  them."
- Contrarian founder post: "No buyer has ever picked us because we were on a list." Do not name the
  prospect company he cited.
- Use the 0 to ~1% recommendation share only with "in our own tests".
