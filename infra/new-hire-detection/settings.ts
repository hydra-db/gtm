// New-hire detection's knobs, in one place. Change a value, run
// `cargo-ai project plan`, and read what moved.

// The words a new hire's current title must contain, any one of them. Each is
// matched as a quoted phrase in the Sales Navigator search, then again in the
// play (the keyword written to new_hire_signals is the first one found).
export const titleKeywords = [
  "context graph",
  "knowledge graph",
  "ontology",
  "agent memory",
];

// Words that put a title out of scope even when it holds a keyword.
export const excludedTitleWords = [
  "intern",
  "student",
  "recruiter",
  "assistant",
  "sales",
];

// Only a role started this many days ago or less is a new hire. The search's
// job-change filters reach back about 90 days; the play drops the rest for
// free, before any paid step.
export const maxStartAgeDays = 30;

// People extracted a day (`limit` on the one search URL). Sales Navigator
// re-extracts and re-bills every returned lead on each sync, so this is also
// the daily extraction bill: 15 x 0.2 = 3 credits.
export const dailyLeadLimit = 15;

// The search syncs once a day at 05:17 UTC; the play routes the people it
// added at 05:47, before find-contacts (14:23) and daily outreach (16:13).
export const searchCron = "17 5 * * *";
export const routeCron = "47 5 * * *";
