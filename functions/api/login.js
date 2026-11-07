import { json, check } from '../_shared.js';

export async function onRequestPost({ request, env }) {
  let body = {};
  try { body = await request.json(); } catch (e) { /* fall through */ }
  const r = await check(request, env, String(body.host || ''), String(body.pin || ''));
  if (r.throttled) return json({ error: 'throttled' }, 429);
  if (!r.host) return json({ error: 'bad pin' }, 401);
  return json({ ok: true, host: r.host });
}
