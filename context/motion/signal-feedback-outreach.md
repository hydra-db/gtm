---
title: Signal-led feedback outreach
description: Cold first touch to people at ICP companies (Series B or later) that showed a dated signal, asking for feedback on HydraDB's open-source context graph. YC founders first.
kind: outreach
hypothesis:
  segment: ICP-qualified companies at Series B or later (TAM_MASTER_FINAL) with a signal in the last 14 days; the signal person, the CTO and the Head of AI, plus the most relevant YC founder at the company, who goes first
  angle: their own signal, quoted, plus a request for feedback on what HydraDB is building in the open (link to the open-source repo); YC copy only for YC people
  trigger: a dated signal in the last 14 days (GitHub issue or PR, job post, LinkedIn or X post, funding, new technical leader)
  expected_reply_rate: 8% of people contacted reply within 21 days (proposed; the owner sets the final bar)
---

## Serves

Not yet set: `plan/outcomes.md` has no filled outcome. This motion produces
replies (the Engaged list in Attio) and, from them, Prospecting deals.

## Trigger

- A signal dated within the last 14 days on an account in TAM_MASTER_FINAL that
  passes the ICP gate and is Series B or later.

## Audience

- [[icp/hydradb]]: engineering and AI leaders whose agents make repeated
  judgment calls across each customer's systems.
- Per account: the signal person, the CTO, the Head of AI, and the most
  relevant ex-YC founder working there. When the YC founder is not the right
  person, they are asked to connect us, and the others wait about 5 days.

## Channel

- lemlist: email, LinkedIn message, LinkedIn voice note. The owner sets the
  final sequence in lemlist.

## Sequence

1. YC founder first, when there is one (YC copy).
2. Signal opener, feedback ask, open-source link, one question.
3. Follow-ups as set in lemlist. Any reply stops the sequence.

## Proof

- None cited. The copy makes no claims about customers, benchmarks or numbers;
  it points to the open-source repo instead.

## Success metric

Reply rate per weekly batch, judged against the expected reply rate above;
then replies that become meetings, and meetings that become Prospecting deals.

## Owner

Nishkarsh Srivastava (founder).

## Implementation

- `infra/gtm-factory/agents/outreach-drafter.ts`: the Outreach drafter agent
  (drafts only, YC-aware). A person approves every message in lemlist.
- `evals/outreach-drafter/`: the regression suite for its prompt.
