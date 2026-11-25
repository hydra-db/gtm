import { defineScript } from "@cargo-ai/cdk";

// The 100 newest stars of one repo, oldest first: ordered by STARRED_AT
// ascending, `last: 100` is the newest page whatever the repo's size.
// GitHub's GraphQL API returns public stargazers with starredAt to any
// authenticated caller, fine-grained tokens included.
const STARS_QUERY = `query($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    stargazers(last: 100, orderBy: {field: STARRED_AT, direction: ASC}) {
      edges { starredAt node { login company email websiteUrl } }
    }
  }
}`;

// The window and the GraphQL call for one watched repo's stars.
export const starsQuery = defineScript(
  async ({ repo, hours }: { repo: string; hours: number }) => {
    const path = String(repo || "").trim().replace(/^\/+|\/+$/g, "");
    const [owner, name] = path.split("/");
    return {
      since: new Date(Date.now() - hours * 3600000).toISOString(),
      graphqlUrl: "https://api.github.com/graphql",
      body: JSON.stringify({
        query: STARS_QUERY,
        variables: { owner: owner || "", name: name || "" },
      }),
    };
  },
);
