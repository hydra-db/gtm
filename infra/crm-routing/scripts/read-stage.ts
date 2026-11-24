import { defineScript } from "@cargo-ai/cdk";

import { communityStages, qualifiedStage } from "../settings";

// From GET /lists/engaged/entries/{entry_id}: the current Stage, the entry's
// owner, and which route (if any) the stage sends the person down.
export const readStage = defineScript(
  async ({ response }: { response: unknown }) => {
    const values = ((response as { data?: { entry_values?: unknown } } | null)?.data
      ?.entry_values ?? {}) as Record<string, Array<Record<string, unknown>> | undefined>;
    const status = values.stage?.[0]?.status as { title?: string } | undefined;
    const stage = String(status?.title ?? "");
    const ownerId = String(values.owner?.[0]?.referenced_actor_id ?? "");
    return {
      stage,
      ownerId,
      toCommunity: communityStages.includes(stage),
      toDeal: stage === qualifiedStage,
    };
  },
);
