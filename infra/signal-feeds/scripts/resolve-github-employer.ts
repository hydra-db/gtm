import { defineScript } from "@cargo-ai/cdk";

import { companyDomain, nameFromDomain } from "./domains";
import { nameKey } from "../../gtm-factory/scripts/hosts";

type GithubUser = {
  username?: string;
  login?: string;
  name?: string | null;
  company?: string | null;
  blog?: string | null;
  email?: string | null;
  bio?: string | null;
};

const NOT_AN_EMPLOYER =
  /\b(student|university|universit|college|school|institute of technology|freelanc|self[- ]?employed|independent|personal|none|n\/a|unemployed|retired|looking for|open to work|hobby|home)\b/i;

const normal = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

// The person's employer from their GitHub profile, or known: false. A work
// email domain wins; then the company field, with the blog's domain when the
// blog is on that company's site. A profile naming no company, or a school,
// a freelance or a personal account, is not kept.
export const resolveGithubEmployer = defineScript(
  async ({ user }: { user: unknown }) => {
    const profile = (user || {}) as GithubUser;
    const login = String(profile.username || profile.login || "");
    const rawCompany = String(profile.company || "").trim();
    const company = rawCompany
      .replace(/^@/, "")
      .split(/[,|/]| and | & /)[0]
      .replace(/\b(inc|llc|ltd|gmbh|corp|co)\.?$/i, "")
      .trim();
    const emailDomain = companyDomain(String(profile.email || "").split("@")[1] || "");
    const blogDomain = companyDomain(profile.blog);
    const companyUsable = company.length >= 2 && !NOT_AN_EMPLOYER.test(rawCompany);
    const blogMatches =
      Boolean(blogDomain) &&
      companyUsable &&
      normal(blogDomain.split(".")[0]).length >= 3 &&
      (normal(company).includes(normal(blogDomain.split(".")[0])) ||
        normal(blogDomain.split(".")[0]).includes(normal(company)));
    // A personal blog named after the person is not a company.
    const blogIsPersonal =
      Boolean(blogDomain) &&
      (normal(blogDomain.split(".")[0]) === normal(login) ||
        normal(String(profile.name || "")).includes(normal(blogDomain.split(".")[0])));
    const domain = emailDomain || (blogMatches && !blogIsPersonal ? blogDomain : "");
    const name = companyUsable ? company : domain ? nameFromDomain(domain) : "";
    const known = Boolean(domain || companyUsable);
    return {
      known,
      login,
      person_name: String(profile.name || login),
      person_bio: String(profile.bio || "").slice(0, 300),
      company_name: name,
      company_domain: domain,
      company_label: domain ? `${name} (${domain})` : name,
      candidate_key: domain || nameKey(name),
    };
  },
);
