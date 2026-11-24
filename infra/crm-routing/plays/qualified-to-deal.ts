import { definePlay, defineWorkflow } from "@cargo-ai/cdk";
import { z } from "zod";

import { attio, attioApi } from "../connectors";
import { playsFolder } from "../folders";
import { engaged } from "../models/engaged";
import { dealPlan } from "../scripts/deal-plan";
import { readEntries } from "../scripts/read-entries";
import { readStage } from "../scripts/read-stage";
import { recordEntriesUrl } from "../scripts/record-entries-url";
import { routingCron } from "../settings";

// One person in Engaged: if their Stage is Qualified and they have no deal
// yet, create a Deal at Prospecting, owned by the Engaged entry's owner (or
// the default owner in settings.ts), linked to the person and their company.
const qualifiedToDeal = defineWorkflow(
  "crm_route_qualified_to_deal",
  {
    input: z.object({
      record_id: z.string(),
      name: z.string().optional(),
    }),
    output: z.object({ result: z.string() }),
    uses: { attio, attioApi },
    imports: { recordEntriesUrl, readEntries, readStage, dealPlan },
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
    if (!state.toDeal) {
      return { result: "not_qualified" };
    }
    const person = uses.attio.findRecord({ objectType: "people", id: input.record_id });
    const plan = dealPlan({ person, ownerId: state.ownerId });
    if (plan.hasDeal) {
      return { result: "deal_exists" };
    }
    uses.attio.insertRecord({ objectType: "deals", mappings: plan.mappings });
    return { result: "deal_created" };
  },
);

// Every 12 hours, every person in Engaged. Idempotent: a person with any deal
// already associated is skipped, so a deal a rep created by hand is not
// duplicated.
export const qualifiedToDealPlay = definePlay("crm_qualified_to_deal", {
  name: "Attio: Qualified -> Deal at Prospecting",
  description:
    "Every 12 hours: each Engaged person at Qualified with no deal gets a Deal at Prospecting, linked to them and their company.",
  folder: playsFolder,
  model: engaged,
  workflow: qualifiedToDeal,
  isEnabled: true,
  runCreationRule: "noConcurrency",
  changeKinds: ["added", "updated", "unchanged"],
  schedule: { type: "cron", cron: routingCron },
});
