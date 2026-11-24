import { defineModel } from "@cargo-ai/cdk";

import { snitcher } from "../../shared/connectors/snitcher";
import { modelsFolder } from "../folders";
import { websiteVisitors } from "./companies";

// Every visit by an identified company: the organisation, when it started,
// the referrer and the pages viewed. Join it to the companies model on
// `organisation_uuid = uuid`. Snitcher bills nothing per session (0 credits
// per item); the companies are what is billed.
//
// `workspaceUuid` is the Snitcher workspace the companies model provisioned
// when the operator created it in the UI. It is a token, so this model
// deploys after that one, in the same deploy.
//
// It keeps the integration's default unification (an account event on the
// company's domain). readiness-scoring gives `website_visitor_sessions` no
// weight, so a session counts for nothing in the score until someone decides
// it should.
export const visitorSessions = defineModel("website_visitor_sessions", {
  connector: snitcher,
  extractSlug: "fetchSessions",
  description:
    "Website sessions of the identified visiting companies on hydradb.com, from Snitcher.",
  folder: modelsFolder,
  config: { workspaceUuid: websiteVisitors.config._workspaceUuid },
});
