---
title: Docs and API simplicity, not features, is what developers complain about
description: Separate signals (all-hands July 2026, customer questions March to April, a sales call in September, a team survey in October) that HydraDB's main friction is confusing concepts and docs, not missing capability.
confidence: validated
references:
  - insight/2026-03-31-ai-cs-agent-found-dropped-balls
  - insight/2026-11-24-own-your-context-teach-dont-pitch
  - insight/2026-11-23-founder-operating-lessons
---

## Claim

For developer infrastructure, the biggest adoption blocker is conceptual and documentation friction;
adding options (like metadata filters) makes it worse.

## Evidence

- Internal: team discussion, 2026-07-24. All-hands goal: make the APIs, SDKs and docs so simple a
  17-year-old could use them on the first try, and fix schema design friction.
- Internal: founder note, 2026-07-26: "find answer to the API problem for memory & knowledge". Customers
  repeatedly asked about "memories vs knowledge" distinctions in March to April (Internal: customer call
  recap, 2026-04-10).
- Internal: founder note, 2026-09-08, after a sales call: "Too much confusion between collections and
  databases", "metadata filters --> was a bad call; too complicated", and the conversation drifted to what
  HydraDB did not have, which is "not the right way to handle it."
- Internal: team discussion, 2026-10-15. Team survey: most responses mentioned that the docs were weak,
  though nobody had said so before.

Validated: customers' repeated questions and a team survey are independent of the founder's own notes.

## Implication

Fewer concepts ("one database and one collection"), defaults over configuration, docs as product.

## Use in messaging

Founder-lesson post: "We shipped metadata filters. It was a bad call." Or: "I asked my team what they're
proud of. Most of them told me our docs were the problem."
