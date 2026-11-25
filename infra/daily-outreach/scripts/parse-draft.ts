import { defineScript } from "@cargo-ai/cdk";

// The Outreach drafter's answer, read whether it came back parsed or as text
// (optionally fenced). `ok` is true only for status "ok" with an email body.
export const parseDraft = defineScript(async ({ answer }: { answer: unknown }) => {
  let value: unknown = answer;
  if (typeof value === "string") {
    const trimmed = value.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    try {
      value = start >= 0 && end > start ? JSON.parse(trimmed.slice(start, end + 1)) : {};
    } catch {
      value = {};
    }
  }
  const draft = (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
  const field = (key: string): string =>
    draft[key] === null || draft[key] === undefined ? "" : String(draft[key]);
  const status = field("status") || "unparsed";
  return {
    ok: status === "ok" && field("email_body") !== "",
    status,
    email_subject: field("email_subject"),
    email_body: field("email_body"),
    linkedin_message: field("linkedin_message"),
    voice_note_script: field("voice_note_script"),
  };
});
