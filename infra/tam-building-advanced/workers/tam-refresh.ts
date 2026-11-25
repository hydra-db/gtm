import { defineWorker } from "@cargo-ai/cdk";

import { tamSourceAiArk } from "../models/tam-source-ai-ark";
import { tamSourceApollo } from "../models/tam-source-apollo";

// The two-weekly refresh of this cookbook's paid sources, by operator
// decision. AI Ark fetchCompanies and Apollo fetchOrganizations take no cron
// (`scheduleNotCompatible`, see ../settings.ts), and Cargo has no native
// model-sync action a play could call, so this worker's cron calls the
// storage API's model refresh instead. The profile play then picks up what
// arrived, capped per tick.
//
// Up to about 27.5 credits a run (AI Ark up to 17.5, Apollo up to 10). Sales
// Navigator is left out on purpose (about 549 credits a run); Exa is loaded by
// hand (references/run.md).
//
// The API token is the secret workspace env var CARGO_API_TOKEN, which every
// worker inherits without a reference (worker `env` takes no workspaceEnv()).
export const tamRefresh = defineWorker("tam-refresh", {
  path: new URL("./tam-refresh", import.meta.url).pathname,
  name: "TAM refresh",
  description:
    "Re-syncs tam_source_ai_ark and tam_source_apollo on the 1st and 15th at 09:07 UTC.",
  env: {
    TAM_MODEL_UUIDS: `${tamSourceAiArk.uuid},${tamSourceApollo.uuid}`,
  },
  triggers: [
    {
      name: "Two-weekly TAM refresh",
      cron: "7 9 1,15 * *",
      path: "/refresh",
      method: "POST",
    },
  ],
});
