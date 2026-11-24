import { defineModel } from "@cargo-ai/cdk";

import { modelsFolder } from "../folders";

// Publicly listed companies and enterprises with 10,000+ employees, parked out
// of the working list for a later multi-threaded motion. Filled outside code
// and adopted here (`cargo-ai project import model:enterprise_parked
// 08e187f9-85e0-4530-8633-e1143991e050`), so its rows stay. It does not unify:
// readiness-scoring reads it through a lookup on Unify Accounts to keep parked
// companies out of the route play.
//
// `config.columns` is the live list, column for column (employee_count is a
// string there): a deploy that finds a different config RESETS the model,
// which on a native model drops its rows.
export const enterpriseParked = defineModel("enterprise_parked", {
  name: "enterprise_parked",
  kind: "native",
  extractSlug: "defineCustom",
  description:
    "Publicly listed companies and enterprises with 10,000+ employees (F500 proxy), parked out of the working list. To be handled later with multi-threaded outreach, starting with those whose people engage with context graphs.",
  config: {
    columns: [
      { slug: "domain", type: "string" },
      { slug: "name", type: "string" },
      { slug: "reason", type: "string" },
      { slug: "latest_round", type: "string" },
      { slug: "employee_count", type: "string" },
      { slug: "icp_status", type: "string" },
      { slug: "funding_stage", type: "string" },
      { slug: "in_working_list", type: "string" },
      { slug: "added_at", type: "date" },
    ],
  },
  folder: modelsFolder,
});
