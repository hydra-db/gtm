import { defineScript } from "@cargo-ai/cdk";

import { attioApiBase, communityListSlug, engagedListSlug } from "../settings";

// From GET /objects/people/records/{id}/entries: the person's Engaged entry
// (as a URL to read its values) and whether they are already in Community.
export const readEntries = defineScript(
  async ({ response }: { response: unknown }) => {
    const data = ((response as { data?: unknown[] } | null)?.data ?? []) as Array<{
      list_api_slug?: string;
      entry_id?: string;
    }>;
    const engagedEntry = data.find((e) => e.list_api_slug === engagedListSlug);
    return {
      inEngaged: Boolean(engagedEntry?.entry_id),
      engagedEntryUrl: engagedEntry?.entry_id
        ? `${attioApiBase}/lists/${engagedListSlug}/entries/${engagedEntry.entry_id}`
        : "",
      inCommunity: data.some((e) => e.list_api_slug === communityListSlug),
    };
  },
);
