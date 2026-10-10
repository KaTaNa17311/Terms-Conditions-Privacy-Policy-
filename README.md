# AdvoHQ onboarding

A full-stack onboarding app with versioned agreement acceptance, workspace selection, billing details, six pricing plans, a configurable free trial and separate enterprise/litigation destinations. No payment gateway or automatic paid conversion is implemented.

## Flow

1. Read the supplied Terms of Service and Privacy Policy in an accessible dialog or full page. Terms acceptance and privacy acknowledgement are separate and unchecked by default.
2. Choose Enterprise or Litigation.
3. Enter full name, company/practice name, billing email and team size. Billing address, country and GSTIN are optional. Phone number, WhatsApp and username are not collected again.
4. Select Monthly or Yearly, select a plan, then Start free trial or Continue with plan. Both choices save the selection and open the chosen workspace. Continue with plan records a selection only; it does not claim payment or paid activation.

## Data and backend

Cloudflare D1 is provisioned through the tracked hosting manifest. Schema and migrations are in `db/schema.ts` and `drizzle/`. `accounts` stores setup progress, organisation/billing details, plan, cycle and trial timestamps. `consents` records the current signed-in user, both exact policy versions, explicit acceptance flags, the collection-notice version and server acceptance time. Policy versions hash the supplied document content after the requested company-detail substitutions. Consent timestamps are not rewritten on repeated requests. Trial activation is guarded by an atomic setup-status predicate; repeated requests do not restart it.

`GET /api/onboarding` returns the current authenticated user's own account. `POST /api/onboarding` accepts one of:

- `accept`: `terms: true`, `privacy: true`, `termsVersion`, `privacyVersion`.
- `category`: `category: enterprise | litigation`.
- `details`: validated `details` object.
- `activate`: `planId`, `cycle: monthly | annual`, `mode: trial | selected`.
- `billing`: validated replacement `details` for an existing workspace.

The server enforces authentication, same-origin writes, current policy versions, both agreement choices, prerequisites, plan-family compatibility, strict form validation and user isolation. Trial duration is `TRIAL_DAYS` in `lib/catalog.ts`, initially 14. Monetary prices and plan allowances come from the two supplied pricing images.

## Connecting to existing AdvoHQ

This hosted app uses Sites' authenticated identity through `app/chatgpt-auth.ts`. In the main AdvoHQ codebase, replace that server-side identity adapter with your verified registration/session identity; never trust a user ID sent in browser JSON. The current app deliberately does not duplicate registration, phone or WhatsApp forms.

Change the server-selected redirect destinations in `app/api/onboarding/route.ts` and protected workspace routes when wiring to the existing platform. The provided workspace destinations show saved onboarding, selected-plan allowances and billing settings; they do not implement drafting, storage, research or signing tools. Integrate the plan ID and catalogue with those services to enforce entitlements. No unverified external workspace URLs are used.

## Policy content

The supplied revised DOCX files are working drafts and retain operational placeholders. The exact legal name, CIN and registered address supplied by the user have been filled in. Draft status remains clearly visible. The internal publication checklists and drafting references are excluded from the displayed policy pages as directed by those documents. Other substantive text is preserved. Confirm remaining effective date, contacts and operational schedules before customer rollout. Do not represent these drafts as final published policies. No optional marketing or model-training consent is bundled with onboarding.

## Development

Follow the Sites skill for install, build and publishing. Standard scripts are `npm run db:generate` and `npm run build`. The database schema migration is applied by Sites during deployment. The tracked source repository preserves this implementation.

Verification completed: TypeScript, production build and API guard/flow checks across both workspaces, both billing cycles and both activation choices. Browser visual QA was unavailable in the authoring environment.
