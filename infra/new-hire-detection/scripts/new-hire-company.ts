import { defineScript } from "@cargo-ai/cdk";

import { bare } from "../../gtm-factory/scripts/hosts";

// The company's bare domain from the LinkedIn enrichment, and the
// tam_candidates key: the domain, the same key every other source uses. A
// shared host (linkedin.com, github.io, ...) is no domain at all.
export const newHireCompany = defineScript(
  async ({ domain, website, name }: { domain: unknown; website: unknown; name: unknown }) => {
    const host = bare(domain) || bare(website);
    return { domain: host, key: host, name: String(name || "").trim() || host };
  },
);
