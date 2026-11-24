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
// Ships switched off. A model has no enable flag and its schedule is the
// spend, so off means no schedule on the sourced models (here and in
// tam-building-advanced) and every play disabled. Set this to true, plan,
// and read the added schedules before merging.
export const refreshEnabled = false;

// The 1st and 15th of each month at 04:17 UTC: sources sync first, then the
// profile play (06:17) and the net-new plays (07:17, 08:17) pick up what
// arrived.
export const sourceRefreshCron = "17 4 1,15 * *";
export const profileCron = "17 6 1,15 * *";
export const netNewCron = "17 7 1,15 * *";
export const netNewAdvancedCron = "17 8 1,15 * *";

// The schedule a sourced model gets, or none while the refresh is off.
export const sourceRefreshSchedule = refreshEnabled
  ? { type: "cron" as const, cron: sourceRefreshCron }
  : undefined;
