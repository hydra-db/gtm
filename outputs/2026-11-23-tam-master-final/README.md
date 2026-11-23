---
title: TAM_MASTER_FINAL, every known company in one list
description: final_tam merged with Jonah's job-post firms on the domain, with funding filled in by an enrichment waterfall, as the base for the narrow Series B-or-later working list.
outcome: 3,326 companies in TAM_MASTER_FINAL; 1,398 at Series B or later (566 already in final_tam, 832 from Jonah's list); 242 with funding still unknown. No outreach sent.
date: 2026-11-23
serves: none yet (plan/outcomes.md is still a skeleton)
---

## What ran

- Model: `infra/gtm-factory/models/tam-master-final.ts` (PR 7), loaded by hand from local scripts.
- Inputs: the 1,791 rows of `final_tam` and Jonah's spreadsheet "HydraDB GTM Data.xlsx" (tier 1 verified, tier 1 unverified and tier 2 firms; 1,706 unique after merging on the domain, 170 already in final_tam).
- Trigger: operator request on 2026-11-23.

## Funding waterfall

Each step only ran on what the previous ones left unknown.

| Step | Provider | Result |
| --- | --- | --- |
| 1 | Deepline: AI Ark company search | funding type for 117 of 563 final_tam unknowns (about 8 Deepline credits) |
| 2 | Deepline: Crustdata | 64 more round types; 166 with no recorded funding (about 6.5 credits) |
| 3 | Deepline: Aviato | 10 of the 35 highest-scoring leftovers (about 4 credits; Deepline then ran out) |
| 4 | Cargo: AI Ark | firmographics and funding for 941 of Jonah's 1,462 firms with a domain |
| 5 | Cargo: Apollo | 595 more matched; no funding rounds, flags public companies |
| 6 | Cargo: Parallel web research | 873 of 1,129 remaining unknowns resolved (about 280 Cargo credits) |
| 7 | Clay (last resort) | 14 of 44 checked resolved; stopped because most answers came back unknown |

## Headline result

| Funding stage | Companies |
| --- | --- |
| Series B or later | 1,398 |
| Earlier stage | 1,153 |
| No outside funding | 373 |
| Acquired | 146 |
| Unknown | 242 |

## Follow-ups started the same day

- 749 of Jonah's Series B-or-later firms sent to the ICP gate (`tam_candidates`, source `jonah_job_posts`).
- Contact finder run on 490 qualified Series B-or-later accounts in final_tam.
- YC check (`yc_checks`, filled from Bookface with the YC CLI) scheduled twice a day.

## Notes

- Acquired companies are marked separately, not as Series B or later.
- Jonah's firms are marked `icp_status = not_checked` until the gate scores them.
- Clay's standard "Latest Funding" data point returns only an amount, not the round type, so it cannot tell Series B from earlier rounds.
