import { json, ensure, who } from '../_shared.js';

// POST /api/img { data: "data:image/jpeg;base64,..." } -> { url: "/api/img/<id>" }   (signed-in hosts only)
export async function onRequestPost({ request, env }) {
  await ensure(env);
  const a = await who(request, env);
  if (!a.host) return json({ error: 'sign in' }, a.throttled ? 429 : 401);
  const text = await request.text();
  if (text.length > 700_000) return json({ error: 'too big' }, 413);
  let body;
  try { body = JSON.parse(text); } catch (e) { return json({ error: 'bad json' }, 400); }
  const m = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(String(body && body.data));
  if (!m) return json({ error: 'not an image' }, 400);
  const id = crypto.randomUUID().replace(/-/g, '').slice(0, 16);
  await env.DB.prepare('INSERT INTO img(id, mime, data, created) VALUES(?,?,?,?)').bind(id, m[1], m[2], Date.now()).run();
  return json({ url: '/api/img/' + id });
}
