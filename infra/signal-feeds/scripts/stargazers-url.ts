import { defineScript } from "@cargo-ai/cdk";

// Stargazers come oldest first, so the newest are on the last page. GitHub
// serves at most 400 pages of 100: past 40,000 stars the newest stars are out
// of reach, the call returns old ones, and the window filter drops them.
export const stargazersUrl = defineScript(
  async ({ repo, repoInfo }: { repo: string; repoInfo: unknown }) => {
    const stars = Number(
      (repoInfo as { stargazers_count?: number } | null)?.stargazers_count || 0,
    );
    const page = Math.min(Math.max(1, Math.ceil(stars / 100)), 400);
    const path = String(repo || "").trim().replace(/^\/+|\/+$/g, "");
    return {
      url: `https://api.github.com/repos/${path}/stargazers?per_page=100&page=${page}`,
      stars,
    };
  },
);
