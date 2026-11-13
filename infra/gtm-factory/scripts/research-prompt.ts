import { defineScript } from "@cargo-ai/cdk";

// The research question for one company.
export const researchPrompt = defineScript(
  async ({
    name,
    domain,
    description,
    instructions,
  }: {
    name: string;
    domain: string;
    description: string;
    instructions: string;
  }): Promise<string> => {
    const today = new Date().toISOString().slice(0, 10);
    const site = domain ? ` (website: ${domain})` : "";
    const known = description
      ? ` Known so far: ${String(description).slice(0, 600)}`
      : "";
    return `Research the company ${name || domain}${site}. Today is ${today}. ${instructions}${known}`;
  },
);
