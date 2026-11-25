import { defineBatch } from "@cargo-ai/cdk";

import { readSignups } from "../../infra/signal-feeds/plays/signups";

// The last 30 days of #signups, once, one read per day (a day is well under
// the 200-message read limit). Every signup lands in the signups model; the
// routing play skips any signup older than 48 hours, so only the last two
// days reach #sales. 0 credits: Slack reads and storage writes.
const DAY = 86400;
const end = Math.floor(Date.parse("2026-11-26T00:00:00Z") / 1000);
const windows = Array.from({ length: 31 }, (_, index) => ({
  value: "#signups",
  oldest: String(end - (index + 1) * DAY),
  latest: String(end - index * DAY),
}));

export const backfill = defineBatch("2026-11-25-signups-feed-backfill", {
  workflow: readSignups,
  data: { kind: "form", records: windows },
});
