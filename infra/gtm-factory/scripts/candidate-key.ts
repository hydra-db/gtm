import { defineScript } from "@cargo-ai/cdk";

import { bare, nameKey } from "./hosts";

// For rows pushed into oss_signals: the candidate key for the ICP gate.
export const candidateKey = defineScript(
  async ({ domain, company }: { domain: string; company: string }) => {
    const bareDomain = bare(domain);
    const name = String(company || "").trim();
    return {
      key: bareDomain || nameKey(name),
      domain: bareDomain,
      name: name || bareDomain,
      known: Boolean(bareDomain || name),
    };
  },
);
