// Local test server: serves ./public and runs the Pages Functions against an in-memory SQLite that mimics D1.
// Usage: HOSTS="Rohan:1111,Ronak:2222,Rutuja:3333" node tests/server.mjs [port]   (Node 22+)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.argv[2] || process.env.PORT || 8788);
const sqlite = new DatabaseSync(':memory:');
const wrap = (sql) => {
  const st = { args: [] };
  st.bind = (...a) => { st.args = a; return st; };
  st.first = async () => sqlite.prepare(sql).get(...st.args) || null;
  st.run = async () => ({ meta: { changes: Number(sqlite.prepare(sql).run(...st.args).changes) } });
  st.all = async () => ({ results: sqlite.prepare(sql).all(...st.args) });
  return st;
};
const DB = { prepare: wrap, batch: async (list) => { for (const s of list) await s.run(); } };
const env = { DB, HOSTS: process.env.HOSTS === undefined ? 'Rohan:1111,Ronak:2222,Rutuja:3333' : process.env.HOSTS };

const routes = [
  ['/api/hosts', 'api/hosts.js'], ['/api/login', 'api/login.js'], ['/api/state', 'api/state.js'], ['/api/img', 'api/img.js'],
];
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json' };

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  try {
    let file = null, params = {};
    const hit = routes.find((r) => r[0] === url.pathname);
    if (hit) file = hit[1];
    const m = /^\/api\/img\/([^/]+)$/.exec(url.pathname);
    if (m) { file = 'api/img/[id].js'; params = { id: m[1] }; }
    if (file) {
      const mod = await import(path.join(root, 'functions', file) + '?v=1');
      const handler = mod['onRequest' + req.method.charAt(0) + req.method.slice(1).toLowerCase()];
      if (!handler) { res.writeHead(405); return res.end('Method not allowed'); }
      const chunks = []; for await (const c of req) chunks.push(c);
      const body = chunks.length ? Buffer.concat(chunks) : undefined;
      const request = new Request(url, { method: req.method, headers: req.headers, body: ['GET', 'HEAD'].includes(req.method) ? undefined : body });
      const out = await handler({ request, env, params });
      const buf = Buffer.from(await out.arrayBuffer());
      res.writeHead(out.status, Object.fromEntries(out.headers));
      return res.end(buf);
    }
    let p = url.pathname === '/' ? '/index.html' : url.pathname;
    const fp = path.join(root, 'public', path.normalize(p).replace(/^(\.\.[/\\])+/, ''));
    if (!fp.startsWith(path.join(root, 'public')) || !fs.existsSync(fp)) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'content-type': mime[path.extname(fp)] || 'application/octet-stream', 'cache-control': 'no-store' });
    fs.createReadStream(fp).pipe(res);
  } catch (e) {
    console.error(e); res.writeHead(500); res.end(String(e && e.message));
  }
}).listen(port, () => console.log(`Flamigos dev server on http://localhost:${port}  (hosts: ${[...Object.keys(Object.fromEntries(env.HOSTS.split(',').map((x) => x.split(':'))))].join(', ') || 'none'})`));
