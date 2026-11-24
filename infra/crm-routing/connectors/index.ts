import { defineConnector, workspaceEnv } from "@cargo-ai/cdk";

// The workspace's Attio connector, authorized in the Cargo UI and bound here
// (`default: true`), never created by a deploy. It reads and writes records
// (people, deals). It cannot touch list entries: its token gets 403 on every
// list-entry write, and its extractors return a list's parent records without
// the entry values (no Stage). That is why the second connector exists.
export const attio = defineConnector("attio", {
  integration: "attio",
  default: true,
});

// Attio's REST API for list entries: read an Engaged entry's Stage, add a
// person to Community & events. Authenticated by the workspace env var
// ATTIO_AUTHORIZATION, whose value is `Bearer <Attio access token>`. The value
// lives only in the workspace (Cargo > Settings > Environment variables) and is
// read on every call, so rotating the token needs no deploy.
//
// The token is an Attio access token (Attio > Workspace settings > Developers)
// with these scopes: Records read, List entries read-write, List configuration
// read, Object configuration read.
export const attioApi = defineConnector("attio_api", {
  integration: "http",
  name: "Attio API (list entries)",
  config: {
    headers: [
      {
        key: "Authorization",
        type: "secret",
        secretValue: workspaceEnv("ATTIO_AUTHORIZATION"),
      },
    ],
  },
});
