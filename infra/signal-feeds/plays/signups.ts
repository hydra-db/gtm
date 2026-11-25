import { definePlay, defineWorkflow } from "@cargo-ai/cdk";
import { z } from "zod";

import { tierAnalyst } from "../../account-scoring/agents/tier-analyst";
import { attio, attioApi } from "../../crm-routing/connectors";
import { readEntries } from "../../crm-routing/scripts/read-entries";
import { recordEntriesUrl } from "../../crm-routing/scripts/record-entries-url";
import { attioApiBase, engagedListSlug } from "../../crm-routing/settings";
import { lemlist } from "../../daily-outreach/connectors";
import { outreachEnrollments } from "../../daily-outreach/models/outreach-enrollments";
import { playsFolder } from "../../gtm-factory/folders";
import { tamCandidates } from "../../gtm-factory/models/tam-candidates";
import { slack } from "../../shared/connectors/slack";
import { signalFeedInputs } from "../models/signal-feed-inputs";
import { signups } from "../models/signups";
import { attioPersonId } from "../scripts/attio-person-id";
import { contactedVerdict } from "../scripts/contacted-verdict";
import { engagedEntry } from "../scripts/engaged-entry";
import { parseSignups } from "../scripts/parse-signups";
import { signupLines } from "../scripts/signup-lines";
import { signupPlan } from "../scripts/signup-plan";
import { signupsWindow } from "../scripts/signups-window";
import {
  outreachLemlistCampaignId,
  gtmEngineChannelId,
  signupVerdictsChannelId,
  signupsChannelId,
  signupsFeedCron,
  signupsReadLimit,
  signupsRouteCron,
} from "../settings";

// ---------------------------------------------------------------------------
// Read: #signups into the signups model
// ---------------------------------------------------------------------------

// One read of #signups over a window (the last 13 hours by default, or the
// `oldest`/`latest` a backfill passes), bot messages included. Every "New
// signup!" message becomes one signups row, keyed on the email. Free: one
// Slack call and a storage write per signup. Fails with not_in_channel until
// the Cargo app is invited to #signups.
export const readSignups = defineWorkflow(
  "signal_feeds_signups_workflow",
  {
    input: z.object({
      value: z.string().optional(),
      oldest: z.string().optional(),
      latest: z.string().optional(),
    }),
    output: z.object({ result: z.string() }),
    uses: { slack },
    imports: { signups, signupsWindow, parseSignups, signupsChannelId, signupsReadLimit },
  },
  ({ input, uses, model }) => {
    const window = signupsWindow({ oldest: input.oldest, latest: input.latest });
    const messages = uses.slack.getConversationHistory({
      channelId: signupsChannelId,
      limit: signupsReadLimit,
      oldest: window.oldest,
      latest: window.latest,
    });
    const parsed = parseSignups({ messages });
    for (const row of parsed.rows as unknown as Iterable<(typeof parsed.rows)[number]>) {
      model.upsert({
        modelUuid: signups.uuid,
        matchingColumnSlug: "key",
        matchingValue: row.key,
        mappings: [
          { columnSlug: "key", value: row.key },
          { columnSlug: "name", value: row.name },
          { columnSlug: "email", value: row.email },
          { columnSlug: "linkedin_url", value: row.linkedin_url },
          { columnSlug: "company", value: row.company },
          { columnSlug: "title", value: row.title },
          { columnSlug: "category", value: row.category },
          { columnSlug: "source", value: row.source },
          { columnSlug: "signed_up_at", value: row.signed_up_at },
          { columnSlug: "domain", value: row.domain },
          { columnSlug: "slack_ts", value: row.slack_ts },
          { columnSlug: "seen_at", value: new Date() },
        ],
      });
    }
    return { result: "read" };
  },
);

// Every 12 hours, over the one signal_feed_inputs row whose feed is "signups"
// (seeded by outputs/2026-11-25-signups-feed-seed).
export const signupsEvery12h = definePlay("signal_feeds_signups_12h", {
  name: "Signal feeds: #signups, every 12 hours",
  description:
    "Reads the last 13 hours of #signups (bot messages included) and writes each signup to the signups model, keyed on email.",
  folder: playsFolder,
  model: signalFeedInputs,
  workflow: readSignups,
  filter: {
    conjonction: "and",
    groups: [
      {
        conjonction: "and",
        conditions: [
          { kind: "string", columnSlug: "feed", operator: "is", values: ["signups"] },
        ],
      },
    ],
  },
  schedule: { type: "cron", cron: signupsFeedCron },
  isEnabled: true,
  runCreationRule: "always",
  changeKinds: ["added", "updated", "unchanged"],
});

// ---------------------------------------------------------------------------
// Route: each new signup, once
// ---------------------------------------------------------------------------

// One new signup. Never emails the person.
//   - Older than signupsRouteMaxAgeHours (the backfill), or our own team or a
//     test probe: nothing.
//   - Already contacted (email or domain in outreach_enrollments, or the email
//     is a lead in the outreach lemlist campaign): stopped in that campaign
//     (lemlist has no "mark interested" action; unsubscribing the lead from
//     the campaign is what stops its sequence), added to Attio Engaged at
//     Replied with a note, and one line in #gtm-engine.
//   - Not contacted, with a company: tiered by the account-scoring agent,
//     added to tam_candidates with that tier, and the verdict in
//     #signups-and-relevant-visitors.
//   - Not contacted, personal email and no company: one line in
//     #signups-and-relevant-visitors.
const routeSignup = defineWorkflow(
  "signal_feeds_route_signup",
  {
    input: z.object({
      key: z.string(),
      email: z.string(),
      name: z.string().optional(),
      company: z.string().optional(),
      title: z.string().optional(),
      linkedin_url: z.string().optional(),
      category: z.string().optional(),
      source: z.string().optional(),
      domain: z.string().optional(),
      signed_up_at: z.string().optional(),
    }),
    output: z.object({ result: z.string() }),
    uses: { slack, lemlist, attio, attioApi, tierAnalyst },
    imports: {
      outreachEnrollments,
      tamCandidates,
      signupPlan,
      contactedVerdict,
      attioPersonId,
      engagedEntry,
      signupLines,
      recordEntriesUrl,
      readEntries,
      attioApiBase,
      engagedListSlug,
      outreachLemlistCampaignId,
      gtmEngineChannelId,
      signupVerdictsChannelId,
    },
  },
  ({ input, uses, model }) => {
    const plan = signupPlan({
      email: input.email,
      domain: input.domain,
      company: input.company,
      signedUpAt: input.signed_up_at,
    });
    if (plan.tooOld) {
      return { result: "skipped_older_than_window" };
    }
    if (plan.ignored) {
      return { result: "skipped_ignored_domain" };
    }

    const ledger = model.search({
      modelUuid: outreachEnrollments.uuid,
      filter: plan.ledgerFilter,
      limit: 5,
      selectedColumnSlugs: ["email", "account_domain"],
    });
    const lemlistLead = uses.lemlist.getLead({ id: plan.email }, { continueOnFailure: true });
    const verdict = contactedVerdict({
      ledger,
      lemlistLead,
      campaignId: outreachLemlistCampaignId,
    });

    if (verdict.contacted) {
      if (verdict.inCampaign) {
        uses.lemlist.unsubscribeLeadFromCampaign(
          { campaignId: outreachLemlistCampaignId, email: plan.email },
          { continueOnFailure: true },
        );
      }
      uses.attio.upsertRecords({
        objectType: "people",
        matchingPropertyName: "email_addresses",
        matchingValue: plan.email,
        mappings: [
          { propertyName: "email_addresses", value: [plan.email] },
          { propertyName: "job_title", value: input.title || "" },
        ],
      });
      const found = uses.attio.findRecords({
        objectType: "people",
        criterias: [{ propertyName: "email_addresses", value: plan.email }],
      });
      const person = attioPersonId({ found });
      const entriesUrl = recordEntriesUrl({ recordId: person.recordId });
      const entries = uses.attioApi.call({ url: entriesUrl.url, method: "get" });
      const listed = readEntries({ response: entries });
      if (!listed.inEngaged) {
        const body = engagedEntry({
          recordId: person.recordId,
          base: attioApiBase,
          list: engagedListSlug,
        });
        uses.attioApi.call({
          url: body.url,
          method: "post",
          // @ts-expect-error bodyFormat and bodyJson are untyped
          bodyFormat: "json",
          bodyJson: body.json,
        });
      }
      uses.attio.createNote({
        objectType: "people",
        recordId: person.recordId,
        title: "signed up after outreach",
        format: "plaintext",
        content: `signed up after outreach: ${input.name || plan.email} (${input.company || "no company"}), ${input.signed_up_at || ""}, ${input.category || ""}, source ${input.source || "unknown"}`,
      });
      const contactedLines = signupLines({
        name: input.name,
        email: plan.email,
        title: input.title,
        company: input.company,
      });
      uses.slack.postMessage({
        channelId: gtmEngineChannelId,
        format: "markdown",
        disableUnfurling: true,
        body: contactedLines.contacted,
      });
      return { result: "contacted_routed" };
    }

    if (!plan.hasCompany) {
      const personalLines = signupLines({
        name: input.name,
        email: plan.email,
        title: input.title,
        company: input.company,
      });
      uses.slack.postMessage({
        channelId: signupVerdictsChannelId,
        format: "markdown",
        disableUnfurling: true,
        body: personalLines.personal,
      });
      return { result: "personal_no_company" };
    }

    const judgment = uses.tierAnalyst({
      prompt: `Tier ${input.company || input.domain} (${input.domain || "domain unknown"}) against the ICP and the tiering rubric in the workspace context. A person there just signed up for HydraDB: ${input.title || "title unknown"}. The signup bot's category: ${input.category || "none"}. LinkedIn: ${input.linkedin_url || "none"}.`,
    });
    model.upsert({
      modelUuid: tamCandidates.uuid,
      matchingColumnSlug: "key",
      matchingValue: plan.candidateKey,
      mappings: [
        { columnSlug: "key", value: plan.candidateKey },
        { columnSlug: "name", value: input.company || input.domain },
        { columnSlug: "domain", value: input.domain || judgment.answer.domain },
        { columnSlug: "signal_source", value: "signups" },
        {
          columnSlug: "signal_detail",
          value: `${plan.email}, ${input.title || "no title"}, signed up ${input.signed_up_at || ""}`,
        },
        { columnSlug: "last_signal_at", value: new Date() },
      ],
      customMappings: [
        { columnSlug: "account_tier", value: judgment.answer.tier },
        { columnSlug: "account_tier_reason", value: judgment.answer.rationale },
        { columnSlug: "account_tier_evidence_url", value: judgment.answer.evidence_url },
        { columnSlug: "account_tiered_at", value: new Date() },
      ],
    });
    const lines = signupLines({
      name: input.name,
      email: plan.email,
      title: input.title,
      company: input.company || input.domain,
      tier: judgment.answer.tier,
      reason: judgment.answer.rationale,
    });
    uses.slack.postMessage({
      channelId: signupVerdictsChannelId,
      format: "markdown",
      disableUnfurling: true,
      body: lines.verdict,
    });
    return { result: "qualified" };
  },
);

// Every new signups row, once, 30 minutes after each read. Rows older than
// signupsRouteMaxAgeHours end at the first step, so the 30-day backfill lands
// in the model without reaching Slack.
export const routeSignups = definePlay("signal_feeds_route_signups", {
  name: "Signal feeds: route new signups",
  description:
    "Each new signup once: already contacted goes to Attio Engaged at Replied (stopped in lemlist) and #gtm-engine; otherwise the company is tiered, added to tam_candidates and the verdict posted to #signups-and-relevant-visitors. Never emails the signup.",
  folder: playsFolder,
  model: signups,
  workflow: routeSignup,
  schedule: { type: "cron", cron: signupsRouteCron },
  isEnabled: true,
  runCreationRule: "noConcurrency",
  changeKinds: ["added"],
});
