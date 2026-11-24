import { defineConnector, workspaceEnv } from "@cargo-ai/cdk";

// The connectors the signal feeds call. Apify, GitHub, Cargo Signals and
// theirStack were authorized in the Cargo UI: `default: true` binds the live
// default connector of each, so a deploy never touches their credentials.
// Exa (tam-building-advanced), Slack (shared) and the plain HTTP connector
// (gtm-factory's http_ingest, used for Hacker News) are declared elsewhere.

// Reddit, through the account's Apify actors.
export const apify = defineConnector("apify", {
  integration: "apify",
  default: true,
});

// GitHub profile lookups (getUser), free.
export const github = defineConnector("github", {
  integration: "github",
  default: true,
});

// LinkedIn engagement and job-switch feeds, billed per lead delivered.
export const cargoSignals = defineConnector("cargo_signals", {
  integration: "cargoSignals",
  default: true,
});

// Job posts, 0.5 credits per job returned.
export const theirStack = defineConnector("their_stack", {
  integration: "theirStack",
  default: true,
});

// The GitHub REST API (repos, stargazers, issues), with the workspace's
// GITHUB_TOKEN as the Authorization header. GitHub needs "Bearer <token>" (or
// "token <token>") there: a bare token is ignored and the calls run
// unauthenticated, which still works for these public endpoints at 60 calls an
// hour. The rate limit keeps one 12-hour sweep (about 70 calls) inside that, so
// the feed runs either way; storing the variable as "Bearer <token>" makes it
// authenticated with no change here.
export const githubApi = defineConnector("github_api", {
  integration: "http",
  name: "GitHub REST API",
  config: {
    headers: [
      {
        key: "Authorization",
        type: "secret",
        secretValue: workspaceEnv("GITHUB_TOKEN"),
      },
      { key: "Accept", type: "public", value: "application/vnd.github+json" },
      { key: "X-GitHub-Api-Version", type: "public", value: "2022-11-28" },
      { key: "User-Agent", type: "public", value: "hydradb-gtm-signal-feeds" },
    ],
  },
  rateLimit: { unit: "hour", max: 50, strategy: "spread" },
});
