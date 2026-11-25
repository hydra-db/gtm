import { createCargoApi, createWorker } from "@cargo-ai/worker-sdk";

// Re-syncs the TAM source models whose extractors take no cron (AI Ark
// fetchCompanies, Apollo fetchOrganizations). Called by this worker's own
// cron trigger (../tam-refresh.ts) on the 1st and 15th at 09:07
// UTC. The daily net-new and profile plays then pick up what arrived.
//
// The URL is public, so the route guards itself: it acts only on the 1st or
// the 15th (UTC), and skips a model that already started a sync in the last
// 20 hours. Calling it by hand can never buy more than the schedule does.

type Env = {
  CARGO_API_TOKEN?: string;
  CARGO_API_URL?: string;
  CARGO_WORKSPACE_UUID?: string;
  TAM_MODEL_UUIDS?: string;
};

const REFRESH_DAYS = [1, 15];
const DEDUPE_MS = 20 * 60 * 60 * 1000;

const { app } = createWorker<Env>({ title: "TAM refresh" });

app.post("/refresh", async (c) => {
  const now = new Date();
  if (!REFRESH_DAYS.includes(now.getUTCDate())) {
    return c.json({ ok: false, skipped: "not a refresh day (1st or 15th, UTC)" }, 409);
  }
  const uuids = (c.env.TAM_MODEL_UUIDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (uuids.length === 0) {
    console.error("TAM_MODEL_UUIDS is empty");
    return c.json({ ok: false, error: "no models configured" }, 500);
  }

  const api = createCargoApi(c.env);
  const results: Array<{ modelUuid: string; status: string; detail?: string }> = [];
  for (const modelUuid of uuids) {
    try {
      const { runs } = await api.storage.run.list({ modelUuid, limit: 5 });
      const latest = Math.max(0, ...runs.map((r) => new Date(r.createdAt).getTime()));
      if (now.getTime() - latest < DEDUPE_MS) {
        results.push({ modelUuid, status: "skipped", detail: "synced in the last 20 hours" });
        continue;
      }
      const res = await api.storage.model.refresh(modelUuid);
      results.push({ modelUuid, status: res.isRefreshing ? "refreshing" : "not refreshing" });
    } catch (err) {
      console.error(`refresh of ${modelUuid} failed`, err);
      results.push({ modelUuid, status: "error", detail: String(err) });
    }
  }
  console.log(JSON.stringify({ refreshedAt: now.toISOString(), results }));
  const failed = results.some((r) => r.status === "error");
  return c.json({ ok: !failed, results }, failed ? 500 : 200);
});

export default app;
