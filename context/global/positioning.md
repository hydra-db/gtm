---
title: HydraDB positioning, one-liners and problem framing (Jun to Nov 2026)
description: How HydraDB describes itself, dated so posts use the current framing (2026-11-24, "own your context and memory", "turbopuffer for graphDBs", not a memory company). Includes the retrieval failures HydraDB leads with, the terms to avoid, and how the framing moved.
references:
  - global/author-voice-nishkarsh
  - global/company-timeline
  - global/product
  - proof/performance-and-cost-claims
  - proof/graph-retrieval-examples
  - jtbd/connect-context-across-sources
  - jtbd/memory-that-tracks-change
  - persona/ai-engineering-leader
  - icp/hydradb
---

## Summary

Current (2026-11-24): HydraDB is the graph database you build your own context and memory layer on. "we're not a memory company. we're the company that lets you build memory on top of us." The story for the second half is "own your context & memory", not fast graphs.

## Detail

### Current framing (use this unless the post is about the journey)

All Nishkarsh, 2026-11-24, exact wording (Internal: founder note, 2026-11-24):
- "we're the tool people use to build their own context layers. we provide the primitives you build the context store for agents. so you use hydra to build your own mem0."
- "in one sentence - i want us to be known as the 'turbopuffer for graphDBs' useful for building ai apps like memory layers, knowledge factories, software agents, etc"
- "we're not a memory company. we're the company that lets you build memory on top of us." A draft that framed HydraDB as "a mem0 alternative" was rejected.
- "for the second half the story isnt fast graphs or whatever - the story is 'own your context & memory'" / "build with primitives that you can use to assemble context for your agents"
- "the idea is going to evolve from the tech i.e. graphs to what is that graphs do for you - they let your agents crawl through the entire corpus without fail so that you can rest assured that no document went unturned to answer a query"
- Two audiences: "companies that need a context graph" vs "companies where we need to geenrate the demand for context graphs". The second gets the "own your context & memory" story.
- Team line (2026-11-16): "Building the last data base your agents will ever need" (Internal: team discussion, 2026-11-16).

### The turbopuffer analogy, with its history

- 2026-09-10: "Essentially a 'turbopuffer' for graphs is required to make agents work." (Internal: founder note, 2026-09-10)
- 2026-10-14 reservation: the analogy "won't work for 80% of the audience." Vector databases launched into an already hot market; "HydraDB is different - right now we're answering the question of "People don't know what they want until you show it to them." so that means we need to position the product in a way that they know they need it." (Internal: founder note, 2026-10-14)
- 2026-11-24: "turbopuffer for graphDBs" is the one-sentence goal (above). Use it for builders who already want a graph; for everyone else lead with "own your context & memory".

### Terms

- **"Context graph":** Nishkarsh dislikes it: "most commonly people have started calling it a 'context graph' (a term i dont like btw ...)" (Internal: founder note, 2026-10-19). Builders rarely use it either; they say "company brain", "ontology", "knowledge graph", "agent memory" (see [[icp/hydradb]]). Use "knowledge graph" or "graph" in his voice; quote "context graph" only as market language.
- **"Memory company" / "mem0 alternative":** never.
- **Internal names:** never use internal engine codenames, unconfirmed model names or rebrand ideas in posts. Use "HydraDB", "fast mode" and "thinking mode".

### The problem HydraDB leads with

- Nishkarsh (2026-09-10): "The problem agents face is they can't work with isolated chunks of information. An isolated notion page gives agent a static chunk, but the surrounding discussions, emails, and supporting docs explain why. Connecting these in a graph helps agents follow dependencies and past decisions to satisfy an agents appetite for more context until it really knows what to do." (Internal: founder note, 2026-09-10)
- Three retrieval failures, from October 2026 outbound copy aimed at vector-database users (Internal: sales notes, 2026-10-19):
  1. "Temporal state of docs: 'How did this doc change over time?'"
  2. "Multi-hop across sources: 'Which customers are affected by this delayed feature, and what did we promise them?' Connect engineering tickets, CRM records, and emails."
  3. "Similar isn't relevance: 'What price did we finally agree with Acme?' Find the signed agreement among similar proposals and old quotes."
  Closing line: "HydraDB helps build and maintain knowledge graphs of your context so agents retrieve the right information, regardless of scale or complexity."
- "Similarity is not relevance" also opened a third-party LinkedIn post featuring HydraDB (Internal: public post, 2026-05-13).
- Film hook: "What was true on Tuesday?" (Internal: team discussion, 2026-11-23).
- A competitor's line on X that Nishkarsh admired (2026-11-12): do not quote it; it belongs to a competitor.

### Use-case language

- "company brain (knowledge graph), software factory (code graph), revenue engine (sales graph)" (Internal: founder note, 2026-11-09).
- "agent memory layers, ontologies, company brains, and unified context layers. We are focused on AI ISTM, code, and voice AI use cases." (Internal: founder note, 2026-09-10).
- Search, context, memory framework (2026-10-23): search (similarity, relations, traversal), context (entities, ontology, time, trust), memory (remember, recall, forget, share). "let's lead with ontology, graph context, relations." (Internal: founder note, 2026-10-23)
- Dependencies matter most in "customer support for ai / legal ai / code / healthcare ai" (Internal: founder note, 2026-11-24).

### Earlier one-liners (dated; prefer the current framing)

- 2026-06-26: "fastest, cheapest graph DB built on object storage, designed as [a general-purpose graph DB] replacement with agent-native architecture" (Internal: team discussion, 2026-06-26). An ad review on 2026-07-06 noted HydraDB needs to "clarify fast object storage in ads"; the object-storage point does not land on its own.
- 2026-07-03: "Graph database providing context infrastructure for AI agents. Data modeled as nodes and relationships accessible via API." (Internal: customer call recap, 2026-07-03)
- 2026-07-23: "we're better off saying something like 'we help you create an intelligent AI driven business'" than leading with a customer case study (Internal: founder note, 2026-07-23).
- 2026-07-24 outbound line: "we're an elegant piece of infra to build ontologies, company brain, agent memory" (Internal: founder note, 2026-07-24)
- 2026-07-24/25 all-hands: mission "to build the world's best graph database for modern AI workloads", built for AI agents, "not humans"; "foundational tech for agent memory, company brains, and AI context infrastructure", "not just a memory product". Longer vision: helping companies build on their own data, with the Context Digestion Layer (CDL) "turning noisy data into structured graphs"; "the graph is the enabler"; "data. is the moat". Platform analogy: "what apache spark is to databricks; our graph database will be to us" (Internal: team discussion, 2026-07-24; founder note, 2026-07-25)
- 2026-09-24: "the context graph we generate becomes the brain of the company and unstructured data comes from vector and structured data comes from sql" (Internal: founder note, 2026-09-24)
- 2026-09-30 content wedge: "object store backed graph search is scaleable & efficient for agents" (Internal: founder note, 2026-09-30)
- 2026-10-04 (September changelog intro): "Own your model. Own your ontology. Own your data." "A context graph is built from your most sensitive information: your documents, your conversations, your customers. We think it should be built where that data already lives, by a model you control." Ontology "defined by you, not by a model vendor." (Internal: public post, 2026-10-04)
- 2026-10-11: "HydraDB is a graphDB built on object storage: fast, extremely cheap, and purpose-made for use cases like AI memory, ontologies, and company brain." (Internal: founder note, 2026-10-11)
- 2026-10-15: "If you are moving away from vectorDB -> knowledge graphs because you think it adds to improved accuracy at scale then HydraDB is built for you!" and "It's made for agents that need to search a knowledge graph because they need context from multiple places: emails, tickets, chats, and more." Graphing SDK analogy: "what next.js is to vercel this graphing library would be to hydradb" (Internal: founder note, 2026-10-15).
- 2026-10-15 hero copy: "Give agents ability to retrieve the most accurate context. HydraDB stores decisions, facts, docs, relationships, knowledge, and how it all evolves, including what changed, when, and why, so your agents can understand and act on the right context, always. At any scale or complexity." It continued with a cost multiple, removed here per [[proof/performance-and-cost-claims]] (Internal: founder note, 2026-10-15).
- 2026-10-19 three pillars for graph-native buyers: (1) a built-in ontology engine "that allows us to build the graph on their behalf"; (2) object storage as the primary storage module, with "sub-200ms latencies for retrieval" (cost multiple in the proof file); (3) "agent-first primtives that allow agents to be the drivers of HydraDB", e.g. agents recording "agent traces" so an organisation's agents work "like a team that has a 'hive mind'". Architecturally, "we log agent actions as decision traces stored as mutable commits in the graph" (blog: "git for context", 2026-09-10) (Internal: founder note, 2026-10-19).
- 2026-11-02 signup email: "hydradb: the knowledge graph infrastructure for agents ... Hydradb is the easiest context databse that your agents will love using. It keeps agent accuracy accurate at scale and lets them see the full picture." (Internal: team discussion, 2026-11-02)
- Vision lines: "My vision for hydradb is to make sure every single agent on the planet chooses hydradb for powering its context and memory." (Internal: founder note, 2026-10-14); "Our goal is to ensure every single token is consumed via HydraDB." (Internal: founder note, 2026-09-10).

### Lead with accuracy, not speed

Buyers on calls ask about accuracy first ("Latency matters but accuracy comes first", ITSM prospect call, Internal: customer call recap, 2026-04-05). For an ontology buyer Nishkarsh planned "80% of the focus will be on the quality data labeling ... and that 20% is a plus point to be super performant" (Internal: founder note, 2026-07-17). With the 2026-11-24 "story isnt fast graphs" line, speed is a supporting point, never the headline.

### Customer names in posts

Posts must not name any company unless its client file says `reference_permission: yes` (none do as of 2026-11-24), and must never call a pilot or prospect a customer.

## Source

Founder notes, team discussions, sales notes and HydraDB's own public copy, 2026-06-26 to 2026-11-24; dates inline.
