import { definePlay, defineWorkflow } from "@cargo-ai/cdk";
import { z } from "zod";

import { playsFolder } from "../../gtm-factory/folders";
import { tamCandidates } from "../../gtm-factory/models/tam-candidates";
import { slack } from "../../shared/connectors/slack";
import { newDecisionMakers } from "../models/cargo-signals";
import { jobSwitchSignals } from "../models/job-switch-signals";
import { readSignalLead } from "../scripts/signal-lead";
import { gtmEngineChannelId } from "../settings";

// One new decision-maker at a working-list company: a job_switch_signals row,
// the company to the ICP gate (already scored companies keep their verdict),
// and one line in #gtm-engine. Every lead here is a fit by construction: the feed
// watches only the working list and only decision-maker titles.
const routeJobSwitch = defineWorkflow(
  "signal_feeds_job_switch_workflow",
  {
    input: z.object({
      id: z.string(),
      signal_name: z.string().optional(),
      signal_type: z.string().optional(),
      last_signal: z.string().optional(),
      last_signal_date: z.string().optional(),
      contact: z.any().optional(),
      company: z.any().optional(),
    }),
    output: z.object({ result: z.string() }),
    uses: { slack },
    imports: { jobSwitchSignals, tamCandidates, readSignalLead, gtmEngineChannelId },
  },
  ({ input, uses, model }) => {
    const lead = readSignalLead({
      id: input.id,
      contact: input.contact,
      company: input.company,
      signalName: input.signal_name || input.signal_type || "",
      lastSignal: input.last_signal || "",
      lastSignalDate: input.last_signal_date || "",
    });
    model.upsert({
      modelUuid: jobSwitchSignals.uuid,
      matchingColumnSlug: "key",
      matchingValue: lead.key,
      mappings: [
        { columnSlug: "key", value: lead.key },
        { columnSlug: "person_name", value: lead.person_name },
        { columnSlug: "person_title", value: lead.person_title },
        { columnSlug: "person_url", value: lead.person_url },
        { columnSlug: "company_name", value: lead.company_name },
        { columnSlug: "company_domain", value: lead.company_domain },
        { columnSlug: "company_linkedin_url", value: lead.company_linkedin_url },
        { columnSlug: "detail", value: lead.detail },
        { columnSlug: "occurred_at", value: lead.occurred_at },
        { columnSlug: "seen_at", value: new Date() },
      ],
    });
    if (lead.known) {
      model.upsert({
        modelUuid: tamCandidates.uuid,
        matchingColumnSlug: "key",
        matchingValue: lead.candidate_key,
        mappings: [
          { columnSlug: "key", value: lead.candidate_key },
          { columnSlug: "name", value: lead.company_name },
          { columnSlug: "domain", value: lead.company_domain },
          { columnSlug: "linkedin_url", value: lead.company_linkedin_url },
          { columnSlug: "signal_source", value: "job_switch_signals" },
          { columnSlug: "signal_detail", value: lead.detail },
          { columnSlug: "last_signal_at", value: new Date() },
        ],
      });
    }
    uses.slack.postMessage({
      channelId: gtmEngineChannelId,
      format: "markdown",
      disableUnfurling: true,
      body: `*New decision-maker at ${lead.company_name}*: ${lead.person_name}, ${lead.person_title}\n${lead.person_url}\n${lead.detail}\nOn the working list. A new CTO, VP Eng or Head of AI re-evaluates the stack in their first 90 days.`,
    });
    return { result: "posted" };
  },
);

// Each new lead the job-switch feed delivers, every hour at :33. The play
// costs nothing; the feed bills when it delivers (settings.ts).
export const jobSwitchesToSales = definePlay("signal_feeds_job_switches", {
  name: "Signal feeds: job switches to #gtm-engine",
  description:
    "Each new decision-maker Cargo Signals finds at a working-list company: a job_switch_signals row, the company to the ICP gate, and a line in #gtm-engine.",
  folder: playsFolder,
  model: newDecisionMakers,
  workflow: routeJobSwitch,
  schedule: { type: "cron", cron: "33 * * * *" },
  isEnabled: true,
  runCreationRule: "once",
  changeKinds: ["added"],
});
