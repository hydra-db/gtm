import { defineModel } from "@cargo-ai/cdk";

import { linkedin } from "../../tam-building-advanced/connectors/linkedin";
import { modelsFolder } from "../folders";
import { weeklyDigestEnabled } from "../settings";

// The week's public LinkedIn posts about the problem you solve.
//
// A paid search source, so the query in `config` is what decides what you buy:
// `fetchPosts` bills per returned post. That is why the search lives here and
// not in SQL downstream, the one exception to "models pull all the data".
//
// `searchKeywords`, from context/icp/hydradb.md (2026-11-24): the language
// teams building their own agent memory use (agent memory, context graph,
// knowledge graph for agents, GraphRAG) and the memory-layer and graph
// vendors the ICP names as tech signals and competitors (Zep, Mem0, Letta,
// Cognee, Graphiti, Neo4j for agents). LinkedIn reads OR between quoted
// phrases. The daily X and LinkedIn keyword listening
// (gtm_social_listening_daily) is separate and stays: it feeds companies into
// tam_candidates; this is the weekly human digest of conversations to join.
//
// Weekly and capped. `limit` is LinkedIn's page of 20 to 100; the schedule
// re-buys the search every Monday, and `datePosted: "Past week"` is what makes
// each sync a new week rather than a re-read of the last one.
//
// A sync REPLACES the rows: the extractor is not incremental. That is why
// "already surfaced" lives in `surfaced_posts`, not here.
export const linkedinPosts = defineModel("linkedin_posts", {
  connector: linkedin,
  extractSlug: "fetchPosts",
  description:
    "The week's public LinkedIn posts matching the buyer-language keywords. Read by the social listener; re-synced every Monday.",
  folder: modelsFolder,
  config: {
    searchKeywords:
      '"agent memory" OR "context graph" OR "knowledge graph for agents" OR "GraphRAG" OR "Zep" OR "Mem0" OR "Letta" OR "Cognee" OR "Graphiti" OR "Neo4j for agents"',
    sortBy: "Latest",
    datePosted: "Past week",
    limit: 40,
  },
  // 05:00 UTC Monday, two hours before the listener runs. Off until
  // `weeklyDigestEnabled` (settings.ts).
  schedule: weeklyDigestEnabled
    ? { type: "cron", cron: "0 5 * * 1" }
    : undefined,
});
