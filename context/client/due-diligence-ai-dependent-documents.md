---
title: Due-diligence AI startup (live account since Jul 2026)
description: A small due-diligence AI startup that chose HydraDB over building in-house for coding memory, memory recall and contract search; now testing whether the graph finds every document a clause affects. Not a public reference.
reference_permission: no
references:
  - proof/customer-and-prospect-quotes
  - proof/performance-and-cost-claims
  - proof/self-hosted-slms-in-production
  - jtbd/surface-every-dependent-document
  - persona/ai-engineering-leader
---

## Profile

A small AI startup serving M&A due diligence, with an engineering team that could have built retrieval itself. Live since July 2026. Not a public reference. In posts say "a due-diligence AI startup".

## Use case

- Agent memory for their engineers while coding, memory recall for their product's users, and contract search, all through one internal service that is the only thing talking to HydraDB.
- Due diligence: a buyer evaluating an acquisition uploads the target's data room into a project, often hundreds of contracts, leases, debt documents and corporate records. Each project is its own HydraDB database. "The outcome we're after: when a clause in one document affects other documents, our agent should find every document it touches." Example: "a credit agreement needs the lender's consent before the company subleases, so we want every lease and sublease in that data room to come back." They hoped the graph would link documents through shared entities "even when they're spelled differently", follow declared relations, and be fast enough for an agent loop.

## Outcome

- Testimonial (2026-07-07): "everybody really loves using memory when coding."
- Graph test (November 2026), run by the customer as a careful A/B (fresh databases, same queries, each run twice): graph context was not yet changing ranked results for clause-to-document dependencies. Rephrasing the query as "what the clause reaches" helped more than the graph did. Fast mode searches took about 0.4 s; thinking or auto modes took 2 to 4 s.
- HydraDB reproduced the gap and found the cause: fast mode read graph context after ranking. Fix in progress: discover clause-specific dependencies from the original files and use them before ranking.
- Use the customer's measurements, not internal runs, when describing this.

## Story

The engineers had the skills to build retrieval themselves and chose HydraDB instead. Later they pushed back on a proposed per-API-key access control: their end users have no HydraDB identity, so a per-key switch gives "one global answer" where they need different behaviour per request (facts only for memory recall, full original text for contract search). Lesson: B2B2C customers sit one layer above your access boundary.

In November the customer's A/B showed the graph was not yet doing the job they hired it for. Nishkarsh's reaction: "here is a real use case and we dont do this well. Forget all random experiments and focus on fixing real stuff". Lesson: a customer who shares scripts and raw results is the best benchmark you will get.

## Quotes

- "everybody really loves using memory when coding."
- "I think the mismatch is that your design assumes each person is a HydraDB principal. We're a SaaS sitting in front of you, so our users are one layer above your access boundary."
- "when a clause in one document affects other documents, our agent should find every document it touches."
- "Happy to share our scripts and raw results."

## Related

[[jtbd/surface-every-dependent-document]], [[proof/customer-and-prospect-quotes]], [[proof/performance-and-cost-claims]], [[proof/self-hosted-slms-in-production]].

Sources:
- Internal: team discussion, 2026-07-07
- Internal: team discussion, 2026-07-24
- Internal: engineering notes, 2026-09-24
- Internal: engineering notes, 2026-11-18
- Internal: engineering notes, 2026-11-19
- Internal: engineering notes, 2026-11-20
- Internal: founder note, 2026-11-19
