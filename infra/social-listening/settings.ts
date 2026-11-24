// Decisions (2026-11-24), adapting the social-listening cookbook to HydraDB:
//   - Weekly digest to #sales (C0BJY52BUTZ), operator decision.
//   - Keywords from context/icp/hydradb.md: buyer language plus competitor
//     and memory-layer names (models/linkedin-posts.ts).
//   - Reuses the project's LinkedIn (tam-building-advanced), Slack and
//     Anthropic (gtm-factory) connectors; the cookbook's copies are deleted.
//   - Kept beside the existing daily listening play
//     (gtm_social_listening_daily), which feeds companies into
//     tam_candidates. This one only posts a digest for a human.
//
// Ships switched off. A Cargo agent has no enable flag and a model sync is a
// paid search, so "off" means: no weekly schedule on linkedin_posts and no
// cron trigger on the listener. Set this to true (after inviting the Cargo
// bot to #sales) and the plan shows both being added.
export const weeklyDigestEnabled = false;
