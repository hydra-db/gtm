import { defineScript } from "@cargo-ai/cdk";

import { candidateKey, companyDomain, nameFromDomain } from "./domains";

type ExaResult = {
  url?: string;
  title?: string | null;
  publishedDate?: string | null;
  author?: string | null;
};

// One row per post; the company is the site's own registrable domain.
export const pickBlogPosts = defineScript(
  async ({
    response,
    keyword,
    kind,
  }: {
    response: unknown;
    keyword: string;
    kind: string;
  }) => {
    const results =
      ((response as { results?: ExaResult[] } | null)?.results || []).filter(
        (result) => result && result.url,
      );
    const rows = results.map((result) => {
      const domain = companyDomain(result.url);
      const name = domain ? nameFromDomain(domain) : "";
      return {
        key: String(result.url),
        keyword,
        kind: kind || "keyword",
        url: String(result.url),
        title: String(result.title || "").slice(0, 300),
        author: String(result.author || "").slice(0, 200),
        published_at: String(result.publishedDate || ""),
        company_name: name,
        company_domain: domain,
        candidate_key: domain ? candidateKey(domain, name) : "",
      };
    });
    return { rows, companies: rows.filter((row) => row.candidate_key) };
  },
);
