import { defineScript } from "@cargo-ai/cdk";

import { attioApiBase, communityListSlug } from "../settings";

// The request that adds a person to Community & events at Invited, with where
// they came from (POST /lists/community/entries).
export const communityEntry = defineScript(
  async ({ recordId, stage }: { recordId: string; stage: string }) => {
    return {
      url: `${attioApiBase}/lists/${communityListSlug}/entries`,
      json: JSON.stringify({
        data: {
          parent_record_id: recordId,
          parent_object: "people",
          entry_values: {
            stage: "Invited",
            source: `Engaged: ${stage}`,
          },
        },
      }),
    };
  },
);
