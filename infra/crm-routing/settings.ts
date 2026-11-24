// The settings an operator changes without touching the plays.

// Attio list slugs. Engaged holds every reply (People); Community & events
// holds the people who are not a deal now but are worth keeping close.
export const engagedListSlug = "engaged";
export const communityListSlug = "community";

// Engaged stages that send a person to Community & events, at Invited.
export const communityStages = ["Not now", "Not interested"];

// The Engaged stage that becomes a Deal at Prospecting.
export const qualifiedStage = "Qualified";
export const dealStage = "Prospecting";

// Deal owner when the Engaged entry has no owner: Nishkarsh (Attio workspace
// member id, from list-workspace-members on 2026-11-24). Attio requires one.
export const defaultDealOwnerId = "9eb16143-d050-4f2d-b3e9-ac9f04537a59";

// Every 12 hours. The Engaged model syncs at :45 past 00 and 12 UTC, the two
// plays read it 30 minutes later.
export const engagedSyncCron = "45 0,12 * * *";
export const routingCron = "15 1,13 * * *";

// Attio's REST API root.
export const attioApiBase = "https://api.attio.com/v2";
