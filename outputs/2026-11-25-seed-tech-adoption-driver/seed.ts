import { defineBatch, defineWorkflow } from "@cargo-ai/cdk";
import { z } from "zod";

import { signalFeedInputs } from "../../infra/signal-feeds/models/signal-feed-inputs";

// The one signal_feed_inputs row the weekly tech-adoption search runs over
// (feed "tech_adoption"). Free: one storage write. Removing the row stops the
// play as surely as switching it off.
const seedRow = defineWorkflow(
  "seed_tech_adoption_driver",
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

export const seed = defineBatch("2026-11-25-seed-tech-adoption-driver", {
  workflow: seedRow,
  data: {
    kind: "form",
    records: [{ key: "tech_adoption:theirstack", feed: "tech_adoption", value: "theirstack", kind: "weekly" }],
  },
});
