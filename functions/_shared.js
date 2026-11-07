// Shared helpers for the Flamigos Host Desk API (Cloudflare Pages Functions + D1).
// Secrets/bindings needed:  DB (D1 database binding)   HOSTS (secret, "Rohan:4821,Ronak:7730,Rutuja:1956")

export const json = (obj, status = 200, extra = {}) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...extra },
  });

export function hostMap(env) {
  const m = new Map();
  String(env.HOSTS || '').split(',').forEach((pair) => {
    const i = pair.indexOf(':');
    if (i < 1) return;
    const name = pair.slice(0, i).trim();
    const pin = pair.slice(i + 1).trim();
    if (name && pin) m.set(name, pin);
  });
  return m;
}

function safeEqual(a, b) {
  a = String(a); b = String(b);
  let diff = a.length ^ b.length;
  const n = Math.max(a.length, b.length);
  for (let i = 0; i < n; i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}

let ready = false;
export async function ensure(env) {
  if (ready) return;
  await env.DB.batch([
    env.DB.prepare('CREATE TABLE IF NOT EXISTS kv (k TEXT PRIMARY KEY, rev INTEGER NOT NULL, v TEXT NOT NULL, updated INTEGER)'),
    env.DB.prepare('CREATE TABLE IF NOT EXISTS img (id TEXT PRIMARY KEY, mime TEXT NOT NULL, data TEXT NOT NULL, created INTEGER)'),
    env.DB.prepare('CREATE TABLE IF NOT EXISTS fails (ip TEXT PRIMARY KEY, n INTEGER NOT NULL, t INTEGER NOT NULL)'),
  ]);
  ready = true;
}

const WINDOW_MS = 10 * 60 * 1000;
const MAX_FAILS = 8;

// Returns { host } when the x-host / x-pin headers are right, { throttled:true } after too many wrong tries, else {}.
export async function check(request, env, host, pin) {
  await ensure(env);
  const ip = request.headers.get('cf-connecting-ip') || 'local';
  const now = Date.now();
  const row = await env.DB.prepare('SELECT n, t FROM fails WHERE ip = ?').bind(ip).first();
  if (row && now - row.t < WINDOW_MS && row.n >= MAX_FAILS) return { throttled: true };
  const hosts = hostMap(env);
  if (host && pin != null && hosts.has(host) && safeEqual(hosts.get(host), pin)) {
    if (row) await env.DB.prepare('DELETE FROM fails WHERE ip = ?').bind(ip).run();
    return { host };
  }
  if (host || pin) {
    const n = row && now - row.t < WINDOW_MS ? row.n + 1 : 1;
    await env.DB.prepare('INSERT INTO fails(ip, n, t) VALUES(?,?,?) ON CONFLICT(ip) DO UPDATE SET n = excluded.n, t = excluded.t').bind(ip, n, now).run();
  }
  return {};
}

export async function who(request, env) {
  const r = await check(request, env, request.headers.get('x-host'), request.headers.get('x-pin'));
  return r;
}

// Viewers get the board, never the secrets: mafia roles in play and unrevealed award winners.
export function redact(state) {
  if (!state || typeof state !== 'object') return state;
  const s = { ...state };
  if (s.mafia) {
    s.mafia = {
      ...s.mafia, comp: undefined, votes: {}, mvp: null, winner: null,
      players: (s.mafia.players || []).map((p) => ({ id: p.id, alive: p.alive, out: p.out })),
    };
  }
  if (Array.isArray(s.awards)) {
    s.awards = s.awards.map((a) => (a.revealed ? a : { ...a, winners: [], votes: {}, pick: null, note: '' }));
  }
  return s;
}
