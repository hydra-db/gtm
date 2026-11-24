import { defineScript } from "@cargo-ai/cdk";

import { companyDomain } from "./domains";
import { nameKey } from "../../gtm-factory/scripts/hosts";

type Job = {
  id?: number;
  job_title?: string;
  url?: string;
  final_url?: string;
  date_posted?: string;
  company?: string;
  company_domain?: string;
  location?: string;
  short_location?: string;
  matching_phrases?: unknown[];
  hiring_team?: { full_name?: string; role?: string; linkedin_url?: string }[];
  company_object?: { name?: string; domain?: string; linkedin_url?: string };
};

// theirStack jobs into job_post_signals rows (the live columns, unchanged)
// and the hiring companies as ICP gate candidates.
export const pickJobs = defineScript(async ({ jobs }: { jobs: unknown }) => {
  const rows = (Array.isArray(jobs) ? (jobs as Job[]) : [])
    .filter((job) => job && (job.url || job.final_url))
    .map((job) => {
      const domain = companyDomain(
        job.company_domain || (job.company_object && job.company_object.domain) || "",
      );
      const company = String(
        job.company || (job.company_object && job.company_object.name) || "",
      );
      const manager = (job.hiring_team || [])[0] || {};
      return {
        key: String(job.url || job.final_url),
        account_domain: domain,
        company,
        company_linkedin_url: String(
          (job.company_object && job.company_object.linkedin_url) || "",
        ),
        job_title: String(job.job_title || ""),
        url: String(job.url || job.final_url),
        date_posted: String(job.date_posted || ""),
        location: String(job.short_location || job.location || ""),
        matching_phrases: (Array.isArray(job.matching_phrases) ? job.matching_phrases : [])
          .map((phrase) => String(phrase))
          .join(" | ")
          .slice(0, 2000),
        hiring_manager_name: String(manager.full_name || ""),
        hiring_manager_title: String(manager.role || ""),
        hiring_manager_linkedin_url: String(manager.linkedin_url || ""),
        candidate_key: domain || nameKey(company),
      };
    });
  return { rows, companies: rows.filter((row) => row.candidate_key) };
});
