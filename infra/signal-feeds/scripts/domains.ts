// Shared by the signal feeds' scripts: turning a URL into a company domain.
import { SHARED_HOSTS, nameKey } from "../../gtm-factory/scripts/hosts";

// Hosts that are never the poster's company: news and media, forums, app
// hosting platforms, package registries, mail providers, schools.
const NOT_A_COMPANY = [
  ...SHARED_HOSTS,
  "news.ycombinator.com", "reddit.com", "redd.it", "imgur.com", "gitlab.com",
  "bitbucket.org", "pypi.org", "npmjs.com", "crates.io", "docs.google.com",
  "google.com", "apple.com", "amazon.com", "microsoft.com", "wikipedia.org",
  "techcrunch.com", "theverge.com", "venturebeat.com", "wired.com", "arstechnica.com",
  "bloomberg.com", "reuters.com", "nytimes.com", "wsj.com", "ft.com", "forbes.com",
  "businessinsider.com", "cnbc.com", "zdnet.com", "infoq.com", "thenewstack.io",
  "theregister.com", "techradar.com", "siliconangle.com", "towardsdatascience.com",
  "analyticsvidhya.com", "kdnuggets.com", "freecodecamp.org", "geeksforgeeks.org",
  "hackernoon.com", "dzone.com", "builtin.com", "producthunt.com", "linkedin.com",
  "vercel.app", "netlify.app", "pages.dev", "herokuapp.com", "fly.dev", "onrender.com",
  "readthedocs.io", "gitbook.io", "ghost.io", "beehiiv.com", "mintlify.app",
  "streamlit.app", "replit.app", "web.app", "firebaseapp.com", "azurewebsites.net",
  "outlook.com", "hotmail.com", "yahoo.com", "icloud.com", "proton.me", "protonmail.com",
  "qq.com", "163.com", "live.com", "me.com", "aol.com", "gmx.com", "yandex.ru", "mail.ru",
];

// Second-level labels under which a registrable domain has three labels
// (acme.co.uk, acme.com.au).
const SECOND_LEVEL = ["co", "com", "ac", "org", "net", "gov", "edu", "ne", "or"];

const host = (value: unknown): string =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^[a-z]+:\/\//, "")
    .replace(/^www\./, "")
    .split(/[/?#:]/)[0];

// The registrable domain of a URL or host, or "" when it names no company.
export const companyDomain = (value: unknown): string => {
  const h = host(value);
  if (!h || !h.includes(".") || h.includes(" ") || /^[0-9.]+$/.test(h)) {
    return "";
  }
  if (NOT_A_COMPANY.some((bad) => h === bad || h.endsWith(`.${bad}`))) {
    return "";
  }
  const parts = h.split(".");
  const tld = parts[parts.length - 1];
  const sld = parts[parts.length - 2];
  const keep = tld.length === 2 && SECOND_LEVEL.includes(sld) ? 3 : 2;
  const root = parts.slice(-keep).join(".");
  // Universities and schools are not accounts.
  if (/\.(edu|ac\.[a-z]{2}|edu\.[a-z]{2})$/.test(root) || /^ac\.|\.edu$/.test(root)) {
    return "";
  }
  return root;
};

// "acme-labs.io" -> "Acme Labs", for a company name when only a domain is known.
export const nameFromDomain = (domain: string): string =>
  String(domain || "")
    .split(".")[0]
    .split(/[-_]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export const candidateKey = (domain: string, name: string): string =>
  domain || nameKey(name);
