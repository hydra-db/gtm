import { definePlay, defineWorkflow } from "@cargo-ai/cdk";
import { z } from "zod";

import { emailChecks } from "../../daily-outreach/models/email-checks";
import { aiArk } from "../../tam-building-advanced/connectors/ai-ark";
import { waterfall } from "../connectors";
import { playsFolder } from "../folders";
import { enterpriseParked } from "../models/enterprise-parked";
import { finalTamContacts } from "../models/final-tam-contacts";
import { tamMasterFinal } from "../models/tam-master-final";
import { firstEmail } from "../scripts/first-email";
import { pickContacts } from "../scripts/pick-contacts";

// The most companies one daily tick looks up. At about 0.5 credits a company
// (more when all four people have an email to verify), 15 keeps it near 8 to
// 20 credits a day.
const dailyContactLimit = 15;

const BUYER_AND_CHAMPION_TITLES = [
  "CTO",
  "Chief Technology Officer",
  "Co-Founder",
  "VP Engineering",
  "Head of Engineering",
  "Head of AI",
  "AI Platform",
  "Staff Engineer",
  "Principal Engineer",
  "Member of Technical Staff",
  "Machine Learning Engineer",
  "Director of Engineering",
];

// For one working-list account: skip it for free when it is in
// enterprise_parked, else search the buyer and champion titles at the company
// (0.05 per person returned, at most 12), keep up to four people, look up a
// work email for each (0.1, nothing billed on a miss), and verify every email
// found with the Cargo waterfall (0.1), writing the result to email_checks:
// daily outreach drafts only for addresses that are `valid` there.
const findContacts = defineWorkflow(
  "final_tam_find_contacts_workflow",
  {
    input: z.object({
      domain: z.string(),
      name: z.string().optional(),
    }),
    output: z.object({
      result: z.string(),
    }),
    uses: { aiArk, waterfall },
    imports: {
      enterpriseParked,
      emailChecks,
      finalTamContacts,
      pickContacts,
      firstEmail,
      BUYER_AND_CHAMPION_TITLES,
    },
  },
  ({ input, uses, model }) => {
    // Public companies and F500s are parked out of the working list. A free
    // native lookup before any paid node (a play filter cannot read another
    // model).
    const parked = model.search({
      modelUuid: enterpriseParked.uuid,
      filter: {
        conjonction: "and",
        groups: [
          {
            conjonction: "and",
            conditions: [
              {
                kind: "string",
                columnSlug: "domain",
                operator: "is",
                values: [input.domain],
              },
            ],
          },
        ],
      },
      limit: 1,
    });
    if (parked.length > 0) {
      return { result: "parked" };
    }

    const people = uses.aiArk.searchPeople({
      companyInfo: { domain_or: input.domain },
      jobRole: { title_or: BUYER_AND_CHAMPION_TITLES },
      limit: 12,
    });
    const picked = pickContacts({
      people,
      domain: input.domain,
      company: input.name || "",
    });
    for (const contact of picked.contacts as unknown as Iterable<
      (typeof picked.contacts)[number]
    >) {
      const enriched = uses.aiArk.enrichPerson({
        linkedinUrl: contact.linkedin_url,
      });
      const email = firstEmail({ email: enriched.email });
      model.upsert({
        modelUuid: finalTamContacts.uuid,
        matchingColumnSlug: "key",
        matchingValue: contact.key,
        mappings: [
          { columnSlug: "key", value: contact.key },
          { columnSlug: "account_domain", value: contact.account_domain },
          { columnSlug: "company", value: contact.company },
          { columnSlug: "role", value: contact.role },
          { columnSlug: "full_name", value: contact.full_name },
          { columnSlug: "first_name", value: contact.first_name },
          { columnSlug: "last_name", value: contact.last_name },
          { columnSlug: "title", value: contact.title },
          { columnSlug: "linkedin_url", value: contact.linkedin_url },
          { columnSlug: "email", value: email },
          { columnSlug: "location", value: contact.location },
          { columnSlug: "found_at", value: new Date() },
        ],
      });
      if (email !== "") {
        const check = uses.waterfall.verifyEmail({ email });
        model.upsert({
          modelUuid: emailChecks.uuid,
          matchingColumnSlug: "email",
          matchingValue: email,
          mappings: [
            { columnSlug: "email", value: email },
            { columnSlug: "email_status", value: check.email_status },
            { columnSlug: "smtp_provider", value: check.smtp_provider },
            { columnSlug: "provider", value: "cargo_waterfall" },
            { columnSlug: "checked_at", value: new Date() },
          ],
        });
      }
    }
    return { result: "done" };
  },
);

// Contacts for companies new to the working list: TAM_MASTER_FINAL rows at
// Series B or later (funding_stage B+) that passed the ICP gate (icp_status
// qualified) and are tiered A or B. The enterprise_parked exclusion is in the
// workflow. Once a day at 14:23 UTC (06:23 PST), before the daily outreach run
// at 16:13 UTC. With `changeKinds: ["added"]` a tick runs only rows that
// entered the filter since the last tick, and enabling it does not backfill
// the rows already there (the deploy creates the skipped "future changes
// only" batch first). `limit` caps a tick at 15 companies; `once` never runs
// the same company twice.
export const findFinalTamContacts = definePlay("final_tam_find_contacts", {
  name: "final_tam: find champion and buyer contacts",
  description:
    "For a company new to the working list (B+, qualified, tier A or B, not parked): find up to two economic buyers and two champions, with a work email verified into email_checks.",
  folder: playsFolder,
  model: tamMasterFinal,
  workflow: findContacts,
  filter: {
    conjonction: "and",
    groups: [
      {
        conjonction: "and",
        conditions: [
          {
            kind: "string",
            columnSlug: "funding_stage",
            operator: "is",
            values: ["B+"],
          },
          {
            kind: "string",
            columnSlug: "icp_status",
            operator: "is",
            values: ["qualified"],
          },
          {
            kind: "string",
            columnSlug: "custom__account_tier",
            operator: "is",
            values: ["A", "B"],
          },
        ],
      },
    ],
  },
  limit: dailyContactLimit,
  isEnabled: true,
  runCreationRule: "once",
  changeKinds: ["added"],
  schedule: { type: "cron", cron: "23 14 * * *" },
});
