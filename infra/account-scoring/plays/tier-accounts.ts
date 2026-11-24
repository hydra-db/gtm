import { definePlay, defineWorkflow } from "@cargo-ai/cdk";
import { z } from "zod";

import { enterpriseParked } from "../../gtm-factory/models/enterprise-parked";
import { finalTam } from "../../gtm-factory/models/final-tam";
import { tamCandidates } from "../../gtm-factory/models/tam-candidates";
import { tamMasterFinal } from "../../gtm-factory/models/tam-master-final";
import { tierAnalyst } from "../agents/tier-analyst";
import { playsFolder } from "../folders";
import { dailyTierLimit, rescoreAfter } from "../settings";

// Two plays, one agent. `tier_accounts` tiers every company a source adds to
// tam_candidates (it replaces the old research gate, `tam_score_candidates`),
// and `tier_book` tiers the working list already on TAM_MASTER_FINAL. The
// agent judges against context/icp/tiering-rubric.md; these workflows are the
// only things that write.
//
// CRM write-back: none (settings.ts). We have no CRM connected for accounts,
// so neither workflow carries a connector node.

// ---------------------------------------------------------------------------
// New companies: tam_candidates
// ---------------------------------------------------------------------------

const tierCandidate = defineWorkflow(
  "tier_account",
  {
    input: z.object({
      id: z.string(),
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
    output: z.object({ tier: z.string(), rationale: z.string() }),
    uses: { tierAnalyst },
    imports: { tamCandidates, finalTam, tamMasterFinal },
  },
  ({ input, uses, model }) => {
    const judgment = uses.tierAnalyst({
      prompt: `Tier ${input.name || ""} (${input.domain || "domain unknown"}) against the ICP and the tiering rubric in the workspace context. Description: ${input.description || "none"}. Employees (hint): ${input.employee_count_hint || "unknown"}. YC batch: ${input.yc_batch || "none"}. Found by: ${input.source || input.signal_source || "unknown"} ${input.source_detail || ""}`,
    });

    // The row write, with bare slugs (`custom__account_tier` here would be
    // dropped while the node reports success). The stamp is on the same node
    // as the tier, so a row is never marked judged without its judgment.
    model.customColumn({
      modelUuid: tamCandidates.uuid,
      id: input.id,
      mappings: [
        { columnSlug: "account_tier", value: judgment.answer.tier },
        { columnSlug: "account_tier_reason", value: judgment.answer.rationale },
        {
          columnSlug: "account_tier_evidence_url",
          value: judgment.answer.evidence_url,
        },
        { columnSlug: "account_tiered_at", value: new Date() },
      ],
    });

    if (judgment.answer.tier === "disqualified") {
      // Keep the old gate's columns meaningful for anything that reads them,
      // and so the disabled gate would never pick this row up again.
      model.update({
        modelUuid: tamCandidates.uuid,
        matchingColumnSlug: "key",
        matchingValue: input.key,
        mappings: [
          { columnSlug: "status", value: "disqualified" },
          { columnSlug: "reason", value: judgment.answer.rationale },
          { columnSlug: "icp_score", value: 0 },
          { columnSlug: "scored_at", value: new Date() },
        ],
      });
      return {
        tier: judgment.answer.tier,
        rationale: judgment.answer.rationale,
      };
    }

    model.update({
      modelUuid: tamCandidates.uuid,
      matchingColumnSlug: "key",
      matchingValue: input.key,
      mappings: [
        { columnSlug: "status", value: "qualified" },
        { columnSlug: "reason", value: judgment.answer.rationale },
        { columnSlug: "icp_score", value: judgment.answer.icp_score },
        {
          columnSlug: "resolved_domain",
          value: input.domain || judgment.answer.domain,
        },
        { columnSlug: "scored_at", value: new Date() },
      ],
    });

    // In scope: promote into the book, as the old gate did, so
    // final_tam_find_contacts and the outreach segments keep working. Only
    // with a domain: both models are keyed on it.
    if (input.domain || judgment.answer.domain) {
      model.upsert({
        modelUuid: finalTam.uuid,
        matchingColumnSlug: "domain",
        matchingValue: input.domain || judgment.answer.domain,
        mappings: [
          {
            columnSlug: "domain",
            value: input.domain || judgment.answer.domain,
          },
          { columnSlug: "name", value: input.name || "" },
          { columnSlug: "linkedin_url", value: input.linkedin_url || "" },
          {
            columnSlug: "source",
            value: input.source || input.signal_source || "",
          },
          { columnSlug: "source_detail", value: input.source_detail || "" },
          { columnSlug: "yc_batch", value: input.yc_batch || "" },
          { columnSlug: "use_case", value: judgment.answer.use_case },
          { columnSlug: "what_they_do", value: judgment.answer.what_they_do },
          { columnSlug: "icp_score", value: judgment.answer.icp_score },
          { columnSlug: "verdict", value: judgment.answer.rationale },
          { columnSlug: "scored_at", value: new Date() },
        ],
      });
      model.upsert({
        modelUuid: tamMasterFinal.uuid,
        matchingColumnSlug: "domain",
        matchingValue: input.domain || judgment.answer.domain,
        mappings: [
          {
            columnSlug: "domain",
            value: input.domain || judgment.answer.domain,
          },
          { columnSlug: "name", value: input.name || "" },
          { columnSlug: "description", value: judgment.answer.what_they_do },
          { columnSlug: "in_final_tam", value: "yes" },
          { columnSlug: "icp_status", value: "qualified" },
          { columnSlug: "icp_score", value: judgment.answer.icp_score },
          { columnSlug: "use_case", value: judgment.answer.use_case },
          { columnSlug: "yc_batch", value: input.yc_batch || "" },
        ],
        customMappings: [
          { columnSlug: "account_tier", value: judgment.answer.tier },
          {
            columnSlug: "account_tier_reason",
            value: judgment.answer.rationale,
          },
          {
            columnSlug: "account_tier_evidence_url",
            value: judgment.answer.evidence_url,
          },
          { columnSlug: "account_tiered_at", value: new Date() },
        ],
      });
    }

    return {
      tier: judgment.answer.tier,
      rationale: judgment.answer.rationale,
    };
  },
);

// New companies only: a candidate no gate has judged yet (`status` empty:
// the old gate wrote it on every row it scored, and this play writes it too)
// and never tiered. The ~2,400 rows the old gate already judged are left
// alone; re-tiering them is `tier_book`'s job, and that is off.
//
// CAPPED: once a day, at most `dailyTierLimit` rows a tick (settings.ts). At
// 3 to 5 credits a company that is about 30 credits a day at most; a burst
// (a TAM refresh adding dozens) drains over the following days instead of
// billing at once. `limit` caps the play's segment, and a row leaves it as
// soon as it is tiered, so the next tick takes the next ones. No sort: not
// every source stamps `added_at` (social listening stamps `last_signal_at`).
// A row whose run fails keeps its slot until someone looks (workspace health
// reports failing runs).
// Switched on 2026-11-24 (operator: "close the loops"), replacing the old gate.
export const tierAccounts = definePlay("tier_accounts", {
  name: "Account scoring: tier new candidates",
  description:
    "Per-company ICP tiering of new tam_candidates: the agent judges against context/icp/tiering-rubric.md, the play writes tier, rationale, evidence and stamp, and promotes in-scope companies to final_tam and TAM_MASTER_FINAL.",
  folder: playsFolder,
  model: tamCandidates,
  workflow: tierCandidate,
  filter: {
    conjonction: "and",
    groups: [
      {
        conjonction: "and",
        conditions: [
          { kind: "string", columnSlug: "status", operator: "isNull" },
          {
            kind: "date",
            columnSlug: "custom__account_tiered_at",
            operator: "isNull",
          },
        ],
      },
    ],
  },
  limit: dailyTierLimit,
  isEnabled: true,
  runCreationRule: "noConcurrency",
  changeKinds: ["added"],
  schedule: { type: "cron", cron: "15 9 * * *" },
});

// ---------------------------------------------------------------------------
// The book: the working list on TAM_MASTER_FINAL
// ---------------------------------------------------------------------------

const tierBookAccount = defineWorkflow(
  "tier_book_account",
  {
    input: z.object({
      id: z.string(),
      domain: z.string(),
      name: z.string().optional(),
      description: z.string().optional(),
      employee_count: z.number().optional(),
      hq_city: z.string().optional(),
      hq_country: z.string().optional(),
      latest_round: z.string().optional(),
      latest_round_date: z.string().optional(),
      yc_batch: z.string().optional(),
      use_case: z.string().optional(),
    }),
    output: z.object({ tier: z.string(), rationale: z.string() }),
    uses: { tierAnalyst },
    imports: { tamMasterFinal, enterpriseParked },
  },
  ({ input, uses, model }) => {
    // Public companies and F500s are parked out of the working list. A free
    // native lookup, before the agent, so a parked company never bills.
    const parked = model.search({
      modelUuid: enterpriseParked.uuid,
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
    if (parked.length > 0) {
      return { tier: "parked", rationale: "in enterprise_parked" };
    }

    const judgment = uses.tierAnalyst({
      prompt: `Tier ${input.name || ""} (${input.domain}) against the ICP and the tiering rubric in the workspace context. Description: ${input.description || "none"}. Employees: ${input.employee_count || "unknown"}. HQ: ${input.hq_city || "unknown"}, ${input.hq_country || "unknown"}. Latest round: ${input.latest_round || "unknown"} (${input.latest_round_date || "date unknown"}). YC batch: ${input.yc_batch || "none"}. Use case on file: ${input.use_case || "none"}.`,
    });

    model.customColumn({
      modelUuid: tamMasterFinal.uuid,
      id: input.id,
      mappings: [
        { columnSlug: "account_tier", value: judgment.answer.tier },
        { columnSlug: "account_tier_reason", value: judgment.answer.rationale },
        {
          columnSlug: "account_tier_evidence_url",
          value: judgment.answer.evidence_url,
        },
        { columnSlug: "account_tiered_at", value: new Date() },
      ],
    });

    return {
      tier: judgment.answer.tier,
      rationale: judgment.answer.rationale,
    };
  },
);

// The working list: Series B and beyond, qualified by the old gate, never
// tiered or stale. The enterprise_parked exclusion is in the workflow (a play
// filter cannot read another model). Weekly on Monday morning; with
// `changeKinds: ["added"]` a tick only tiers rows that entered the filter
// (new to the list, or gone stale), so steady state is near zero. Ships
// disabled: the first pass over the existing ~650 rows is a separate,
// approved batch.
export const tierBook = definePlay("tier_book", {
  name: "Account scoring: tier the working list",
  description:
    "Per-company ICP tiering of the TAM_MASTER_FINAL working list (B+, qualified, not parked) against context/icp/tiering-rubric.md.",
  folder: playsFolder,
  model: tamMasterFinal,
  workflow: tierBookAccount,
  filter: {
    conjonction: "and",
    groups: [
      {
        conjonction: "and",
        conditions: [
          {
            kind: "string",
            columnSlug: "funding_stage",
            operator: "is",
            values: ["B+"],
          },
          {
            kind: "string",
            columnSlug: "icp_status",
            operator: "is",
            values: ["qualified"],
          },
        ],
      },
      {
        conjonction: "or",
        conditions: [
          {
            kind: "date",
            columnSlug: "custom__account_tiered_at",
            operator: "isNull",
          },
          {
            kind: "date",
            columnSlug: "custom__account_tiered_at",
            operator: "lowerThan",
            value: rescoreAfter,
          },
        ],
      },
    ],
  },
  isEnabled: false,
  runCreationRule: "noConcurrency",
  changeKinds: ["added"],
  schedule: { type: "cron", cron: "40 6 * * 1" },
});
