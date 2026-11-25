import { defineScript } from "@cargo-ai/cdk";

// The Attio person's record id, from the connector's findRecords.
export const attioPersonId = defineScript(
  async ({ found }: { found: unknown }) => {
    const records = ((found as { records?: unknown[] } | null)?.records ?? []) as Array<
      Record<string, unknown>
    >;
    const first = records[0] || {};
    const id = first.id as { record_id?: string } | string | undefined;
    const recordId =
      (first.record_id as string | undefined) ||
      (typeof id === "string" ? id : id?.record_id) ||
      "";
    return { recordId, found: Boolean(recordId) };
  },
);
