import { defineScript } from "@cargo-ai/cdk";

// The request that adds a person to Engaged at Replied (POST
// /lists/engaged/entries), the same shape crm-routing uses for Community.
export const engagedEntry = defineScript(
  async ({ recordId, base, list }: { recordId: string; base: string; list: string }) => {
    return {
      url: `${base}/lists/${list}/entries`,
      json: JSON.stringify({
        data: {
          parent_record_id: recordId,
          parent_object: "people",
          entry_values: { stage: "Replied" },
        },
      }),
    };
  },
);
