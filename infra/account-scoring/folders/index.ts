import { defineFolder } from "@cargo-ai/cdk";

// Every resource this skill deploys is filed under folders named after the
// skill, not under a shared "GTM" one. A workspace accumulates resources from
// several skills plus whatever the team wrote by hand, and the folder is what
// answers "what put this here, and what else came with it" by looking. It is
// also what makes removing a skill bounded rather than a hunt.
//
// Folders are per-kind. No models folder: this skill adds its tier columns to
// the GTM factory's own models (tam_candidates, TAM_MASTER_FINAL) instead of
// carrying a copy of tam_companies.
export const agentsFolder = defineFolder("account_scoring_agents", {
  kind: "agent",
  name: "Account scoring",
});

export const playsFolder = defineFolder("account_scoring_plays", {
  kind: "play",
  name: "Account scoring",
});
