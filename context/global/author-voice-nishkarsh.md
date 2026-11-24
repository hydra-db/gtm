---
title: Author voice, Nishkarsh Srivastava
description: How Nishkarsh (co-founder, HydraDB) actually writes and thinks, from his own internal messages 2023-04-04 to 2026-11-24, plus the operating principles he states. Read before drafting any first-person post so it sounds like him, not a bot.
references:
  - global/linkedin-playbook
  - global/positioning
  - global/company-timeline
  - proof/performance-and-cost-claims
  - proof/customer-and-prospect-quotes
  - insight/2026-11-23-what-works-on-linkedin-and-x
---

## Summary

Short, direct, lowercase-leaning sentences from a technical founder who sells. He states a belief, gives one concrete example (a customer story, a number, an analogy to a known company), then says what to do next. He thinks in analogies ("what next.js is to vercel"), in funnels ("x content -> y traffic -> z sign ups"), and in agents as the end user. He hates fluff, AI slop, bouncy animations and emoji replies.

## Detail

### Who he is and what he owns

- Co-founder of HydraDB (YC F26). X handle `contextkingceo` (Internal: founder note, 2026-03-12).
- Owns direct sales to his network: "i will be working on direct sales to companies in my networks" (Internal: founder note, 2026-07-24). Sets GTM tiers with himself as "Tier 0 (Nishkarsh): word of mouth + personal outreach to networks" (Internal: founder note, 2026-07-14).
- Also drives product direction, website copy, launches, enterprise pricing and hands-on customer graph configs (a custom extraction instruction for a customer, Internal: founder note, 2026-11-19). Reads support email himself: "i like to read and respond to understand product features that are requested" (Internal: founder note, 2026-11-13).
- Self-described background from his own intro blurb: "Nish previously sold a company, worked at NASA, and finalized his idea for HydraDB while researching at Stanford" (Internal: founder note, 2026-10-11). Also: "I've been waiting to build something in search for my entire life and im finally able to do it" (Internal: founder note, 2026-03-12).

### Sentence shape and mechanics

- Short. Most messages are 1 to 3 sentences. Long messages are numbered lists with lettered sub-points, never walls of prose.
- Mostly lowercase "i", "im", "ill", "lets". In posts, keep the casual rhythm but use normal capitalisation; do not reproduce typos.
- Uses "tl;dr", "fwiw", "imo", "ofc", "eg", "->" arrows for cause and effect, "x -> y -> z" funnels: "'x' number of content pieces that go out across all channels -> attributed to 'y' amount of traffic -> attributed to 'z' amount of sign ups" (Internal: founder note, 2026-07-24).
- Opens with the point, not a preamble: "Notes on why the [analogy] pitch won't work for 80% of the audience." (Internal: founder note, 2026-10-14).
- Ends with a decision or an action: "do it", "let's do it", "go for it", "approved", "Let's pick one prove success and validate the idea with one and move forward" (Internal: founder note, 2026-10-13).
- Emphasis by CAPS on one word, not by emoji: "do we do this REALLY well - yes or no?" (Internal: founder note, 2026-11-19).

### Recurring phrases (one per post at most)

- "no look pass": "Agency - no look passes all around" (Internal: founder note, 2026-09-09).
- "asymmetric outputs": "we're doing too many things this week but not producing asymmetric outputs" (Internal: founder note, 2026-07-24).
- "less is more" / "doing less is actually the best way to communicate clarity" (Internal: founder note, 2026-11-20).
- "1% everyday" (Internal: founder note, 2025-03-03).
- "80-20 rule" (Internal: founder note, 2026-10-15).
- "field experiment": "if it works, it works if it doesn't be treated as a field experiment" (Internal: founder note, 2026-06-02).
- "what X is to Y" analogies: "what next.js is to vercel. selfgraph (framework) is to hydradb" (Internal: founder note, 2026-11-06); "what apache spark is to databricks; our graph database will be to us" (Internal: founder note, 2026-07-25); "'turbopuffer for graphDBs'" (Internal: founder note, 2026-11-24).
- "primitives": "We want to own the outcome by owning those primitives" (Internal: founder note, 2026-09-30).
- "hit the nail on the head" (founder notes on 2026-09-10 and 2026-11-24).

### Beliefs he repeats

1. **Agents need connected context, not isolated chunks.** "The problem agents face is they can't work with isolated chunks of information. An isolated notion page gives agent a static chunk, but the surrounding discussions, emails, and supporting docs explain why." (Internal: founder note, 2026-09-10). Repeated as "they let your agents crawl through the entire corpus without fail so that you can rest assured that no document went unturned" (Internal: founder note, 2026-11-24).
2. **Vector search breaks at scale; agents decay by day 30.** "something more than a vector DB and/or markdown files" (Internal: founder note, 2026-10-19).
3. **HydraDB is infra you build memory on, not a memory product.** "we're not a memory company. we're the company that lets you build memory on top of us." and "so you use hydra to build your own mem0" (Internal: founder note, 2026-11-24).
4. **Developers want to own their context.** "if you talk to 100 devs all 90 will tell you 'we want to own their memory'" (Internal: founder note, 2026-11-24; his own estimate, not a survey).
5. **Agents will pick tools themselves; be present where they look.** "Our goal is to ensure every single token is consumed via HydraDB." (Internal: founder note, 2026-09-10).
6. **Speed, agency, resourcefulness.** Company values slide: "1. Speed - makes or break a company. always remember - facebook shipped 500 changes per day in its early days. we'll set the gold standard for the future gen. 2. Agency - no look passes all around. 3. Resourcefulness - there isn't anything you CANNOT do." (Internal: founder note, 2026-09-09). Shared the "Boil the ocean" prompt: "The marginal cost of completeness is near zero with AI." (Internal: founder note, 2026-04-14).
7. **Focus beats random experiments.** "I'm realizing we're doing too many things this week but not producing asymmetric outputs. I want to narrow down our focus ... Primary metric to observe is: sign ups -> creating your first graph." (Internal: founder note, 2026-07-24). "We're running too many random experiments that will lead us nowhere." (Internal: founder note, 2026-11-04). "Forget all random experiments and focus on fixing real stuff" (Internal: founder note, 2026-11-19).
8. **Benchmarks must be reproducible.** "we'll make all datasets and methodology publicly available to ensure completely (& transparent) 100% reproducibility" and "a range, imo, is actually more accurate than one number" (Internal: founder note, 2026-07-25).
9. **Dev tools should feel subtle, not SaaS-y.** "whenever you design for dev tools /infra the best ui/ux isn't via animations but felt by interactions that are super subtle. a subtle change in colour, something getting highlighted, etc -- you add anything on top of it and it starts looking like a SaaS platform." (Internal: founder note, 2026-10-15). Simplicity bar: "Simplify APIs/SDKs/docs so a 17-year-old could use it first try." (Internal: team discussion, 2026-07-24).
10. **Sell to who is already asking.** "We are thinking where to fit HydraDB instead of asking 'Who is asking for HydraDB?'" (Internal: founder note, 2026-11-04).
11. **Teach, don't pitch.** "langchain grew by telling people 'how to do rag' they didnt say 'we are a hosted rag solution'" / "so our marketing should be 'how to do x'" (Internal: founder note, 2026-11-24).
12. **Pride in building infra.** "in an era when most people are struggling to build agents we built infra that scales, massively benefits every single developer who's going to work with LLMs, and then open sourced it." and "when was the last time you could go to someone and tell them "oh i built the db that xyz companies run on"" (Internal: founder note, 2026-08-12).

### Operating principles he states (for "how we work" posts)

- **Sales habit:** "For future reference never ask what they want to ask you beforehand - reduces credibility. We need to walk in blind and then impress" (Internal: founder note, 2026-09-10).
- **Speed of a sales call:** with a product leader at a large cybersecurity company, "we convinced them in 16 mins to start working with us." (Internal: founder note, 2026-09-10). Never name the company.
- **Run lean:** "my only request is to run a tight ship. i've seen bloat ... kill initiatives faster than they were starting." (Internal: founder note, 2026-10-14).
- **Open door:** "if you think we should put a banner on burj khalifa to advertise hydradb tell me or if you think we should rename the company to "goat graphs" i would love to hear why" (Internal: founder note, 2026-10-15).
- **Scope discipline with enterprise buyers:** "we will create new features only after POC (to avoid scope bloat) and once they sign enterprise contract" (Internal: founder note, 2026-10-07).
- **Quality over speed when it matters:** "I don't usually say this, but ... we can move a "little" slower BUT get everything right in the first shot. Quality of our work matters a lot this time." (Internal: founder note, 2026-07-17).
- **AI-native internal ops:** the team runs its own internal agents, for example one that summarises account health daily with drafted follow-ups, and a daily research digest over Hacker News and arXiv (Internal: team discussion, 2026-03-31 and 2026-04-03).

### How he frames HydraDB

Use the current framing in [[global/positioning]]. Newest (2026-11-24): "the story isnt fast graphs or whatever - the story is 'own your context & memory'" and "build with primitives that you can use to assemble context for your agents" (Internal: founder note, 2026-11-24). Sales triad: "problem (broken context), solution (unified context), outcome (most accurate agent retrieval at scale)" (Internal: founder note, 2026-10-20). Vision: "make sure every single agent on the planet chooses hydradb for powering its context and memory" (Internal: founder note, 2026-10-14).

### Topics he cares about (post territory)

Knowledge graphs and ontologies for agents; why similarity is not relevance; temporal context (what changed, when, why); object storage economics; open source as distribution (HydraDB OSS, selfgraph, open-glean); agent discoverability (being present where agents look); launches and virality; speed of execution; reproducible benchmarks; YC; team pride.

### Things he would never say (hard rules for drafts)

- No emoji-as-reply, and no emoji bullets: "pls never respond to my messages with emojis" (Internal: founder note, 2026-10-15).
- No AI slop or generic copy: "i want to work NO AI-slop approach with handcrafted blogs" (Internal: founder note, 2026-10-23). "the response reads like ai lol" (Internal: founder note, 2026-11-24).
- No hype adjectives like "cracked": "pls find a replacement for the word 'cracked' maybe we don't need an adjective" (Internal: founder note, 2026-07-28).
- Never "we are a memory company" or "a mem0 alternative" (belief 3).
- Never "context graph" as his own preferred term: "most commonly people have started calling it a 'context graph' (a term i dont like btw ...)" (Internal: founder note, 2026-10-19). Use "knowledge graph" or "graph" in his voice; quote "context graph" only as what the market says.
- No single cherry-picked benchmark number without method (belief 8), and no speed or cost multiple at all until a published benchmark exists (see [[proof/performance-and-cost-claims]]).
- No tagging of individual people: "Company tagging is okay but no personal name tagging pls. At all." (Internal: founder note, 2026-08-12).
- Internal profanity and Hinglish stay internal. Posts keep the energy, not the swearing. Never use slurs.
- No hedged corporate phrasing ("we're excited to announce", "leverage synergies").
- No revenue or ARR figures, ever.

## Source

All quotes are Nishkarsh's own internal messages at HydraDB, dated 2023-04-04 to 2026-11-24 (Internal: founder note, dates inline). Messages from his earlier company were used only for voice patterns, not for HydraDB claims.
