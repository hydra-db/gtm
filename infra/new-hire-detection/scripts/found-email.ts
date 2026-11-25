import { defineScript } from "@cargo-ai/cdk";

// The address the find-work-email tool returned, lowercased, or "" when it
// found none (the tool answers with an empty or missing `email`), or when the
// address is not on the account's domain (or a subdomain of it). The tool
// can return an address from an earlier employer (on 2026-11-25 it gave a
// getaida.com address for a new hire at harvey.ai); one of those would be
// drafted to the wrong company, so it is dropped.
export const foundEmail = defineScript(
  async ({ email, domain }: { email: unknown; domain: unknown }) => {
    const address = typeof email === "string" ? email.trim().toLowerCase() : "";
    const account = String(domain || "").trim().toLowerCase();
    if (!account || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
      return { email: "" };
    }
    const host = address.split("@")[1];
    return { email: host === account || host.endsWith(`.${account}`) ? address : "" };
  },
);
