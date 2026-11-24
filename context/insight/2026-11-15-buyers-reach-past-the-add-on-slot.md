---
title: Some buyers want HydraDB as the main system, not a side add-on
description: Two early, separate signals that buyers reach for more than a sidecar. A report (2026-10-30) of teams considering HydraDB as their primary database, and several orgs that upgraded straight to the dedicated Scale tier on Friday 2026-11-13.
confidence: hypothesis
references:
  - alternative/postgres-and-one-engine-databases
  - alternative/vector-databases
---

## Claim

Demand is reaching past the "add a graph next to your stack" slot that HydraDB's own messaging targets
("keep your vector db"). Some teams want it as the primary store, on dedicated infrastructure, from day one.

## Evidence

- Internal: sales notes, 2026-10-30. Nishkarsh: people have started considering switching to HydraDB from
  a hosted Postgres platform as their primary database (no accounts or count given).
- Internal: team discussion, 2026-11-15. On Friday 2026-11-13, several orgs upgraded directly to the
  dedicated Scale tier, skipping the Ship tier.
- Internal: founder note, 2026-11-03. Nishkarsh on a public agent-memory example that still used a vector
  database: "that's what we need to change".

Two different claims from two people pointing the same way, each seen once: not validated. "Orgs" are
paying upgrades, not named customers.

## Implication

Packaging assumes a ladder (Ship, then Scale). Some buyers skip it; make the direct path to dedicated
infrastructure clean. Tension with "keep / add" messaging is unresolved.

## Use in messaging

Possible post: "Several teams skipped our starter plan on the same Friday." No upgrade counts, revenue or
operational issues in public.
