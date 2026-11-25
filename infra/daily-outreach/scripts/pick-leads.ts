import { defineScript } from "@cargo-ai/cdk";

// Who the daily outreach run drafts for today, and the drafter input for each.
//
// Accounts come in already ordered (ready_now, then warming, highest score
// first). For each account, in that order: its final_tam_contacts whose email
// is valid in email_checks, who are not in do_not_contact (by domain, email or
// LinkedIn URL) and not in the outreach_enrollments ledger, with an
// engineering or AI leadership title, best title first. The person whose own
// move is the signal (role `signal`, from new-hire-detection) comes before
// everyone else at the account, and opens with their own new-hire event; a
// signal person's title is drafted unless it is excluded outright. An
// account with no account event in the last `signalMaxAgeDays` days is
// skipped: there is nothing to open with. Stops at `cap` people.

type Row = Record<string, unknown>;

type Lead = {
  key: string;
  email: string;
  account_domain: string;
  company: string;
  full_name: string;
  first_name: string;
  last_name: string;
  title: string;
  linkedin_url: string;
  readiness_stage: string;
  signal_type: string;
  signal_url: string;
  signal_date: string;
  signal_quote: string;
  sender_email: string;
  sender_name: string;
  campaign: string;
  prompt: string;
};

const list = (value: unknown): Row[] => (Array.isArray(value) ? (value as Row[]) : []);
const text = (value: unknown): string =>
  value === null || value === undefined ? "" : String(value).trim();
const lower = (value: unknown): string => text(value).toLowerCase();
const linkedinKey = (value: unknown): string =>
  lower(value)
    .replace(/^https?:\/\//, "")
    .replace(/^([a-z]{2,3}\.)?(www\.)?/, "")
    .replace(/[?#].*$/, "")
    .replace(/\/+$/, "");
const clip = (value: unknown, max: number): string => {
  const t = text(value).replace(/\s+/g, " ");
  return t.length > max ? `${t.slice(0, max - 3)}...` : t;
};

// Titles. Excluded first (growth, sales, marketing, design, non-engineering),
// SRE-only titles unless they also lead engineering, then a rank: lower is
// better. A title that matches no rank is not drafted.
const EXCLUDED =
  /(growth|sales|marketing|go-to-market|\bgtm\b|revenue|business development|\bbdr\b|\bsdr\b|account (executive|manager)|customer|support|success|solutions?|design|designer|\bux\b|\bui\b|recruit|talent|people|\bhr\b|finance|legal|partner|intern|student|advisor|consultant|product marketing)/i;
const SRE = /(site reliability|\bsre\b)/i;
const RANKS: RegExp[] = [
  /(\bcto\b|chief technology officer|chief ai officer|\bcaio\b)/i,
  /((vp|vice president|svp|head|director)\b.{0,20}\b(engineering|ai|artificial intelligence|machine learning|\bml\b|platform|data science|applied ai)|co-?founder)/i,
  /((\bai\b|\bml\b|machine learning|llm|genai|gen ai|platform|agent|applied ai|ai platform|ml platform|infrastructure).{0,25}\b(lead|manager|head|architect)|\blead\b.{0,25}(\bai\b|\bml\b|machine learning|platform|agent))/i,
  /\b(staff|principal|distinguished)\b.{0,30}(engineer|scientist|architect)/i,
  /(founding engineer|member of technical staff|engineering manager|machine learning engineer|\bml engineer|\bai engineer|research scientist|architect)/i,
];
const titleRank = (title: string): number => {
  if (!title || EXCLUDED.test(title)) {
    return -1;
  }
  const rank = RANKS.findIndex((pattern) => pattern.test(title));
  if (rank === -1) {
    return -1;
  }
  if (SRE.test(title) && rank > 1) {
    return -1;
  }
  return rank;
};

// Names: no parentheses, no credentials after a comma, no middle initials,
// no suffixes, no emoji ("🦄 Jeff McCoy" is Jeff McCoy).
const SUFFIX = /^(jr|sr|ii|iii|iv|phd|ph\.d|md|mba|cpa|cfa|pe|esq|msc|ms|bsc|pmp)\.?$/i;
const cleanName = (fullName: string, firstName: string, lastName: string) => {
  const base = (fullName || `${firstName} ${lastName}`)
    .replace(/\([^)]*\)/g, " ")
    .replace(/,.*$/, " ")
    .replace(/\s+/g, " ")
    .trim();
  const tokens = base
    .split(" ")
    .filter((token) => token && /\p{L}/u.test(token) && !SUFFIX.test(token))
    .filter((token, index, all) => index === 0 || index === all.length - 1 || !/^[A-Za-z]\.?$/.test(token));
  const first = tokens[0] || text(firstName);
  const last = tokens.length > 1 ? tokens.slice(1).join(" ") : text(lastName);
  return { first, last, full: [first, last].filter(Boolean).join(" ") };
};

// The account event, shaped as the drafter's `signal`.
const signalOf = (event: Row) => {
  const p = (event.properties || {}) as Row;
  const slug = text(event.model_slug);
  const date = text(event.occurred_at).slice(0, 10);
  switch (slug) {
    case "job_post_signals":
      return {
        type: "job_post",
        summary: `Hiring: ${text(p.job_title)}`,
        url: text(p.url || p.key),
        date: text(p.date_posted) || date,
        quote: clip(p.matching_phrases, 400),
      };
    case "oss_signals": {
      const repo = text(p.repos).split(",")[0].trim();
      return {
        type: "github",
        summary: clip(p.signal, 300),
        url: repo ? `https://github.com/${repo}` : "",
        date,
        quote: clip(p.signal, 400),
      };
    }
    case "github_signals":
      return {
        type: "github",
        summary: `${text(p.person_name || p.login)} ${text(p.action)} ${text(p.repo)}`.trim(),
        url: text(p.url),
        date,
        quote: clip(p.person_bio, 300),
      };
    case "social_listening":
      return {
        type: lower(p.platform) === "x" ? "x_post" : "linkedin_post",
        summary: `${text(p.person_name)} (${text(p.person_title)}) posted about ${text(p.keyword)}`,
        url: text(p.post_url),
        date: text(p.posted_at).slice(0, 10) || date,
        quote: clip(p.post_text, 400),
      };
    case "reddit_hn_signals":
      return {
        type: lower(p.platform) === "hn" || lower(p.platform).includes("hacker") ? "hacker_news" : "reddit",
        summary: clip(p.title, 200),
        url: text(p.post_url),
        date: text(p.posted_at).slice(0, 10) || date,
        quote: clip(p.post_text || p.title, 400),
      };
    case "blog_signals":
      return {
        type: "blog_post",
        summary: clip(p.title, 200),
        url: text(p.url),
        date: text(p.published_at).slice(0, 10) || date,
        quote: clip(p.title, 300),
      };
    case "new_hire_signals":
      return {
        type: "new_hire",
        summary: `${text(p.person_name)} just started as ${text(p.title)} at ${text(p.company)}`,
        url: text(p.linkedin_url),
        // When we saw the new role (the event date): the start is known only
        // to the month, so it is not the date the opener cites.
        date,
        quote: text(p.title),
      };
    case "linkedin_engagement_signals":
    case "job_switch_signals":
      return {
        type: slug === "job_switch_signals" ? "new_technical_leader" : "linkedin_engagement",
        summary: `${text(p.person_name)} (${text(p.person_title)}): ${clip(p.detail || p.signal_name, 200)}`,
        url: text(p.person_url),
        date,
        quote: clip(p.detail, 300),
      };
    case "tech_adoption_signals":
      return {
        type: "tech_stack",
        summary: `Uses ${text(p.tools_matched)} (from their job posts, theirStack)`,
        url: "",
        date: text(p.detected_at).slice(0, 10) || date,
        quote: text(p.first_seen) ? `First seen ${text(p.first_seen)}` : "",
      };
    case "website_visitors":
      return {
        type: "website_visit",
        summary: "Visited hydradb.com",
        url: "",
        date,
        quote: "",
      };
    default:
      return { type: slug, summary: clip(JSON.stringify(p), 300), url: "", date, quote: "" };
  }
};

export const pickLeads = defineScript(
  async ({
    accounts,
    contacts,
    checks,
    doNotContact,
    ledger,
    events,
    companies,
    yc,
    cap,
    maxPerAccount,
    signalMaxAgeDays,
    senders,
    campaignId,
  }: {
    accounts: unknown;
    contacts: unknown;
    checks: unknown;
    doNotContact: unknown;
    ledger: unknown;
    events: unknown;
    companies: unknown;
    yc: unknown;
    cap: number;
    maxPerAccount: number;
    signalMaxAgeDays: number;
    senders: { email: string; name: string }[];
    campaignId: string;
  }) => {
    const valid: Record<string, boolean> = {};
    for (const row of list(checks)) {
      if (lower(row.email_status) === "valid") {
        valid[lower(row.email)] = true;
      }
    }
    const blocked = { domain: {} as Record<string, boolean>, email: {} as Record<string, boolean>, linkedin: {} as Record<string, boolean> };
    for (const row of list(doNotContact)) {
      if (lower(row.domain)) blocked.domain[lower(row.domain).replace(/^www\./, "")] = true;
      if (lower(row.email)) blocked.email[lower(row.email)] = true;
      if (linkedinKey(row.linkedin_url)) blocked.linkedin[linkedinKey(row.linkedin_url)] = true;
    }
    const enrolled: Record<string, boolean> = {};
    const perAccount: Record<string, number> = {};
    for (const row of list(ledger)) {
      if (lower(row.email)) enrolled[lower(row.email)] = true;
      if (linkedinKey(row.linkedin_url)) enrolled[linkedinKey(row.linkedin_url)] = true;
      const domain = lower(row.account_domain);
      perAccount[domain] = (perAccount[domain] || 0) + 1;
    }

    // Freshest event per account in the window; one with a URL wins a tie.
    const cutoff = Date.now() - signalMaxAgeDays * 86400000;
    const freshest: Record<string, Row> = {};
    for (const event of list(events)) {
      const at = new Date(text(event.occurred_at)).getTime();
      if (!at || at < cutoff || at > Date.now() + 86400000) continue;
      const id = text(event.account_id);
      const current = freshest[id];
      const currentAt = current ? new Date(text(current.occurred_at)).getTime() : 0;
      if (!current || at > currentAt) freshest[id] = event;
    }

    // Each new hire's own event, by LinkedIn URL, so a signal person opens
    // with their own move rather than the account's latest event.
    const newHireEvent: Record<string, Row> = {};
    for (const event of list(events)) {
      if (text(event.model_slug) !== "new_hire_signals") continue;
      const at = new Date(text(event.occurred_at)).getTime();
      if (!at || at < cutoff) continue;
      const p = (event.properties || {}) as Row;
      const li = linkedinKey(p.linkedin_url);
      if (li && !newHireEvent[li]) newHireEvent[li] = event;
    }

    const companyByDomain: Record<string, Row> = {};
    for (const row of list(companies)) companyByDomain[lower(row.domain)] = row;
    const ycByLinkedin: Record<string, Row> = {};
    for (const row of list(yc)) ycByLinkedin[linkedinKey(row.person_linkedin_url)] = row;
    const contactsByDomain: Record<string, Row[]> = {};
    for (const row of list(contacts)) {
      const domain = lower(row.account_domain);
      (contactsByDomain[domain] = contactsByDomain[domain] || []).push(row);
    }

    // Senders alternate within the day, starting on a different one each day,
    // so the split stays even over time.
    const dayIndex = Math.floor(Date.now() / 86400000);
    const leads: Lead[] = [];
    const skipped = { noSignal: 0, invalidEmail: 0, doNotContact: 0, enrolled: 0, title: 0 };
    for (const account of list(accounts)) {
      if (leads.length >= cap) break;
      const domain = lower(account.domain);
      if (!domain || blocked.domain[domain]) continue;
      const event = freshest[text(account.id)];
      const people = contactsByDomain[domain] || [];
      if (!event) {
        skipped.noSignal += people.length;
        continue;
      }
      const company = companyByDomain[domain] || {};
      const ranked = people
        .map((person) => {
          const isSignal = lower(person.role) === "signal";
          const rank = titleRank(text(person.title));
          // A signal person is ranked ahead of every title (-1 is "not
          // drafted", so they sort as -0.5), unless the title is excluded.
          return {
            person,
            isSignal,
            rank: isSignal && !EXCLUDED.test(text(person.title)) ? -0.5 : rank,
          };
        })
        .filter((entry) => {
          const email = lower(entry.person.email);
          const li = linkedinKey(entry.person.linkedin_url);
          if (entry.rank === -1) { skipped.title += 1; return false; }
          if (!email || !valid[email]) { skipped.invalidEmail += 1; return false; }
          if (blocked.email[email] || (li && blocked.linkedin[li])) { skipped.doNotContact += 1; return false; }
          if (enrolled[email] || (li && enrolled[li])) { skipped.enrolled += 1; return false; }
          return true;
        })
        .sort((a, b) => a.rank - b.rank);
      const seen: Record<string, boolean> = {};
      for (const entry of ranked) {
        if (leads.length >= cap || (perAccount[domain] || 0) >= maxPerAccount) break;
        const person = entry.person;
        const email = lower(person.email);
        if (seen[email]) continue;
        seen[email] = true;
        perAccount[domain] = (perAccount[domain] || 0) + 1;
        const ownEvent = entry.isSignal ? newHireEvent[linkedinKey(person.linkedin_url)] : undefined;
        const signal = signalOf(ownEvent || event);
        const name = cleanName(text(person.full_name), text(person.first_name), text(person.last_name));
        const ycRow = ycByLinkedin[linkedinKey(person.linkedin_url)] || {};
        const isYc = ["yes", "true", "1"].includes(lower(ycRow.is_yc));
        const sender = senders[(dayIndex + leads.length) % senders.length];
        const companyName = text(company.name) || text(person.company) || domain;
        const input = {
          person: {
            name: name.full,
            first_name: name.first,
            title: text(person.title),
            company: companyName,
            linkedin_url: text(person.linkedin_url),
            is_yc: isYc,
            yc_batch: isYc ? text(ycRow.yc_batch) : "",
            yc_company: isYc ? text(ycRow.company) : "",
          },
          company: {
            name: companyName,
            domain,
            what_they_do: text(company.what_they_do),
            use_case: text(company.use_case),
            graph_evidence: text(company.graph_evidence),
          },
          signal,
          route: { kind: "direct", target_person_name: "", target_title: "" },
          sender_name: sender.name,
        };
        leads.push({
          key: email,
          email,
          account_domain: domain,
          company: companyName,
          full_name: name.full,
          first_name: name.first,
          last_name: name.last,
          title: text(person.title),
          linkedin_url: text(person.linkedin_url),
          readiness_stage: text(account.computed__readiness_stage),
          signal_type: signal.type,
          signal_url: signal.url,
          signal_date: signal.date,
          signal_quote: signal.quote,
          sender_email: sender.email,
          sender_name: sender.name,
          campaign: campaignId,
          prompt: JSON.stringify(input),
        });
      }
    }
    return { leads, count: leads.length, skipped, useLemlist: Boolean(campaignId) };
  },
);
