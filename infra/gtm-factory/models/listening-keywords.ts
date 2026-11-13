import { defineModel } from "@cargo-ai/cdk";

import { modelsFolder } from "../folders";

// What the daily listening play searches for: one row per keyword and platform.
// Add or remove a row to change what is listened to; no deploy needed.
export const listeningKeywords = defineModel("listening_keywords", {
  name: "listening_keywords",
  kind: "native",
  extractSlug: "defineCustom",
  description:
    "Keywords the daily social listening play searches on LinkedIn and X. kind is keyword (ICP language) or competitor.",
  config: {
    columns: [
      { slug: "key", type: "string" },
      { slug: "keyword", type: "string" },
      { slug: "platform", type: "string" },
      { slug: "kind", type: "string" },
    ],
  },
  folder: modelsFolder,
});
