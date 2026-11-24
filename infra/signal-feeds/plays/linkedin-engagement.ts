import { definePlay, defineWorkflow } from "@cargo-ai/cdk";
import { z } from "zod";

import { playsFolder } from "../../gtm-factory/folders";
import { tamCandidates } from "../../gtm-factory/models/tam-candidates";
import {
  competitorCeoEngagement,
  competitorPageEngagement,
  founderNetworkConnections,
} from "../models/cargo-signals";
import { linkedinEngagementSignals } from "../models/linkedin-engagement-signals";
import { readSignalLead } from "../scripts/signal-lead";

const leadInput = z.object({
  id: z.string(),
  signal_name: z.string().optional(),
  signal_type: z.string().optional(),
  last_signal: z.string().optional(),
  last_signal_date: z.string().optional(),
  contact: z.any().optional(),
  company: z.any().optional(),
});

// One delivered lead: a linkedin_engagement_signals row and, when the lead
// names a company, that company to the ICP gate. `feed` says which of the
// three feeds delivered it.
const copyLead = (slug: string) =>
  defineWorkflow(
    slug,
    {
      input: leadInput,
      output: z.object({ result: z.string() }),
      imports: { linkedinEngagementSignals, tamCandidates, readSignalLead },
    },
    ({ input, model }) => {
      const lead = readSignalLead({
        id: input.id,
        contact: input.contact,
        company: input.company,
        signalName: input.signal_name || input.signal_type || "",
        lastSignal: input.last_signal || "",
        lastSignalDate: input.last_signal_date || "",
      });
      model.upsert({
        modelUuid: linkedinEngagementSignals.uuid,
        matchingColumnSlug: "key",
        matchingValue: lead.key,
        mappings: [
          { columnSlug: "key", value: lead.key },
          { columnSlug: "feed", value: lead.signal_name },
          { columnSlug: "signal_name", value: lead.signal_name },
          { columnSlug: "detail", value: lead.detail },
          { columnSlug: "occurred_at", value: lead.occurred_at },
          { columnSlug: "person_name", value: lead.person_name },
          { columnSlug: "person_title", value: lead.person_title },
          { columnSlug: "person_url", value: lead.person_url },
          { columnSlug: "company_name", value: lead.company_name },
          { columnSlug: "company_domain", value: lead.company_domain },
          { columnSlug: "company_linkedin_url", value: lead.company_linkedin_url },
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
            { columnSlug: "signal_source", value: "linkedin_engagement_signals" },
            { columnSlug: "signal_detail", value: lead.detail },
            { columnSlug: "last_signal_at", value: new Date() },
          ],
        });
        return { result: "proposed" };
      }
      return { result: "signal_only" };
    },
  );

// Each feed's new leads, every hour at :27. The plays cost nothing; the
// feeds bill when they deliver (settings.ts).
const common = {
  folder: playsFolder,
  schedule: { type: "cron" as const, cron: "27 * * * *" },
  isEnabled: true,
  runCreationRule: "once" as const,
  changeKinds: ["added" as const],
};

export const competitorPageEngagementToSignals = definePlay(
  "signal_feeds_competitor_page_engagement",
  {
    ...common,
    name: "Signal feeds: competitor page engagement to signals",
    description:
      "Each person Cargo Signals finds engaging with a competitor's LinkedIn page: a linkedin_engagement_signals row and their company to the ICP gate.",
    model: competitorPageEngagement,
    workflow: copyLead("signal_feeds_competitor_page_engagement_workflow"),
  },
);

export const competitorCeoEngagementToSignals = definePlay(
  "signal_feeds_competitor_ceo_engagement",
  {
    ...common,
    name: "Signal feeds: competitor CEO engagement to signals",
    description:
      "Each person Cargo Signals finds engaging with a competitor CEO's LinkedIn posts: a linkedin_engagement_signals row and their company to the ICP gate.",
    model: competitorCeoEngagement,
    workflow: copyLead("signal_feeds_competitor_ceo_engagement_workflow"),
  },
);

export const founderConnectionsToSignals = definePlay(
  "signal_feeds_founder_connections",
  {
    ...common,
    name: "Signal feeds: founder's new connections to signals",
    description:
      "Each new LinkedIn connection of Nishkarsh that Cargo Signals delivers: a linkedin_engagement_signals row and their company to the ICP gate.",
    model: founderNetworkConnections,
    workflow: copyLead("signal_feeds_founder_connections_workflow"),
  },
);
