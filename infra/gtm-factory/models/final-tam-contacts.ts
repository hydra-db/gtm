import { defineModel } from "@cargo-ai/cdk";

import { modelsFolder } from "../folders";

// The people to write to at each account worth reaching now: at most two
// economic buyers (CTO, VP Engineering) and two champions (the engineers who
// own agent memory, retrieval or the AI platform). B2B work identities from a
// licensed provider. Nothing here sends anything: this list is what gets
// enrolled in the sequencer after a person has reviewed it.
export const finalTamContacts = defineModel("final_tam_contacts", {
  name: "final_tam_contacts",
  kind: "native",
  extractSlug: "defineCustom",
  description:
    "Champion and economic-buyer contacts at final_tam accounts in the outreach-now segment, with a verified work email where one was found.",
  config: {
    columns: [
      { slug: "key", type: "string" },
      { slug: "account_domain", type: "string" },
      { slug: "company", type: "string" },
      { slug: "role", type: "string" },
      { slug: "full_name", type: "string" },
      { slug: "first_name", type: "string" },
      { slug: "last_name", type: "string" },
      { slug: "title", type: "string" },
      { slug: "linkedin_url", type: "string" },
      { slug: "email", type: "string" },
      { slug: "location", type: "string" },
      { slug: "found_at", type: "date" },
    ],
  },
  folder: modelsFolder,
});
