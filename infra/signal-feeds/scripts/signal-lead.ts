import { defineScript } from "@cargo-ai/cdk";

import { candidateKey, companyDomain } from "./domains";

type Obj = Record<string, unknown>;

const pick = (from: unknown, keys: string[]): string => {
  const obj = (from || {}) as Obj;
  for (const key of keys) {
    const value = obj[key];
    if (value !== undefined && value !== null && String(value).trim()) {
      return String(value).trim();
    }
  }
  return "";
};

// One Cargo Signals lead (any listen* feed) flattened: the person, their
// company and when the signal fired. Field names vary a little between feeds,
// so each value is read from the first key that holds it.
export const readSignalLead = defineScript(
  async ({
    id,
    contact,
    company,
    signalName,
    lastSignal,
    lastSignalDate,
  }: {
    id: string;
    contact: unknown;
    company: unknown;
    signalName: string;
    lastSignal: string;
    lastSignalDate: string;
  }) => {
    const domain = companyDomain(
      pick(company, ["website", "domain", "company_domain", "website_url"]),
    );
    const name = pick(company, ["name", "company_name", "legal_name"]);
    const firstLast = [pick(contact, ["first_name"]), pick(contact, ["last_name"])]
      .filter(Boolean)
      .join(" ");
    return {
      key: String(id || ""),
      signal_name: String(signalName || ""),
      detail: String(lastSignal || "").slice(0, 600),
      occurred_at: String(lastSignalDate || ""),
      person_name: pick(contact, ["full_name", "name"]) || firstLast,
      person_title: pick(contact, ["job_title", "title", "headline", "position"]),
      person_url: pick(contact, ["linkedin_profile_url", "linkedin_url", "profile_url"]),
      company_name: name,
      company_domain: domain,
      company_linkedin_url: pick(company, ["linkedin_url", "linkedin_company_url"]),
      candidate_key: candidateKey(domain, name),
      known: Boolean(domain || name),
    };
  },
);
