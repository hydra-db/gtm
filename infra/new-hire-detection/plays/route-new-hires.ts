import { definePlay, defineWorkflow, toolRef } from "@cargo-ai/cdk";
import { z } from "zod";

import { emailChecks } from "../../daily-outreach/models/email-checks";
import { waterfall } from "../../gtm-factory/connectors";
import { playsFolder } from "../../gtm-factory/folders";
import { finalTamContacts } from "../../gtm-factory/models/final-tam-contacts";
import { tamCandidates } from "../../gtm-factory/models/tam-candidates";
import { linkedin } from "../../tam-building-advanced/connectors/linkedin";
import { newHireSignals } from "../models/new-hire-signals";
import { newHires } from "../models/new-hires";
import { foundEmail } from "../scripts/found-email";
import { newHireCompany } from "../scripts/new-hire-company";
import { newHireLead } from "../scripts/new-hire-lead";
import { maxStartAgeDays, routeCron, titleKeywords } from "../settings";

// Cargo's "Find work email from LinkedIn URL" waterfall tool (0.5 to 3
// credits, input `linkedinUrl`, output `email`).
const findWorkEmail = toolRef<{ email?: string }>("a045fc36-9e79-40f7-9f06-2330ccee6ec0");

// One person the daily search added:
//
//   no keyword in the title, or a role started more than 30 days ago,
//   or no LinkedIn URL / company   -> skipped, free
//   already in new_hire_signals    -> seen, free
//   company with no domain         -> new_hire_signals row only (no account
//                                     to attach it to), 0.25
//   otherwise                      -> new_hire_signals row (an account event),
//                                     the company to tam_candidates for the
//                                     account-scoring tier, the person to
//                                     final_tam_contacts as role `signal`, a
//                                     work email found (0.5 to 3) and verified
//                                     into email_checks (0.1)
//
// Nothing is posted and nothing is sent. Daily outreach drafts for the
// person once the account is on the working list and their email is valid.
const routeNewHire = defineWorkflow(
  "new_hire_detection_route_workflow",
  {
    // The `fetchLeadSearch` columns read here.
    input: z.object({
      linkedin_profile_url: z.string().optional(),
      sales_navigator_company_url: z.string().optional(),
      full_name: z.string().optional(),
      first_name: z.string().optional(),
      last_name: z.string().optional(),
      job_title: z.string().optional(),
      company_name: z.string().optional(),
      current_company: z.string().optional(),
      tenure_start: z.string().optional(),
      location: z.string().optional(),
    }),
    output: z.object({ result: z.string() }),
    uses: { linkedin, waterfall, findWorkEmail },
    imports: {
      newHireSignals,
      tamCandidates,
      finalTamContacts,
      emailChecks,
      newHireLead,
      newHireCompany,
      foundEmail,
      titleKeywords,
      maxStartAgeDays,
    },
  },
  ({ input, uses, model }) => {
    const lead = newHireLead({
      row: input,
      keywords: titleKeywords,
      maxStartAgeDays,
    });
    if (!lead.route) {
      return { result: "skipped" };
    }

    const seen = model.search({
      modelUuid: newHireSignals.uuid,
      filter: {
        conjonction: "and",
        groups: [
          {
            conjonction: "and",
            conditions: [
              { kind: "string", columnSlug: "key", operator: "is", values: [lead.key] },
            ],
          },
        ],
      },
      limit: 1,
    });
    if (seen.length > 0) {
      return { result: "seen" };
    }

    const enriched = uses.linkedin.enrichCompany({
      linkedinUrl: input.sales_navigator_company_url || "",
    });
    const company = newHireCompany({
      domain: enriched.domain,
      website: enriched.website,
      name: enriched.company_name || lead.company,
    });

    model.upsert({
      modelUuid: newHireSignals.uuid,
      matchingColumnSlug: "key",
      matchingValue: lead.key,
      mappings: [
        { columnSlug: "key", value: lead.key },
        { columnSlug: "person_name", value: lead.full_name },
        { columnSlug: "title", value: lead.title },
        { columnSlug: "linkedin_url", value: lead.linkedin_url },
        { columnSlug: "company", value: company.name },
        { columnSlug: "domain", value: company.domain },
        { columnSlug: "started_at", value: lead.started_at },
        { columnSlug: "keyword", value: lead.keyword },
        { columnSlug: "detected_at", value: new Date() },
      ],
    });
    if (company.domain === "") {
      return { result: "no_domain" };
    }

    model.upsert({
      modelUuid: tamCandidates.uuid,
      matchingColumnSlug: "key",
      matchingValue: company.key,
      mappings: [
        { columnSlug: "key", value: company.key },
        { columnSlug: "name", value: company.name },
        { columnSlug: "domain", value: company.domain },
        { columnSlug: "signal_source", value: "new_hire" },
        { columnSlug: "signal_detail", value: lead.title },
        { columnSlug: "last_signal_at", value: new Date() },
      ],
    });

    const found = uses.findWorkEmail({ linkedinUrl: lead.linkedin_url });
    const email = foundEmail({ email: found.email });
    model.upsert({
      modelUuid: finalTamContacts.uuid,
      matchingColumnSlug: "key",
      matchingValue: lead.key,
      mappings: [
        { columnSlug: "key", value: lead.key },
        { columnSlug: "account_domain", value: company.domain },
        { columnSlug: "company", value: company.name },
        { columnSlug: "role", value: "signal" },
        { columnSlug: "full_name", value: lead.full_name },
        { columnSlug: "first_name", value: lead.first_name },
        { columnSlug: "last_name", value: lead.last_name },
        { columnSlug: "title", value: lead.title },
        { columnSlug: "linkedin_url", value: lead.linkedin_url },
        { columnSlug: "email", value: email.email },
        { columnSlug: "location", value: lead.location },
        { columnSlug: "found_at", value: new Date() },
      ],
    });
    if (email.email === "") {
      return { result: "no_email" };
    }

    const check = uses.waterfall.verifyEmail({ email: email.email });
    model.upsert({
      modelUuid: emailChecks.uuid,
      matchingColumnSlug: "email",
      matchingValue: email.email,
      mappings: [
        { columnSlug: "email", value: email.email },
        { columnSlug: "email_status", value: check.email_status },
        { columnSlug: "smtp_provider", value: check.smtp_provider },
        { columnSlug: "provider", value: "cargo_waterfall" },
        { columnSlug: "checked_at", value: new Date() },
      ],
    });
    return { result: "routed" };
  },
);

// Each person the daily search adds, once, 30 minutes after the sync.
// `changeKinds: ["added"]` is what makes a person routed once: the model
// re-extracts the whole search on every sync, and only people new to it
// create a run (the new_hire_signals lookup above is the second guard).
// Cron, not watch: `fetchLeadSearch` is a fetch-mode extractor.
export const routeNewHires = definePlay("new_hire_detection_route", {
  name: "New-hire detection: route new hires",
  description:
    "Each US person who just started a context graph, knowledge graph, ontology or agent memory role: a new_hire_signals account event, the company to tam_candidates, and the person to final_tam_contacts (role signal) with a verified work email.",
  folder: playsFolder,
  model: newHires,
  workflow: routeNewHire,
  isEnabled: true,
  runCreationRule: "once",
  changeKinds: ["added"],
  schedule: { type: "cron", cron: routeCron },
});
