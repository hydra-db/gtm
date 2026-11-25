import { defineScript } from "@cargo-ai/cdk";

// Contacted when the outreach ledger has the email or the domain, or lemlist
// holds the email as a lead in the outreach campaign.
export const contactedVerdict = defineScript(
  async ({
    ledger,
    lemlistLead,
    campaignId,
  }: {
    ledger: unknown;
    lemlistLead: unknown;
    campaignId: string;
  }) => {
    const inLedger = Array.isArray(ledger) && ledger.length > 0;
    const inCampaign =
      lemlistLead !== null &&
      lemlistLead !== undefined &&
      JSON.stringify(lemlistLead).includes(campaignId);
    return { contacted: inLedger || inCampaign, inLedger, inCampaign };
  },
);
