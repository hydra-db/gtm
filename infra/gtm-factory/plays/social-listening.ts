import { definePlay, defineWorkflow } from "@cargo-ai/cdk";
import { z } from "zod";

import { linkedin } from "../../tam-building-advanced/connectors/linkedin";
import { x } from "../connectors";
import { playsFolder } from "../folders";
import { listeningKeywords } from "../models/listening-keywords";
import { socialListening } from "../models/social-listening";
import { tamCandidates } from "../models/tam-candidates";
import { pickLinkedinPosts } from "../scripts/pick-linkedin-posts";
import { pickXPosts } from "../scripts/pick-x-posts";
import { resolveEmployer } from "../scripts/resolve-employer";
import {
  maxPostsPerKeyword,
  maxProfileLookupsPerKeyword,
  xResultsPerKeyword,
} from "../settings";

// One run per keyword row, every day. Finds yesterday's public posts for the
// keyword, writes one social_listening row per post with the poster's company,
// and proposes that company to the ICP gate (a tam_candidates row with no
// status). Nobody is contacted from here: this is a list of accounts.
const listen = defineWorkflow(
  "gtm_social_listening_workflow",
  {
    input: z.object({
      keyword: z.string(),
      platform: z.string(),
      kind: z.string().optional(),
    }),
    output: z.object({
      result: z.string(),
    }),
    uses: { linkedin, x },
    imports: {
      socialListening,
      tamCandidates,
      pickLinkedinPosts,
      pickXPosts,
      resolveEmployer,
      maxPostsPerKeyword,
      maxProfileLookupsPerKeyword,
      xResultsPerKeyword,
    },
  },
  ({ input, uses, model }) => {
    if (input.platform === "linkedin") {
      const found = uses.linkedin.searchPosts({
        searchKeywords: input.keyword,
        sortBy: "Latest",
        datePosted: "Past 24 hours",
      });
      const picked = pickLinkedinPosts({
        posts: found,
        keyword: input.keyword,
        kind: input.kind || "keyword",
        maxPosts: maxPostsPerKeyword,
        maxPeople: maxProfileLookupsPerKeyword,
      });

      for (const post of picked.companyPosts as unknown as Iterable<(typeof picked.companyPosts)[number]>) {
        model.upsert({
          modelUuid: socialListening.uuid,
          matchingColumnSlug: "key",
          matchingValue: post.key,
          mappings: [
            { columnSlug: "key", value: post.key },
            { columnSlug: "platform", value: post.platform },
            { columnSlug: "keyword", value: post.keyword },
            { columnSlug: "kind", value: post.kind },
            { columnSlug: "post_url", value: post.post_url },
            { columnSlug: "post_text", value: post.post_text },
            { columnSlug: "posted_at", value: post.posted_at },
            { columnSlug: "engagement", value: post.engagement },
            { columnSlug: "person_name", value: post.person_name },
            { columnSlug: "person_title", value: post.person_title },
            { columnSlug: "person_url", value: post.person_url },
            { columnSlug: "company_name", value: post.company_name },
            { columnSlug: "company_linkedin_url", value: post.company_linkedin_url },
            { columnSlug: "seen_at", value: new Date() },
          ],
        });
        model.upsert({
          modelUuid: tamCandidates.uuid,
          matchingColumnSlug: "key",
          matchingValue: post.candidate_key,
          mappings: [
            { columnSlug: "key", value: post.candidate_key },
            { columnSlug: "name", value: post.company_name },
            { columnSlug: "linkedin_url", value: post.company_linkedin_url },
            { columnSlug: "signal_source", value: "social_listening" },
            { columnSlug: "signal_detail", value: post.post_url },
            { columnSlug: "last_signal_at", value: new Date() },
          ],
        });
      }

      for (const post of picked.personPosts as unknown as Iterable<(typeof picked.personPosts)[number]>) {
        const profile = uses.linkedin.enrichProfile({
          linkedinUrl: post.person_url,
        });
        const employer = resolveEmployer({
          company: profile.company || "",
          companyDomain: profile.company_domain || "",
          companyWebsite: profile.company_website || "",
          companyLinkedinUrl: profile.company_linkedin_url || "",
        });
        model.upsert({
          modelUuid: socialListening.uuid,
          matchingColumnSlug: "key",
          matchingValue: post.key,
          mappings: [
            { columnSlug: "key", value: post.key },
            { columnSlug: "platform", value: post.platform },
            { columnSlug: "keyword", value: post.keyword },
            { columnSlug: "kind", value: post.kind },
            { columnSlug: "post_url", value: post.post_url },
            { columnSlug: "post_text", value: post.post_text },
            { columnSlug: "posted_at", value: post.posted_at },
            { columnSlug: "engagement", value: post.engagement },
            { columnSlug: "person_name", value: post.person_name },
            { columnSlug: "person_title", value: post.person_title },
            { columnSlug: "person_url", value: post.person_url },
            { columnSlug: "company_name", value: employer.company_name },
            { columnSlug: "company_domain", value: employer.company_domain },
            { columnSlug: "company_linkedin_url", value: employer.company_linkedin_url },
            { columnSlug: "seen_at", value: new Date() },
          ],
        });
        if (employer.known) {
          model.upsert({
            modelUuid: tamCandidates.uuid,
            matchingColumnSlug: "key",
            matchingValue: employer.candidate_key,
            mappings: [
              { columnSlug: "key", value: employer.candidate_key },
              { columnSlug: "name", value: employer.company_name },
              { columnSlug: "domain", value: employer.company_domain },
              { columnSlug: "linkedin_url", value: employer.company_linkedin_url },
              { columnSlug: "signal_source", value: "social_listening" },
              { columnSlug: "signal_detail", value: post.post_url },
              { columnSlug: "last_signal_at", value: new Date() },
            ],
          });
        }
      }
      return { result: "linkedin" };
    }

    const tweets = uses.x.searchPosts({
      query: input.keyword,
      type: "Latest",
      limit: xResultsPerKeyword,
    });
    const pickedX = pickXPosts({
      posts: tweets,
      keyword: input.keyword,
      kind: input.kind || "keyword",
      maxPosts: maxPostsPerKeyword,
    });
    for (const row of pickedX.rows as unknown as Iterable<(typeof pickedX.rows)[number]>) {
      model.upsert({
        modelUuid: socialListening.uuid,
        matchingColumnSlug: "key",
        matchingValue: row.key,
        mappings: [
          { columnSlug: "key", value: row.key },
          { columnSlug: "platform", value: row.platform },
          { columnSlug: "keyword", value: row.keyword },
          { columnSlug: "kind", value: row.kind },
          { columnSlug: "post_url", value: row.post_url },
          { columnSlug: "post_text", value: row.post_text },
          { columnSlug: "posted_at", value: row.posted_at },
          { columnSlug: "engagement", value: row.engagement },
          { columnSlug: "person_name", value: row.person_name },
          { columnSlug: "person_title", value: row.person_title },
          { columnSlug: "person_url", value: row.person_url },
          { columnSlug: "company_name", value: row.company_name },
          { columnSlug: "company_domain", value: row.company_domain },
          { columnSlug: "seen_at", value: new Date() },
        ],
      });
    }
    for (const company of pickedX.companies as unknown as Iterable<(typeof pickedX.companies)[number]>) {
      model.upsert({
        modelUuid: tamCandidates.uuid,
        matchingColumnSlug: "key",
        matchingValue: company.candidate_key,
        mappings: [
          { columnSlug: "key", value: company.candidate_key },
          { columnSlug: "name", value: company.company_name },
          { columnSlug: "domain", value: company.company_domain },
          { columnSlug: "signal_source", value: "social_listening" },
          { columnSlug: "signal_detail", value: company.post_url },
          { columnSlug: "last_signal_at", value: new Date() },
        ],
      });
    }
    return { result: "x" };
  },
);

// Every keyword row, once a day at 13:23 UTC. Piloted by hand on 2026-11-13.
// Daily spend ceiling: one LinkedIn search (0.25) plus up to
// maxProfileLookupsPerKeyword lookups (0.25 each) per LinkedIn keyword, and
// 0.02 per X keyword.
export const socialListeningDaily = definePlay("gtm_social_listening_daily", {
  name: "Social listening: daily keyword search on LinkedIn and X",
  description:
    "For every listening_keywords row, each day: find the last day's public posts, add the posters' companies to social_listening, and propose them to the ICP gate.",
  folder: playsFolder,
  model: listeningKeywords,
  workflow: listen,
  schedule: { type: "cron", cron: "23 13 * * *" },
  isEnabled: true,
  runCreationRule: "always",
  changeKinds: ["added", "updated", "unchanged"],
});
