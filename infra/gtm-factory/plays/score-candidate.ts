import { definePlay, defineWorkflow } from "@cargo-ai/cdk";
import { z } from "zod";

import { parallel } from "../connectors";
import { playsFolder } from "../folders";
import { finalTam } from "../models/final-tam";
import { tamCandidates } from "../models/tam-candidates";
import { researchPrompt } from "../scripts/research-prompt";
import { scoreCompany } from "../scripts/score";
import {
  researchInstructions,
  researchProcessor,
  researchSchema,
} from "../settings";

// The ICP gate. One web research task per candidate fills the schema in
// settings.ts; scripts/score.ts turns the answers into a status, a score out of
// 10 and a tier. Every candidate keeps its verdict on its tam_candidates row;
// only qualified companies are written to final_tam.
const scoreCandidate = defineWorkflow(
  "tam_score_candidate_workflow",
  {
    input: z.object({
      key: z.string(),
      name: z.string().optional(),
      domain: z.string().optional(),
      linkedin_url: z.string().optional(),
      source: z.string().optional(),
      source_detail: z.string().optional(),
      signal_source: z.string().optional(),
      description: z.string().optional(),
      yc_batch: z.string().optional(),
      employee_count_hint: z.number().optional(),
    }),
    output: z.object({
      result: z.string(),
    }),
    uses: { parallel },
    imports: {
      tamCandidates,
      finalTam,
      researchPrompt,
      scoreCompany,
      researchInstructions,
      researchProcessor,
      researchSchema,
    },
  },
  ({ input, uses, model }) => {
    const question = researchPrompt({
      name: input.name || "",
      domain: input.domain || "",
      description: input.description || "",
      instructions: researchInstructions,
    });
    const research = uses.parallel.createTask({
      input: question,
      processor: researchProcessor,
      outputSchema: researchSchema,
    });
    const scored = scoreCompany({
      output: research.output,
      inputDomain: input.domain || "",
      inputName: input.name || "",
      source: input.source || "",
      signalSource: input.signal_source || "",
      ycBatch: input.yc_batch || "",
      employeeHint: input.employee_count_hint || 0,
    });

    model.upsert({
      modelUuid: tamCandidates.uuid,
      matchingColumnSlug: "key",
      matchingValue: input.key,
      mappings: [
        { columnSlug: "key", value: input.key },
        { columnSlug: "status", value: scored.status },
        { columnSlug: "reason", value: scored.reason },
        { columnSlug: "icp_score", value: scored.icp_score },
        { columnSlug: "tier", value: scored.tier },
        { columnSlug: "resolved_domain", value: scored.domain },
        { columnSlug: "research", value: scored.research },
        { columnSlug: "scored_at", value: new Date() },
      ],
    });

    if (scored.qualified) {
      model.upsert({
        modelUuid: finalTam.uuid,
        matchingColumnSlug: "domain",
        matchingValue: scored.domain,
        mappings: [
          { columnSlug: "domain", value: scored.domain },
          { columnSlug: "name", value: scored.name },
          { columnSlug: "website", value: scored.website },
          { columnSlug: "linkedin_url", value: input.linkedin_url || "" },
          { columnSlug: "source", value: scored.source },
          { columnSlug: "source_detail", value: input.source_detail || "" },
          { columnSlug: "yc_batch", value: input.yc_batch || "" },
          { columnSlug: "use_case", value: scored.use_case },
          { columnSlug: "what_they_do", value: scored.what_they_do },
          { columnSlug: "icp_score", value: scored.icp_score },
          { columnSlug: "tier", value: scored.tier },
          { columnSlug: "tier_label", value: scored.tier_label },
          { columnSlug: "bay_area", value: scored.bay_area },
          { columnSlug: "hq_city", value: scored.hq_city },
          { columnSlug: "hq_country", value: scored.hq_country },
          { columnSlug: "employee_count", value: scored.employee_count },
          { columnSlug: "latest_round", value: scored.latest_round },
          { columnSlug: "latest_round_date", value: scored.latest_round_date },
          { columnSlug: "series_b_plus_last_12_months", value: scored.series_b },
          { columnSlug: "graph_signal", value: scored.graph_signal },
          { columnSlug: "graph_evidence", value: scored.graph_evidence },
          { columnSlug: "vector_or_agent_stack", value: scored.stack },
          { columnSlug: "context_language", value: scored.context_language },
          { columnSlug: "learns_from_past_decisions", value: scored.learns },
          { columnSlug: "warm_path", value: scored.warm_path },
          { columnSlug: "verdict", value: scored.verdict },
          { columnSlug: "scored_at", value: new Date() },
        ],
      });
      return { result: "qualified" };
    }
    return { result: "rejected" };
  },
);

// Scores every candidate that has no verdict yet. Deployed disabled: the first
// load is run by hand as a batch (pilot, then the rest). Switch it on with
// isEnabled: true once that is done, and every company a listening job adds is
// scored within the hour.
export const scoreCandidates = definePlay("tam_score_candidates", {
  name: "TAM: score candidate against the ICP",
  description:
    "For every tam_candidates row with no status: research the company, score it out of 10, and write qualified companies to final_tam.",
  folder: playsFolder,
  model: tamCandidates,
  workflow: scoreCandidate,
  filter: {
    conjonction: "and",
    groups: [
      {
        conjonction: "and",
        conditions: [
          { kind: "string", columnSlug: "status", operator: "isNull" },
        ],
      },
    ],
  },
  schedule: { type: "cron", cron: "17 * * * *" },
  isEnabled: false,
  runCreationRule: "once",
  changeKinds: ["added"],
});
