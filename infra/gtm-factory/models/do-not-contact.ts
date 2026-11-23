import { defineModel } from "@cargo-ai/cdk";

import { modelsFolder } from "../folders";

// One list, checked right before anyone is enrolled in lemlist: people and
// companies we must not cold-contact. A row is a person (email or LinkedIn)
// or a whole company (domain). Sources: lemlist (already in a sequence,
// replied, bounced, unsubscribed), Attio (customers and open deals), the 7
// campaigns drafted in Attio before 2026-11-23, and names added by hand.
export const doNotContact = defineModel("do_not_contact", {
  name: "do_not_contact",
  kind: "native",
  extractSlug: "defineCustom",
  description:
    "People and companies not to cold-contact: already in a sequence, replied, unsubscribed, customers, open deals, earlier drafted campaigns, or added by hand. Checked before every lemlist enrolment.",
  config: {
    columns: [
      { slug: "key", type: "string" },
      { slug: "kind", type: "string" },
      { slug: "domain", type: "string" },
      { slug: "email", type: "string" },
      { slug: "linkedin_url", type: "string" },
      { slug: "name", type: "string" },
      { slug: "company", type: "string" },
      { slug: "reason", type: "string" },
      { slug: "source", type: "string" },
      { slug: "added_at", type: "date" },
    ],
  },
  folder: modelsFolder,
});
