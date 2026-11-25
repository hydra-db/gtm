import { defineModel } from "@cargo-ai/cdk";

import { modelsFolder } from "../../gtm-factory/folders";
import { github } from "../connectors";

type Row = { starred_at?: string | null };

// Everyone who starred our own repos, synced every 12 hours by Cargo's GitHub
// connector (OAuth, free). GitHub only lists stargazers to an authenticated
// caller, and the workspace's GITHUB_TOKEN is not sent in a form GitHub
// accepts, so this is how our own repos' stars are read. Each sync re-reads
// the whole list (the extractor is not incremental): about 130 calls for
// hydradb, against the connector's 5,000 an hour.
//
// The extractor leaves starred_at empty, so `recent_star` stays no:
// plays/own-repo-stars.ts runs on rows new to the model instead, and the first
// sync's 13,000 existing stars never reach it.
const recentStar = {
  kind: "computed" as const,
  slug: "recent_star",
  type: "string" as const,
  label: "Recent star",
  description: "yes when the star is less than 48 hours old, else no.",
  expression: (record: Row) =>
    record.starred_at &&
    Date.now() - new Date(record.starred_at).getTime() < 48 * 3600000
      ? "yes"
      : "no",
};

export const hydradbStargazers = defineModel("hydradb_stargazers", {
  name: "hydradb_stargazers",
  connector: github,
  extractSlug: "fetchStargazers",
  description: "Stargazers of hydra-db/hydradb (Cargo's GitHub connector).",
  config: { ownerName: "hydra-db", repositoryName: "hydradb" },
  additionalColumns: [
    recentStar,
    {
      kind: "computed",
      slug: "repo",
      type: "string",
      label: "Repo",
      description: "The starred repo.",
      expression: (record: Row) => (record.starred_at ? "hydra-db/hydradb" : "hydra-db/hydradb"),
    },
  ],
  schedule: { type: "cron", cron: "17 2,14 * * *" },
  folder: modelsFolder,
});

export const selfgraphStargazers = defineModel("selfgraph_stargazers", {
  name: "selfgraph_stargazers",
  connector: github,
  extractSlug: "fetchStargazers",
  description: "Stargazers of hydra-db/selfgraph (Cargo's GitHub connector).",
  config: { ownerName: "hydra-db", repositoryName: "selfgraph" },
  additionalColumns: [
    recentStar,
    {
      kind: "computed",
      slug: "repo",
      type: "string",
      label: "Repo",
      description: "The starred repo.",
      expression: (record: Row) => (record.starred_at ? "hydra-db/selfgraph" : "hydra-db/selfgraph"),
    },
  ],
  schedule: { type: "cron", cron: "17 2,14 * * *" },
  folder: modelsFolder,
});
