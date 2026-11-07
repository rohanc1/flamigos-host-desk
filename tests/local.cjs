const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 414, height: 860 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8799/'); await p.waitForTimeout(1500);
  console.log('gate:', (await p.locator('#app').innerText()).slice(0, 160).replace(/\n+/g, ' | '));
  console.log('ERRS', errs);
  await b.close();
})();
