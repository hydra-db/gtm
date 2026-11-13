import { defineScript } from "@cargo-ai/cdk";

import { bare, nameKey } from "./hosts";

// Keeps the best few of a day's X posts for one keyword. The company comes
// from the website on the account, else from the bio.
type XPost = {
  tweet_url?: string;
  text?: string;
  created_at?: string;
  like_count?: number;
  retweet_count?: number;
  lang?: string;
  is_retweet?: boolean;
  author?: {
    handle?: string;
    name?: string;
    bio?: string;
    website?: string;
    followers_count?: number;
    profile_url?: string;
  };
};

export const pickXPosts = defineScript(
  async ({
    posts,
    keyword,
    kind,
    maxPosts,
  }: {
    posts: unknown;
    keyword: string;
    kind: string;
    maxPosts: number;
  }) => {
    const seen: Record<string, boolean> = {};
    const rows = (Array.isArray(posts) ? (posts as XPost[]) : [])
      .filter(
        (post) =>
          post &&
          post.tweet_url &&
          post.author &&
          post.author.handle &&
          !post.is_retweet &&
          (!post.lang || post.lang === "en") &&
          String(post.text || "").length >= 60 &&
          (post.author.followers_count || 0) >= 150,
      )
      .filter((post) => {
        const who = String(post.author ? post.author.handle : "");
        if (seen[who]) {
          return false;
        }
        seen[who] = true;
        return true;
      })
      .sort(
        (a, b) =>
          (b.like_count || 0) +
          (b.retweet_count || 0) -
          ((a.like_count || 0) + (a.retweet_count || 0)),
      )
      .slice(0, maxPosts)
      .map((post) => {
        const author = post.author || {};
        const bio = String(author.bio || "");
        const domain = bare(author.website);
        const employer = bio.match(
          /(?:\bat|@|founder of|building|ceo of|cto of|co-founder of|cofounder of)\s+@?([A-Za-z0-9][A-Za-z0-9._-]{1,40})/i,
        );
        const company = domain
          ? domain.split(".")[0]
          : employer
            ? employer[1].replace(/[.,;:]+$/, "")
            : "";
        return {
          key: String(post.tweet_url),
          platform: "x",
          keyword,
          kind: kind || "keyword",
          post_url: String(post.tweet_url),
          post_text: String(post.text || "").slice(0, 600),
          posted_at: String(post.created_at || ""),
          engagement: (post.like_count || 0) + (post.retweet_count || 0),
          person_name: String(author.name || author.handle || ""),
          person_title: bio.slice(0, 200),
          person_url: String(author.profile_url || `https://x.com/${author.handle}`),
          company_name: company,
          company_domain: domain,
          candidate_key: domain || nameKey(company),
        };
      });
    const companies = rows.filter((row) => row.candidate_key);
    return { rows, companies };
  },
);
