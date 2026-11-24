import { defineScript } from "@cargo-ai/cdk";

import { companyOf, strip, type ForumRow, type HnHit } from "./forum-shared";

export const pickHnPosts = defineScript(
  async ({
    response,
    keyword,
    kind,
    maxPosts,
  }: {
    response: unknown;
    keyword: string;
    kind: string;
    maxPosts: number;
  }) => {
    const hits = ((response as { hits?: HnHit[] } | null)?.hits || []).filter(
      (hit) => hit && hit.objectID && hit.author,
    );
    const rows: ForumRow[] = hits.slice(0, maxPosts).map((hit) => {
      const isComment = Boolean(hit.comment_text);
      const title = String(hit.title || hit.story_title || "");
      const link = String(hit.url || hit.story_url || "");
      const company = isComment
        ? { company_name: "", company_domain: "", candidate_key: "" }
        : companyOf(title, link, title);
      return {
        key: `hn:${hit.objectID}`,
        platform: "hackernews",
        keyword,
        kind: kind || "keyword",
        post_url: `https://news.ycombinator.com/item?id=${hit.objectID}`,
        title,
        post_text: strip(hit.comment_text || hit.story_text).slice(0, 600),
        posted_at: String(hit.created_at || ""),
        engagement: (hit.points || 0) + (hit.num_comments || 0),
        author: String(hit.author || ""),
        author_url: `https://news.ycombinator.com/user?id=${hit.author}`,
        community: isComment ? "comment" : "story",
        linked_url: link,
        ...company,
      };
    });
    return { rows, companies: rows.filter((row) => row.candidate_key) };
  },
);
