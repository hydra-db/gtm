import { defineModel } from "@cargo-ai/cdk";

import { attio } from "../connectors";
import { modelsFolder } from "../folders";
import { engagedListSlug, engagedSyncCron } from "../settings";

// The people in the Attio list Engaged: one row per person with a reply. The
// extractor returns the parent People record (name, emails, company,
// associated deals), not the entry's own values, so the plays read Stage from
// Attio's API per person (`../connectors`). Synced every 12 hours.
export const engaged = defineModel("attio_engaged", {
  name: "Attio Engaged",
  connector: attio,
  extractSlug: "fetchListRecords",
  config: { objectId: "people", listId: engagedListSlug },
  schedule: { type: "cron", cron: engagedSyncCron },
  folder: modelsFolder,
});
