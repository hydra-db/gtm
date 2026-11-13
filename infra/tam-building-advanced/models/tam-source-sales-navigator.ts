import { defineModel } from "@cargo-ai/cdk";

import { salesNavigator } from "../connectors/sales-navigator";
import { modelsFolder } from "../folders";

// The census: every company LinkedIn files under your filters. Rows come back
// with the LinkedIn company id, which is the key every company in Accounts is
// merged on.
//
// ONE SEARCH SERVES AT MOST 1,000 ACCOUNTS. A market bigger than that is split
// into several searches, each under the cap, and every search URL goes in
// `urls` below. The procedure (count, split, merge back to the fewest
// searches, re-count) is the `extract-sales-navigator-search` skill: run it,
// then paste its URLs here. One model holds them all.
//
// NO SEAT. `identityIds` stays off: the search runs on Cargo's side without a
// LinkedIn account, and running it through someone's own account puts that
// account at risk.
//
// NO SCHEDULE, ON PURPOSE. Every sync re-bills every returned record. Re-run
// it when you decide to refresh, and re-count the searches first: Sales
// Navigator counts drift week to week.
export const tamSourceSalesNavigator = defineModel(
  "tam_source_sales_navigator",
  {
    name: "TAM source: Sales Navigator",
    connector: salesNavigator,
    extractSlug: "fetchAccountSearch",
    description:
      "TAM source 1 of 4: Sales Navigator account searches built from the ICP, each under the 1,000-account cap.",
    folder: modelsFolder,

    // Into Accounts on the LinkedIn company id. Sales Navigator's own
    // unification is OFF by default: without this declaration its rows never
    // reach Accounts and the census is invisible to the rest of the TAM.
    unification: {
      source: "custom",
      type: "account",
      uniqueColumns: [
        { slug: "sales_navigator_company_id", reference: "linkedinId" },
      ],
    },

    // PLACEHOLDER: your searches. Each URL must carry the three minimum
    // criteria as Sales Navigator filters: INDUSTRY, COMPANY_HEADCOUNT and
    // REGION. This one is Software Development and Computer and Network
    // Security, 51 to 200 employees, United States.
    config: {
      urls: [
        // 11-50, California: 792 (counted 2026-11-13)
        "https://www.linkedin.com/sales/search/company?query=(keywords:%28AI%20agents%20OR%20agentic%29,filters:List((type:INDUSTRY,values:List((id:4,selectionType:INCLUDED),(id:6,selectionType:INCLUDED))),(type:COMPANY_HEADCOUNT,values:List((id:C,selectionType:INCLUDED))),(type:REGION,values:List((id:102095887,selectionType:INCLUDED)))))",
        // 11-50, New York: 236 (counted 2026-11-13)
        "https://www.linkedin.com/sales/search/company?query=(keywords:%28AI%20agents%20OR%20agentic%29,filters:List((type:INDUSTRY,values:List((id:4,selectionType:INCLUDED),(id:6,selectionType:INCLUDED))),(type:COMPANY_HEADCOUNT,values:List((id:C,selectionType:INCLUDED))),(type:REGION,values:List((id:105080838,selectionType:INCLUDED)))))",
        // 11-50, rest of US: 840 (counted 2026-11-13)
        "https://www.linkedin.com/sales/search/company?query=(keywords:%28AI%20agents%20OR%20agentic%29,filters:List((type:INDUSTRY,values:List((id:4,selectionType:INCLUDED),(id:6,selectionType:INCLUDED))),(type:COMPANY_HEADCOUNT,values:List((id:C,selectionType:INCLUDED))),(type:REGION,values:List((id:103644278,selectionType:INCLUDED),(id:102095887,selectionType:EXCLUDED),(id:105080838,selectionType:EXCLUDED)))))",
        // 51-200, US: 812 (counted 2026-11-13)
        "https://www.linkedin.com/sales/search/company?query=(keywords:%28AI%20agents%20OR%20agentic%29,filters:List((type:INDUSTRY,values:List((id:4,selectionType:INCLUDED),(id:6,selectionType:INCLUDED))),(type:COMPANY_HEADCOUNT,values:List((id:D,selectionType:INCLUDED))),(type:REGION,values:List((id:103644278,selectionType:INCLUDED)))))",
        // 201-5,000, US: 396 (counted 2026-11-13)
        "https://www.linkedin.com/sales/search/company?query=(keywords:%28AI%20agents%20OR%20agentic%29,filters:List((type:INDUSTRY,values:List((id:4,selectionType:INCLUDED),(id:6,selectionType:INCLUDED))),(type:COMPANY_HEADCOUNT,values:List((id:E,selectionType:INCLUDED),(id:F,selectionType:INCLUDED),(id:G,selectionType:INCLUDED))),(type:REGION,values:List((id:103644278,selectionType:INCLUDED)))))",
      ],
      // PLACEHOLDER: the budget across all URLs. Billing is per returned
      // record.
      limit: 1000,
    },
  },
);
