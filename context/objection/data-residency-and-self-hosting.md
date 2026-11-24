---
title: "\"Our data can't leave our environment\" (residency, self-hosting, compliance certifications)"
description: "The most common enterprise blocker: residency law, self-hosting, network lockdown, an unsupported cloud, or SOC 2 / HIPAA asks. HydraDB's answer evolved into BYOC, on-prem SLMs in Enterprise, and certifications in progress (not complete)."
references:
  - objection/permissions-and-isolation
  - insight/2026-11-10-small-buyers-run-enterprise-security-reviews
  - insight/2026-09-24-saas-customers-sit-above-your-access-boundary
  - alternative/enterprise-search-and-data-platforms
  - global/positioning
  - icp/hydradb
---

## Objection

Generic forms heard across fintech, healthcare, services and voice-AI buyers:
- "Our financial data must legally stay in-country. DPA review comes before any data transfer."
- "Can we self-host this? How does replication work across our clusters?"
- "No public ingress on any host."
- "We run on a cloud you don't support yet."
- "Can we self-host this in our cloud, and are you SOC 2 / HIPAA compliant?"
- Sometimes with a threat attached: "we'll build it ourselves if you can't deliver."

## Root cause

A context layer is built from the most sensitive data a company has. Buyers are not objecting to the
product; they are objecting to where extraction and storage happen and who controls the model. Often their
own customers require it. For SaaS buyers, what is stored matters more than who can read it
([[insight/2026-09-24-saas-customers-sit-above-your-access-boundary]]).

## Stage

discovery | demo | negotiation

## Response

"Then build it where the data already lives, with a model you control."

## Full response

1. Acknowledge: residency and network rules are non-negotiable, a blocker not a preference. Treat a stalled
   residency question as revenue walking out the door.
2. Reframe: HydraDB Enterprise runs in your environment with on-prem small language models for knowledge
   graph extraction: "Your data never leaves your environment to become your context graph, and there is
   nothing extra to pay. The models are included." (public changelog, 2026-10-04).
3. Evidence of capability: dedicated and BYOC deployments, plus an open-source core that lets teams run it
   themselves. Do not describe specific customer deployments.
4. Scope around requirements: the goal is to run the
   infrastructure for the customer.
5. Next step: while legal reviews the DPA, start scoping on redacted operational metrics (latencies,
   P90/P95, success rates) so the evaluation does not stall.

## Proof

- Public changelog entry on on-prem SLMs in Enterprise (2026-10-04).
- No certification completion date is recorded. Do not claim "SOC 2 certified" or "HIPAA compliant"
  anywhere until a source says so.

## Followup

Ask for the DPA and security questionnaire on the first call, the target cloud, and for redacted metrics
to scope in parallel.

## Push back vs concede

Hold the line that a cloud POC is fine for non-sensitive scope, and that BYOC is possible. Concede
timelines if a certification is not complete. Concede when the buyer's cloud is not supported yet:
disqualify early rather than stall.

## Source

- Internal: sales notes, 2026-08-27
- Internal: sales notes, 2026-09-30
- Internal: customer call recap, 2026-09-23
- Internal: sales notes, 2026-04-01
- Internal: team discussion, 2026-04-11
- Internal: public post, 2026-10-04 (changelog)
- Internal: founder note, 2026-09-28
