import { defineModel } from "@cargo-ai/cdk";

import { modelsFolder } from "../../gtm-factory/folders";

// The ledger of the daily outreach run: one row per person drafted, keyed on
// the lowercased email. A person with a row is never drafted again. While
// `lemlistCampaignId` is empty, `campaign` is blank and `lemlist_status` is
// `drafts_only`: the drafts wait here for review.
//
// Created with `cargo-ai storage model create` on 2026-11-24 (for the live
// test before merge) and adopted with `cargo-ai project import
// model:outreach_enrollments 3c32f343-fad4-41a6-9a6a-9ea2aa7417f4`.
export const outreachEnrollments = defineModel("outreach_enrollments", {
  name: "outreach_enrollments",
  kind: "native",
  extractSlug: "defineCustom",
  description:
    "Daily outreach ledger: one row per person drafted (email, LinkedIn message, voice-note script), the signal behind it, the sender, and whether it reached lemlist.",
  config: {
    columns: [
      { slug: "key", type: "string" },
      { slug: "email", type: "string" },
      { slug: "account_domain", type: "string" },
      { slug: "company", type: "string" },
      { slug: "full_name", type: "string" },
      { slug: "first_name", type: "string" },
      { slug: "last_name", type: "string" },
      { slug: "title", type: "string" },
      { slug: "linkedin_url", type: "string" },
      { slug: "readiness_stage", type: "string" },
      { slug: "signal_type", type: "string" },
      { slug: "signal_url", type: "string" },
      { slug: "signal_date", type: "string" },
      { slug: "signal_quote", type: "string" },
      { slug: "sender_email", type: "string" },
      { slug: "sender_name", type: "string" },
      { slug: "campaign", type: "string" },
      { slug: "email_subject", type: "string" },
      { slug: "email_body", type: "string" },
      { slug: "linkedin_message", type: "string" },
      { slug: "voice_note_script", type: "string" },
      { slug: "lemlist_status", type: "string" },
      { slug: "enrolled_at", type: "date" },
    ],
  },
  folder: modelsFolder,
});
