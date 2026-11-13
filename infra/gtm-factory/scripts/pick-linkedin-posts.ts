import { defineScript } from "@cargo-ai/cdk";

import { nameKey } from "./hosts";

// Keeps the best few of a day's LinkedIn posts for one keyword, split into
// posts by company pages and posts by people (whose employer is looked up).
type LinkedinPost = {
  post_url?: string;
  posted?: string;
  poster_name?: string;
  poster_title?: string;
  poster_linkedin_url?: string;
  text?: string;
  num_likes?: number;
  num_comments?: number;
  is_sponsored?: boolean;
};

export const pickLinkedinPosts = defineScript(
  async ({
    posts,
    keyword,
    kind,
    maxPosts,
    maxPeople,
  }: {
    posts: unknown;
    keyword: string;
    kind: string;
    maxPosts: number;
    maxPeople: number;
  }) => {
    const seen: Record<string, boolean> = {};
    const usable = (Array.isArray(posts) ? (posts as LinkedinPost[]) : [])
      .filter(
        (post) =>
          post &&
          post.post_url &&
          post.poster_linkedin_url &&
          !post.is_sponsored &&
          String(post.text || "").length >= 80,
      )
      .filter((post) => {
        const who = String(post.poster_linkedin_url);
        if (seen[who]) {
          return false;
        }
        seen[who] = true;
        return true;
      })
      .sort(
        (a, b) =>
          (b.num_likes || 0) +
          (b.num_comments || 0) -
          ((a.num_likes || 0) + (a.num_comments || 0)),
      )
      .slice(0, maxPosts)
      .map((post) => ({
        key: String(post.post_url),
        platform: "linkedin",
        keyword,
        kind: kind || "keyword",
        post_url: String(post.post_url),
        post_text: String(post.text || "").slice(0, 600),
        posted_at: String(post.posted || ""),
        engagement: (post.num_likes || 0) + (post.num_comments || 0),
        person_name: String(post.poster_name || ""),
        person_title: String(post.poster_title || ""),
        person_url: String(post.poster_linkedin_url),
      }));

    const companyPosts = usable
      .filter((post) => post.person_url.includes("/company/"))
      .map((post) => ({
        ...post,
        company_name: post.person_name,
        company_linkedin_url: post.person_url,
        candidate_key: nameKey(post.person_name),
      }))
      .filter((post) => post.candidate_key);
    const personPosts = usable
      .filter((post) => !post.person_url.includes("/company/"))
      .slice(0, maxPeople);
    return { companyPosts, personPosts };
  },
);
