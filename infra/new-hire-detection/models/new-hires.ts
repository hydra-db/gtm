import { defineModel } from "@cargo-ai/cdk";

import { modelsFolder } from "../../gtm-factory/folders";
import { salesNavigator } from "../../tam-building-advanced/connectors/sales-navigator";
import {
  dailyLeadLimit,
  excludedTitleWords,
  searchCron,
  titleKeywords,
} from "../settings";

// One market slice as a Sales Navigator people search: anyone in the United
// States whose current title holds one of the keywords in settings.ts, and who
// just changed jobs. No industry or headcount facet: the title is the signal,
// and account scoring tiers the company once it reaches tam_candidates.
//
// The three job-change filters are not part of the market and must not be
// edited away: RECENTLY_CHANGED_JOBS, under a year at the company, and under
// a year in the position. Together they drop internal promotions, which look
// like a job change and are not one. The 30-day window is applied by the play
// on `tenure_start`, for free, since Sales Navigator has no finer facet.
const search = {
  regions: [{ id: "103644278", text: "United States" }],
};

// Every free-text value is URL-encoded ONCE, and the query around it is left
// as is. Counted on 2026-11-25 with `searchPersonMetrics`: this encoding
// returns 14 people, while the cookbook's double encoding (and labels on the
// id facets) returns 0 and would sync an empty model while reporting success.
const encodeText = (value: string) =>
  encodeURIComponent(value).replace(
    /[!'()*]/g,
    (char) => "%" + char.charCodeAt(0).toString(16).toUpperCase(),
  );

type Facet = { id?: string; text?: string; excluded?: boolean };

const facet = (type: string, values: Facet[]) =>
  `(type:${type},values:List(${values
    .map(
      (value) =>
        "(" +
        (value.id === undefined ? "" : `id:${value.id},`) +
        (value.text === undefined ? "" : `text:${encodeText(value.text)},`) +
        `selectionType:${value.excluded === true ? "EXCLUDED" : "INCLUDED"})`,
    )
    .join(",")}))`;

const searchUrl = (filters: string[]) =>
  `https://www.linkedin.com/sales/search/people?query=(filters:List(${filters.join(",")}))`;

export const newHireSearchUrl = searchUrl([
  facet("RECENTLY_CHANGED_JOBS", [{ id: "RPC" }]),
  facet("YEARS_AT_CURRENT_COMPANY", [{ id: "1" }]),
  facet("YEARS_IN_CURRENT_POSITION", [{ id: "1" }]),
  facet("REGION", search.regions.map((region) => ({ id: region.id }))),
  facet("CURRENT_TITLE", [
    { text: titleKeywords.map((keyword) => `"${keyword}"`).join(" OR ") },
    ...excludedTitleWords.map((text) => ({ text, excluded: true })),
  ]),
]);

// One row per person the search returns, keyed by `linkedin_profile_id`. The
// play (plays/route-new-hires.ts) reacts to rows ADDED here, so a person is
// routed once, the first sync they appear in.
//
// The search counted 14 people on 2026-11-25 (`searchPersonMetrics`), under
// the daily limit, so each sync reads all of it.
//
// THE SCHEDULE RE-BUYS THE SEARCH. `fetchLeadSearch` is not incremental:
// every daily sync extracts and bills up to `dailyLeadLimit` leads (0.2
// credits each), including people already in this model. That is the fixed
// daily cost; see settings.ts.
//
// If the schedule is ever deleted from code, that does NOT clear the live
// cron: clear it at runtime with
//   cargo-ai storage model update --uuid <modelUuid> --schedule null
export const newHires = defineModel("new_hires", {
  name: "new_hires",
  connector: salesNavigator,
  extractSlug: "fetchLeadSearch",
  description:
    "US people who just started a role whose title names context graphs, knowledge graphs, ontology or agent memory (Sales Navigator job-change search). Each new row is routed by the new-hire play.",
  folder: modelsFolder,
  config: {
    urls: [newHireSearchUrl],
    limit: dailyLeadLimit,
  },
  schedule: { type: "cron", cron: searchCron },
});
