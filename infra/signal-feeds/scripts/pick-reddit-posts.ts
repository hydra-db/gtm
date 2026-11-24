import { defineScript } from "@cargo-ai/cdk";

import { companyOf, type ForumRow, type RedditItem } from "./forum-shared";

export const pickRedditPosts = defineScript(
  async ({
    items,
    keyword,
    kind,
    maxPosts,
  }: {
    items: unknown;
    keyword: string;
    kind: string;
    maxPosts: number;
  }) => {
    const usable = (Array.isArray(items) ? (items as RedditItem[]) : []).filter(
      (item) =>
        item &&
        item.id &&
        item.author &&
        item.author !== "[deleted]" &&
        item.author !== "AutoModerator" &&
        !item.isNsfw,
    );
    const rows: ForumRow[] = usable.slice(0, maxPosts).map((item) => {
      const isComment = item._type === "comment";
      const title = String(item.title || item.postTitle || "");
      const link = item.isSelfPost ? "" : String(item.outboundUrl || "");
      const company = isComment
        ? { company_name: "", company_domain: "", candidate_key: "" }
        : companyOf(title, link, `${title} ${String(item.body || "").slice(0, 300)}`);
      const url =
        item.threadUrl ||
        item.postUrl ||
        (item.permalink ? `https://www.reddit.com${item.permalink}` : "");
      return {
        key: `reddit:${item.id}`,
        platform: "reddit",
        keyword,
        kind: kind || "keyword",
        post_url: String(url),
        title,
        post_text: String(item.body || "").slice(0, 600),
        posted_at: String(item.createdAt || ""),
        engagement: (item.score || 0) + (item.commentCount || 0),
        author: String(item.author || ""),
        author_url: `https://www.reddit.com/user/${item.author}`,
        community: String(item.subreddit || ""),
        linked_url: link,
        ...company,
      };
    });
    return { rows, companies: rows.filter((row) => row.candidate_key) };
  },
);
