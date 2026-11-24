import { defineModel } from "@cargo-ai/cdk";

import { httpIngest } from "../connectors";
import { modelsFolder } from "../folders";

type Row = {
  domain?: string | null;
  last_activity?: string | null;
  seen_at?: string | null;
};

// Companies whose engineers act on the GitHub repos Dayly watches (ours and
// competitors'). Filled from outside Cargo: a daily job reads Dayly and posts
// rows to this model's ingest URL. Keys per row: domain, company, readiness,
// icp_match, signal, repos, people, employees, last_activity, dayly_url,
// source, seen_at.
//
// Unified as an account event on the domain, dated the company's last GitHub
// activity (or when Dayly saw it, when that is missing), so readiness-scoring
// weighs each signal.
export const ossSignals = defineModel("oss_signals", {
  name: "oss_signals",
  connector: httpIngest,
  extractSlug: "listenHook",
  description:
    "GitHub (open source) signals from Dayly: companies starring, forking, opening issues or PRs on watched repos.",
  config: {},
  additionalColumns: [
    {
      kind: "computed",
      slug: "match_domain",
      type: "string",
      label: "Match domain",
      description: "The domain, or null when there is none, so empty values never merge.",
      expression: (record: Row) => (record.domain ? record.domain : null),
    },
    {
      kind: "computed",
      slug: "event_at",
      type: "date",
      label: "Event at",
      description: "The last GitHub activity, else when Dayly saw it: the date of its Account Events row.",
      expression: (record: Row) =>
        record.last_activity
          ? record.last_activity
          : record.seen_at
            ? record.seen_at
            : null,
    },
  ],
  unification: {
    source: "custom",
    type: "accountEvent",
    uniqueColumns: [{ slug: "computed__match_domain", reference: "domain" }],
    timeColumnSlug: "computed__event_at",
  },
  folder: modelsFolder,
});
