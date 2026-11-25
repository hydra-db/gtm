import { defineScript } from "@cargo-ai/cdk";

// The #sales lines.
export const signupLines = defineScript(
  async ({
    name,
    email,
    title,
    company,
    tier,
    reason,
  }: {
    name?: string;
    email: string;
    title?: string;
    company?: string;
    tier?: string;
    reason?: string;
  }) => {
    const who = name || email;
    const firstSentence = String(reason || "")
      .split(/(?<=\.)\s/)[0]
      .replace(/\u2014/g, ",")
      .trim();
    const role = title ? `, ${title}` : "";
    return {
      contacted: `${who} (${company || email}) signed up after our outreach`,
      verdict: `${who}${role} at ${company} signed up: tier ${tier || "?"}, ${firstSentence}`,
      personal: `${who} (${email}) signed up: personal email, no company`,
    };
  },
);
