---
title: Competitor sales reps engaging with a target account's LinkedIn posts
description: Reps from graph and vector database vendors liking or commenting on posts by technical people at target accounts, tiered Warm, Hot, Super and CEO lead.
confidence: hypothesis
references:
  - icp/hydradb
  - motion/signal-feedback-outreach
  - persona/ai-engineering-leader
---

_confidence: hypothesis (we think so) | validated (seen twice, independently) |
proven (measured, repeatable). Outreach plays may only cite validated or proven
files. Start at hypothesis and earn the upgrade._

## Source

LinkedIn engagement data, scanned by an internal agent (Internal: team discussion, 2026-11-09).

## Definition

"A sales rep at a tracked competitor engaging on LinkedIn with a post by someone at a target account." Logged engagement types: liked, celebrated, loved, found insightful, commented, reacted to a comment. Engagement on posts by non-technical authors or competitors is dropped. Tracked vendors are graph and vector database companies; the roster runs to a few hundred reps.

Tiers: Warm (one competitor reached 1 person); Hot (one competitor reached 2+ people in 30 days); Super (2 different competitors at the same account, or a competitor CEO plus another rep from that competitor); CEO lead (competitor CEO engaged, no other rep in 90 days; watched about 30 days).

## Weight

medium (thresholds are "observed" from output, not from code)

## ICP fit

- [[icp/hydradb]]

## Recommended play

- None written yet. Candidate: [[motion/signal-feedback-outreach]] using the target person's own post as the dated signal.

## Why it matters

A competitor's rep working an account suggests the account is evaluating graph or vector infrastructure now. Recurring reasons attached to strong signals: a new senior hire joining, a buyer posting on agents, context, knowledge graphs, GraphRAG or retrieval, a leader hiring for AI or data roles, a shipped production build.

Merged from staging: gtm/signal/competitor-rep-linkedin-engagement.

## False positives

- Reps liking posts from friends or former colleagues with no deal in play.
- The largest graph database vendor's rep roster dominates volume.
