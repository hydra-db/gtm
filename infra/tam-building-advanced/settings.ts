// The ICP gates every company passes through, whatever source found it. The
// source filters decide what you buy; these decide what counts. They are read
// by the `status` and `exclusion_reason` columns of company_tam_v1, so moving a
// threshold re-gates every company at the next sync with no other edit. A
// company that fails one is kept, flagged `out_of_scope` with the reason, so the
// report can say what each source returned that was not your market.

// the size band from `context/icp.md`, in employees on LinkedIn.
// Read from the company page, not from the size a source reported: the two
// disagree often enough to matter.
export const minEmployees = 30;
export const maxEmployees = 2000;

// headquarters countries, as the two-letter codes LinkedIn returns
// in `hq_country`.
export const countries = ["US"];

// your categories. Use the values of the industry field in your
// CRM, so the TAM, the CRM and the reports speak the same language. Every
// company is classified into one of these from its own description, never
// from a provider's industry label.
export const inScopeCategories = [
  "Support and CX",
  "Legal and contracts",
  "Fintech and compliance (KYC/KYB)",
  "SRE and incident response",
  "Coding and code review",
  "Sales and RevOps",
  "Security",
  "Insurance claims, healthcare billing and procurement",
  "Other cross-system agents",
];

// What a company can be instead. Keep "Not enough information": a thin page
// is a coverage gap, not a verdict, and it is flagged for review rather than
// thrown out.
export const outOfScopeCategories = [
  "Memory, context or graph vendor",
  "Chat-over-docs RAG",
  "One-shot lookup agent",
  "Not AI-native or services",
];
export const unknownCategory = "Not enough information";

// How sure the classifier must be that a page is a subsidiary, a regional or
// country page, or an acquired brand before it is flagged out of scope (0 to
// 1). Read the flagged rows of the pilot: raise it if independent companies
// are flagged, lower it if "Acme France" pages get through.
export const subsidiaryThreshold = 0.5;

// How many companies each Exa query asks for. Exa bills per returned result.
export const exaResultsPerQuery = 50;

// the Exa queries, one per category and country, written the way a
// buyer would describe the company, not the way a database files it. They live
// here so every rebuild runs the same queries and the diff shows what changed.
// Start with the categories you expect providers to file under the wrong
// industry. references/run.md runs them and loads what they find into
// tam_source_exa.
export const exaQueries = [
  "AI-native startup in the United States whose agents resolve customer support tickets by taking actions across the customer's systems",
  "AI agent company in the United States building a company brain or institutional knowledge layer for each customer",
  "US startup building AI agents for legal contract review that learn from past precedent and overrides",
  "US fintech startup using AI agents for KYC, KYB and compliance case decisions",
  "US startup building AI SRE agents for incident response and root cause analysis across observability tools",
  "US startup building AI coding agents or AI code review that learns each customer's codebase",
  "US startup building AI agents for sales and RevOps that act in the CRM",
  "US security startup using AI agents to triage alerts and investigate incidents",
  "US startup building AI agents for insurance claims, healthcare billing or procurement decisions",
  "US AI company whose engineering blog discusses agent memory, knowledge graphs or ontology for its product",
];
