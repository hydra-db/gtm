// The settings an operator changes without touching the graph. The score
// columns, the segments and the play are all generated from them, so edit here,
// run `cargo-ai project plan`, and read what moved.

// What each signal is worth on the day it lands, and how many days it takes to
// lose half of that. The key is the event's signal type: a `signal_type` in the
// Account Events `properties` when the source sets one, else the slug of the
// model it came from. Every source here is first-party and sets none, so the
// keys are model slugs. An event whose key is not listed here weighs nothing: a
// new model must not move a score until someone has decided what it is worth.
//
// Set by the operator on 2026-11-24. No Cargo Signals type key: the Cargo
// Signals feeds (infra/signal-feeds) are copied into their own signal models,
// which carry no signal_type, so every key here is a model slug.
export const signals: Record<string, { weight: number; halfLifeDays: number }> =
  {
    // Job posts naming graph, memory or context work (theirStack).
    job_post_signals: { weight: 8, halfLifeDays: 21 },
    // A new CTO, VP Eng or Head of AI at a working-list company (Cargo Signals).
    job_switch_signals: { weight: 7, halfLifeDays: 30 },
    // GitHub activity on watched repos: Dayly's feed, then signal-feeds' own.
    oss_signals: { weight: 5, halfLifeDays: 14 },
    github_signals: { weight: 5, halfLifeDays: 14 },
    // LinkedIn and X posts on a listening keyword.
    social_listening: { weight: 4, halfLifeDays: 14 },
    // Engagement with competitors' and their CEOs' LinkedIn posts, and our
    // founder's new connections (Cargo Signals).
    linkedin_engagement_signals: { weight: 4, halfLifeDays: 14 },
    // Reddit and Hacker News posts that name their company.
    reddit_hn_signals: { weight: 3, halfLifeDays: 14 },
    // Company engineering blog posts on a listening keyword (Exa).
    blog_signals: { weight: 3, halfLifeDays: 21 },
    // A company seen on hydradb.com (Snitcher, "website visitors hydradb").
    website_visitors: { weight: 2, halfLifeDays: 7 },
  };

// The score lines. A score at or above `readyThreshold` is `ready_now`, the
// segment the play routes from; at or above `warmingThreshold` it is
// `warming`. Both are in the same unit as the weights: with the weights above,
// one fresh job post alone is ready, and one fresh post on LinkedIn or X is
// warming.
//
// PLACEHOLDER until the pilot: reset them from the score distribution the pilot
// query returns (.agents/skills/readiness-scoring/references/run.md).
export const readyThreshold = 8;
export const warmingThreshold = 4;

// How far back an event counts. Older events contribute 0, which keeps a
// stale event from holding a score up by a rounding error. Three half-lives
// of the slowest signal leaves an event at an eighth of its weight, which no
// threshold above should hinge on.
export const horizonDays =
  3 * Math.max(...Object.values(signals).map((signal) => signal.halfLifeDays));
