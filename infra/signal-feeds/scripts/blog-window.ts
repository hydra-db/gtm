import { defineScript } from "@cargo-ai/cdk";

// The earliest publish date Exa should return, as YYYY-MM-DD.
export const blogWindow = defineScript(
  async ({ lookbackDays }: { lookbackDays: number }) => {
    const since = new Date(Date.now() - lookbackDays * 86400000);
    return { since: since.toISOString().slice(0, 10) };
  },
);
