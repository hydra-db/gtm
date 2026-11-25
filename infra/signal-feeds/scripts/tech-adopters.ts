import { defineScript } from "@cargo-ai/cdk";

import { candidateKey, companyDomain } from "./domains";

type Found = {
  technology?: { slug?: string; name?: string };
  first_date_found?: string;
};
type Company = {
  name?: string;
  domain?: string;
  url?: string;
  linkedin_url?: string;
  technology_slugs?: string[];
  technology_names?: string[];
  technologies_found?: Found[];
};

// theirStack companies into tech_adoption_signals rows: the tracked tools each
// one uses and the earliest date theirStack first saw one. A company whose
// domain is on the excluded list (should the search ignore the filter) is
// kept as a signal but not proposed again.
export const pickAdopters = defineScript(
  async ({
    companies,
    excluded,
    slugs,
  }: {
    companies: unknown;
    excluded: string[];
    slugs: string[];
  }) => {
    const known = new Set(Array.isArray(excluded) ? excluded : []);
    const tracked = new Set(slugs);
    const rows = (Array.isArray(companies) ? (companies as Company[]) : [])
      .filter((company) => company && (company.domain || company.url || company.name))
      .map((company) => {
        const domain = companyDomain(company.domain || company.url || "");
        const name = String(company.name || "");
        const found = (Array.isArray(company.technologies_found) ? company.technologies_found : [])
          .filter((entry) => entry && entry.technology && tracked.has(String(entry.technology.slug)));
        const tools = found.length
          ? found.map((entry) => String((entry.technology && (entry.technology.name || entry.technology.slug)) || ""))
          : (Array.isArray(company.technology_slugs) ? company.technology_slugs : [])
              .filter((slug) => tracked.has(String(slug)));
        const firstSeen = found
          .map((entry) => String(entry.first_date_found || "").slice(0, 10))
          .filter(Boolean)
          .sort()[0] || "";
        return {
          key: candidateKey(domain, name),
          company: name,
          domain,
          linkedin_url: String(company.linkedin_url || ""),
          tools_matched: Array.from(new Set(tools.filter(Boolean))).join(", "),
          first_seen: firstSeen,
          propose: !domain || !known.has(domain),
        };
      })
      .filter((row) => row.key);
    return { rows, proposals: rows.filter((row) => row.propose) };
  },
);
