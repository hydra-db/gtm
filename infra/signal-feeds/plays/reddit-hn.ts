import { definePlay, defineWorkflow } from "@cargo-ai/cdk";
import { z } from "zod";

import { httpIngest } from "../../gtm-factory/connectors";
import { playsFolder } from "../../gtm-factory/folders";
import { listeningKeywords } from "../../gtm-factory/models/listening-keywords";
import { tamCandidates } from "../../gtm-factory/models/tam-candidates";
import { apify } from "../connectors";
import { redditHnSignals } from "../models/reddit-hn-signals";
import { forumQueries } from "../scripts/forum-queries";
import { pickHnPosts } from "../scripts/pick-hn-posts";
import { pickRedditPosts } from "../scripts/pick-reddit-posts";
import {
  hnResultsPerKeyword,
  maxForumPostsPerKeyword,
  redditActorId,
  redditResultsPerKeyword,
} from "../settings";

// One run per listening keyword, every day. Hacker News first (Algolia, free),
// then Reddit (Apify), so an Apify failure never loses the HN rows. Every post
// lands in reddit_hn_signals; a post that names its company (a Show HN or
// "we built" post linking its own site) also proposes that company to the ICP
// gate. Nobody is contacted from here.
const listenForums = defineWorkflow(
  "signal_feeds_reddit_hn_workflow",
  {
    input: z.object({
      keyword: z.string(),
      kind: z.string().optional(),
    }),
    output: z.object({ result: z.string() }),
    uses: { httpIngest, apify },
    imports: {
      redditHnSignals,
      tamCandidates,
      forumQueries,
      pickHnPosts,
      pickRedditPosts,
      hnResultsPerKeyword,
      maxForumPostsPerKeyword,
      redditActorId,
      redditResultsPerKeyword,
    },
  },
  ({ input, uses, model }) => {
    const queries = forumQueries({
      keyword: input.keyword,
      hnResults: hnResultsPerKeyword,
      redditResults: redditResultsPerKeyword,
    });

    // bodyFormat is required by the action but missing from its generated type.
    const hn = uses.httpIngest.call({
      url: queries.hnUrl,
      method: "get",
      bodyFormat: "json",
    } as { url: string; method: "get" });
    const hnPicked = pickHnPosts({
      response: hn,
      keyword: input.keyword,
      kind: input.kind || "keyword",
      maxPosts: maxForumPostsPerKeyword,
    });
    for (const row of hnPicked.rows as unknown as Iterable<(typeof hnPicked.rows)[number]>) {
      model.upsert({
        modelUuid: redditHnSignals.uuid,
        matchingColumnSlug: "key",
        matchingValue: row.key,
        mappings: [
          { columnSlug: "key", value: row.key },
          { columnSlug: "platform", value: row.platform },
          { columnSlug: "keyword", value: row.keyword },
          { columnSlug: "kind", value: row.kind },
          { columnSlug: "post_url", value: row.post_url },
          { columnSlug: "title", value: row.title },
          { columnSlug: "post_text", value: row.post_text },
          { columnSlug: "posted_at", value: row.posted_at },
          { columnSlug: "engagement", value: row.engagement },
          { columnSlug: "author", value: row.author },
          { columnSlug: "author_url", value: row.author_url },
          { columnSlug: "community", value: row.community },
          { columnSlug: "linked_url", value: row.linked_url },
          { columnSlug: "company_name", value: row.company_name },
          { columnSlug: "company_domain", value: row.company_domain },
          { columnSlug: "seen_at", value: new Date() },
        ],
      });
    }
    for (const company of hnPicked.companies as unknown as Iterable<(typeof hnPicked.companies)[number]>) {
      model.upsert({
        modelUuid: tamCandidates.uuid,
        matchingColumnSlug: "key",
        matchingValue: company.candidate_key,
        mappings: [
          { columnSlug: "key", value: company.candidate_key },
          { columnSlug: "name", value: company.company_name },
          { columnSlug: "domain", value: company.company_domain },
          { columnSlug: "signal_source", value: "reddit_hn_signals" },
          { columnSlug: "signal_detail", value: company.post_url },
          { columnSlug: "last_signal_at", value: new Date() },
        ],
      });
    }

    const reddit = uses.apify.runActor({
      actorId: redditActorId,
      input: queries.redditInput,
      memory: 512,
      timeout: 300,
    });
    const redditPicked = pickRedditPosts({
      items: reddit,
      keyword: input.keyword,
      kind: input.kind || "keyword",
      maxPosts: maxForumPostsPerKeyword,
    });
    for (const row of redditPicked.rows as unknown as Iterable<(typeof redditPicked.rows)[number]>) {
      model.upsert({
        modelUuid: redditHnSignals.uuid,
        matchingColumnSlug: "key",
        matchingValue: row.key,
        mappings: [
          { columnSlug: "key", value: row.key },
          { columnSlug: "platform", value: row.platform },
          { columnSlug: "keyword", value: row.keyword },
          { columnSlug: "kind", value: row.kind },
          { columnSlug: "post_url", value: row.post_url },
          { columnSlug: "title", value: row.title },
          { columnSlug: "post_text", value: row.post_text },
          { columnSlug: "posted_at", value: row.posted_at },
          { columnSlug: "engagement", value: row.engagement },
          { columnSlug: "author", value: row.author },
          { columnSlug: "author_url", value: row.author_url },
          { columnSlug: "community", value: row.community },
          { columnSlug: "linked_url", value: row.linked_url },
          { columnSlug: "company_name", value: row.company_name },
          { columnSlug: "company_domain", value: row.company_domain },
          { columnSlug: "seen_at", value: new Date() },
        ],
      });
    }
    for (const company of redditPicked.companies as unknown as Iterable<(typeof redditPicked.companies)[number]>) {
      model.upsert({
        modelUuid: tamCandidates.uuid,
        matchingColumnSlug: "key",
        matchingValue: company.candidate_key,
        mappings: [
          { columnSlug: "key", value: company.candidate_key },
          { columnSlug: "name", value: company.company_name },
          { columnSlug: "domain", value: company.company_domain },
          { columnSlug: "signal_source", value: "reddit_hn_signals" },
          { columnSlug: "signal_detail", value: company.post_url },
          { columnSlug: "last_signal_at", value: new Date() },
        ],
      });
    }
    return { result: "done" };
  },
);

// Every keyword once a day at 14:07 UTC. listening_keywords holds each keyword
// twice (platform x and linkedin): the filter keeps the linkedin row, so each
// keyword is searched once. Cap and cost: settings.ts.
export const redditHnDaily = definePlay("signal_feeds_reddit_hn_daily", {
  name: "Signal feeds: Reddit and Hacker News, daily",
  description:
    "For every listening keyword, each day: the last day's Reddit and Hacker News posts into reddit_hn_signals, and any company a post names to the ICP gate.",
  folder: playsFolder,
  model: listeningKeywords,
  workflow: listenForums,
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
  schedule: { type: "cron", cron: "7 14 * * *" },
  isEnabled: true,
  runCreationRule: "always",
  changeKinds: ["added", "updated", "unchanged"],
});
