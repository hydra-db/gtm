---
title: SaaS customers sit one layer above your access boundary
description: A customer's pushback on per-API-key access control (2026-09-24) showed that multi-tenant AI products need per-request and per-collection controls, and that "we never stored it" beats "we restrict who can read it" for auditors.
confidence: hypothesis
references:
  - objection/permissions-and-isolation
  - objection/data-residency-and-self-hosting
  - objection/give-us-the-original-data
  - insight/2026-11-10-small-buyers-run-enterprise-security-reviews
---

## Claim

Infra built for AI products must assume the customer is a SaaS with many end users behind one credential;
access and privacy controls need to work per request and per collection, and the strongest privacy
control is not storing raw data at all.

## Evidence

- A customer's engineering lead, paraphrased: they have one API key and their end users have no HydraDB
  identity; memory recall should return facts only, while document search needs the original text. "Your
  design assumes each person is a HydraDB principal. We're a SaaS sitting in front of you, so our users
  are one layer above your access boundary." For auditors, "the vendor has a retrieval ACL" is a weaker
  control than "we never wrote it". Internal: customer call recap, 2026-09-24

Same customer as a later data-handling review
([[insight/2026-11-10-small-buyers-run-enterprise-security-reviews]]), so not an independent second source.

## Implication

Product: per-request facts-only vs full-text retrieval, per-collection defaults, and a store-only-the-
inference option. Messaging: lead privacy conversations with what is stored, not who can read it.

## Use in messaging

Post: "A customer's engineering lead told us our access model was one layer too low." Anonymised; never
name the customer or describe their review.
