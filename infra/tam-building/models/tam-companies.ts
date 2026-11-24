import { defineModel } from "@cargo-ai/cdk";

// The AI Ark connector tam-building-advanced already declares.
import { aiArk } from "../../tam-building-advanced/connectors/ai-ark";
import { modelsFolder } from "../folders";
import { sourceRefreshSchedule } from "../settings";

// The account universe: one row per company AI Ark returned for the approved
// ICP filter. This model is the whole cookbook. What happens to the rows next
// (a CRM coverage check, enrichment, deduplication, scoring) is a separate job
// the skill suggests, not something this model depends on.
//
// THE FILTER IS THE TAM. There is no post-filter and no "source wide, then
// throw away": `fetchCompanies` bills per returned record, so a row outside the
// ICP was already paid for. Narrowing happens here, in `config`, and nowhere
// else.
//
// COUNT BEFORE YOU SOURCE. `aiArk.countCompanies` takes exactly these filter
// groups, returns `{"count": N}` and costs nothing:
//
//   cargo-ai orchestration action execute --wait-until-finished \
//     --action '{"kind":"connector","integrationSlug":"aiArk","actionSlug":"countCompanies","config":{}}' \
//     --data '{"industry":{"industry_or":["software development"]}, ...}'
//
// Run it for every candidate filter before deploying this. A free number is
// the whole difference between a market you chose and a market you discovered
// after paying for it.
//
// SCHEDULE, BY OPERATOR DECISION (2026-11-24): once every two weeks, from
// settings.ts, and only while `refreshEnabled` is true. The cookbook's
// warning below still holds: each run re-bills the whole pool (244 companies
// at 0.01 credits on 2026-11-24, about 2.4 credits a run).
//
// The cookbook default was NO SCHEDULE, ON PURPOSE. A cron here re-runs the same search and bills for
// every returned record again, including the rows already sitting in this
// model: a monthly refresh buys the handful of new companies at the price of
// the entire pool. Sourcing is a deliberate spend, triggered when you decide to
// widen.
//
// And if you add a schedule and later delete the line, that does NOT clear a
// live cron: `ScheduleSpec` is optional with no null, the deploy engine omits
// the field when the spec is silent, and the platform keeps whatever cron it
// already has. Clear it at runtime instead:
//   cargo-ai storage model update --uuid <modelUuid> --schedule null
export const tamCompanies = defineModel("tam_companies", {
  connector: aiArk,
  extractSlug: "fetchCompanies",
  description:
    "The account universe sourced from AI Ark for the approved ICP filter.",
  folder: modelsFolder,

  // The ICP (context/icp/hydradb.md, "Sourcing filters") as AI Ark filter
  // groups, narrowed to the working list's funding stage (Series B and
  // later) and to companies whose profile names AI agents. Counted for free
  // with aiArk.countCompanies on 2026-11-24:
  //   industry + size + US                      18,406
  //   + Series B to H                            1,783
  //   + agent keywords                             244  <- this filter
  // Three groups are the floor and never leave: `industry`, `employeeSize`
  // and `companyLocation`. Filters are nested groups; a flat key is ignored
  // silently and sources the whole database up to `limit`.
  config: {
    industry: {
      industry_or: [
        "software development",
        "technology, information and internet",
      ],
    },
    employeeSize: { min_employee_count: 30, max_employee_count: 2000 },
    companyLocation: { location_or: ["United States"] },
    funding: {
      funding_type: [
        "SERIES_B",
        "SERIES_C",
        "SERIES_D",
        "SERIES_E",
        "SERIES_F",
        "SERIES_G",
        "SERIES_H",
      ],
    },
    companyKeywords: {
      keyword_or: ["AI agents", "agentic", "AI agent", "autonomous agents"],
    },
    // Above the counted pool, so a run returns all of it: 244 x 0.01.
    limit: 300,
  },
  schedule: sourceRefreshSchedule,
});
