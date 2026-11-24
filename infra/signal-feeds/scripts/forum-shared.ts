import { candidateKey, companyDomain, nameFromDomain } from "./domains";

// A post "names a company" when it links a site that is not a shared host or
// a news outlet and reads as first-party: a Show HN or Launch HN, or "we
// built", "I built", "introducing", "our startup". Anything else is kept as a
// signal with no company.
export const FIRST_PARTY =
  /^(show|launch) hn\b|\b(we|i)('ve| have)? (built|launched|made|released|shipped|open[- ]sourced)\b|\bintroducing\b|\bour (startup|product|company|team)\b/i;

export type ForumRow = {
  key: string;
  platform: string;
  keyword: string;
  kind: string;
  post_url: string;
  title: string;
  post_text: string;
  posted_at: string;
  engagement: number;
  author: string;
  author_url: string;
  community: string;
  linked_url: string;
  company_name: string;
  company_domain: string;
  candidate_key: string;
};

export const strip = (html: unknown): string =>
  String(html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/\s+/g, " ")
    .trim();

export const companyOf = (title: string, link: string, evidence: string) => {
  const domain = FIRST_PARTY.test(evidence) ? companyDomain(link) : "";
  if (!domain) {
    return { company_name: "", company_domain: "", candidate_key: "" };
  }
  // "Show HN: Acme, the thing" or "Show HN: Acme - the thing" -> "Acme"
  const named = title
    .replace(/^(show|launch) hn:\s*/i, "")
    .split(/\s[\u2013\u2014:|-]\s|:\s/)[0]
    .trim();
  const name = named && named.length <= 40 ? named : nameFromDomain(domain);
  return {
    company_name: name,
    company_domain: domain,
    candidate_key: candidateKey(domain, name),
  };
};

export type HnHit = {
  objectID?: string;
  title?: string | null;
  story_title?: string | null;
  url?: string | null;
  story_url?: string | null;
  comment_text?: string | null;
  story_text?: string | null;
  author?: string;
  created_at?: string;
  points?: number | null;
  num_comments?: number | null;
  story_id?: number | null;
};


export type RedditItem = {
  _type?: string;
  id?: string;
  title?: string;
  body?: string;
  author?: string;
  subreddit?: string;
  score?: number;
  commentCount?: number;
  createdAt?: string;
  threadUrl?: string;
  permalink?: string;
  outboundUrl?: string;
  isSelfPost?: boolean;
  isNsfw?: boolean;
  postTitle?: string;
  postUrl?: string;
};
