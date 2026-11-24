import { defineScript } from "@cargo-ai/cdk";

import { dealStage, defaultDealOwnerId } from "../settings";

// From the Attio connector's findRecord on the person: whether a deal already
// exists for them, and the mappings of the deal to insert when it does not.
// The mapping shapes were checked against the live connector on 2026-11-24.
export const dealPlan = defineScript(
  async ({ person, ownerId }: { person: unknown; ownerId: string }) => {
    const p = (person ?? {}) as {
      record_id?: string;
      name?: string;
      associated_deals?: unknown[];
      company?: { target_record_id?: string } | null;
    };
    const hasDeal = Array.isArray(p.associated_deals) && p.associated_deals.length > 0;
    const mappings: Array<{ propertyName: string; value: unknown }> = [
      { propertyName: "name", value: p.name || "Engaged reply" },
      { propertyName: "stage", value: dealStage },
      {
        propertyName: "owner",
        value: {
          referenced_actor_type: "workspace-member",
          referenced_actor_id: ownerId || defaultDealOwnerId,
        },
      },
      {
        propertyName: "associated_people",
        value: [{ target_object: "people", target_record_id: p.record_id }],
      },
    ];
    if (p.company?.target_record_id) {
      mappings.push({
        propertyName: "associated_company",
        value: { target_object: "companies", target_record_id: p.company.target_record_id },
      });
    }
    return { hasDeal, mappings };
  },
);
