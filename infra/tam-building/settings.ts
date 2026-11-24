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
//     (0.01), CompanyEnrich (0.25), LinkedIn (0.5). Clay was to be the last
//     fallback, but this workspace has no Clay connector, and Cargo's Clay
//     integration has no company enrichment action (only runRoutine,
//     searchCompanies, searchPeople), so the waterfall ends at LinkedIn.
//   - Reuses tam-building-advanced's AI Ark connector; the cookbook's copy is
//     deleted.
//
// Switched on 2026-11-24 (operator: "close the loops"). A model has no enable
// flag and its schedule is the spend, so off means no schedule on the
// sourced models (here and in tam-building-advanced). Set this to false and
// the plan shows the schedules removed (a removed schedule may need clearing
// at runtime too: see models/tam-companies.ts).
export const refreshEnabled = true;

// The sources on the refresh, and what one run re-bills (2026-11-24):
//   tam_companies (AI Ark, 244 x 0.01)             about 2.5 credits
//   tam_source_ai_ark (AI Ark, up to 1,750 x 0.01) up to 17.5 credits
//   tam_source_apollo (Apollo, up to 1,000 x 0.01) up to 10 credits
// About 30 credits a run, twice a month. Sales Navigator is EXCLUDED: one
// run re-bills about 549 credits, above the 100-credit ceiling for any one
// action. It stays on no schedule; re-source it by hand when the operator
// approves the spend.

// The 1st and 15th of each month at 04:17 UTC: the sources sync. The plays
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
