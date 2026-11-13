import { defineModel } from "@cargo-ai/cdk";

import { httpIngest } from "../connectors";
import { modelsFolder } from "../folders";

// Companies whose engineers act on the GitHub repos Dayly watches (ours and
// competitors'). Filled from outside Cargo: a daily job reads Dayly and posts
// rows to this model's ingest URL. Expected keys per row: id, domain, company,
// readiness, signal, repos, people, icp_match, dayly_url, seen_at.
export const ossSignals = defineModel("oss_signals", {
  name: "oss_signals",
  connector: httpIngest,
  extractSlug: "listenHook",
  description:
    "GitHub (open source) signals from Dayly: companies starring, forking, opening issues or PRs on watched repos.",
  config: {},
  folder: modelsFolder,
});
