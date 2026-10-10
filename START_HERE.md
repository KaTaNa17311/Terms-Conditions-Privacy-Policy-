# AdvoHQ downloadable UI and backend

This ZIP contains the complete onboarding source, plan catalogue, policy viewers, database schema and migrations. It is the exported version of the published app.

## Open the app locally

Requires Node.js 22.13 or newer and Corepack/pnpm. Unzip the folder, open Terminal in the AdvoHQ_Onboarding folder, and run:

```sh
corepack pnpm install --frozen-lockfile
corepack pnpm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_polite_random.sql
corepack pnpm run dev
```

Open http://localhost:5173 and click Sign in to continue. The portable development server uses a local test account, not your live AdvoHQ account. The database runs locally. Apply the supplied initial migration once on a fresh local database; do not replay it against existing data.

This is a full-stack source project, not a standalone HTML file. Internet access is needed to install dependencies. No payment gateway is required. No API keys are needed for this onboarding app.

## For your developer

- Connect app/chatgpt-auth.ts to your existing verified AdvoHQ registration/session.
- Connect the chosen plan's redirect to your Enterprise or Litigation workspace.
- Plans, exact prices, limits and the 14-day trial are in lib/catalog.ts.
- Backend actions are in app/api/onboarding/route.ts.
- Database tables and SQL migrations are in db/ and drizzle/.
- Company legal details are in lib/company.ts and the included policy text.
- Terms/privacy content is in lib/policies.json. The documents are working drafts with operational placeholders remaining.
- Phone, WhatsApp and username registration are not repeated.
- This package includes onboarding and workspace welcome/billing screens. Drafting, research, storage and signing services must be connected separately.

The hosting manifest in this export retains DB binding configuration but omits the original private Site ID so this copy cannot accidentally overwrite that Site. No live database, authentication secrets or installed dependencies are included.

Source build, TypeScript and backend-flow checks passed. This portable export has not been independently run on your computer.
