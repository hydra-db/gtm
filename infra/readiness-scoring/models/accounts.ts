import { defineModel, modelRef } from "@cargo-ai/cdk";

import { enterpriseParked } from "../../gtm-factory/models/enterprise-parked";
import { tamMasterFinal } from "../../gtm-factory/models/tam-master-final";
import { readyThreshold, warmingThreshold } from "../settings";
import { accountEvents } from "./account-events";

// Unify Accounts: the one account layer of the workspace, the row reps and
// every other pipeline read. TAM_MASTER_FINAL, final_tam, the tam-building
// sources and company_tam_v1 unify into it, and Cargo does the merge: one
// account per company, whatever found it, with each source's row attached
// (`ids`).
//
// THE PROJECT'S ONE DECLARATION OF THIS MODEL. tam-building-advanced's
// profile play imports it from here; a second declaration collides at deploy.
//
// ADOPTED, NOT CREATED, and on its own schedule: hourly at :10, after Account
// Events at :00, so the score sums contributions computed the same hour. Its
// unification settings (`config`) are not declared, so they stay as they are.
//
// `additionalColumns` IS THE WHOLE LIST. A deploy removes every additional
// column of Unify Accounts that is not declared here, values included. The
// list below is every live column (read with `cargo-ai storage column list`
// on 2026-11-24: only `status`), then the columns readiness-scoring adds.
//
//   - `status` (live, carried over): the tier from companies_list_v0.
//   - `readiness_score`, a metric: the sum of `readiness_contribution` over the
//     account's Account Events, over the relationship Account Events' sync
//     generates (`account_id` -> `id`), read as
//     `accountEvents.relationships.account_id`.
//   - `readiness_stage`, computed from the score and the two thresholds:
//     `ready_now`, `warming` or `cold`. The segments and the play read this,
//     never the score.
//   - `working_list_domain`, `parked_domain` and `on_working_list`: the fit
//     gate. The route play posts only accounts on the working list.
export const accounts = defineModel("accounts", {
  name: "Accounts",
  kind: "native",
  extractSlug: "unifyAccounts",
  schedule: { type: "cron", cron: "10 * * * *" },
  additionalColumns: [
    {
      kind: "lookup",
      slug: "status",
      type: "string",
      label: "Status",
      description:
        "hot, warm or disqualified, read from the matching companies_list_v0 (gtm_companies) row. Blank for companies outside the scoring set.",
      // companies_list_v0 (slug gtm_companies) is not declared in this project.
      join: {
        model: modelRef("968601a6-e757-44cb-8278-3a18a45a77cb"),
        fromColumnSlug: "domain",
        toColumnSlug: "domain",
      },
      extractColumnSlug: "custom__tier",
    },
    {
      kind: "metric",
      slug: "readiness_score",
      type: "number",
      label: "Readiness score",
      description:
        "Sum of the account's event contributions: rises with each fresh signal, falls as they age.",
      relationship: accountEvents.relationships.account_id,
      aggregation: {
        function: "SUM",
        columnSlug: "computed__readiness_contribution",
      },
    },
    {
      kind: "computed",
      slug: "readiness_stage",
      type: "string",
      label: "Readiness stage",
      description: `ready_now at ${readyThreshold} or more, warming at ${warmingThreshold} or more, cold below.`,
      imports: { readyThreshold, warmingThreshold },
      expression: (record) =>
        record.metric__readiness_score >= readyThreshold
          ? "ready_now"
          : record.metric__readiness_score >= warmingThreshold
            ? "warming"
            : "cold",
    },
    {
      kind: "lookup",
      slug: "working_list_domain",
      type: "string",
      label: "Working list domain",
      description:
        "The domain of the matching TAM_MASTER_FINAL row when it is Series B or later (funding_stage B+) and passed the ICP gate (icp_status qualified). Blank otherwise.",
      join: {
        model: tamMasterFinal,
        fromColumnSlug: "domain",
        toColumnSlug: "domain",
      },
      extractColumnSlug: "domain",
      filter: {
        conjonction: "and",
        groups: [
          {
            conjonction: "and",
            conditions: [
              {
                kind: "string",
                columnSlug: "funding_stage",
                operator: "is",
                values: ["B+"],
              },
              {
                kind: "string",
                columnSlug: "icp_status",
                operator: "is",
                values: ["qualified"],
              },
            ],
          },
        ],
      },
    },
    {
      kind: "lookup",
      slug: "parked_domain",
      type: "string",
      label: "Parked domain",
      description:
        "The domain of the matching enterprise_parked row (public, or 10,000+ employees). Blank when the company is not parked.",
      join: {
        model: enterpriseParked,
        fromColumnSlug: "domain",
        toColumnSlug: "domain",
      },
      extractColumnSlug: "domain",
    },
    {
      kind: "computed",
      slug: "on_working_list",
      type: "string",
      label: "On working list",
      description:
        "yes when the account is a qualified, Series B or later TAM_MASTER_FINAL company that is not in enterprise_parked; no otherwise. The route play posts only yes.",
      expression: (record) =>
        record.lookup__working_list_domain && !record.lookup__parked_domain
          ? "yes"
          : "no",
    },
  ],
});
