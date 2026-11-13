// The ICP gate, in one place. Source of truth: context/icp/hydradb.md
// (rewritten by the operator on 2026-11-13). The research step answers the
// schema below for every candidate; scripts/score.ts turns the answers into a
// score out of 10, a tier, and a qualified / rejected status.

// Research depth for parallel.createTask. "base" matched "core" on the
// 2026-11-13 pilot (Sierra, Resolve AI, Footprint in; Lumana, PureLogics out)
// at 40% of the price.
export const researchProcessor = "base" as const;

export const researchInstructions =
  "Use its website, product docs, engineering blog, careers page and funding news. " +
  "We sell a graph database and context layer for AI agents, and need to know whether this company builds AI-agent applications that make repeated, exception-heavy judgment calls across each customer's systems and would need a per-customer memory of entities, relationships and past decisions. " +
  "Answer every field of the schema from evidence; use 'unclear' or 'unknown' when there is none.";

const yesNoUnclear = { type: "string", enum: ["yes", "no", "unclear"] };

export const researchSchema = JSON.stringify({
  type: "object",
  additionalProperties: false,
  properties: {
    company_name: { type: "string", description: "The company's name as it uses it." },
    website_domain: { type: "string", description: "The company's primary website domain, bare, for example acme.com." },
    what_they_do: { type: "string", description: "One sentence: what the company sells and to whom." },
    agents_take_actions: { ...yesNoUnclear, description: "Does the product use AI agents that take actions or make decisions in customers' workflows (not only Q&A or search over documents)?" },
    cross_system_entities: { ...yesNoUnclear, description: "Do those decisions depend on relationships between entities (accounts, tickets, contracts, code, assets, claims) across several of the customer's systems?" },
    learns_from_past_decisions: { ...yesNoUnclear, description: "Does the product improve from past decisions per customer (precedent, overrides, exceptions, feedback, memory)?" },
    multi_tenant_b2b: { ...yesNoUnclear, description: "Is it a B2B product serving many customers, each needing its own data and context?" },
    disqualifier: {
      type: "string",
      enum: [
        "none",
        "memory_context_or_graph_vendor",
        "agent_framework_or_llm_infrastructure_vendor",
        "chat_over_docs_rag",
        "one_shot_lookup_agent",
        "services_or_consultancy_no_product",
        "not_an_ai_agent_product",
      ],
      description: "Pick the first that applies, else none. memory_context_or_graph_vendor = sells memory, context, vector or graph databases or infrastructure itself. agent_framework_or_llm_infrastructure_vendor = sells agent frameworks, LLM gateways, model hosting or eval tooling to developers rather than an agent application.",
    },
    use_case: {
      type: "string",
      enum: [
        "support_cx",
        "legal_contracts",
        "fintech_compliance",
        "sre_incident_response",
        "coding_code_review",
        "sales_revops",
        "security",
        "insurance_healthcare_billing_procurement",
        "other_cross_system_agents",
        "none",
      ],
    },
    graph_or_memory_signal: { type: "string", enum: ["yes", "no"], description: "Public evidence the company uses or hires for graph or agent-memory technology: Neo4j, Memgraph, FalkorDB, Neptune, Graphiti, knowledge graph, ontology, agent memory, Zep, Mem0, Letta, Cognee, GraphRAG, or job posts naming these." },
    graph_or_memory_evidence: { type: "string", description: "The specific tech, job post or blog post, with its URL; empty if none." },
    vector_or_agent_stack: { type: "string", description: "Named vector databases or agent stack in use if public (Pinecone, Weaviate, Qdrant, Turbopuffer, pgvector, LangGraph, Claude Agent SDK, LangSmith, Braintrust, Arize); empty if unknown." },
    context_language: { type: "string", enum: ["yes", "no"], description: "Does the company publicly use phrases like context graph, company brain, institutional knowledge, knowledge graph, agent memory, precedent or ontology about its own product?" },
    latest_round: { type: "string", description: "Latest funding round type, for example Seed, Series A, Series B; unknown if not found." },
    latest_round_date: { type: "string", description: "YYYY-MM of the latest round; empty if unknown." },
    series_b_or_later_in_last_12_months: { type: "string", enum: ["yes", "no", "unknown"], description: "Series B or later round announced in the 12 months before today." },
    hq_city: { type: "string" },
    hq_country: { type: "string", description: "Two-letter country code of headquarters; empty if unknown." },
    hq_bay_area: { type: "string", enum: ["yes", "no", "unknown"], description: "Headquartered in the San Francisco Bay Area." },
    employee_count_estimate: { type: "number", description: "Approximate current employees; 0 if unknown." },
    verdict: { type: "string", description: "One line: why this is or is not a fit for a graph database and context layer for AI agents." },
  },
  required: [
    "company_name",
    "website_domain",
    "what_they_do",
    "agents_take_actions",
    "cross_system_entities",
    "learns_from_past_decisions",
    "multi_tenant_b2b",
    "disqualifier",
    "use_case",
    "graph_or_memory_signal",
    "graph_or_memory_evidence",
    "vector_or_agent_stack",
    "context_language",
    "latest_round",
    "latest_round_date",
    "series_b_or_later_in_last_12_months",
    "hq_city",
    "hq_country",
    "hq_bay_area",
    "employee_count_estimate",
    "verdict",
  ],
});

// Listening. Per keyword and day: how many posts are kept, and how many of the
// people who posted get a LinkedIn profile lookup (0.25 credits each) to learn
// their employer. Raise these for coverage, lower them for spend.
export const maxPostsPerKeyword = 4;
export const maxProfileLookupsPerKeyword = 2;
export const xResultsPerKeyword = 30;
