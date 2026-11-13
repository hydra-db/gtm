import { defineScript } from "@cargo-ai/cdk";

import { bare, nameKey } from "./hosts";

// The employer on a LinkedIn profile, as a company and a candidate key.
export const resolveEmployer = defineScript(
  async ({
    company,
    companyDomain,
    companyWebsite,
    companyLinkedinUrl,
  }: {
    company: string;
    companyDomain: string;
    companyWebsite: string;
    companyLinkedinUrl: string;
  }) => {
    const domain = bare(companyDomain) || bare(companyWebsite);
    const name = String(company || "").trim();
    return {
      company_name: name,
      company_domain: domain,
      company_linkedin_url: String(companyLinkedinUrl || ""),
      candidate_key: domain || nameKey(name),
      known: Boolean(domain || name),
    };
  },
);
