import { defineBatch } from "@cargo-ai/cdk";

import { newHires } from "../../infra/new-hire-detection/models/new-hires";
import { routeNewHires } from "../../infra/new-hire-detection/plays/route-new-hires";

// The new_hires rows the first sync loaded while the route play was
// skipping existing rows, that started in 10/2026 or 11/2026 and were not
// routed by the 2026-11-25 test (Harvey and Stellus Rx were). Leaves out the
// three public enterprises (JPMorganChase, Takeda, Accenture), which
// enterprise_parked keeps off the working list, so outreach would never
// reach them. new_hires `_id` is the LinkedIn profile id.
export const backfill = defineBatch("2026-11-25-new-hire-backfill", {
  workflow: routeNewHires,
  data: {
    kind: "recordIds",
    model: newHires,
    ids: [
      "848026448", // Josh Billig, GEP Worldwide, 11/2026
      "835145311", // Geetha Palaparthi, Vizient, 11/2026
      "416199884", // Matthew Hollar, Phaidra, 11/2026
      "131371981", // Marco V., Stealth Startup, 10/2026
      "1056700411", // Jacob Langewisch, Coalition for Secure AI, 10/2026
      "326615200", // Alex G., ASME, 10/2026
      "575713111", // Joshua Monson, Nscale, 10/2026
    ],
  },
});
