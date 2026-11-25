// Decisions (2026-11-24), adapting the tam-building cookbook to HydraDB and
// refreshing tam-building-advanced alongside it:
//   - Refresh cadence: once every two weeks, operator decision. Cron has no
//     "every 14 days", so it is the 1st and the 15th of each month.
//     This is the cookbook's `refresh-cadence` variation on a paid source:
//     every run re-bills every returned record, so the filter is kept narrow
//     (models/tam-companies.ts, counted for free at 244 companies on
//     2026-11-24) and the cookbook contract's no-schedule check fails by
//     design once the refresh is switched on.
//   - Only net-new companies go on to tam_candidates (plays/net-new.ts):
//     a domain already in TAM_MASTER_FINAL, final_tam or tam_candidates is
//     skipped before anything is enriched. account-scoring's tier_accounts
//     then tiers them.
//   - Enrichment is a waterfall: the source row first (free), then AI Ark
//     (0.01), CompanyEnrich (0.25), LinkedIn (0.5), then Clay last
//     (2026-11-25: `searchCompanies` on the domain through HydraDB's own Clay
//     key, 0 Cargo credits; the integration lists no routines, so
//     runRoutine is not used).
//   - Reuses tam-building-advanced's AI Ark connector; the cookbook's copy is
//     deleted.
//
// OFF: these sources cannot be scheduled. The deploy of 2026-11-24 stopped
// on `model:tam_companies: This model can't be scheduled
// (scheduleNotCompatible)`. AI Ark `fetchCompanies` and Apollo
// `fetchOrganizations` are one-shot extractors (no minimum interval in their
// integration definitions), so a model built on them takes no cron. A
// refresh is a manual re-sync of each model (`cargo-ai storage model refresh <uuid>`
// or the model page); the daily net-new and profile plays then pick up what
// arrived. Sales Navigator and LinkedIn extractors are schedulable.
export const refreshEnabled = false;

// What one re-sync of each source bills (2026-11-24):
//   tam_companies (AI Ark, 244 x 0.01)             about 2.5 credits
//   tam_source_ai_ark (AI Ark, up to 1,750 x 0.01) up to 17.5 credits
//   tam_source_apollo (Apollo, up to 1,000 x 0.01) up to 10 credits
// About 30 credits for the three. Sales Navigator is left out: one run
// re-bills about 549 credits, above the 100-credit ceiling for any one
// action; re-source it by hand only when the operator approves the spend.

// The 1st and 15th of each month at 04:17 UTC, used only while
// `refreshEnabled` is true (it cannot be, see above). The plays
// that pick up what arrived tick daily and are capped per tick (`*Limit`
// below), so a refresh that adds hundreds of companies drains over a few
// days at about 30 credits a day at most, instead of billing at once.
export const sourceRefreshCron = "17 4 1,15 * *";
export const profileCron = "17 6 * * *";
export const netNewCron = "17 7 * * *";
export const netNewAdvancedCron = "17 8 * * *";

// Rows a tick, per play. Profile: LinkedIn enrich (0.5) and a classification,
// about 1 credit a company. Net new: a free lookup, and at most 0.76 credits
// of enrichment for a thin row.
export const profileLimit = 30;
export const netNewLimit = 40;

// The schedule a sourced model gets, or none while the refresh is off.
export const sourceRefreshSchedule = refreshEnabled
  ? { type: "cron" as const, cron: sourceRefreshCron }
  : undefined;
