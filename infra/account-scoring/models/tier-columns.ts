// The four columns the tiering plays write, added to the models they tier
// (tam_candidates for new companies, TAM_MASTER_FINAL for the book) instead of
// a separate tam_companies copy. Prefixed `account_` because both models
// already hold an original numeric `tier` column (the old gate's Bay Area
// tier): a second `tier` would read as `custom__tier` beside `tier` and be
// mistaken for it.
//
// Written with these bare slugs; read as `custom__<slug>`.
export const tierColumns = [
  {
    kind: "custom" as const,
    slug: "account_tier",
    type: "string" as const,
    label: "Account tier",
    description:
      "A, B, C, or disqualified, from context/icp/tiering-rubric.md. Written by the account-scoring plays.",
  },
  {
    kind: "custom" as const,
    slug: "account_tier_reason",
    type: "string" as const,
    label: "Account tier rationale",
    description:
      "Two sentences naming the rubric lines that decided the tier, and the evidence behind them.",
  },
  {
    kind: "custom" as const,
    slug: "account_tier_evidence_url",
    type: "string" as const,
    label: "Account tier evidence",
    description:
      "The page the agent verified against when the row was not enough. Empty when the sourced facts decided it.",
  },
  {
    kind: "custom" as const,
    slug: "account_tiered_at",
    type: "date" as const,
    label: "Account tiered at",
    description:
      "When the tier was last written. The plays' eligibility stamp: never tiered, or older than rescoreAfter.",
  },
];
