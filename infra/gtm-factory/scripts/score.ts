import { defineScript } from "@cargo-ai/cdk";

import { bare } from "./hosts";

// Turns the research answers into the ICP verdict. Rules, all from
// context/icp/hydradb.md:
//   disqualified  a disqualifier applies (vendor, RAG-only, lookup agent, services)
//   not_fit       a must-have is missing: agents that act, across systems, and
//                 either learning from past decisions or a graph/memory signal
//   outside_us    headquartered outside the US and under 500 people
//   too_early     under 10 people
//   qualified     everything else; written to final_tam
// Score out of 10: 3 agents decide across systems per tenant, 2 graph or memory
// hiring or tech, 2 Series B or later in the last 12 months, 1 Bay Area,
// 1 context-graph or company-brain language, 1 warm path (a YC company: we are
// in the YC network).
// Tier: 1 = Bay Area and a graph/memory signal now; 2 = Bay Area, no graph
// signal yet; 3 = everywhere else in scope.

const text = (value: unknown): string =>
  value === null || value === undefined ? "" : String(value);

export const scoreCompany = defineScript(
  async ({
    output,
    inputDomain,
    inputName,
    source,
    signalSource,
    ycBatch,
    employeeHint,
  }: {
    output: Record<string, unknown>;
    inputDomain: string;
    inputName: string;
    source: string;
    signalSource: string;
    ycBatch: string;
    employeeHint: number;
  }) => {
    const empty = {
      status: "error",
      qualified: false,
      reason: "research returned nothing readable",
      domain: bare(inputDomain),
      name: inputName || "",
      website: "",
      source: source || signalSource || "",
      use_case: "",
      what_they_do: "",
      icp_score: 0,
      tier: 0,
      tier_label: "",
      bay_area: "",
      hq_city: "",
      hq_country: "",
      employee_count: 0,
      latest_round: "",
      latest_round_date: "",
      series_b: "",
      graph_signal: "",
      graph_evidence: "",
      stack: "",
      context_language: "",
      learns: "",
      warm_path: "",
      verdict: "",
      research: "",
    };

    let answers: Record<string, unknown> = {};
    try {
      const content = output ? (output as { content?: unknown }).content : "";
      answers =
        typeof content === "string"
          ? JSON.parse(content)
          : ((content as Record<string, unknown>) || {});
    } catch {
      return empty;
    }
    if (!answers || !answers.agents_take_actions) {
      return empty;
    }

    const yes = (key: string): boolean => text(answers[key]).toLowerCase() === "yes";
    const domain = bare(inputDomain) || bare(text(answers.website_domain));
    const employees =
      Number(answers.employee_count_estimate) > 0
        ? Number(answers.employee_count_estimate)
        : Number(employeeHint) > 0
          ? Number(employeeHint)
          : 0;
    const country = text(answers.hq_country).toUpperCase();
    const disqualifier = text(answers.disqualifier) || "none";
    const bayArea = yes("hq_bay_area");
    const graph = yes("graph_or_memory_signal");
    const learns = yes("learns_from_past_decisions");
    const acts =
      yes("agents_take_actions") &&
      yes("cross_system_entities") &&
      text(answers.multi_tenant_b2b).toLowerCase() !== "no";
    const warm = Boolean(ycBatch);

    let status = "qualified";
    let reason = "";
    if (disqualifier !== "none") {
      status = "disqualified";
      reason = disqualifier;
    } else if (!acts) {
      status = "not_fit";
      reason = "agents do not act across each customer's systems";
    } else if (!learns && !graph) {
      status = "not_fit";
      reason = "no memory of past decisions and no graph or memory signal";
    } else if (country && country !== "US" && country !== "USA" && employees < 500) {
      status = "outside_us";
      reason = `headquartered in ${country}`;
    } else if (employees > 0 && employees < 10) {
      status = "too_early";
      reason = `about ${employees} people`;
    } else if (!domain) {
      status = "error";
      reason = "no website domain found";
    }

    const score =
      (acts ? 3 : 0) +
      (graph ? 2 : 0) +
      (yes("series_b_or_later_in_last_12_months") ? 2 : 0) +
      (bayArea ? 1 : 0) +
      (yes("context_language") ? 1 : 0) +
      (warm ? 1 : 0);
    const tier = bayArea ? (graph ? 1 : 2) : 3;
    const tierLabel =
      tier === 1
        ? "Bay Area, needs a context graph now"
        : tier === 2
          ? "Bay Area, not on graphs yet"
          : "Outside the Bay Area";

    return {
      status,
      qualified: status === "qualified",
      reason,
      domain,
      name: text(answers.company_name) || inputName || "",
      website: domain ? `https://${domain}` : "",
      source: source || signalSource || "",
      use_case: text(answers.use_case),
      what_they_do: text(answers.what_they_do),
      icp_score: score,
      tier,
      tier_label: tierLabel,
      bay_area: bayArea ? "yes" : "no",
      hq_city: text(answers.hq_city),
      hq_country: country,
      employee_count: employees,
      latest_round: text(answers.latest_round),
      latest_round_date: text(answers.latest_round_date),
      series_b: text(answers.series_b_or_later_in_last_12_months),
      graph_signal: graph ? "yes" : "no",
      graph_evidence: text(answers.graph_or_memory_evidence),
      stack: text(answers.vector_or_agent_stack),
      context_language: text(answers.context_language),
      learns: text(answers.learns_from_past_decisions),
      warm_path: warm ? `YC ${ycBatch}` : "",
      verdict: text(answers.verdict),
      research: JSON.stringify(answers).slice(0, 6000),
    };
  },
);
