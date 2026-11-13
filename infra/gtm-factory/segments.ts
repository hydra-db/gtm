import { defineSegment } from "@cargo-ai/cdk";

import { finalTam } from "./models/final-tam";

// Who to reach out to first: tier 1 (Bay Area with a graph or memory signal
// now), or any company scoring 7 or more out of 10.
export const outreachNow = defineSegment("final_tam_outreach_now", {
  model: finalTam,
  filter: {
    conjonction: "and",
    groups: [
      {
        conjonction: "or",
        conditions: [
          { kind: "number", columnSlug: "tier", operator: "is", value: 1 },
          {
            kind: "number",
            columnSlug: "icp_score",
            operator: "greaterThan",
            value: 6,
          },
        ],
      },
    ],
  },
});

// Relevant, not urgent: everything else in final_tam (tier 2 or 3, under 7).
export const outreachLater = defineSegment("final_tam_outreach_later", {
  model: finalTam,
  filter: {
    conjonction: "and",
    groups: [
      {
        conjonction: "and",
        conditions: [
          { kind: "number", columnSlug: "tier", operator: "isNot", value: 1 },
          {
            kind: "number",
            columnSlug: "icp_score",
            operator: "lowerThan",
            value: 7,
          },
        ],
      },
    ],
  },
});
