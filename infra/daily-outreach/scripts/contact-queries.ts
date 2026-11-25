import { defineScript } from "@cargo-ai/cdk";

import { isIn, strings, type Row } from "./filters";

// From the contacts at those accounts: their email checks and YC checks.
export const contactQueries = defineScript(
  async ({ contacts }: { contacts: unknown }) => {
    const rows = Array.isArray(contacts) ? (contacts as Row[]) : [];
    const emails = strings(rows.map((row) => row.email));
    const lowered = strings(emails.map((email) => email.toLowerCase()));
    const linkedin = strings(rows.map((row) => row.linkedin_url));
    return {
      checkFilter: isIn("email", strings([...emails, ...lowered])),
      ycFilter: isIn("person_linkedin_url", linkedin),
    };
  },
);
