import { definePlay, defineWorkflow } from "@cargo-ai/cdk";
import { z } from "zod";

import { finalTam } from "../../gtm-factory/models/final-tam";
import { tamCandidates } from "../../gtm-factory/models/tam-candidates";
import { tamMasterFinal } from "../../gtm-factory/models/tam-master-final";
import { aiArk } from "../../tam-building-advanced/connectors/ai-ark";
import { linkedin } from "../../tam-building-advanced/connectors/linkedin";
import { tamCompanies as companyTamV1 } from "../../tam-building-advanced/models/tam-companies";
import { companyEnrich } from "../connectors/company-enrich";
import { playsFolder } from "../folders";
import { tamCompanies } from "../models/tam-companies";
import { netNewAdvancedCron, netNewCron, netNewLimit } from "../settings";

// One company from a TAM source in; a tam_candidates row out, only when the
// company is net new. account-scoring's `tier_accounts` tiers it from there.
//
// 1. Net new? A free native lookup of the domain in TAM_MASTER_FINAL,
//    final_tam and tam_candidates, before anything is paid for.
// 2. Enrichment, always a waterfall, and only when the source row is thin
//    (no description): AI Ark (0.01 credits), then CompanyEnrich (0.25), then
//    LinkedIn from the domain (0.5), each only when the one before returned
//    no description. Clay was to be the last fallback; it is not wired
//    because the workspace has no Clay connector and Cargo's Clay integration
//    has no company enrichment action (see settings.ts).
// 3. One tam_candidates row, keyed on the bare domain like every other
//    source, with no status, so the tiering play picks it up.
//
// The lookups and steps are `if` blocks, never `a ? b : c`: a conditional
// expression compiles to both calls and pays twice.
const netNewCandidate = defineWorkflow(
  "tam_net_new_candidate",
  {
    input: z.object({
      domain: z.string(),
      name: z.string().optional(),
      description: z.string().optional(),
      linkedin_url: z.string().optional(),
      employee_count: z.number().optional(),
    }),
    output: z.object({ result: z.string() }),
    uses: { aiArk, companyEnrich, linkedin },
    imports: { tamMasterFinal, finalTam, tamCandidates },
  },
  ({ input, uses, model }) => {
    const inBook = model.search({
      modelUuid: tamMasterFinal.uuid,
      filter: {
        conjonction: "and",
        groups: [
          {
            conjonction: "and",
            conditions: [
              {
                kind: "string",
                columnSlug: "domain",
                operator: "is",
                values: [input.domain],
              },
            ],
          },
        ],
      },
      limit: 1,
    });
    if (inBook.length > 0) {
      return { result: "known: TAM_MASTER_FINAL" };
    }
    const inFinal = model.search({
      modelUuid: finalTam.uuid,
      filter: {
        conjonction: "and",
        groups: [
          {
            conjonction: "and",
            conditions: [
              {
                kind: "string",
                columnSlug: "domain",
                operator: "is",
                values: [input.domain],
              },
            ],
          },
        ],
      },
      limit: 1,
    });
    if (inFinal.length > 0) {
      return { result: "known: final_tam" };
    }
    const inCandidates = model.search({
      modelUuid: tamCandidates.uuid,
      filter: {
        conjonction: "and",
        groups: [
          {
            conjonction: "and",
            conditions: [
              {
                kind: "string",
                columnSlug: "domain",
                operator: "is",
                values: [input.domain],
              },
            ],
          },
        ],
      },
      limit: 1,
    });
    if (inCandidates.length > 0) {
      return { result: "known: tam_candidates" };
    }

    if (input.description) {
      model.upsert({
        modelUuid: tamCandidates.uuid,
        matchingColumnSlug: "key",
        matchingValue: input.domain,
        mappings: [
          { columnSlug: "key", value: input.domain },
          { columnSlug: "domain", value: input.domain },
          { columnSlug: "name", value: input.name || "" },
          { columnSlug: "linkedin_url", value: input.linkedin_url || "" },
          { columnSlug: "source", value: "tam_building" },
          { columnSlug: "source_detail", value: "enriched_by: source row" },
          { columnSlug: "description", value: input.description },
          {
            columnSlug: "employee_count_hint",
            value: input.employee_count || 0,
          },
          { columnSlug: "added_at", value: new Date() },
        ],
      });
      return { result: "added: source row" };
    }

    const ark = uses.aiArk.enrichCompany(
      { domain: input.domain },
      { continueOnFailure: true },
    );
    if (ark.description) {
      model.upsert({
        modelUuid: tamCandidates.uuid,
        matchingColumnSlug: "key",
        matchingValue: input.domain,
        mappings: [
          { columnSlug: "key", value: input.domain },
          { columnSlug: "domain", value: input.domain },
          { columnSlug: "name", value: input.name || ark.name },
          { columnSlug: "linkedin_url", value: input.linkedin_url || "" },
          { columnSlug: "source", value: "tam_building" },
          { columnSlug: "source_detail", value: "enriched_by: aiArk" },
          { columnSlug: "description", value: ark.description },
          { columnSlug: "employee_count_hint", value: ark.employee_count },
          { columnSlug: "added_at", value: new Date() },
        ],
      });
      return { result: "added: aiArk" };
    }

    const ce = uses.companyEnrich.enrichByDomain(
      { domain: input.domain },
      { continueOnFailure: true },
    );
    if (ce.description) {
      model.upsert({
        modelUuid: tamCandidates.uuid,
        matchingColumnSlug: "key",
        matchingValue: input.domain,
        mappings: [
          { columnSlug: "key", value: input.domain },
          { columnSlug: "domain", value: input.domain },
          { columnSlug: "name", value: input.name || ce.name },
          { columnSlug: "linkedin_url", value: input.linkedin_url || "" },
          { columnSlug: "source", value: "tam_building" },
          { columnSlug: "source_detail", value: "enriched_by: companyEnrich" },
          { columnSlug: "description", value: ce.description },
          { columnSlug: "added_at", value: new Date() },
        ],
      });
      return { result: "added: companyEnrich" };
    }

    const li = uses.linkedin.enrichCompanyFromDomain(
      { domain: input.domain },
      { continueOnFailure: true },
    );
    // Last step of the waterfall. With no description anywhere the company
    // is still added: the tiering agent can search once, and a thin row is a
    // coverage gap, not a verdict.
    model.upsert({
      modelUuid: tamCandidates.uuid,
      matchingColumnSlug: "key",
      matchingValue: input.domain,
      mappings: [
        { columnSlug: "key", value: input.domain },
        { columnSlug: "domain", value: input.domain },
        { columnSlug: "name", value: input.name || li.company_name },
        {
          columnSlug: "linkedin_url",
          value: input.linkedin_url || li.linkedin_url,
        },
        { columnSlug: "source", value: "tam_building" },
        { columnSlug: "source_detail", value: "enriched_by: linkedin" },
        { columnSlug: "description", value: li.description },
        { columnSlug: "employee_count_hint", value: li.employee_count },
        { columnSlug: "added_at", value: new Date() },
      ],
    });
    return { result: "added: linkedin" };
  },
);

// Both plays tick daily, at most `netNewLimit` rows a tick (settings.ts), and
// are switched on (2026-11-24): about 30 credits a day at most, usually far
// less, since a known domain is skipped for free.
//
// tam-building's AI Ark pool: every company that arrives on a refresh.
// `changeKinds: ["added"]` keeps it to companies new to the pool; the
// workflow then drops the ones already known anywhere else.
export const tamNetNew = definePlay("tam_net_new_to_candidates", {
  name: "TAM building: net-new companies to tam_candidates",
  description:
    "For every company the AI Ark TAM refresh adds: skip it if its domain is already in TAM_MASTER_FINAL, final_tam or tam_candidates, else enrich it by waterfall when thin and add it to tam_candidates for tiering.",
  folder: playsFolder,
  model: tamCompanies,
  workflow: netNewCandidate,
  filter: {
    conjonction: "and",
    groups: [
      {
        conjonction: "and",
        conditions: [
          { kind: "string", columnSlug: "domain", operator: "isNotEmpty" },
        ],
      },
    ],
  },
  limit: netNewLimit,
  isEnabled: true,
  runCreationRule: "once",
  changeKinds: ["added"],
  schedule: { type: "cron", cron: netNewCron },
});

// tam-building-advanced's profiled TAM: every company the profile play marks
// in scope, the same net-new check and the same waterfall.
export const tamAdvancedNetNew = definePlay(
  "tam_advanced_net_new_to_candidates",
  {
    name: "TAM building (advanced): net-new in-scope companies to tam_candidates",
    description:
      "For every in-scope company_tam_v1 profile: skip it if its domain is already known, else add it to tam_candidates for tiering.",
    folder: playsFolder,
    model: companyTamV1,
    workflow: netNewCandidate,
    filter: {
      conjonction: "and",
      groups: [
        {
          conjonction: "and",
          conditions: [
            {
              kind: "string",
              columnSlug: "computed__status",
              operator: "is",
              values: ["in_scope"],
            },
            { kind: "string", columnSlug: "domain", operator: "isNotEmpty" },
          ],
        },
      ],
    },
    limit: netNewLimit,
    isEnabled: true,
    runCreationRule: "once",
    changeKinds: ["added"],
    schedule: { type: "cron", cron: netNewAdvancedCron },
  },
);
