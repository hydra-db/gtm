import { defineModel } from "@cargo-ai/cdk";

import { modelsFolder } from "../../gtm-factory/folders";

// Every new star on a watched repo, read every 12 hours over GitHub's GraphQL
// API by plays/github-stars.ts (one row per repo and person, whatever their
// profile says). GitHub restricted the REST stargazer listing to admins and
// collaborators in June 2026 and refuses fine-grained tokens there, so stars
// are read only here. plays/own-repo-stars.ts runs on the rows of our own repos.
export const githubStars = defineModel("github_stars", {
  name: "github_stars",
  kind: "native",
  extractSlug: "defineCustom",
  description:
    "New stars on watched GitHub repos from the last 12 hours, read over GitHub's GraphQL API, one row per repo and person.",
  config: {
    columns: [
      { slug: "key", type: "string" },
      { slug: "repo", type: "string" },
      { slug: "repo_kind", type: "string" },
      { slug: "login", type: "string" },
      { slug: "starred_at", type: "string" },
      { slug: "company", type: "string" },
      { slug: "email", type: "string" },
      { slug: "website_url", type: "string" },
      { slug: "seen_at", type: "date" },
    ],
  },
  folder: modelsFolder,
});
