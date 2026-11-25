import { definePlay } from "@cargo-ai/cdk";

import { playsFolder } from "../../gtm-factory/folders";
import { signalFeedInputs } from "../../signal-feeds/models/signal-feed-inputs";
import dailyOutreach from "../workflows/daily-outreach";

// The daily outreach run, weekdays at 16:13 UTC (08:13 in Los Angeles while
// it is on PST; 09:13 PDT from 2027-03-14, since the cron is UTC). It runs
// over the one signal_feed_inputs row whose feed is "outreach" (seeded by
// outputs/2026-11-24-seed-outreach-driver), so a tick is one run.
//
// Per run, at most `dailyCap` people (settings.ts): one Outreach drafter run
// each, and one lemlist createLead each once `lemlistCampaignId` is set. The
// lemlist lead carries these custom variables for the sequence to use:
// emailSubject, emailBody, linkedinMessage, voiceNoteScript, signalUrl,
// senderEmail, senderName. Nothing is sent until the operator launches the
// campaign in lemlist.
export const dailyOutreachPlay = definePlay("daily_outreach", {
  name: "Daily outreach: draft leads for lemlist",
  description:
    "Weekdays: up to 30 engineering and AI leaders at ready_now, then warming, working-list accounts get a signal-led draft (email, LinkedIn, voice note) in outreach_enrollments, and are added to the lemlist campaign once one is set. Sends nothing.",
  folder: playsFolder,
  model: signalFeedInputs,
  workflow: dailyOutreach,
  filter: {
    conjonction: "and",
    groups: [
      {
        conjonction: "and",
        conditions: [
          { kind: "string", columnSlug: "feed", operator: "is", values: ["outreach"] },
        ],
      },
    ],
  },
  schedule: { type: "cron", cron: "13 16 * * 1-5" },
  isEnabled: true,
  runCreationRule: "always",
  changeKinds: ["added", "updated", "unchanged"],
});
