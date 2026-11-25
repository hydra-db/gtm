import { defineBatch, defineWorkflow } from "@cargo-ai/cdk";
import { z } from "zod";

import { signalFeedInputs } from "../../infra/signal-feeds/models/signal-feed-inputs";

// Writes the one signal_feed_inputs row the daily outreach play runs over
// (feed "outreach"). Free: one storage write. Removing the row stops the play
// as surely as switching it off.
const seedRow = defineWorkflow(
  "seed_outreach_driver",
  {
    input: z.object({
      key: z.string(),
      feed: z.string(),
      value: z.string(),
      kind: z.string(),
    }),
    output: z.object({ result: z.string() }),
    imports: { signalFeedInputs },
  },
  ({ input, model }) => {
    model.upsert({
      modelUuid: signalFeedInputs.uuid,
      matchingColumnSlug: "key",
      matchingValue: input.key,
      mappings: [
        { columnSlug: "key", value: input.key },
        { columnSlug: "feed", value: input.feed },
        { columnSlug: "value", value: input.value },
        { columnSlug: "kind", value: input.kind },
      ],
    });
    return { result: "seeded" };
  },
);

export const seed = defineBatch("2026-11-24-seed-outreach-driver", {
  workflow: seedRow,
  data: {
    kind: "form",
    records: [{ key: "outreach:daily", feed: "outreach", value: "lemlist", kind: "daily" }],
  },
});
