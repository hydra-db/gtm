// The settings an operator changes without touching the agent.

// TODO(operator): the findings channel. The plan was `#gtm-alerts`, and no
// channel by that name exists in the Slack workspace (checked through the
// Slack connector's listChannels autocomplete on 2026-11-24). Create it,
// invite the Cargo app to it (getConversationHistory cannot read a channel the
// app is not in), and put its id (C...) here, not its name. One constant locks
// both the post and the read-back: the agent remembers what it already
// reported by reading its own earlier posts there.
export const healthChannelId = "TODO_GTM_ALERTS_CHANNEL_ID";

// Off until the channel above is real and the operator says yes. While false,
// the agent is deployed with no trigger, so it never runs on its own and bills
// nothing. Set it to true to add the daily cron below.
export const dailyRunEnabled = false;

// 14:00 UTC: early morning in the Americas, afternoon in Europe, before most
// teams' first review of the day.
export const dailyCron = "0 14 * * *";
