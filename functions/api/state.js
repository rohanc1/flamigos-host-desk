import { json, ensure, who, redact } from '../_shared.js';

const MAX_BYTES = 1_500_000;

// GET /api/state            -> { rev, state }   (viewers get a redacted copy; signed-in hosts get everything)
// GET /api/state?since=12   -> { same:true, rev } when nothing changed (cheap polling)
export async function onRequestGet({ request, env }) {
  await ensure(env);
  const since = new URL(request.url).searchParams.get('since');
  const row = await env.DB.prepare('SELECT rev, v FROM kv WHERE k = ?').bind('state').first();
  const rev = row ? row.rev : 0;
  if (since !== null && Number(since) === rev) return json({ same: true, rev });
  if (!row) return json({ rev: 0, state: null });
  let state = JSON.parse(row.v);
  const a = await who(request, env);
  if (!a.host) state = redact(state);
  return json({ rev, state });
}

// PUT /api/state  { baseRev, state }  -> { rev } or 409 { rev, state } if someone else saved first
export async function onRequestPut({ request, env }) {
  await ensure(env);
  const a = await who(request, env);
  if (a.throttled) return json({ error: 'throttled' }, 429);
  if (!a.host) return json({ error: 'sign in' }, 401);
  const text = await request.text();
  if (text.length > MAX_BYTES) return json({ error: 'too big' }, 413);
  let body;
  try { body = JSON.parse(text); } catch (e) { return json({ error: 'bad json' }, 400); }
  const st = body && body.state;
  if (!st || typeof st !== 'object' || !Array.isArray(st.people)) return json({ error: 'bad state' }, 400);
  const base = Number(body.baseRev) || 0;
  const now = Date.now();
  const v = JSON.stringify(st);
  let changes = 0;
  if (base === 0) {
    const r = await env.DB.prepare("INSERT OR IGNORE INTO kv(k, rev, v, updated) VALUES('state', 1, ?, ?)").bind(v, now).run();
    changes = r.meta.changes;
    if (changes) return json({ rev: 1 });
  } else {
    const r = await env.DB.prepare("UPDATE kv SET rev = rev + 1, v = ?, updated = ? WHERE k = 'state' AND rev = ?").bind(v, now, base).run();
    changes = r.meta.changes;
    if (changes) return json({ rev: base + 1 });
  }
  const cur = await env.DB.prepare('SELECT rev, v FROM kv WHERE k = ?').bind('state').first();
  return json({ rev: cur ? cur.rev : 0, state: cur ? JSON.parse(cur.v) : null }, 409);
}
