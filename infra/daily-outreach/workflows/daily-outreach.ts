import { defineWorkflow } from "@cargo-ai/cdk";
import { z } from "zod";

import { outreachDrafter } from "../../gtm-factory/agents/outreach-drafter";
import { doNotContact } from "../../gtm-factory/models/do-not-contact";
import { finalTam } from "../../gtm-factory/models/final-tam";
import { finalTamContacts } from "../../gtm-factory/models/final-tam-contacts";
import { ycChecks } from "../../gtm-factory/models/yc-checks";
import { accountEvents } from "../../readiness-scoring/models/account-events";
import { accounts } from "../../readiness-scoring/models/accounts";
import { lemlist } from "../connectors";
import { emailChecks } from "../models/email-checks";
import { outreachEnrollments } from "../models/outreach-enrollments";
import { parseDraft } from "../scripts/parse-draft";
import { pickLeads } from "../scripts/pick-leads";
import { accountQueries } from "../scripts/account-queries";
import { contactQueries } from "../scripts/contact-queries";
import {
  dailyCap,
  lemlistCampaignId,
  maxPeoplePerAccount,
  senders,
  signalMaxAgeDays,
} from "../settings";

// One daily pass: pick up to `dailyCap` people (scripts/pick-leads.ts), draft
// each with the Outreach drafter, write the draft to the outreach_enrollments
// ledger, and, only when `lemlistCampaignId` is set, add the lead to that
// lemlist campaign with the draft as custom variables. Nothing is sent from
// here: lemlist sends only once the operator launches the sequence.
//
// `limit` overrides the cap for a test run (a batch over `{"limit": 2}`).
// Default export so `cargo-ai orchestration batch create --file` can run it.
const dailyOutreach = defineWorkflow(
  "daily_outreach_workflow",
  {
    input: z.object({
      key: z.string().optional(),
      limit: z.number().optional(),
    }),
    output: z.object({ result: z.string() }),
    uses: { drafter: outreachDrafter, lemlist },
    imports: {
      accounts,
      accountEvents,
      finalTam,
      finalTamContacts,
      emailChecks,
      doNotContact,
      ycChecks,
      outreachEnrollments,
      accountQueries,
      contactQueries,
      pickLeads,
      parseDraft,
      dailyCap,
      lemlistCampaignId,
      maxPeoplePerAccount,
      senders,
      signalMaxAgeDays,
    },
  },
  ({ input, uses, model }) => {
    // Working-list accounts, ready_now before warming, highest score first.
    const candidates = model.search({
      modelUuid: accounts.uuid,
      filter: {
        conjonction: "and",
        groups: [
          {
            conjonction: "and",
            conditions: [
              {
                kind: "string",
                columnSlug: "computed__on_working_list",
                operator: "is",
                values: ["yes"],
              },
              {
                kind: "string",
                columnSlug: "computed__readiness_stage",
                operator: "is",
                values: ["ready_now", "warming"],
              },
            ],
          },
        ],
      },
      sort: [
        { columnSlug: "computed__readiness_stage", kind: "asc" },
        { columnSlug: "metric__readiness_score", kind: "desc" },
      ],
      limit: 500,
      selectedColumnSlugs: [
        "id",
        "domain",
        "computed__readiness_stage",
        "metric__readiness_score",
      ],
    });
    const byAccount = accountQueries({ accounts: candidates });
    const contacts = model.search({
      modelUuid: finalTamContacts.uuid,
      filter: byAccount.contactFilter,
      limit: 2000,
    });
    const events = model.search({
      modelUuid: accountEvents.uuid,
      filter: byAccount.eventFilter,
      sort: [{ columnSlug: "occurred_at", kind: "desc" }],
      limit: 2000,
      selectedColumnSlugs: ["id", "account_id", "occurred_at", "model_slug", "properties"],
    });
    const companies = model.search({
      modelUuid: finalTam.uuid,
      filter: byAccount.companyFilter,
      limit: 2000,
      selectedColumnSlugs: ["domain", "name", "what_they_do", "use_case", "graph_evidence"],
    });
    const ledger = model.search({
      modelUuid: outreachEnrollments.uuid,
      filter: byAccount.ledgerDomainFilter,
      limit: 2000,
      selectedColumnSlugs: ["email", "linkedin_url", "account_domain"],
    });
    const byContact = contactQueries({ contacts });
    const checks = model.search({
      modelUuid: emailChecks.uuid,
      filter: byContact.checkFilter,
      limit: 2000,
      selectedColumnSlugs: ["email", "email_status"],
    });
    const yc = model.search({
      modelUuid: ycChecks.uuid,
      filter: byContact.ycFilter,
      limit: 2000,
    });
    const blocked = model.search({
      modelUuid: doNotContact.uuid,
      limit: 2000,
      selectedColumnSlugs: ["domain", "email", "linkedin_url"],
    });

    const picked = pickLeads({
      accounts: candidates,
      contacts,
      checks,
      doNotContact: blocked,
      ledger,
      events,
      companies,
      yc,
      cap: input.limit || dailyCap,
      maxPerAccount: maxPeoplePerAccount,
      signalMaxAgeDays,
      senders,
      campaignId: lemlistCampaignId,
    });

    for (const lead of picked.leads as unknown as Iterable<(typeof picked.leads)[number]>) {
      const reply = uses.drafter({ prompt: lead.prompt });
      const draft = parseDraft({ answer: reply.answer });
      // needs_signal (or an unreadable answer): no ledger row, so the person
      // is tried again once the account has a fresh signal.
      if (draft.ok) {
        model.upsert({
          modelUuid: outreachEnrollments.uuid,
          matchingColumnSlug: "key",
          matchingValue: lead.key,
          mappings: [
            { columnSlug: "key", value: lead.key },
            { columnSlug: "email", value: lead.email },
            { columnSlug: "account_domain", value: lead.account_domain },
            { columnSlug: "company", value: lead.company },
            { columnSlug: "full_name", value: lead.full_name },
            { columnSlug: "first_name", value: lead.first_name },
            { columnSlug: "last_name", value: lead.last_name },
            { columnSlug: "title", value: lead.title },
            { columnSlug: "linkedin_url", value: lead.linkedin_url },
            { columnSlug: "readiness_stage", value: lead.readiness_stage },
            { columnSlug: "signal_type", value: lead.signal_type },
            { columnSlug: "signal_url", value: lead.signal_url },
            { columnSlug: "signal_date", value: lead.signal_date },
            { columnSlug: "signal_quote", value: lead.signal_quote },
            { columnSlug: "sender_email", value: lead.sender_email },
            { columnSlug: "sender_name", value: lead.sender_name },
            { columnSlug: "campaign", value: lead.campaign },
            { columnSlug: "email_subject", value: draft.email_subject },
            { columnSlug: "email_body", value: draft.email_body },
            { columnSlug: "linkedin_message", value: draft.linkedin_message },
            { columnSlug: "voice_note_script", value: draft.voice_note_script },
            {
              columnSlug: "lemlist_status",
              value: picked.useLemlist ? "pending" : "drafts_only",
            },
            { columnSlug: "enrolled_at", value: new Date() },
          ],
        });
        if (picked.useLemlist) {
          // The createLead action has no sender field: the sender travels as
          // the senderEmail and senderName custom variables.
          uses.lemlist.createLead({
            campaignId: lead.campaign,
            email: lead.email,
            options: ["deduplicate"],
            mappings: [
              { attribute: "firstName", value: lead.first_name },
              { attribute: "lastName", value: lead.last_name },
              { attribute: "companyName", value: lead.company },
              { attribute: "companyDomain", value: lead.account_domain },
              { attribute: "jobTitle", value: lead.title },
              { attribute: "linkedinUrl", value: lead.linkedin_url },
              { attribute: "emailSubject", value: draft.email_subject },
              { attribute: "emailBody", value: draft.email_body },
              { attribute: "linkedinMessage", value: draft.linkedin_message },
              { attribute: "voiceNoteScript", value: draft.voice_note_script },
              { attribute: "signalUrl", value: lead.signal_url },
              { attribute: "senderEmail", value: lead.sender_email },
              { attribute: "senderName", value: lead.sender_name },
            ],
          });
          model.update({
            modelUuid: outreachEnrollments.uuid,
            matchingColumnSlug: "key",
            matchingValue: lead.key,
            mappings: [{ columnSlug: "lemlist_status", value: "added" }],
          });
        }
      }
    }
    return { result: "done" };
  },
);

export default dailyOutreach;
