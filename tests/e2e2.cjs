const { chromium } = require('playwright');
const B = 'http://localhost:8788/';
const errs = [];
const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) process.exitCode = 1; };
const txt = async (p) => (await p.locator('#app').innerText()).replace(/\n+/g, ' | ');
async function mk(b, vp) {
  const c = await b.newContext({ viewport: vp || { width: 414, height: 860 } });
  const p = await c.newPage();
  p.on('pageerror', e => errs.push('PAGEERR ' + e.message));
  p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push('CONSOLE ' + m.text()); });
  return p;
}
async function signIn(p, name, pin) {
  await p.goto(B); await p.waitForSelector('[data-act="login-pick"]');
  await p.locator(`[data-act="login-pick"][data-n="${name}"]`).click();
  await p.fill('#pin', pin); await p.press('#pin', 'Enter');
  await p.waitForSelector('#addname', { timeout: 5000 });
}
const addNames = async (p, s) => { await p.fill('#addname', s); await p.press('#addname', 'Enter'); };
(async () => {
  const b = await chromium.launch();
  const rohan = await mk(b), ronak = await mk(b), view = await mk(b, { width: 1280, height: 760 });
  await signIn(rohan, 'Rohan', '1111');
  await addNames(rohan, 'Asha, Ben, Chitra, Dev');
  await rohan.waitForTimeout(900);
  await view.goto(B + '#live'); await view.waitForTimeout(500);
  await rohan.waitForTimeout(3500);
  await view.waitForTimeout(3500);
  ok(/Asha/.test(await txt(view)) && /Dev/.test(await txt(view)), 'viewer sees names pushed by Rohan within a few seconds');
  await signIn(ronak, 'Ronak', '2222'); await ronak.waitForTimeout(400);
  ok(/Chitra/.test(await txt(ronak)), 'Ronak sees the shared flock after signing in');

  // simultaneous edits -> 409 -> merge
  await Promise.all([addNames(rohan, 'Esha'), addNames(ronak, 'Farhan')]);
  await rohan.waitForTimeout(2500); await ronak.waitForTimeout(2500); await view.waitForTimeout(3500);
  for (const [n, p] of [['Rohan', rohan], ['Ronak', ronak], ['viewer', view]]) {
    const t = await txt(p);
    ok(/Esha/.test(t) && /Farhan/.test(t) && /Asha/.test(t), `${n} has Esha + Farhan + earlier names after concurrent adds`);
  }
  // awards flow
  await rohan.evaluate(() => { location.hash = '#games'; }); await rohan.waitForTimeout(300);
  await rohan.locator('[data-act="phase"][data-v="awards"]').click(); await rohan.waitForTimeout(300);
  await rohan.screenshot({ path: 'tests/shots/10-awards-admin.png', fullPage: true });
  const t1 = await txt(rohan);
  ok(/Alpha Flamingo|Top|top/i.test(t1) && /Best dressed|dressed/i.test(t1) && /MVP/i.test(t1), 'admin Awards panel lists top / dressed / MVP');
  await rohan.locator('[data-act="aw-edit"]').nth(1).click(); await rohan.waitForTimeout(300);
  await rohan.screenshot({ path: 'tests/shots/11-award-sheet.png' });
  await rohan.locator('#sheet-root .pchip').first().click();
  await rohan.fill('#aw-title', 'Peacock of the Night');
  await rohan.fill('#aw-note', 'Gold dupatta, no contest');
  await rohan.locator('[data-act="save-award"]').click(); await rohan.waitForTimeout(400);
  await rohan.locator('[data-act="aw-reveal"]').nth(1).click(); await rohan.waitForTimeout(600);
  await rohan.screenshot({ path: 'tests/shots/12-revealed.png', fullPage: true });
  await view.waitForTimeout(4000);
  await view.screenshot({ path: 'tests/shots/13-viewer-board.png' });
  const vt = await txt(view);
  ok(/Peacock of the Night/.test(vt), 'viewer board shows the revealed award');
  // pre-reveal redaction: pick an unrevealed award winner, check public API hides it
  await rohan.locator('[data-act="aw-edit"]').nth(3).click().catch(()=>{}); await rohan.waitForTimeout(200);
  const api = await view.evaluate(async () => { const r = await fetch('/api/state'); return r.json(); });
  const aw = (api.state.awards || []);
  ok(aw.filter(a => !a.revealed).every(a => !(a.winners || []).length && !a.note), 'public API strips winners/notes of unrevealed awards');
  ok(aw.some(a => a.revealed && a.winners.length === 1), 'public API keeps the revealed award winner');
  // wrong pin throttling & unauth write
  const un = await view.evaluate(async () => (await fetch('/api/state', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: '{"baseRev":0,"state":{}}' })).status);
  ok(un === 401, 'viewer cannot write state (401)');
  // image upload
  const png = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
  const up = await rohan.evaluate(async (d) => { const r = await fetch('/api/img', { method: 'POST', headers: { 'content-type': 'application/json', 'x-host': 'Rohan', 'x-pin': '1111' }, body: JSON.stringify({ data: d }) }); const j = await r.json().catch(()=>({})); const g = j.url ? await fetch(j.url) : null; return { s: r.status, url: j.url, gs: g && g.status, ct: g && g.headers.get('content-type') }; }, png);
  ok(up.s === 200 && up.gs === 200 && /png/.test(up.ct || ''), 'image upload + fetch works: ' + JSON.stringify(up));
  const up2 = await view.evaluate(async (d) => (await fetch('/api/img', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ data: d }) })).status, png);
  ok(up2 === 401, 'viewer cannot upload images');
  // themes on the viewer board
  for (const th of ['bright', 'night', 'diwali']) {
    await view.evaluate((t) => { localStorage.setItem('flamigos-theme', t); }, th);
    await view.reload(); await view.waitForTimeout(1200);
    ok((await view.evaluate(() => document.documentElement.getAttribute('data-theme'))) === th, 'theme applied: ' + th);
    await view.screenshot({ path: `tests/shots/20-board-${th}.png` });
  }
  await rohan.evaluate(() => { localStorage.setItem('flamigos-theme', 'diwali'); }); await rohan.reload(); await rohan.waitForTimeout(1200);
  await rohan.evaluate(() => { location.hash = '#games'; }); await rohan.waitForTimeout(300);
  await rohan.screenshot({ path: 'tests/shots/21-host-diwali.png' });
  console.log('ERRS', errs);
  ok(errs.length === 0, 'no page errors');
  await b.close();
})();
