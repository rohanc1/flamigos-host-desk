// Cloudflare Worker entry. Serves ./public as static assets and runs the /api routes in ../functions.
import * as hosts from '../functions/api/hosts.js';
import * as login from '../functions/api/login.js';
import * as state from '../functions/api/state.js';
import * as img from '../functions/api/img.js';
import * as imgId from '../functions/api/img/[id].js';

const routes = { '/api/hosts': hosts, '/api/login': login, '/api/state': state, '/api/img': img };

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) {
      let mod = routes[url.pathname], params = {};
      const m = /^\/api\/img\/([^/]+)$/.exec(url.pathname);
      if (m) { mod = imgId; params = { id: m[1] }; }
      if (!mod) return new Response('Not found', { status: 404 });
      const h = mod['onRequest' + request.method.charAt(0) + request.method.slice(1).toLowerCase()];
      if (!h) return new Response('Method not allowed', { status: 405 });
      return h({ request, env, params, waitUntil: ctx.waitUntil.bind(ctx) });
    }
    return env.ASSETS.fetch(request);
  },
};
