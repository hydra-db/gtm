// The settings an operator changes without touching the agent.

// The findings channel: #sales (C0BJY52BUTZ), operator decision on
// 2026-11-24. The plan was `#gtm-alerts`, which does not exist in the Slack
// workspace. An id (C...), not a name. One constant locks both the post and
// the read-back: the agent remembers what it already reported by reading its
// own earlier posts there, and the Cargo app must be in the channel for that
// read to work.
export const healthChannelId = "C0BJY52BUTZ";

// Switched on 2026-11-24 (operator: "close the loops"). Set to false to drop
// the daily cron; the agent stays deployed and never runs on its own.
export const dailyRunEnabled = true;

// 14:00 UTC: early morning in the Americas, afternoon in Europe, before most
// teams' first review of the day.
export const dailyCron = "0 14 * * *";
