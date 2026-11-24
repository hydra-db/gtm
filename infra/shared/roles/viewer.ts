import { defineRole } from "@cargo-ai/cdk";

// The workspace's viewer system role, adopted once for every service user that
// only reads (workspace-health, goal-coverage). A system role cannot be edited,
// so there is no permission list here to drift. One slug, one declaration.
export const viewer = defineRole("viewer", { adopt: true });
