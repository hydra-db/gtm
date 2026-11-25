import { defineRun, defineWorkflow } from "@cargo-ai/cdk";
import { z } from "zod";

import { emailChecks } from "../../infra/daily-outreach/models/email-checks";
import { finalTamContacts } from "../../infra/gtm-factory/models/final-tam-contacts";

// The off-domain address the find-work-email tool returned for the Harvey
// new hire in the 2026-11-25 test (atish@getaida.com, an earlier employer,
// verified "valid"): its email_checks row is removed and the email on his
// final_tam_contacts row is cleared, so daily outreach cannot draft to it.
// He stays in final_tam_contacts as the account's signal person.
const clearOffDomainEmail = defineWorkflow(
  "new_hire_clear_off_domain_email",
  {
    input: z.object({ contactKey: z.string(), email: z.string() }),
    output: z.object({ result: z.string() }),
    imports: { emailChecks, finalTamContacts },
  },
  ({ input, model }) => {
    model.remove({
      modelUuid: emailChecks.uuid,
      matchingColumnSlug: "email",
      matchingValue: input.email,
    });
    model.update({
      modelUuid: finalTamContacts.uuid,
      matchingColumnSlug: "key",
      matchingValue: input.contactKey,
      mappings: [{ columnSlug: "email", value: "" }],
    });
    return { result: "cleared" };
  },
);

export const clearAtishEmail = defineRun("2026-11-25-new-hire-atish-email-cleanup", {
  workflow: clearOffDomainEmail,
  data: {
    contactKey: "https://www.linkedin.com/in/ACwAAADqQ_4B6L3QPRmt73mZK1AHuecwV4wap4s",
    email: "atish@getaida.com",
  },
});
