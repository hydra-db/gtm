import { defineBatch, defineWorkflow } from "@cargo-ai/cdk";
import { z } from "zod";

import { signalFeedInputs } from "../../infra/signal-feeds/models/signal-feed-inputs";
import { watchedRepos } from "../../infra/signal-feeds/settings";

// Writes the first rows of signal_feed_inputs: one per watched GitHub repo,
// and the one row that drives the job-post search. Free: one storage write
// per row, no connector call. From here on the model is the list to edit.
const seedRow = defineWorkflow(
  "seed_signal_feed_input",
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

export const seed = defineBatch("2026-11-24-seed-signal-feed-inputs", {
  workflow: seedRow,
  data: {
    kind: "form",
    records: [
      ...watchedRepos.map((entry) => ({
        key: `github:${entry.repo}`,
        feed: "github",
        value: entry.repo,
        kind: entry.kind,
      })),
      { key: "job_posts:theirstack", feed: "job_posts", value: "theirstack", kind: "search" },
    ],
  },
});
