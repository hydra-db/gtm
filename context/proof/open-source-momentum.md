---
title: Open-source core momentum (Aug to Nov 2026)
description: GitHub star counts with dates and sources, #1 trending, hackathon and Discord numbers, open-glean, the AGPL-plan-to-ELv2 license change, pg_hydradb, the new engine as default, and external developers building on the OSS core.
confidence: validated
references:
  - global/company-timeline
  - global/product-and-pricing
  - global/linkedin-playbook
  - proof/launch-reach-and-social-proof
  - insight/2026-11-23-what-works-on-linkedin-and-x
---

_confidence: hypothesis (we think so) | validated (seen twice, independently) |
proven (measured, repeatable). Outreach motions may only cite validated or proven
files. Start at hypothesis and earn the upgrade._

_validated for the star trajectory and trending status: counts were reported by several different people in different channels (growth updates, the hackathon report, Nishkarsh's changelog edit), each later number consistent with the earlier ones. They are self-reported counts, not audited. The November lines are single reports._

## Type

metric

## Content

**Guardrail: do not describe star growth as organic.** Give counts with their dates. Verify the live count before posting.

### GitHub stars, hydra-db/hydradb (repo public 2026-08-12)

| Date | Count as posted | Source |
| --- | --- | --- |
| 2026-08-17 | "493 stars and 248 forks"; also reported as "500 Stars and 250 Forks" | Internal: team discussion |
| 2026-08-18 | 536 stars (with 758 hackathon registrations) | Internal: team discussion |
| 2026-08-19 | "613 stars, 303 forks, and 26 prs" | Internal: team discussion |
| 2026-08-20 | "1,000 done" | Internal: team discussion |
| 2026-08-25 | "we're at 1.2K" | Internal: team discussion |
| 2026-09-02 | "2K stars" | Internal: team discussion |
| 2026-09-23 | "5,000+ stars on our Github" | Internal: team discussion |
| 2026-09-27 | "Our repo finally crossed 10,000 github stars!" | Internal: team discussion |
| 2026-10-04 | "This month our repository was the #1 trending project on GitHub, and it has over 12,000 stars." | Internal: team discussion |

Trending: a trendshift "#1 repo of the day badge" was proposed for the website (2026-09-28); "we were trending on Github!" (2026-09-29). No star, download or contributor counts appear in internal notes after 2026-10-04.

Context for the arc: on 2026-06-30 the team "Confirmed product is not open source"; the AGPL plan was set at the 2026-07-24/25 all-hands; the repo went public 2026-08-12 and passed 10,000 stars about six weeks later.

### Hack Hydra hackathon (2026-08-12 to 2026-08-20)

On 2026-08-19: "Hackathon Registrations: 792 (received 40 submissions)", "X & LinkedIn mentions and hydradb related posts: 133", "X followers: 350+ increase (after hackathon started)", "Discord community: 359 new members added (before hackathon: 832, currently: 1189)". Problem statements had to "showcase why graphs are useful v. simple vector search" and "result in working products, not just benchmark notebooks" (growth update, 2026-08-10). An earlier US to India parallel hackathon ran "9pm to 2:30am (yes) | saturday | $500 up for grabs" (2026-04-03).

### More open-source projects

- open-glean, "Glean, but open sourced" (2026-09-17).
- selfgraph, the agent graph framework, on GitHub by 2026-11-17 (see [[global/product-and-pricing]]).

### October to November 2026

- 2026-10-23: v0.3 public release prepared.
- 2026-10-28: Cypher test suite "Restructured and expanded", following "the same generalized, layered structure as the GQL test suite"; extended openCypher TCK run on the experimental engine.
- License: the July 2026 plan was "AGPL + commercial enterprise license, dual model" (2026-07-24). Changed to Elastic License v2 on 2026-11-03; "in the 0.4.0 release - please make sure that license is elastic license" (2026-11-09). Nishkarsh, 2026-11-15: "we switched licenses to make it people to adopt it easily. elv2 is better than agpl." ELv2 is current as of 2026-11-15.
- pg_hydradb Postgres extension "is ready" (2026-11-11); "pg_hydradb - is live in oss repo!" (2026-11-15).
- 2026-11-20: "The experimental engine is now the default. We are retiring the legacy engine." Nishkarsh: "Amazing".
- Community: Database Paper Reading sessions on Discord (one on "making the kv store from scratch", 2026-11-12). GitHub is the source of truth for issues; Discord #pr-discussion has one thread per PR; issues are reproduced on the latest released image before approval.
- 2026-11-23: "This guy decided to go super deep in our OSS" (an external developer's X post). 2026-11-24: "you should also see what people are building with hydradb" (Discord).
- Nishkarsh, 2026-11-04: "OSS marketing - which is working. It will always be a hit for a miss. But we can optimize."

### Do not use

"Our OSS ranked as the #1 choice of context database for agents" (2026-10-15) has no supporting source.

## Source

Internal: team discussion, 2026-04-03 to 2026-11-24 (growth updates, hackathon reports, engineering notes, founder notes).

## Client

None.

## Context

Supports "developers adopt HydraDB in the open" and the founder-decision story of the license switch (ELv2 over AGPL, for adoption). Frame stars as community momentum with dates, never as organic pull.

## Use cases

- Founder-decision post: why we moved from an AGPL plan to ELv2.
- "This week" post: we retired our legacy query engine / pg_hydradb is live.
- Community posts: paper-reading sessions, building a KV store from scratch, what external developers built.
- Milestone post: from closed source in June to #1 trending on GitHub by late September 2026.
