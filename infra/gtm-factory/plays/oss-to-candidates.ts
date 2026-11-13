import { definePlay, defineWorkflow } from "@cargo-ai/cdk";
import { z } from "zod";

import { playsFolder } from "../folders";
import { ossSignals } from "../models/oss-signals";
import { tamCandidates } from "../models/tam-candidates";
import { candidateKey } from "../scripts/candidate-key";

// Every company that lands in oss_signals is proposed to the ICP gate.
const propose = defineWorkflow(
  "gtm_oss_signal_to_candidate_workflow",
  {
    input: z.object({
      domain: z.string().optional(),
      company: z.string().optional(),
      signal: z.string().optional(),
    }),
    output: z.object({
      result: z.string(),
    }),
    imports: { tamCandidates, candidateKey },
  },
  ({ input, model }) => {
    const candidate = candidateKey({
      domain: input.domain || "",
      company: input.company || "",
    });
    if (candidate.known) {
      model.upsert({
        modelUuid: tamCandidates.uuid,
        matchingColumnSlug: "key",
        matchingValue: candidate.key,
        mappings: [
          { columnSlug: "key", value: candidate.key },
          { columnSlug: "name", value: candidate.name },
          { columnSlug: "domain", value: candidate.domain },
          { columnSlug: "signal_source", value: "oss_signals" },
          { columnSlug: "signal_detail", value: input.signal || "" },
          { columnSlug: "last_signal_at", value: new Date() },
        ],
      });
      return { result: "proposed" };
    }
    return { result: "skipped" };
  },
);

export const ossSignalToCandidate = definePlay("gtm_oss_signal_to_candidate", {
  name: "OSS signals: propose the company to the ICP gate",
  description:
    "For every new oss_signals row: add the company to tam_candidates so the ICP gate scores it.",
  folder: playsFolder,
  model: ossSignals,
  workflow: propose,
  schedule: { type: "cron", cron: "47 * * * *" },
  isEnabled: false,
  runCreationRule: "once",
  changeKinds: ["added"],
});
