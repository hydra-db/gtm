import { defineAgent } from "@cargo-ai/cdk";

import { listenerPrompt } from "./listener.prompt";
// Connectors already declared in this project, reused: one slug declared
// twice collides at deploy.
import { anthropic } from "../../gtm-factory/agents/outreach-drafter";
import { slack } from "../../shared/connectors/slack";
import { linkedin } from "../../tam-building-advanced/connectors/linkedin";
import { agentsFolder } from "../folders";
import { linkedinPosts } from "../models/linkedin-posts";
import { surfacedPosts } from "../models/surfaced-posts";
import { weeklyDigestEnabled } from "../settings";

// The listener: once a week, which public conversations are worth joining and
// who in them looks like a buyer.
//
// The model does the buying (one capped keyword search, synced Monday at 05:00
// UTC); the agent does the judging. It reads the week's posts, drops the ones
// already surfaced, picks at most five against the ICP and pains in the
// workspace context, reads comments only on those, and posts one digest.
//
// Comments, not reactions. A comment is a person saying something in public
// about the problem; a reaction is a click. `searchPostReactions` bills per
// reactor and returns no words to quote, so it is left off `uses` (the
// `with-reactions` variation in SKILL.md adds it back).
//
// No engagement action, ever. likePost, commentPost, connectProfile and
// messageProfile live on the same connector; none is on `uses`, and the
// contract fails if one is added. The digest is for a human who decides.
//
// The engagers are not stored. They appear in that week's digest, quoted from
// a public comment, and the ledger keeps only the post. A standing list of
// people who commented is a list nobody gave a basis for.
export const listener = defineAgent("social_listener", {
  name: "Social listener",
  description:
    "Weekly digest of the LinkedIn conversations worth joining, and the commenters in them who match the ICP.",
  color: "yellow",
  connector: anthropic,
  languageModel: "claude-sonnet-5",
  // Context and post reads, at most five comment pulls, one post and a few
  // ledger rows, with room left over so the post always fits.
  maxSteps: 40,
  capabilities: [
    // Read-only: the ICP, the pains in the buyer's words, competitors. The
    // rubric for "worth joining" and "looks like a buyer".
    { slug: "context", config: { isReadOnly: true } },
  ],
  uses: [
    { ref: linkedinPosts, readOnly: true },
    // The ledger is the one model the agent writes.
    { ref: surfacedPosts, readOnly: false },
    linkedin.actions.searchPostComments,
    {
      ref: slack.actions.postMessage,
      config: {
        // #growth, resolved from the Slack connector's listChannels
        // autocomplete on 2026-11-25 (operator decision; it was #sales). Locked so the
        // digest, which names people, never lands anywhere else. The Cargo
        // bot must be invited to #growth before the first run.
        channelId: "C0CG3H6R6KA",
        format: "markdown",
        disableUnfurling: true,
      },
    },
  ],
  // No trigger until `weeklyDigestEnabled` (settings.ts): the agent cannot
  // be deployed disabled, so the switch is whether its cron exists.
  triggers: weeklyDigestEnabled
    ? [
        {
          type: "cron" as const,
          name: "weekly",
          // 07:00 UTC Monday: two hours after the posts model syncs. Move both
          // together.
          cron: "0 7 * * 1",
          text: "Write this week's social listening digest. Follow your system prompt exactly: read the context, skip what is already in surfaced_posts, pick at most five posts, read comments only on those, post one digest, record it.",
        },
      ]
    : [],
  systemPrompt: listenerPrompt,
  evaluator: {
    rubric:
      "Was exactly one digest posted, with no post already in surfaced_posts? Is every pick tied to a named line of the ICP or pains? Is every engager quoted from a comment that was read, with no employer or URL invented? Did it avoid every engagement action?",
    threshold: 0.8,
  },
  folder: agentsFolder,
});
