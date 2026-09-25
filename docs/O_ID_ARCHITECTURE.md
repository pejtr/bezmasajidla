# O-Identity Architecture v1

Status: **FOUNDATION / NON-PRODUCTION**

## Canonical hierarchy

- **o_ID** — universal root identity.
- **ONYX** — authentication, security, trust and access.
- **OMNI** — intelligence, agents and orchestration.
- **OPTI** — commercial projection, CRM, attribution and growth.
- **vegID** — food-domain projection used first by BezmasáJídla.

The root `o_identity_id` is an internal identifier and must never be exposed to
the browser or used as a public profile id.

## First vertical slice

BezmasáJídla keeps the existing login untouched. On the first authenticated
o_ID request the server lazily creates:

1. an `o_identity` root,
2. a link to the legacy BezmasáJídla user,
3. a pairwise `vegID` subject,
4. a private veg profile,
5. an audit event,
6. a one-time mirror of existing recipe/restaurant favorites into the new
   interaction model.

This makes migration additive and rollback-friendly. Existing favorites,
reviews and recipes continue to work during the transition.

## Privacy boundaries

- root o_ID: server-side only;
- vegID subject: application/domain scoped;
- veg profile: private by default;
- cross-domain correlation: prohibited unless a future explicit consent grant
  authorizes it;
- dietary preferences must not flow automatically to advertising or OPTI
  targeting.

## Interaction model

Supported v1 targets:

- recipe
- venue
- article
- product

Supported v1 actions:

- favorite
- want_to_visit
- visited
- want_to_cook
- cooked
- saved

The API uses idempotent `set(active: boolean)` semantics instead of a blind
toggle to avoid race conditions across devices.

## Migration gate

Do not deploy the schema until:

- migration SQL is reviewed;
- typecheck passes;
- identifier tests pass;
- legacy login is verified unchanged;
- root o_ID is confirmed absent from all client responses;
- two different users cannot read/write each other's interactions;
- production backup and rollback procedure are ready.
