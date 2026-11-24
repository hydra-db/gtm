import { defineScript } from "@cargo-ai/cdk";

// The window and the GitHub REST URLs for one watched repo.
export const githubWindow = defineScript(
  async ({ repo, hours }: { repo: string; hours: number }) => {
    const since = new Date(Date.now() - hours * 3600000).toISOString();
    const path = String(repo || "").trim().replace(/^\/+|\/+$/g, "");
    return {
      since,
      repoUrl: `https://api.github.com/repos/${path}`,
      issuesUrl:
        `https://api.github.com/repos/${path}/issues` +
        `?state=all&sort=created&direction=desc&per_page=50&since=${encodeURIComponent(since)}`,
    };
  },
);
