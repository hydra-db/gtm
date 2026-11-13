# GTM factory

One ICP gate, fed by every source, producing one list to work: `final_tam`.

```
Bookface ─┐
Clay ─────┤
Cargo sourcing (Sales Navigator, AI Ark, Apollo, Exa, theirStack) ─┤
social_listening (LinkedIn and X posts, daily) ─┼─► tam_candidates ─► ICP gate ─► final_tam
oss_signals (Dayly GitHub signals, daily) ──────┘        (staging)    (research      (score, tier)
                                                                       and score)
```

## The lists (Cargo models)

| Model | What it holds |
| --- | --- |
| `final_tam` | Companies that passed the gate: score out of 10, tier, use case, evidence, source. |
| `tam_candidates` | Every company any source proposed, with its verdict once scored. |
| `social_listening` | One row per LinkedIn or X post that matched a keyword, with the poster's company. |
| `oss_signals` | Companies acting on the GitHub repos Dayly watches. |
| `listening_keywords` | What the daily listening play searches for. Edit rows, no deploy needed. |

Segments on `final_tam`: `final_tam_outreach_now` (tier 1, or 7 and up) and
`final_tam_outreach_later` (the rest).

## The gate

Source of truth: `context/icp/hydradb.md`. One web research task per company
answers the schema in `settings.ts`; `scripts/score.ts` turns the answers into:

- **Status.** `qualified`, or the reason it is not: `disqualified` (vendor,
  RAG-only, lookup agent, services), `not_fit` (a must-have is missing),
  `outside_us`, `too_early` (under 10 people), `error` (research came back empty).
- **Score out of 10.** 3 agents decide across systems per tenant, 2 graph or
  memory hiring or tech, 2 Series B or later in the last 12 months, 1 Bay Area,
  1 context-graph or company-brain language, 1 warm path (a YC company).
- **Tier.** 1 is Bay Area with a graph or memory signal now. 2 is Bay Area
  without one yet. 3 is the rest in scope.

## What runs on its own

| Play | When | Spend |
| --- | --- | --- |
| Social listening | Daily, 13:23 UTC, every `listening_keywords` row | LinkedIn: 0.25 per search plus up to 2 profile lookups at 0.25. X: 0.02 per search. |
| ICP gate | Hourly at :17, rows with no verdict added since the last run | 0.25 per company |
| OSS signal to candidate | Hourly at :47, new `oss_signals` rows | none |

Caps are in `settings.ts`. To stop a play, set `isEnabled: false` and merge.

## Adding companies by hand

Insert a row into `tam_candidates` with `key` (the bare domain), `name`,
`domain` and `source`, and leave `status` empty. The gate scores it within the
hour.
