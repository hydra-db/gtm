import { defineScript } from "@cargo-ai/cdk";

// The first verified address on an enriched person, or "" when none was found.
export const firstEmail = defineScript(
  async ({ email }: { email: unknown }): Promise<string> => {
    const output = email ? (email as { output?: unknown }).output : null;
    const first = Array.isArray(output) && output.length > 0 ? output[0] : null;
    const address = first ? (first as { address?: unknown }).address : "";
    return typeof address === "string" ? address : "";
  },
);
