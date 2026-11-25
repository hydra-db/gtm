import { defineScript } from "@cargo-ai/cdk";

type Edge = {
  starredAt?: string;
  node?: {
    login?: string;
    company?: string | null;
    email?: string | null;
    websiteUrl?: string | null;
  } | null;
} | null;

// The stars inside the window from the GraphQL body
// (data.repository.stargazers.edges), newest first, bots dropped, at most
// maxStars. A failed call or an errors-only body reads as no stars.
export const pickStars = defineScript(
  async ({
    response,
    since,
    repo,
    maxStars,
  }: {
    response: unknown;
    since: string;
    repo: string;
    maxStars: number;
  }) => {
    const from = new Date(since).getTime();
    const body = (response || {}) as {
      data?: { repository?: { stargazers?: { edges?: Edge[] } } | null };
    };
    const edges = body.data?.repository?.stargazers?.edges;
    const stars: {
      key: string;
      login: string;
      starred_at: string;
      company: string;
      email: string;
      website_url: string;
    }[] = [];
    for (const edge of Array.isArray(edges) ? edges : []) {
      const login = edge?.node?.login;
      if (
        edge &&
        login &&
        !/\[bot\]$|-bot$|^dependabot|^renovate/i.test(login) &&
        edge.starredAt &&
        new Date(edge.starredAt).getTime() >= from
      ) {
        stars.push({
          key: `${repo}:star:${login}`,
          login,
          starred_at: edge.starredAt,
          company: String(edge.node?.company || ""),
          email: String(edge.node?.email || ""),
          website_url: String(edge.node?.websiteUrl || ""),
        });
      }
    }
    stars.reverse();
    return { stars: stars.slice(0, maxStars), found: stars.length };
  },
);
