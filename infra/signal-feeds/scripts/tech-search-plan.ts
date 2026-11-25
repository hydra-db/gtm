import { defineScript } from "@cargo-ai/cdk";

import { companyDomain } from "./domains";

type DomainRow = { domain?: string | null };

const domainsOf = (rows: unknown): string[] =>
  (Array.isArray(rows) ? (rows as DomainRow[]) : [])
    .map((row) => companyDomain(row && row.domain))
    .filter(Boolean);

// The searchCompanies filters, and the domains to leave out of them: every
// company this feed already found (never billed twice) and every known
// company the search could return (TAM_MASTER_FINAL past pre-B, tam_candidates
// with 50 or more employees). Free: the lists come from model searches.
export const planTechSearch = defineScript(
  async ({
    own,
    book,
    candidatesQualified,
    candidatesOther,
    slugs,
    countries,
    minEmployees,
    maxEmployees,
    fundingStages,
    limit,
    maxLimit,
  }: {
    own: unknown;
    book: unknown;
    candidatesQualified: unknown;
    candidatesOther: unknown;
    slugs: string[];
    countries: string[];
    minEmployees: number;
    maxEmployees: number;
    fundingStages: string[];
    limit: unknown;
    maxLimit: number;
  }) => {
    const excluded = Array.from(
      new Set([
        ...domainsOf(own),
        ...domainsOf(book),
        ...domainsOf(candidatesQualified),
        ...domainsOf(candidatesOther),
      ]),
    ).sort();
    const asked = Number(limit);
    return {
      excluded,
      limit: asked > 0 ? Math.min(asked, maxLimit) : maxLimit,
      fields: {
        company_technology_slug_or: slugs,
        company_country_code_or: countries,
        min_employee_count: minEmployees,
        max_employee_count: maxEmployees,
        funding_stage_or: fundingStages,
        company_domain_not: excluded,
      },
    };
  },
);

