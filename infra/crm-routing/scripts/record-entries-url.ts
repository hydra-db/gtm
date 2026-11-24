import { defineScript } from "@cargo-ai/cdk";

import { attioApiBase } from "../settings";

// The URL of every list entry a person is the parent of.
export const recordEntriesUrl = defineScript(
  async ({ recordId }: { recordId: string }) => {
    return { url: `${attioApiBase}/objects/people/records/${recordId}/entries` };
  },
);
