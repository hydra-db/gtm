// Decisions (2026-11-24), adapting the social-listening cookbook to HydraDB:
//   - Weekly digest to #growth (C0CG3H6R6KA), operator decision
//     (2026-11-25; it was #sales).
//   - Keywords from context/icp/hydradb.md: buyer language plus competitor
//     and memory-layer names (models/linkedin-posts.ts).
//   - Reuses the project's LinkedIn (tam-building-advanced), Slack and
//     Anthropic (gtm-factory) connectors; the cookbook's copies are deleted.
//   - Kept beside the existing daily listening play
//     (gtm_social_listening_daily), which feeds companies into
//     tam_candidates. This one only posts a digest for a human.
//
// Switched on 2026-11-24 (operator: "close the loops"). A Cargo agent has no
// enable flag and a model sync is a paid search, so "off" means: no weekly
// schedule on linkedin_posts and no cron trigger on the listener. Set this to
// false and the plan shows both being removed. The Cargo bot must be in
// #growth for the post to land.
export const weeklyDigestEnabled = true;
