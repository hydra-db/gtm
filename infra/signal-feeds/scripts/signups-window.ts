import { defineScript } from "@cargo-ai/cdk";

import { signupsLookbackHours } from "../settings";

// The window one read of #signups covers, as Slack `ts` values. A backfill
// passes its own; the 12-hourly read takes the last `signupsLookbackHours`.
export const signupsWindow = defineScript(
  async ({ oldest, latest }: { oldest?: string; latest?: string }) => {
    const now = Date.now() / 1000;
    return {
      oldest: oldest || String(Math.floor(now - signupsLookbackHours * 3600)),
      latest: latest || String(Math.ceil(now)),
    };
  },
);
