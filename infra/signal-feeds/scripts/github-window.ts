import { defineScript } from "@cargo-ai/cdk";

// The 20 discussions most recently updated, each with its last 10 comments:
// enough to cover a 12-hour window on the busiest watched repo. GitHub serves
// discussions only over its authenticated GraphQL API.
const DISCUSSIONS_QUERY = `query($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    discussions(first: 20, orderBy: {field: UPDATED_AT, direction: DESC}) {
      nodes {
        number
        url
        createdAt
        updatedAt
        author { login }
        comments(last: 10) { nodes { author { login } createdAt url } }
      }
    }
  }
}`;

// The window and the GitHub REST (issues) and GraphQL (discussions) calls for
// one watched repo.
export const githubWindow = defineScript(
  async ({ repo, hours }: { repo: string; hours: number }) => {
    const since = new Date(Date.now() - hours * 3600000).toISOString();
    const path = String(repo || "").trim().replace(/^\/+|\/+$/g, "");
    const [owner, name] = path.split("/");
    return {
      since,
      issuesUrl:
        `https://api.github.com/repos/${path}/issues` +
        `?state=all&sort=created&direction=desc&per_page=50&since=${encodeURIComponent(since)}`,
      graphqlUrl: "https://api.github.com/graphql",
      discussionsBody: JSON.stringify({
        query: DISCUSSIONS_QUERY,
        variables: { owner: owner || "", name: name || "" },
      }),
    };
  },
);
