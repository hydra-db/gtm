import { definePlay, defineWorkflow } from "@cargo-ai/cdk";
import { z } from "zod";

import { aiArk } from "../../tam-building-advanced/connectors/ai-ark";
import { playsFolder } from "../folders";
import { finalTam } from "../models/final-tam";
import { finalTamContacts } from "../models/final-tam-contacts";
import { firstEmail } from "../scripts/first-email";
import { pickContacts } from "../scripts/pick-contacts";

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

// For one final_tam account: search the buyer and champion titles at the
// company (0.05 per person returned, at most 12), keep up to four people, and
// look up a verified work email for each (0.1, nothing billed on a miss).
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
    uses: { aiArk },
    imports: {
      finalTamContacts,
      pickContacts,
      firstEmail,
      BUYER_AND_CHAMPION_TITLES,
    },
  },
  ({ input, uses, model }) => {
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
    }
    return { result: "done" };
  },
);

// Run by hand as a batch over the outreach-now accounts. Left switched off: a
// person decides when contacts are looked up for newly qualified accounts.
export const findFinalTamContacts = definePlay("final_tam_find_contacts", {
  name: "final_tam: find champion and buyer contacts",
  description:
    "For a final_tam account (tier 1, or 7 and up): find up to two economic buyers and two champions, with a verified work email where one exists.",
  folder: playsFolder,
  model: finalTam,
  workflow: findContacts,
  filter: {
    conjonction: "and",
    groups: [
      {
        conjonction: "or",
        conditions: [
          { kind: "number", columnSlug: "tier", operator: "is", value: 1 },
          {
            kind: "number",
            columnSlug: "icp_score",
            operator: "greaterThan",
            value: 6,
          },
        ],
      },
    ],
  },
  isEnabled: false,
  runCreationRule: "once",
  changeKinds: ["added"],
});
