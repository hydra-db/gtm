import { defineModel } from "@cargo-ai/cdk";

import { modelsFolder } from "../../gtm-factory/folders";
import { tamMasterFinal } from "../../gtm-factory/models/tam-master-final";
import { cargoSignals } from "../connectors";
import {
  competitorCeoLeadsPerDay,
  competitorCeoProfiles,
  competitorCompanyPages,
  competitorPageLeadsPerDay,
  decisionMakerTitles,
  founderConnectionLeadsPerDay,
  founderProfiles,
  jobSwitchLeadsPerDay,
} from "../settings";

// The four Cargo Signals feeds. Each is a standing feed that bills per lead it
// delivers, capped by its dailyLeadLimit (prices and caps in settings.ts). They
// stay on the integration's default unification (person signals feed Contact
// Events): the plays copy each lead into linkedin_engagement_signals or
// job_switch_signals, which unify as account events, so a lead counts once.
//
// duplicateHandling "30d": a person who engages again inside 30 days is not
// delivered, or billed, again.

// Drop self-employed people, and the competitors' own staff engaging with
// their employer's posts.
const notSelfEmployed = {
  excludedCompanySizeFilters: ["Self-employed" as const],
  allowUnknownCompanySize: true,
};
const notCompetitorStaff = {
  ...notSelfEmployed,
  excludedCompanyUrls: competitorCompanyPages,
};

// People engaging with posts by the competitors' company pages (2 a lead).
export const competitorPageEngagement = defineModel(
  "competitor_page_engagement",
  {
    name: "competitor_page_engagement",
    connector: cargoSignals,
    extractSlug: "listenCompetitorSocialReactions",
    description:
      "Cargo Signals: people engaging with Zep, Mem0, Letta, Cognee, Neo4j, FalkorDB and Memgraph company-page posts on LinkedIn.",
    config: {
      filters: {
        source: { linkedinCompanyUrls: competitorCompanyPages },
        engagement: { engagementTypes: ["comments", "likes"], postedLimit: "week" },
        company: notCompetitorStaff,
      },
      advancedSettings: {
        dailyLeadLimit: competitorPageLeadsPerDay,
        duplicateHandling: "30d",
      },
    },
    folder: modelsFolder,
  },
);

// People engaging with the competitors' CEOs' posts (1 a lead).
export const competitorCeoEngagement = defineModel(
  "competitor_ceo_engagement",
  {
    name: "competitor_ceo_engagement",
    connector: cargoSignals,
    extractSlug: "listenInfluencerEngagement",
    description:
      "Cargo Signals: people engaging with the LinkedIn posts of the CEOs of Zep, Mem0, Letta, Cognee, Neo4j, FalkorDB and Memgraph.",
    config: {
      filters: {
        source: { linkedinUrls: competitorCeoProfiles },
        engagement: { engagementTypes: ["comments", "likes"], postedLimit: "week" },
        company: notCompetitorStaff,
      },
      advancedSettings: {
        dailyLeadLimit: competitorCeoLeadsPerDay,
        duplicateHandling: "30d",
      },
    },
    folder: modelsFolder,
  },
);

// New connections of our founder (5 a lead on the new-connections stream).
// oneTimeExtractCount 0 is the guard: the default backfill of 500 existing
// connections bills 3 a lead outside the daily cap.
export const founderNetworkConnections = defineModel(
  "founder_network_connections",
  {
    name: "founder_network_connections",
    connector: cargoSignals,
    extractSlug: "listenPersonConnections",
    description:
      "Cargo Signals: people who newly connect with Nishkarsh on LinkedIn (new connections only, no backfill).",
    config: {
      filters: {
        people: { linkedinProfileUrls: founderProfiles },
        volume: { oneTimeExtractCount: 0, dailyNewConnections: true },
        company: notSelfEmployed,
      },
      advancedSettings: {
        dailyLeadLimit: founderConnectionLeadsPerDay,
        duplicateHandling: "refuse",
      },
    },
    folder: modelsFolder,
  },
);

// Job switches: a new decision-maker joining a working-list company (2 a
// lead). The watchlist is TAM_MASTER_FINAL narrowed to the working list
// (Series B or later, passed the ICP gate), the same rule readiness-scoring's
// `on_working_list` reads. One lead per company.
export const newDecisionMakers = defineModel("new_decision_makers", {
  name: "new_decision_makers",
  connector: cargoSignals,
  extractSlug: "listenNewDecisionMakerWatchlist",
  description:
    "Cargo Signals: a new CTO, VP Engineering, Head of AI or AI platform lead joined a working-list company.",
  config: {
    entities: {
      source: "model",
      modelUuid: tamMasterFinal.uuid,
      filter: {
        conjonction: "and",
        groups: [
          {
            conjonction: "and",
            conditions: [
              {
                kind: "string",
                columnSlug: "funding_stage",
                operator: "is",
                values: ["B+"],
              },
              {
                kind: "string",
                columnSlug: "icp_status",
                operator: "is",
                values: ["qualified"],
              },
            ],
          },
        ],
      },
      limit: 1000,
      nameColumnSlug: "name",
      domainColumnSlug: "domain",
      linkedinUrlColumnSlug: "linkedin_url",
    },
    filters: {
      titles: { customJobTitles: decisionMakerTitles },
      maxLeadsPerCompany: 1,
    },
    advancedSettings: { dailyLeadLimit: jobSwitchLeadsPerDay },
  },
  folder: modelsFolder,
});
