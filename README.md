# Skill Issue Society

Private board-game leaderboard and game-night app for the crew. One Cloudflare Worker, one D1 database, no build step.

- `src/worker.js`: the API (`/api/*`). Runs migrations itself on first request.
- `public/`: the app (Preact + htm, vendored). Served by the Worker's assets binding.
- `test/`: `node test/logic.test.mjs`, and `BASE=http://localhost:8799 node test/api.test.mjs` against `npx wrangler dev --local` (delete `.wrangler/state` first).

## Deploy
Connected through Cloudflare Workers Builds. Push to `main` and it deploys (`npx wrangler deploy`).
The D1 binding is in `wrangler.jsonc`.

## First run
Open the live URL once. The first person in sets the crew code and the admin PIN. Everyone else enters the crew code and taps their name.

## Changing things later
- New games, roast lines, tags: `public/js/data.js`
- Points and cap rules: `public/js/core.js`
- Themes: `public/js/theme.js`
- Database changes: append to `MIGRATIONS` in `src/schema.js` (never edit shipped steps) and bump `SCHEMA_VERSION`.
