import { defineSegment } from "@cargo-ai/cdk";

import { accounts } from "../models/accounts";

// Views onto the score, by stage, on Unify Accounts. They read
// `readiness_stage`, which is computed from the thresholds in settings.ts, so
// moving a threshold moves both segments at the next rebuild with no edit
// here. `cold` gets no segment: it is every other account, and nothing routes
// on it.

// Ready now: the handle a sequencer, contact sourcing or a rep's list takes.
// The play routes the accounts that enter it.
export const readyNow = defineSegment("ready_now_accounts", {
  model: accounts,
  filter: {
    conjonction: "and",
    groups: [
      {
        conjonction: "and",
        conditions: [
          {
            kind: "string",
            columnSlug: accounts.columns.computed__readiness_stage,
            operator: "is",
            values: ["ready_now"],
          },
        ],
      },
    ],
  },
});

// Warming: one more signal from ready. Worth a nurture, not a rep.
export const warming = defineSegment("warming_accounts", {
  model: accounts,
  filter: {
    conjonction: "and",
    groups: [
      {
        conjonction: "and",
        conditions: [
          {
            kind: "string",
            columnSlug: accounts.columns.computed__readiness_stage,
            operator: "is",
            values: ["warming"],
          },
        ],
      },
    ],
  },
});

// SOM: the companies we expect to close in the next 3 to 6 months. Hot or
// warm right now, and on the working list (Series B and beyond, passed account
// scoring, not a parked public company or F500). Moves on its own every hour
// as signals land and age.
export const som = defineSegment("som_accounts", {
  model: accounts,
  filter: {
    conjonction: "and",
    groups: [
      {
        conjonction: "and",
        conditions: [
          {
            kind: "string",
            columnSlug: accounts.columns.computed__readiness_stage,
            operator: "is",
            values: ["ready_now", "warming"],
          },
          {
            kind: "string",
            columnSlug: accounts.columns.computed__on_working_list,
            operator: "is",
            values: ["yes"],
          },
        ],
      },
    ],
  },
});
