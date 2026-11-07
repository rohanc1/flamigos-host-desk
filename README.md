# Flamigos Host Desk

Live scoreboard and host desk for the Flamigos Games Meetup: people, card tables, trivia, Khufia Mafia, bonus feathers, awards, three looks (Bright, Night, Diwali) and a laptop display board.
It is a separate project from S.I.S.T.M. Nothing here touches it.

```
public/      the site (index.html, app.js, styles.css, icons)
worker/      Worker entry: serves public/ and routes /api/*
functions/   the API handlers (hosts, login, state, img)
src/         readable source; `python3 build.py` bundles it into public/
tests/       local dev server (Node 22+) and browser tests
```

## Deploy (Cloudflare Workers, about 5 minutes)

The database already exists (`flamigos-host`) and is wired up in `wrangler.jsonc`, so there is nothing to bind.

1. **Push to GitHub.** Put these files at the top level of the repo (`wrangler.jsonc`, `public/`, `worker/`, `functions/` side by side). `public/app.js` is already built.
2. **Cloudflare dashboard, Workers & Pages, Create, Import a repository.** Pick the repo.
   The Worker name must be `flamigos-host-desk` (it has to match `name` in `wrangler.jsonc`).
   Build command: leave empty. Deploy command: `npx wrangler deploy` (the default).
3. **Add the host PINs.** Open the Worker, Settings, Variables and Secrets, Add, type Secret.
   Name `HOSTS`, value `Rohan:482913,Ronak:773021,Rutuja:195604` (name:PIN pairs, comma separated, 6 digits or more).
   Saving a secret deploys it right away.
4. Open the Worker's `workers.dev` link. Sign in on your phone with name and PIN. Everyone else opens the same link and taps "Open the live board". The laptop uses `/#live`.

### Just hosting, no database?
Drag the `public/` folder into a Cloudflare Pages Direct Upload. The app then runs in local mode: one device only, no sign-in, no sync between phones.

### Command line
`npm install`, then `npx wrangler deploy`. Add the secret with `npx wrangler secret put HOSTS`.

## How it behaves
- Viewers get a redacted copy: mafia roles while a game is running, MVP votes, and awards you have not revealed yet stay hidden.
- Hosts push changes within a second. Two hosts logging at once are merged automatically.
- If the connection drops, results stay on the device and are sent when it returns. The chip in the header shows Live, Saving or Offline.
- Photos for tables and games are uploaded and stored in D1 (resized on the device, about 50KB each).
- Wrong PINs are throttled: 8 tries per IP per 10 minutes.
- PINs are checked on the server, but they are kept in the browser after sign-in. This is meetup-grade security. Do not reuse a real password.

## Change things
- Awards and their fun names: `src/awards.js`. Looks: `src/themes.css`. Scoring defaults: `src/core.js`, and editable live in the app under Scoring rules.
- After editing `src/`, run `python3 build.py` and commit `public/`.

## Try it locally
```
echo 'HOSTS=Rohan:1111,Ronak:2222,Rutuja:3333' > .dev.vars
npx wrangler dev --local
```
Open the printed link. The local database lives in .wrangler/ and is not deployed.
