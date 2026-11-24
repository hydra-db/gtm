---
title: "Which model providers see our data, and we need a signed DPA before we load it"
description: Even small, AI-native customers now run enterprise-grade data-handling reviews (providers per step, no-training terms, retention, deletion, DPA). HydraDB's public stance is self-hosted models and fast, honest paperwork.
references:
  - objection/data-residency-and-self-hosting
  - objection/give-us-the-original-data
  - insight/2026-11-10-small-buyers-run-enterprise-security-reviews
  - insight/2026-09-24-saas-customers-sit-above-your-access-boundary
  - global/positioning
---

## Objection

Generic form, as small AI-native buyers phrase it:
- "We need a signed DPA before we put our customers' data in it. Our customer contracts and our own
  audits require one."
- "Process our content only to provide the service, never to train or improve models."
- "Which model and embedding providers touch our content at each step?"
- "What happens to our data when we delete it, including backups and logs?"

Buyers also want control over which model touches their data, down to asking whether they can choose the
model themselves.

## Root cause

Surface: compliance paperwork. Underneath: a context layer ingests a customer's most sensitive documents,
often their own customers' data, and model calls are part of extraction. The buyer's own audits and
customer contracts are on the line, so the questions are legitimate.

## Stage

negotiation | post-sale

## Response

"Here is every step that touches your data, here is how models we host keep it in our boundary, and we
will put the no-training and deletion terms in writing."

## Full response

- Acknowledge: "these are the right questions to ask." Their audits make this non-negotiable.
- Be specific and complete about which steps touch content. Do not hand-wave.
- Reframe: HydraDB runs its own small language models and embedding models, so extraction and embedding
  stay inside HydraDB's environment (self-hosted models went live in production in November 2026). For
  Enterprise, the models run in the customer's environment.
- Concede any gap honestly and give a date for closing it.
- Then the paper: DPA ("happy to sign yours"), sub-processor list, deletion statement, and written
  confirmation of the no-training commitment.

## Proof

- Self-hosted extraction and embedding models live in production, November 2026.
- Strategy: run the infrastructure for the customer and keep the model in the customer's control.

## Followup

Ask for their DPA template and deadline, which use cases need which retention, and how they want access
keys scoped ("It helps us prioritise").

## Push back vs concede

- Concede on paperwork fast. A DPA that drags past the buyer's deadline puts the account at risk.
- Concede on contract language about training on customer content.
- Hold on safeguards that protect data integrity (for example, not letting a delete race a running
  index), and explain why they exist.
- Do not claim SOC 2 Type 2 or any certification until it is complete.
- LinkedIn: talk about the pattern (small buyers, big reviews), never the buyer or the terms.

## Source

- Internal: customer call recap, 2026-11-05
- Internal: customer call recap, 2026-11-10
- Internal: team discussion, 2026-11-11
- Internal: founder note, 2026-11-24
- Internal: customer call recap, 2026-08-28
- Internal: founder note, 2026-09-28 (self-hosted model strategy)
