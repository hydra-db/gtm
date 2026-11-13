import { defineScript } from "@cargo-ai/cdk";

// From a title search at one company, keep the people the ICP names: the
// economic buyer (CTO, VP or Head of Engineering, a technical co-founder) and
// the champion (staff or principal engineers and leaders on AI platform, agent
// memory, retrieval). Customer-facing and non-engineering titles are dropped.

type Person = {
  full_name?: string;
  first_name?: string;
  last_name?: string;
  title?: string;
  headline?: string;
  linkedin_url?: string;
  company_domain?: string;
  city?: string;
  country?: string;
};

const NOT_ENGINEERING =
  /(solutions?|sales|customer|support|success|recruit|talent|marketing|account|partner|deployed|field|design|product manager|finance|legal|people|hr\b|intern|student|advisor|consultant)/i;
const BUYER =
  /(\bcto\b|chief technology officer|vp,? (of )?engineering|vice president,? (of )?engineering|head of engineering|svp,? (of )?engineering|co-?founder)/i;
const CHAMPION =
  /(head of ai|head of ml|head of machine learning|ai platform|ml platform|agent|memory|retrieval|knowledge graph|search|staff (software |ml |ai |machine learning )?engineer|principal (software |ml |ai |machine learning )?engineer|member of technical staff|machine learning engineer|applied ai|ai engineer|director of engineering|engineering manager|architect)/i;

export const pickContacts = defineScript(
  async ({
    people,
    domain,
    company,
  }: {
    people: unknown;
    domain: string;
    company: string;
  }) => {
    const seen: Record<string, boolean> = {};
    const clean = (Array.isArray(people) ? (people as Person[]) : [])
      .filter((person) => person && person.linkedin_url && person.title)
      .filter(
        (person) =>
          !person.company_domain ||
          String(person.company_domain).toLowerCase() === String(domain).toLowerCase(),
      )
      .filter((person) => {
        const url = String(person.linkedin_url);
        if (seen[url]) {
          return false;
        }
        seen[url] = true;
        return true;
      });
    const shape = (person: Person, role: string) => ({
      key: String(person.linkedin_url),
      account_domain: domain,
      company,
      role,
      full_name: String(person.full_name || ""),
      first_name: String(person.first_name || ""),
      last_name: String(person.last_name || ""),
      title: String(person.title || ""),
      linkedin_url: String(person.linkedin_url),
      location: [person.city, person.country].filter(Boolean).join(", "),
    });
    const buyers = clean
      .filter(
        (person) =>
          BUYER.test(String(person.title)) &&
          (!NOT_ENGINEERING.test(String(person.title)) ||
            /co-?founder|\bcto\b/i.test(String(person.title))),
      )
      .slice(0, 2)
      .map((person) => shape(person, "economic_buyer"));
    const taken: Record<string, boolean> = {};
    for (const buyer of buyers) {
      taken[buyer.key] = true;
    }
    const champions = clean
      .filter(
        (person) =>
          !taken[String(person.linkedin_url)] &&
          CHAMPION.test(String(person.title)) &&
          !NOT_ENGINEERING.test(String(person.title)),
      )
      .slice(0, 2)
      .map((person) => shape(person, "champion"));
    return { contacts: [...buyers, ...champions] };
  },
);
