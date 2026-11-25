import { defineScript } from "@cargo-ai/cdk";

import { nameKey } from "../../gtm-factory/scripts/hosts";
import { ignoredSignupDomains, signupsRouteMaxAgeHours } from "../settings";

// What routing does with one signup, before it calls anything: too old (the
// backfill), ignored (our team, test probes), or which lookups to run.
export const signupPlan = defineScript(
  async ({
    email,
    domain,
    company,
    signedUpAt,
  }: {
    email: string;
    domain?: string;
    company?: string;
    signedUpAt?: string;
  }) => {
    const lowered = String(email || "").toLowerCase();
    const emailDomain = lowered.split("@")[1] || "";
    const at = signedUpAt ? new Date(signedUpAt).getTime() : 0;
    const tooOld = !at || Date.now() - at > signupsRouteMaxAgeHours * 3600000;
    const ignored = ignoredSignupDomains.includes(emailDomain);
    const conditions: Array<Record<string, unknown>> = [
      { kind: "string", columnSlug: "email", operator: "is", values: [lowered] },
    ];
    if (domain) {
      conditions.push({
        kind: "string",
        columnSlug: "account_domain",
        operator: "is",
        values: [domain],
      });
    }
    const companyName = String(company || "").trim();
    return {
      tooOld,
      ignored,
      email: lowered,
      ledgerFilter: {
        conjonction: "or" as const,
        groups: [{ conjonction: "or" as const, conditions }],
      },
      hasCompany: Boolean(domain || companyName),
      candidateKey: domain || nameKey(companyName),
    };
  },
);
