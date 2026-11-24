import { defineScript } from "@cargo-ai/cdk";

// What the Reddit and Hacker News searches for one keyword look like: the
// Algolia URL for the last day of HN stories and comments, and the Apify actor
// input for the last day of Reddit posts.
export const forumQueries = defineScript(
  async ({
    keyword,
    hnResults,
    redditResults,
  }: {
    keyword: string;
    hnResults: number;
    redditResults: number;
  }) => {
    const since = Math.floor(Date.now() / 1000) - 24 * 3600;
    const hnUrl =
      "https://hn.algolia.com/api/v1/search_by_date?" +
      `query=${encodeURIComponent(keyword)}` +
      "&tags=(story,comment)" +
      `&numericFilters=${encodeURIComponent(`created_at_i>${since}`)}` +
      `&hitsPerPage=${hnResults}`;
    const redditInput = JSON.stringify({
      query: keyword,
      maxResults: redditResults,
      contentType: "both",
      sort: "new",
      timeFilter: "day",
      requireQueryTerms: true,
      autoDiscoverSubreddits: false,
    });
    return { hnUrl, redditInput };
  },
);
