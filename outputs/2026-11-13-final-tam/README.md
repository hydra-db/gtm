---
title: final_tam, first build
description: Every source (Bookface, Clay, Cargo sourcing, Dayly GitHub signals, social listening) run through one ICP gate, producing the list of companies to speak with.
outcome: 1,754 companies qualified into final_tam out of 5,482 proposed; 714 to reach now (tier 1, or 7 and up); 294 contacts with a verified email at 112 of the top accounts. No outreach sent yet.
date: 2026-11-13
serves: none yet (plan/outcomes.md is still a skeleton)
---

## What ran

- Play: `infra/gtm-factory/plays/score-candidate.ts` (the ICP gate), run as hand batches over `tam_candidates`, then hourly on its own.
- Also: `plays/social-listening.ts` (one hand-run pass over 32 keyword rows), `plays/oss-to-candidates.ts`, `plays/find-contacts.ts` (hand batch over accounts scoring 8 and up).
- Trigger: operator request on 2026-11-13, run overnight.
- Context used: `context/icp/hydradb.md` (rewritten 2026-11-13).

## Headline result

Proposed companies, by where they came from, and how many passed the gate:

| Source | Proposed | Qualified | Rate |
| --- | --- | --- | --- |
| Cargo sourcing (Sales Navigator, AI Ark, Apollo, Exa, theirStack) | 4,266 | 1,449 | 34% |
| YC Bookface | 509 | 152 | 30% |
| Clay | 254 | 120 | 47% |
| Dayly GitHub signals (`oss_signals`) | 373 | 30 | 8% |
| Social listening (LinkedIn and X) | 80 | 4 | 5% |
| Total | 5,482 | 1,755 | 32% |

`final_tam`, 1,754 companies (one per domain):

- Tier 1 (Bay Area, graph or memory signal now): 620
- Tier 2 (Bay Area, no graph signal yet): 164
- Tier 3 (rest in scope): 970
- Score 8 to 10: 171. Score 7: 527. Under 7: 1,056.
- Reach now (tier 1, or 7 and up): 714

Not qualified: 1,688 disqualified (vendors, RAG-only, lookup agents, services), 1,670 missing a must-have, 169 outside the US, 162 under 10 people, 29 where research came back empty twice.

Contacts: 294 people with a verified work email at 112 accounts (economic buyers and champions), in `final_tam_contacts`.

Listening: 99 posts from 82 companies in `social_listening`; 400 Dayly GitHub leads in `oss_signals`.

Cost: about 2,200 Cargo credits (scoring about 1,350, new sourcing about 220, contacts about 95, the rest listening and pilots).

## Where the full data lives

- Cargo models `final_tam`, `tam_candidates`, `final_tam_contacts`, `social_listening`, `oss_signals` (folder "GTM factory").
- Segments `final_tam_outreach_now` and `final_tam_outreach_later`.

## What we learned (candidate for context/)

- A description-only classifier marked about a third of real fits; researching each company against the must-haves is what separates fits from lookalikes. First observation.
- Signal sources (GitHub activity, posts) propose mostly vendors and individuals: 5 to 8% pass the gate, against 30 to 47% for searched sources. They are a timing signal on known accounts more than a sourcing channel. First observation.
- 189 of the qualified companies were first found only by the 2026-11-12 AI Ark lookalike search, which the operator did not ask for. They passed the gate on their own evidence and are labelled "lookalike only" in `source_detail`.
