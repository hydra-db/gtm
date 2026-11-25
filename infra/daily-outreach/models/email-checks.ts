import { defineModel } from "@cargo-ai/cdk";

// Work email verification per address (Cargo verify-email waterfall). Created
// outside this project and adopted with `cargo-ai project import
// model:email_checks 9d35191f-3a63-45c5-a245-13a478d5e755`; the spec below is
// the live one, unchanged. The daily outreach run reads it: only addresses
// whose email_status is `valid` are drafted.
export const emailChecks = defineModel("email_checks", {
  name: "email_checks",
  kind: "native",
  extractSlug: "defineCustom",
  description:
    "Work email verification per address (Cargo verify-email waterfall): valid, invalid, catch_all or unknown. Only valid emails get email steps in lemlist.",
  config: {
    columns: [
      { slug: "email", type: "string" },
      { slug: "email_status", type: "string" },
      { slug: "smtp_provider", type: "string" },
      { slug: "provider", type: "string" },
      { slug: "checked_at", type: "date" },
    ],
  },
});
