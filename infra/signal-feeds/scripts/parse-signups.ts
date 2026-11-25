import { defineScript } from "@cargo-ai/cdk";

import { personalEmailDomains } from "../settings";

// Slack escapes &, < and >, and wraps links as <url|label> or <url>: keep
// the label, else the url.
const unwrap = (value: string): string => {
  const text = value
    .trim()
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
  const match = text.match(/^<([^|>]+)(?:\|([^>]*))?>$/);
  if (!match) {
    return text;
  }
  const inner = match[2] || match[1];
  return inner.replace(/^mailto:/i, "").trim();
};

// One signup per "New signup!" bot message. Every field but the email is
// optional: the bot omits what it does not know.
export const parseSignups = defineScript(
  async ({ messages }: { messages: unknown }) => {
    const list = Array.isArray(messages)
      ? (messages as Array<{ ts?: string; text?: string }>)
      : [];
    const seen: Record<string, boolean> = {};
    const rows: Array<{
      key: string;
      name: string;
      email: string;
      linkedin_url: string;
      company: string;
      title: string;
      category: string;
      source: string;
      signed_up_at: string;
      domain: string;
      slack_ts: string;
    }> = [];
    for (const message of list) {
      const text = String(message.text || "");
      if (!/^\s*New signup!/i.test(text)) {
        continue;
      }
      const fields: Record<string, string> = {};
      for (const line of text.split("\n")) {
        const at = line.indexOf(":");
        if (at <= 0) {
          continue;
        }
        const label = line.slice(0, at).trim().toLowerCase();
        fields[label] = unwrap(line.slice(at + 1));
      }
      const email = String(fields.email || "").toLowerCase();
      if (!email.includes("@") || seen[email]) {
        continue;
      }
      seen[email] = true;
      const emailDomain = email.split("@")[1] || "";
      const personal = personalEmailDomains.includes(emailDomain);
      const ts = Number(message.ts || 0);
      rows.push({
        key: email,
        name: fields.name || "",
        email,
        linkedin_url: fields.linkedin || "",
        company: fields.company || "",
        title: fields.title || "",
        category: fields.category || "",
        source: fields.source || "",
        signed_up_at: ts ? new Date(ts * 1000).toISOString() : "",
        domain: personal ? "" : emailDomain,
        slack_ts: String(message.ts || ""),
      });
    }
    return { rows, count: rows.length };
  },
);
