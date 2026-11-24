import { defineConnector } from "@cargo-ai/cdk";

// Snitcher: website visitor identification on hydradb.com. Set up in the Cargo
// UI (the tracker is placed in Framer), adopted here rather than created:
// `default: true` binds the live connector, imported into the deploy state as
// df95b8a4-c7b9-454d-b348-7aa3a2076b58. Its API key is never declared, so a
// deploy never clears it.
export const snitcher = defineConnector("snitcher", {
  integration: "snitcher",
  default: true,
});
