import { defineScript } from "@cargo-ai/cdk";

import { isIn, strings, type Row } from "./filters";

// From the candidate accounts: who to search for at them, their events, what
// final_tam knows about them, and who the ledger already holds there.
export const accountQueries = defineScript(
  async ({ accounts }: { accounts: unknown }) => {
    const rows = Array.isArray(accounts) ? (accounts as Row[]) : [];
    const domains = strings(rows.map((row) => String(row.domain || "").toLowerCase()));
    const ids = strings(rows.map((row) => row.id));
    return {
      contactFilter: isIn("account_domain", domains),
      eventFilter: isIn("account_id", ids),
      companyFilter: isIn("domain", domains),
      ledgerDomainFilter: isIn("account_domain", domains),
    };
  },
);

