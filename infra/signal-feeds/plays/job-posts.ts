import { definePlay, defineWorkflow } from "@cargo-ai/cdk";
import { z } from "zod";

import { playsFolder } from "../../gtm-factory/folders";
import { jobPostSignals } from "../../gtm-factory/models/job-post-signals";
import { tamCandidates } from "../../gtm-factory/models/tam-candidates";
import { theirStack } from "../connectors";
import { signalFeedInputs } from "../models/signal-feed-inputs";
import { pickJobs } from "../scripts/jobs";
import {
  jobDescriptionPatterns,
  jobPostLimit,
  jobPostMaxAgeDays,
  jobTitlePatterns,
} from "../settings";

// The one-off theirStack search, made recurring: engineering and AI jobs
// posted in the last day whose description names graph, memory or context
// work. Each job lands in job_post_signals (its live columns, unchanged); the
// hiring company goes to the ICP gate.
const searchJobPosts = defineWorkflow(
  "signal_feeds_job_posts_workflow",
  {
    input: z.object({ value: z.string().optional() }),
    output: z.object({ result: z.string() }),
    uses: { theirStack },
    imports: {
      jobPostSignals,
      tamCandidates,
      pickJobs,
      jobDescriptionPatterns,
      jobPostLimit,
      jobPostMaxAgeDays,
      jobTitlePatterns,
    },
  },
  ({ uses, model }) => {
    const jobs = uses.theirStack.searchJobs({
      fields: {
        job_description_pattern_or: jobDescriptionPatterns,
        job_description_pattern_is_case_insensitive: true,
        job_title_pattern_or: jobTitlePatterns,
        posted_at_max_age_days: jobPostMaxAgeDays,
      },
      limit: jobPostLimit,
    });
    const picked = pickJobs({ jobs });
    for (const row of picked.rows as unknown as Iterable<(typeof picked.rows)[number]>) {
      model.upsert({
        modelUuid: jobPostSignals.uuid,
        matchingColumnSlug: "key",
        matchingValue: row.key,
        mappings: [
          { columnSlug: "key", value: row.key },
          { columnSlug: "account_domain", value: row.account_domain },
          { columnSlug: "company", value: row.company },
          { columnSlug: "job_title", value: row.job_title },
          { columnSlug: "url", value: row.url },
          { columnSlug: "date_posted", value: row.date_posted },
          { columnSlug: "location", value: row.location },
          { columnSlug: "matching_phrases", value: row.matching_phrases },
          { columnSlug: "hiring_manager_name", value: row.hiring_manager_name },
          { columnSlug: "hiring_manager_title", value: row.hiring_manager_title },
          { columnSlug: "hiring_manager_linkedin_url", value: row.hiring_manager_linkedin_url },
          { columnSlug: "source", value: "theirstack" },
          { columnSlug: "found_at", value: new Date() },
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
          { columnSlug: "name", value: company.company },
          { columnSlug: "domain", value: company.account_domain },
          { columnSlug: "linkedin_url", value: company.company_linkedin_url },
          { columnSlug: "signal_source", value: "job_post_signals" },
          { columnSlug: "signal_detail", value: company.url },
          { columnSlug: "last_signal_at", value: new Date() },
        ],
      });
    }
    return { result: "done" };
  },
);

// The signal_feed_inputs row with feed "job_posts", at 05:43 and 17:43 UTC.
// Cap and cost: settings.ts (jobPostLimit jobs a run, 0.5 credits each).
export const jobPostsEvery12h = definePlay("signal_feeds_job_posts_12h", {
  name: "Signal feeds: job posts, every 12 hours",
  description:
    "theirStack jobs from the last day that mention graph, memory or context work into job_post_signals, and the hiring companies to the ICP gate.",
  folder: playsFolder,
  model: signalFeedInputs,
  workflow: searchJobPosts,
  filter: {
    conjonction: "and",
    groups: [
      {
        conjonction: "and",
        conditions: [
          { kind: "string", columnSlug: "feed", operator: "is", values: ["job_posts"] },
        ],
      },
    ],
  },
  schedule: { type: "cron", cron: "43 5,17 * * *" },
  isEnabled: true,
  runCreationRule: "always",
  changeKinds: ["added", "updated", "unchanged"],
});
