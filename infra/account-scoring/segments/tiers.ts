import { defineSegment } from "@cargo-ai/cdk";

import { tamCandidates } from "../../gtm-factory/models/tam-candidates";
import { tamMasterFinal } from "../../gtm-factory/models/tam-master-final";

// One segment per tier the agent can emit, so no tier lands nowhere. The book
// (TAM_MASTER_FINAL) carries every tier: the book play writes there, and the
// candidate play promotes every in-scope candidate there with its tier. A
// disqualified candidate is never promoted, so it gets its own segment on
// tam_candidates. Reads use the `custom__` alias; the plays write bare slugs.

const onTier = (tier: string) => ({
  conjonction: "and" as const,
  groups: [
    {
      conjonction: "and" as const,
      conditions: [
        {
          kind: "string" as const,
          columnSlug: "custom__account_tier",
          operator: "is" as const,
          values: [tier],
        },
      ],
    },
  ],
});

// Work it now. The handle contact sourcing and outreach take.
export const tierA = defineSegment("tier_a_accounts", {
  model: tamMasterFinal,
  filter: onTier("A"),
});

// Worth a sequence, not a rep.
export const tierB = defineSegment("tier_b_accounts", {
  model: tamMasterFinal,
  filter: onTier("B"),
});

// In the market, not in the motion yet.
export const tierC = defineSegment("tier_c_accounts", {
  model: tamMasterFinal,
  filter: onTier("C"),
});

// Suppress, do not work. A large share means the sourcing filter is too wide.
// Named apart from a leftover "Disqualified Accounts" segment (on the
// unmanaged gtm_companies model, 2026-11-11), which a deploy would collide
// with.
export const disqualified = defineSegment("disqualified_accounts", {
  name: "Disqualified book accounts",
  model: tamMasterFinal,
  filter: onTier("disqualified"),
});

export const disqualifiedCandidates = defineSegment("disqualified_candidates", {
  model: tamCandidates,
  filter: onTier("disqualified"),
});
