import { defineScript } from "@cargo-ai/cdk";

// The address the find-work-email tool returned, lowercased, or "" when it
// found none (the tool answers with an empty or missing `email`).
export const foundEmail = defineScript(async ({ email }: { email: unknown }) => {
  const address = typeof email === "string" ? email.trim().toLowerCase() : "";
  return { email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address) ? address : "" };
});
