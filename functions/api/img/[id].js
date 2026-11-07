import { ensure } from '../../_shared.js';

// GET /api/img/<id>  -> the image bytes, cached for a year (ids never change)
export async function onRequestGet({ params, env }) {
  await ensure(env);
  const row = await env.DB.prepare('SELECT mime, data FROM img WHERE id = ?').bind(String(params.id)).first();
  if (!row) return new Response('Not found', { status: 404 });
  const bin = atob(row.data);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Response(bytes, { headers: { 'content-type': row.mime, 'cache-control': 'public, max-age=31536000, immutable' } });
}
