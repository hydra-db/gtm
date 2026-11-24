---
title: Retrieved is not read; the answer model drops the right document half the time
description: A pilot eval (2026-09-04) found the gold document in the retrieved set 96% of the time, yet wrong answers came from the model only reading the top 12 chunks. Chat threads, where later messages override earlier ones, were hit hardest.
confidence: hypothesis
references:
  - insight/2026-07-26-fast-mode-beats-thinking-mode
  - insight/2026-11-20-similar-wording-is-not-applicability
  - objection/vector-search-is-enough
---

## Claim

Many "retrieval failures" in agent context are not retrieval failures. The right document was found and
then cut before the model read it. Conversational sources, where the latest message overrides earlier
ones, suffer most.

## Evidence

Applied AI eval write-up (Internal: engineering notes, 2026-09-04):
- "the answer model was only reading the top 12 chunks (~9 docs, ~26k chars), on the wrong answers the
  gold doc was inside that window only so ~half the time even though it was in the retrieved set 96% of
  the time"
- Chat threads were the worst hit: later messages that overrode earlier values were getting cut, and
  chat-only questions scored 21/100.
- "switching to thinking alone moved recall@10 from ~90 to ~97 & semantic qs from 42 to 94 on the pilot"
- The judge zeroed completeness if a single fact-check call failed (2 questions scored 0 that rejudged to
  100). Eval harnesses have bugs too.

Numbers are from one pilot eval, approximate as written.

## Implication

Sell and build around what the agent actually reads, including recency and supersession (the newer message
wins), not only recall.

## Use in messaging

Post hook: "Our retrieval found the right document 96% of the time. The agent still got it wrong."
"Thinking" is HydraDB's retrieval mode name; explain it as a slower, deeper retrieval mode. Do not name
the pilot account.
