import { definePlay, defineWorkflow } from "@cargo-ai/cdk";
import { z } from "zod";

import { playsFolder } from "../../gtm-factory/folders";
import { listeningKeywords } from "../../gtm-factory/models/listening-keywords";
import { tamCandidates } from "../../gtm-factory/models/tam-candidates";
import { exa } from "../../tam-building-advanced/connectors/exa";
import { blogSignals } from "../models/blog-signals";
import { blogWindow } from "../scripts/blog-window";
import { pickBlogPosts } from "../scripts/pick-blog-posts";
import { blogLookbackDays, blogResultsPerKeyword } from "../settings";

// Sites that publish about a keyword without being the company behind the
// post: social networks, forums and news. Kept out of the search itself so
// the results Exa bills for are company blogs.
const excludeDomains = [
  "linkedin.com", "x.com", "twitter.com", "reddit.com", "news.ycombinator.com",
  "youtube.com", "facebook.com", "github.com", "arxiv.org", "wikipedia.org",
  "techcrunch.com", "venturebeat.com", "forbes.com", "businessinsider.com",
  "theverge.com", "wired.com", "zdnet.com", "infoq.com", "thenewstack.io",
  "producthunt.com", "quora.com", "geeksforgeeks.org", "analyticsvidhya.com",
];

// One Exa search per listening keyword, every day, over posts published in the
// last blogLookbackDays. Every post lands in blog_signals; the site's company
// is proposed to the ICP gate unless the site is a shared host.
const listenBlogs = defineWorkflow(
  "signal_feeds_blogs_workflow",
  {
    input: z.object({
      keyword: z.string(),
      kind: z.string().optional(),
    }),
    output: z.object({ result: z.string() }),
    uses: { exa },
    imports: {
      blogSignals,
      tamCandidates,
      blogWindow,
      pickBlogPosts,
      blogLookbackDays,
      blogResultsPerKeyword,
      excludeDomains,
    },
  },
  ({ input, uses, model }) => {
    const span = blogWindow({ lookbackDays: blogLookbackDays });
    const found = uses.exa.search({
      query: `engineering blog post about ${input.keyword}`,
      searchType: "auto",
      numResults: blogResultsPerKeyword,
      startPublishedDate: span.since,
      excludeDomains,
    });
    const picked = pickBlogPosts({
      response: found,
      keyword: input.keyword,
      kind: input.kind || "keyword",
    });
    for (const row of picked.rows as unknown as Iterable<(typeof picked.rows)[number]>) {
      model.upsert({
        modelUuid: blogSignals.uuid,
        matchingColumnSlug: "key",
        matchingValue: row.key,
        mappings: [
          { columnSlug: "key", value: row.key },
          { columnSlug: "keyword", value: row.keyword },
          { columnSlug: "kind", value: row.kind },
          { columnSlug: "url", value: row.url },
          { columnSlug: "title", value: row.title },
          { columnSlug: "author", value: row.author },
          { columnSlug: "published_at", value: row.published_at },
          { columnSlug: "company_name", value: row.company_name },
          { columnSlug: "company_domain", value: row.company_domain },
          { columnSlug: "seen_at", value: new Date() },
        ],
      });
    }
    for (const company of picked.companies as unknown as Iterable<(typeof picked.companies)[number]>) {
      model.upsert({
        modelUuid: tamCandidates.uuid,
        matchingColumnSlug: "key",
        matchingValue: company.candidate_key,
        mappings: [
          { columnSlug: "key", value: company.candidate_key },
          { columnSlug: "name", value: company.company_name },
          { columnSlug: "domain", value: company.company_domain },
          { columnSlug: "signal_source", value: "blog_signals" },
          { columnSlug: "signal_detail", value: company.url },
          { columnSlug: "last_signal_at", value: new Date() },
        ],
      });
    }
    return { result: "done" };
  },
);

// Every keyword once a day at 15:13 UTC, each keyword once (the linkedin row
// of each pair). Cap and cost: settings.ts.
export const blogsDaily = definePlay("signal_feeds_blogs_daily", {
  name: "Signal feeds: engineering blogs, daily",
  description:
    "For every listening keyword, each day: recent company blog posts on it (Exa) into blog_signals, and the publishing company to the ICP gate.",
  folder: playsFolder,
  model: listeningKeywords,
  workflow: listenBlogs,
  filter: {
    conjonction: "and",
    groups: [
      {
        conjonction: "and",
        conditions: [
          { kind: "string", columnSlug: "platform", operator: "is", values: ["linkedin"] },
        ],
      },
    ],
  },
  schedule: { type: "cron", cron: "13 15 * * *" },
  isEnabled: true,
  runCreationRule: "always",
  changeKinds: ["added", "updated", "unchanged"],
});
