import { defineAgent, defineConnector } from "@cargo-ai/cdk";

import { finalTam } from "../models/final-tam";
import { finalTamContacts } from "../models/final-tam-contacts";
import { tamMasterFinal } from "../models/tam-master-final";
import { outreachDrafterPrompt } from "./outreach-drafter-prompt";

// Claude, through the workspace's existing Anthropic connector.
export const anthropic = defineConnector("anthropic", {
  integration: "anthropic",
  default: true,
});

// Drafts one person's first-touch email, LinkedIn message and voice-note
// script from their signal, YC-aware. Drafts only: nothing here sends.
// Narrative and hypothesis: context/motion/signal-feedback-outreach.md.
export const outreachDrafter = defineAgent("outreach_drafter", {
  name: "Outreach drafter",
  description:
    "Drafts a short, personalised first touch (email, LinkedIn message, voice-note script) for one person from their signal. YC copy only for YC people. Drafts only; a person approves before anything is sent.",
  color: "blue",
  connector: anthropic,
  languageModel: "claude-sonnet-5",
  temperature: 0.4,
  maxSteps: 4,
  systemPrompt: outreachDrafterPrompt,
  uses: [tamMasterFinal, finalTam, finalTamContacts],
  repository: null,
});
