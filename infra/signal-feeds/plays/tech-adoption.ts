import { definePlay, defineWorkflow } from "@cargo-ai/cdk";
import { z } from "zod";

import { playsFolder } from "../../gtm-factory/folders";
import { tamCandidates } from "../../gtm-factory/models/tam-candidates";
import { tamMasterFinal } from "../../gtm-factory/models/tam-master-final";
import { theirStack } from "../connectors";
import { signalFeedInputs } from "../models/signal-feed-inputs";
import { techAdoptionSignals } from "../models/tech-adoption-signals";
import { pickAdopters } from "../scripts/tech-adopters";
import { planTechSearch } from "../scripts/tech-search-plan";
import {
  techAdoptionCountries,
  techAdoptionCron,
  techAdoptionFundingStages,
  techAdoptionLimit,
  techAdoptionMaxEmployees,
  techAdoptionMinEmployees,
  techAdoptionSlugs,
} from "../settings";

// tam_candidates with a domain and 50 or more employees, in two halves
// (qualified and the rest) so each stays under a search's 2,000-row cap.
const bigCandidateConditions = [
  { kind: "number", columnSlug: "employee_count_hint", operator: "greaterThan", value: 49 },
  { kind: "string", columnSlug: "domain", operator: "isNotEmpty" },
];
const bigQualified = {
  conjonction: "and" as const,
  groups: [
    {
      conjonction: "and",
      conditions: [
        ...bigCandidateConditions,
        { kind: "string", columnSlug: "status", operator: "is", values: ["qualified"] },
      ],
    },
  ],
};
const bigOther = {
  conjonction: "and" as const,
  groups: [
    {
      conjonction: "and",
      conditions: [
        ...bigCandidateConditions,
        { kind: "string", columnSlug: "status", operator: "isNot", values: ["qualified"] },
      ],
    },
  ],
};

// US companies of 50 to 5,000 people, Series B or later, that use a tracked
// graph database, vector database or agent framework (theirStack
// technographics). The domains already known are left out of the search
// before it bills (planTechSearch); each company returned is a
// tech_adoption_signals row and a tam_candidates proposal, so it flows through
// account scoring, the working list, contact finding and daily outreach.
// `limit` in the run input caps one test run below techAdoptionLimit.
const searchTechAdopters = defineWorkflow(
  "signal_feeds_tech_adoption_workflow",
  {
    input: z.object({ value: z.string().optional(), limit: z.number().optional() }),
    output: z.object({ result: z.string() }),
    uses: { theirStack },
    imports: {
      techAdoptionSignals,
      tamCandidates,
      tamMasterFinal,
      bigQualified,
      bigOther,
      planTechSearch,
      pickAdopters,
      techAdoptionSlugs,
      techAdoptionCountries,
      techAdoptionMinEmployees,
      techAdoptionMaxEmployees,
      techAdoptionFundingStages,
      techAdoptionLimit,
    },
  },
  ({ input, uses, model }) => {
    const own = model.search({
      modelUuid: techAdoptionSignals.uuid,
      limit: 2000,
      selectedColumnSlugs: ["domain"],
    });
    const book = model.search({
      modelUuid: tamMasterFinal.uuid,
      filter: {
        conjonction: "and",
        groups: [
          {
            conjonction: "and",
            conditions: [
              { kind: "string", columnSlug: "funding_stage", operator: "isNot", values: ["pre-B"] },
              { kind: "string", columnSlug: "funding_stage", operator: "isNot", values: ["none"] },
              { kind: "string", columnSlug: "domain", operator: "isNotEmpty" },
            ],
          },
        ],
      },
      limit: 2000,
      selectedColumnSlugs: ["domain"],
    });
    const candidatesQualified = model.search({
      modelUuid: tamCandidates.uuid,
      filter: bigQualified,
      limit: 2000,
      selectedColumnSlugs: ["domain"],
    });
    const candidatesOther = model.search({
      modelUuid: tamCandidates.uuid,
      filter: bigOther,
      limit: 2000,
      selectedColumnSlugs: ["domain"],
    });
    const plan = planTechSearch({
      own,
      book,
      candidatesQualified,
      candidatesOther,
      slugs: techAdoptionSlugs,
      countries: techAdoptionCountries,
      minEmployees: techAdoptionMinEmployees,
      maxEmployees: techAdoptionMaxEmployees,
      fundingStages: techAdoptionFundingStages,
      limit: input.limit,
      maxLimit: techAdoptionLimit,
    });
    const companies = uses.theirStack.searchCompanies({
      fields: plan.fields,
      limit: plan.limit,
    });
    const picked = pickAdopters({
      companies,
      excluded: plan.excluded,
      slugs: techAdoptionSlugs,
    });
    for (const row of picked.rows as unknown as Iterable<(typeof picked.rows)[number]>) {
      model.upsert({
        modelUuid: techAdoptionSignals.uuid,
        matchingColumnSlug: "key",
        matchingValue: row.key,
        mappings: [
          { columnSlug: "key", value: row.key },
          { columnSlug: "company", value: row.company },
          { columnSlug: "domain", value: row.domain },
          { columnSlug: "linkedin_url", value: row.linkedin_url },
          { columnSlug: "tools_matched", value: row.tools_matched },
          { columnSlug: "first_seen", value: row.first_seen },
          { columnSlug: "source", value: "theirstack_technographics" },
          { columnSlug: "detected_at", value: new Date() },
        ],
      });
    }
    for (const row of picked.proposals as unknown as Iterable<(typeof picked.proposals)[number]>) {
      model.upsert({
        modelUuid: tamCandidates.uuid,
        matchingColumnSlug: "key",
        matchingValue: row.key,
        mappings: [
          { columnSlug: "key", value: row.key },
          { columnSlug: "name", value: row.company },
          { columnSlug: "domain", value: row.domain },
          { columnSlug: "linkedin_url", value: row.linkedin_url },
          { columnSlug: "signal_source", value: "tech_adoption" },
          { columnSlug: "signal_detail", value: row.tools_matched },
          { columnSlug: "last_signal_at", value: new Date() },
        ],
      });
    }
    return { result: "done" };
  },
);

// The signal_feed_inputs row with feed "tech_adoption", Tuesdays at 04:47 UTC.
// Cap and cost: settings.ts (techAdoptionLimit companies a run, 0.5 each).
export const techAdoptionWeekly = definePlay("signal_feeds_tech_adoption_weekly", {
  name: "Signal feeds: graph and vector tool adopters, weekly",
  description:
    "theirStack companies (US, 50 to 5,000 people, Series B or later) that use a tracked graph database, vector database or agent framework into tech_adoption_signals, and the new ones to the ICP gate.",
  folder: playsFolder,
  model: signalFeedInputs,
  workflow: searchTechAdopters,
  filter: {
    conjonction: "and",
    groups: [
      {
        conjonction: "and",
        conditions: [
          { kind: "string", columnSlug: "feed", operator: "is", values: ["tech_adoption"] },
        ],
      },
    ],
  },
  schedule: { type: "cron", cron: techAdoptionCron },
  isEnabled: true,
  runCreationRule: "always",
  changeKinds: ["added", "updated", "unchanged"],
});
