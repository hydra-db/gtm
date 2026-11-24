import { defineModel } from "@cargo-ai/cdk";

import { snitcher } from "../connectors/snitcher";

type Row = { website?: string | null; last_seen?: string | null };

// The companies Snitcher identifies on hydradb.com, one row per company, with
// when it was first and last seen. Created in the Cargo UI and adopted here
// (`cargo-ai project import model:website_visitors
// 8117d218-e49e-410e-ac01-99c283576ad9`), so its rows stay.
//
// The config is the live one, key for key. A deploy compares a declared config
// with the live one and, when they differ, RESETS the model: it drops the rows
// and re-fetches them, and Snitcher bills 3 credits per company fetched. The
// `_workspaceUuid` and `_trackingScript` keys are Snitcher's own and are kept
// by the backend, so they are not declared. No schedule is declared either:
// the extractor manages its own 30-minute fetch.
//
// It unifies as an ACCOUNT EVENT, not an account: one event per visiting
// company, dated its last visit, so readiness-scoring can weigh a visit. The
// integration default made each visitor an account; now a visitor reaches
// Unify Accounts only when another model (TAM_MASTER_FINAL, final_tam) holds
// the company, which is the point: an unknown visitor has no account to score.
export const websiteVisitors = defineModel("website_visitors", {
  name: "website visitors hydradb",
  connector: snitcher,
  extractSlug: "fetchOrganisations",
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
  ],
  unification: {
    source: "custom",
    type: "accountEvent",
    uniqueColumns: [{ slug: "computed__match_domain", reference: "domain" }],
    timeColumnSlug: "computed__event_at",
  },
});
