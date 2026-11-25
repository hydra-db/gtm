// The daily outreach run's knobs, in one place. Change a value, run
// `cargo-ai project plan`, and read what moved.

// The lemlist campaign every drafted lead is added to. TODO(operator): set it
// to the campaign id once the sequence is built in lemlist (it reads the
// custom variables listed in plays/daily-outreach.ts). While it is empty the
// play stops before lemlist: it drafts and writes each lead to the
// outreach_enrollments ledger only, so drafts pile up there for review.
export const lemlistCampaignId = "";

// New people a day, all accounts together. One Outreach drafter run (LLM
// tokens) per person, plus one lemlist call each once the campaign is set.
export const dailyCap = 30;

// At most this many people per account in the ledger, across all days, so one
// company never gets a wall of first touches.
export const maxPeoplePerAccount = 3;

// Only an account event this recent is a signal worth opening with.
export const signalMaxAgeDays = 30;

// The two senders, alternated evenly (one, then the other).
export const senders = [
  { email: "nishkarsh@hydradb.app", name: "Nishkarsh" },
  { email: "thomas@hydradb.app", name: "Thomas" },
];
