// The signal feeds' knobs, in one place. Every recurring feed is capped to
// roughly 30 credits a day; the comment on each says what it costs at the cap.
// Change a number, run `cargo-ai project plan`, and read what moved.

// Reddit and Hacker News, daily, one run per listening keyword (27 today).
// Reddit goes through Apify ("Reddit Search Scraper - Keyword Monitoring"),
// billed on the Apify account at about $0.001 a result, 0 Cargo credits.
// Hacker News is Algolia's free search API. Cap: redditResultsPerKeyword
// results a keyword a day, so 27 x 5 = 135 Reddit results, about $0.15 a day.
export const redditActorId = "5LOwKe4dIDEJ64I58";
export const redditResultsPerKeyword = 5;
export const hnResultsPerKeyword = 10;
export const maxForumPostsPerKeyword = 8;

// Engineering blogs, daily, one Exa search per listening keyword over the last
// two days of published posts. Exa bills 0.175 a search plus 0.025 a result:
// 27 keywords x (0.175 + 4 x 0.025) = 7.4 credits a day at the cap.
export const blogResultsPerKeyword = 4;
export const blogLookbackDays = 2;

// GitHub, every 12 hours: one run per `signal_feed_inputs` row whose feed is
// github (the watched repos below, seeded into that model). Repo, stargazer
// and issue calls go to the GitHub REST API through the github_api connector,
// profile lookups through Cargo's GitHub connector: 0 credits either way.
export const githubWindowHours = 12;
export const maxGithubPeoplePerRepo = 15;
// Our own repos: every new person at a real company is also posted to
// #visitors. Resolved to its id through the Slack connector on 2026-11-24.
export const visitorsChannelId = "C0CMJ11QKTJ";
// The seed for `signal_feed_inputs` (feed "github"). The model is the live
// list: add or remove a row there to change what is watched, no deploy.
export const watchedRepos: { repo: string; kind: "own" | "primitive" }[] = [
  { repo: "hydra-db/hydradb", kind: "own" },
  { repo: "hydra-db/selfgraph", kind: "own" },
  ...[
    "topoteretes/cognee",
    "mem0ai/mem0",
    "getzep/graphiti",
    "getzep/zep",
    "letta-ai/letta",
    "microsoft/graphrag",
    "neo4j/neo4j",
    "memgraph/memgraph",
    "FalkorDB/falkordb",
    "run-llama/llama_index",
    "langchain-ai/langgraph",
    "langchain-ai/langchain",
    "chroma-core/chroma",
    "milvus-io/milvus",
    "qdrant/qdrant",
    "weaviate/weaviate",
    "unstructured-io/unstructured",
    "docling-project/docling",
    "NangoHQ/nango",
    "e2b-dev/E2B",
    "vectorize-io/hindsight",
  ].map((repo) => ({ repo, kind: "primitive" as const })),
];

// Job posts, every 12 hours, through theirStack (0.5 credits a job returned).
// 2 runs x 30 jobs x 0.5 = 30 credits a day at the cap.
export const jobPostLimit = 30;
export const jobPostMaxAgeDays = 1;
export const jobDescriptionPatterns = [
  "knowledge graph",
  "context graph",
  "graph database",
  "agent memory",
  "long-term memory",
  "long term memory",
  "memory layer",
  "GraphRAG",
  "Neo4j",
  "ontology",
];
export const jobTitlePatterns = [
  "engineer",
  "engineering",
  "developer",
  "architect",
  "\\bAI\\b",
  "\\bML\\b",
  "machine learning",
  "data scientist",
  "research scientist",
  "CTO",
  "platform",
];

// LinkedIn engagement through Cargo Signals, billed per lead delivered:
//   competitor company pages, 2 a lead x 8 a day = 16
//   their CEOs' posts,         1 a lead x 8 a day =  8
//   Nishkarsh's new connections, 5 a lead x 1 a day = 5
// 29 credits a day at the cap. The connections feed takes new connections
// only (oneTimeExtractCount 0): the default one-time extract of 500 would bill
// up to 1,500 credits on the first day.
export const competitorCompanyPages = [
  "https://www.linkedin.com/company/zep-ai",
  "https://www.linkedin.com/company/mem0",
  "https://www.linkedin.com/company/letta-ai",
  "https://www.linkedin.com/company/cognee-ai",
  "https://www.linkedin.com/company/neo4j",
  "https://www.linkedin.com/company/falkordb",
  "https://www.linkedin.com/company/memgraph",
];
export const competitorCeoProfiles = [
  "https://www.linkedin.com/in/danielchalef", // Zep
  "https://www.linkedin.com/in/taranjeet7114", // Mem0
  "https://www.linkedin.com/in/charles-packer", // Letta
  "https://www.linkedin.com/in/vasilije-markovic-13302471", // Cognee
  "https://www.linkedin.com/in/emileifrem", // Neo4j
  "https://www.linkedin.com/in/guykorland", // FalkorDB
  "https://www.linkedin.com/in/dominiktomicevic", // Memgraph
];
export const founderProfiles = ["https://www.linkedin.com/in/nishkarsh-srivastava"];
export const competitorPageLeadsPerDay = 8;
export const competitorCeoLeadsPerDay = 8;
export const founderConnectionLeadsPerDay = 1;

// Job switches: a new decision-maker joining a working-list company (Cargo
// Signals, 2 a lead x 15 a day = 30 credits a day at the cap). Cheaper than the
// new-hire-detection cookbook, which pays a Sales Navigator extraction and an
// LLM qualification per person to find the same thing market-wide.
export const jobSwitchLeadsPerDay = 15;
export const decisionMakerTitles = [
  "CTO",
  "Chief Technology Officer",
  "VP Engineering",
  "VP of Engineering",
  "Head of Engineering",
  "Head of AI",
  "VP AI",
  "Director of AI",
  "Head of AI Platform",
  "AI Platform Lead",
  "Head of Machine Learning",
  "Chief AI Officer",
];
// #sales, where each job switch at a working-list company is posted.
export const salesChannelId = "C0BJY52BUTZ";

// Product signups, read from the Slack channel #signups (the product's signup
// bot posts one message per signup there), every 12 hours. Resolved to its id
// through the Slack connector on 2026-11-25. The Cargo Slack app must be a
// member of the channel to read it (`/invite @Cargo` in #signups).
export const signupsChannelId = "C0AJMNLHYCW";
// Each read covers the last 13 hours, so two 12-hour reads overlap by an hour
// and a late or retried run loses nothing. A signup is keyed on its email, so
// the overlap writes nothing twice. One read is at most `signupsReadLimit`
// messages (about 10 signups a day today).
export const signupsLookbackHours = 13;
export const signupsReadLimit = 200;
export const signupsFeedCron = "23 1,13 * * *";
// Routing (plays/signups.ts) runs 30 minutes after each read, and only on a
// signup newer than `signupsRouteMaxAgeHours`: the 30-day backfill lands
// every older signup in the model without posting it to #sales.
export const signupsRouteCron = "53 1,13 * * *";
export const signupsRouteMaxAgeHours = 48;
// Mail providers: a signup from one keeps its row, with an empty domain, so it
// is never unified onto a company that is really gmail.com.
export const personalEmailDomains = [
  "gmail.com", "googlemail.com", "outlook.com", "hotmail.com", "live.com",
  "msn.com", "yahoo.com", "ymail.com", "icloud.com", "me.com", "mac.com",
  "proton.me", "protonmail.com", "pm.me", "aol.com", "gmx.com", "gmx.de",
  "yandex.ru", "yandex.com", "mail.ru", "qq.com", "163.com", "126.com",
  "zoho.com", "hey.com", "fastmail.com", "tutanota.com",
];
// Signups the routing never posts or scores: our own team, and the signup
// probes our tests create (fldubai.com addresses).
export const ignoredSignupDomains = ["hydradb.com", "hydradb.app", "fldubai.com"];
// The lemlist campaign the outreach runs through: a signup who is a lead in it
// is stopped there, since they came in on their own.
export const outreachLemlistCampaignId = "cam_pLeqyyA2YFqfR8Efp";
