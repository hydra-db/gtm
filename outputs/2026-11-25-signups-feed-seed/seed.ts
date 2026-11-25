import { defineBatch, defineWorkflow } from "@cargo-ai/cdk";
import { z } from "zod";

import { signalFeedInputs } from "../../infra/signal-feeds/models/signal-feed-inputs";

// The one signal_feed_inputs row the 12-hourly #signups read runs over.
const seedRow = defineWorkflow(
  "seed_signups_feed_input",
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

export const seed = defineBatch("2026-11-25-signups-feed-seed", {
  workflow: seedRow,
  data: {
    kind: "form",
    records: [{ key: "signups:slack", feed: "signups", value: "#signups", kind: "slack" }],
  },
});
