const http = require('http');
const path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require('playwright');

const PORT = Number(process.env.PORT || 3030);
const MAP_FILE = path.resolve(__dirname, '..', '05_gis_mapas', 'mapa_prototipo_armacao_infra_clone.html');

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(payload));
}

function safeText(value) {
  return String(value || '').replace(/[\r\n]+/g, ' ').trim();
}

function buildMapUrl(query) {
  const url = new URL(pathToFileURL(MAP_FILE).href);
  ['layers', 'ref', 'base'].forEach((key) => {
    const value = safeText(query[key]);
    if (value) url.searchParams.set(key, value);
  });
  return url.toString();
}

async function renderPng(query) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1760, height: 1080 }, deviceScaleFactor: 2 });

  try {
    await page.goto(buildMapUrl(query), { waitUntil: 'load' });
    await page.waitForFunction(() => window.__mapReady === true, null, { timeout: 30000 });
    await page.waitForFunction(() => !document.querySelector('.leaflet-tile-loading'), null, { timeout: 30000 });
    await page.waitForTimeout(750);

    const area = page.locator('#exportArea');
    const buffer = await area.screenshot({ type: 'png' });
    return buffer;
  } finally {
    await page.close().catch(() => {});
    await browser.close().catch(() => {});
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);

  if (url.pathname === '/health') {
    return sendJson(res, 200, { ok: true });
  }

  if (url.pathname === '/render.png') {
    try {
      const buffer = await renderPng({
        layers: url.searchParams.get('layers'),
        ref: url.searchParams.get('ref'),
        base: url.searchParams.get('base')
      });

      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Disposition': 'inline; filename="mapa_piloto_armacao.png"',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(buffer);
    } catch (error) {
      sendJson(res, 500, { ok: false, error: error.message || String(error) });
    }
    return;
  }

  sendJson(res, 404, { ok: false, error: 'Not found' });
});

server.listen(PORT, () => {
  console.log(`Render server listening on http://127.0.0.1:${PORT}`);
});
