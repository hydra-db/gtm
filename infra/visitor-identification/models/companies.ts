import { defineModel } from "@cargo-ai/cdk";

import { enterpriseParked } from "../../gtm-factory/models/enterprise-parked";
import { finalTam } from "../../gtm-factory/models/final-tam";
import { tamMasterFinal } from "../../gtm-factory/models/tam-master-final";
import { snitcher } from "../../shared/connectors/snitcher";
import { modelsFolder } from "../folders";

type Row = {
  website?: string | null;
  last_seen?: string | null;
  lookup__tmf_icp_status?: string | null;
  lookup__tmf_funding_stage?: string | null;
  lookup__final_tam_domain?: string | null;
  lookup__parked_domain?: string | null;
};

// The companies Snitcher identifies on hydradb.com: one row per organisation
// resolved from a visit's IP address, with its website, industry and first and
// last visit. Company-level only: no person is identified.
//
// ADOPTED, NOT CREATED. The operator set Snitcher up in the Cargo UI (model
// "website visitors hydradb", profile sckFoTOBCF) and placed the tracker on
// hydradb.com in Framer. It is imported into the deploy state
// (`cargo-ai project import model:website_visitors
// 8117d218-e49e-410e-ac01-99c283576ad9`), so its rows and its Snitcher
// workspace stay. The slug is the live one, `website_visitors`: renaming it
// would create a second model and provision a second Snitcher workspace.
//
// The config is the live one, key for key. A deploy compares a declared config
// with the live one and, when they differ, RESETS the model: it drops the rows
// and re-fetches them, and Snitcher bills 3 credits per company fetched. The
// `_workspaceUuid` and `_trackingScript` keys are Snitcher's own and are kept
// by the backend, so they are not declared. NO SCHEDULE: the extractor fetches
// incrementally every 30 minutes on its own and refuses a cron.
//
// It unifies as an ACCOUNT EVENT, not an account: one event per visiting
// company, dated its last visit, so readiness-scoring weighs a visit. The
// integration default made each visitor an account; now a visitor reaches
// Unify Accounts only when another model (TAM_MASTER_FINAL, final_tam) holds
// the company: an unknown visitor has no account to score.
//
// The lookups and `relevance` decide which visitors are posted to #visitors
// (plays/post-relevant-visitors.ts): a company on the working list, or one
// that passed the ICP gate. Every other visitor stays in the model, unposted.
export const websiteVisitors = defineModel("website_visitors", {
  name: "website visitors hydradb",
  connector: snitcher,
  extractSlug: "fetchOrganisations",
  folder: modelsFolder,
  config: { url: "https://hydradb.com/" },
  additionalColumns: [
    {
      kind: "computed",
      slug: "match_domain",
      type: "string",
      label: "Match domain",
      description: "The visitor's website, or null when Snitcher has none, so empty values never merge.",
      expression: (record: Row) => (record.website ? record.website : null),
    },
    {
      kind: "computed",
      slug: "event_at",
      type: "date",
      label: "Event at",
      description: "When the company was last seen on the site: the date of its Account Events row.",
      expression: (record: Row) => (record.last_seen ? record.last_seen : null),
    },
    {
      kind: "lookup",
      slug: "tmf_icp_status",
      type: "string",
      label: "TAM icp_status",
      description: "The ICP gate status of the matching TAM_MASTER_FINAL row (qualified, not_fit, ...). Blank when the company is not in it.",
      join: { model: tamMasterFinal, fromColumnSlug: "website", toColumnSlug: "domain" },
      extractColumnSlug: "icp_status",
    },
    {
      kind: "lookup",
      slug: "tmf_funding_stage",
      type: "string",
      label: "TAM funding_stage",
      description: "The funding stage of the matching TAM_MASTER_FINAL row (B+, pre-B, ...). Blank when the company is not in it.",
      join: { model: tamMasterFinal, fromColumnSlug: "website", toColumnSlug: "domain" },
      extractColumnSlug: "funding_stage",
    },
    {
      kind: "lookup",
      slug: "final_tam_domain",
      type: "string",
      label: "final_tam domain",
      description: "The domain of the matching final_tam row: set when the company passed the ICP gate.",
      join: { model: finalTam, fromColumnSlug: "website", toColumnSlug: "domain" },
      extractColumnSlug: "domain",
    },
    {
      kind: "lookup",
      slug: "parked_domain",
      type: "string",
      label: "Parked domain",
      description: "The domain of the matching enterprise_parked row. Blank when the company is not parked.",
      join: { model: enterpriseParked, fromColumnSlug: "website", toColumnSlug: "domain" },
      extractColumnSlug: "domain",
    },
    {
      kind: "computed",
      slug: "relevance",
      type: "string",
      label: "Relevance",
      description:
        "working_list: qualified, B+ in TAM_MASTER_FINAL and not parked. icp_qualified: passed the ICP gate (qualified in TAM_MASTER_FINAL, or in final_tam). not_relevant: anything else. Only the first two are posted.",
      expression: (record: Row) =>
        record.lookup__tmf_icp_status === "qualified" &&
        record.lookup__tmf_funding_stage === "B+" &&
        !record.lookup__parked_domain
          ? "working_list"
          : record.lookup__tmf_icp_status === "qualified" ||
              record.lookup__final_tam_domain
            ? "icp_qualified"
            : "not_relevant",
    },
  ],
  unification: {
    source: "custom",
    type: "accountEvent",
    uniqueColumns: [{ slug: "computed__match_domain", reference: "domain" }],
    timeColumnSlug: "computed__event_at",
  },
});
