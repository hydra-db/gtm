import { defineModel } from "@cargo-ai/cdk";

import { modelsFolder } from "../../gtm-factory/folders";

// What the GitHub and job-post feeds run over: one row per thing to watch.
// feed "github": value is owner/repo and kind is own or primitive. feed
// "job_posts": one row, value "theirstack". Seeded once from settings.ts by
// outputs/2026-11-24-seed-signal-feed-inputs; add or remove a row here to
// change what is watched, no deploy needed.
export const signalFeedInputs = defineModel("signal_feed_inputs", {
  name: "signal_feed_inputs",
  kind: "native",
  extractSlug: "defineCustom",
  description:
    "What the GitHub (repos) and job-post feeds watch, one row per input. Edit rows to change what is watched.",
  config: {
    columns: [
      { slug: "key", type: "string" },
      { slug: "feed", type: "string" },
      { slug: "value", type: "string" },
      { slug: "kind", type: "string" },
    ],
  },
  folder: modelsFolder,
});
