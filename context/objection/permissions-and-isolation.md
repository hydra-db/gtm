---
title: "Agents can't see what the user isn't allowed to see"
description: Enterprise buyers ask how access rules and tenant isolation carry into the context layer. HydraDB shipped permission-aware search in September 2026; SaaS buyers need per-request and per-collection controls on top.
references:
  - objection/data-residency-and-self-hosting
  - insight/2026-09-24-saas-customers-sit-above-your-access-boundary
  - global/company-timeline
---

## Objection

An enterprise software prospect (2026-04-05): how HydraDB handles "group-based filtering at ingest and
query stage" (they mirror directory groups and filter at search time), plus "Isolation required at both
org level and individual user level within each org".

## Root cause

Agents answering on behalf of employees can leak documents across permission boundaries. For SaaS buyers
the end users have no identity in HydraDB at all: "our users are one layer above your access boundary"
([[insight/2026-09-24-saas-customers-sit-above-your-access-boundary]]).

## Stage

discovery

## Response

"Your agent only sees what that person can see."

## Full response

Tag-based group filtering at ingest and search covers the common case. In
September 2026 HydraDB shipped permission-aware search: agents "answer on behalf of a specific person and
see only what that person is allowed to see", carrying over access rules from Google Drive, Slack and Jira
(public changelog, 2026-10-04). Tenants per use case, sub-tenants per end customer. For SaaS buyers, add
per-request facts-only vs full-text retrieval, and lead with what is stored, not who can read it.

## Proof

- September 2026 changelog (see [[global/company-timeline]]).

## Followup

Ask which identity source defines access today, and whether their end users are principals or sit behind
one service credential.

## Push back vs concede

Concede where a pattern (for example, cross-tenant queries) still needs extra calls today.

## Source

- Internal: customer call recap, 2026-04-05
- Internal: customer call recap, 2026-04-23
- Internal: public post, 2026-10-04 (changelog)
