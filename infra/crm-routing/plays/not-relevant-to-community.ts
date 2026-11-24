import { definePlay, defineWorkflow } from "@cargo-ai/cdk";
import { z } from "zod";

import { attioApi } from "../connectors";
import { playsFolder } from "../folders";
import { engaged } from "../models/engaged";
import { communityEntry } from "../scripts/community-entry";
import { readEntries } from "../scripts/read-entries";
import { readStage } from "../scripts/read-stage";
import { recordEntriesUrl } from "../scripts/record-entries-url";
import { routingCron } from "../settings";

// One person in Engaged: if their Stage is Not now or Not interested and they
// are not in Community & events yet, add them there at Invited, with source
// "Engaged: <stage>". Never moves or edits an entry that already exists, so a
// person a human moved to Attending stays at Attending.
const routeToCommunity = defineWorkflow(
  "crm_route_not_relevant_to_community",
  {
    input: z.object({
      record_id: z.string(),
      name: z.string().optional(),
    }),
    output: z.object({ result: z.string() }),
    uses: { attioApi },
    imports: { recordEntriesUrl, readEntries, readStage, communityEntry },
  },
  ({ input, uses }) => {
    const entriesUrl = recordEntriesUrl({ recordId: input.record_id });
    const entries = uses.attioApi.call({ url: entriesUrl.url, method: "get" });
    const found = readEntries({ response: entries });
    if (!found.inEngaged) {
      return { result: "not_in_engaged" };
    }
    const entry = uses.attioApi.call({ url: found.engagedEntryUrl, method: "get" });
    const state = readStage({ response: entry });
    if (!state.toCommunity) {
      return { result: "stage_not_routed" };
    }
    if (found.inCommunity) {
      return { result: "already_in_community" };
    }
    const body = communityEntry({ recordId: input.record_id, stage: state.stage });
    uses.attioApi.call({
      url: body.url,
      method: "post",
      // The http connector's JSON body fields are in its action schema but not
      // in the generated types yet.
      // @ts-expect-error bodyFormat and bodyJson are untyped
      bodyFormat: "json",
      bodyJson: body.json,
    });
    return { result: "added_to_community" };
  },
);

// Every 12 hours, every person in Engaged (`unchanged` included, because a
// Stage change in Attio does not change the model row). Idempotent: a person
// already in Community & events is skipped. Removing someone from Community
// while their Engaged stage is still Not now or Not interested brings them
// back at the next run: move the Engaged stage too.
export const notRelevantToCommunity = definePlay("crm_not_relevant_to_community", {
  name: "Attio: Not now / Not interested -> Community & events",
  description:
    "Every 12 hours: each Engaged person at Not now or Not interested who is not in Community & events is added there at Invited.",
  folder: playsFolder,
  model: engaged,
  workflow: routeToCommunity,
  isEnabled: true,
  runCreationRule: "noConcurrency",
  changeKinds: ["added", "updated", "unchanged"],
  schedule: { type: "cron", cron: routingCron },
});
