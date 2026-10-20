// Pulls NAFDAC's public Greenbook once and saves it as data/greenbook-sample.json.
// Run: node scripts/pull-greenbook.mjs   (takes a few minutes; be gentle with NAFDAC's server)
import { writeFile } from 'node:fs/promises';

const BASE = 'https://greenbook.nafdac.gov.ng';
const PAGE = 1000;
const OUT = new URL('../data/greenbook-sample.json', import.meta.url);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url, json) {
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(url, {
        headers: json ? { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' } : {},
        signal: AbortSignal.timeout(60_000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return json ? res.json() : res.text();
    } catch (err) {
      if (attempt >= 4) throw err;
      await sleep(2000 * attempt);
    }
  }
}

async function listProducts() {
  const rows = [];
  for (let start = 0; ; start += PAGE) {
    const q = new URLSearchParams({ draw: '1', start: String(start), length: String(PAGE), 'search[value]': '' });
    const page = await get(`${BASE}/?${q}`, true);
    rows.push(...page.data);
    console.log(`products ${rows.length}/${page.recordsFiltered}`);
    if (rows.length >= page.recordsFiltered || page.data.length === 0) return rows;
    await sleep(500);
  }
}

const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&#0?39;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

async function manufacturerName(productId) {
  const html = await get(`${BASE}/products/details/${productId}`, false);
  const m = html.match(/Manufacturer Name\s*<\/h1>\s*<p[^>]*>([\s\S]*?)<\/p>/i);
  return m ? decode(m[1]) || null : null;
}

const cleanName = (s) =>
  decode(s ?? '')
    .replace(/#+/g, '')
    .replace(/\((duplicate|check description)\)/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

const rows = await listProducts();

// One detail page per manufacturer, not per product.
const firstProduct = new Map();
for (const r of rows) if (r.manufacturer_id && !firstProduct.has(r.manufacturer_id)) firstProduct.set(r.manufacturer_id, r.product_id);
const manufacturers = new Map();
const ids = [...firstProduct.entries()];
for (let i = 0; i < ids.length; i += 4) {
  await Promise.all(
    ids.slice(i, i + 4).map(async ([mid, pid]) => {
      try {
        manufacturers.set(mid, await manufacturerName(pid));
      } catch {
        manufacturers.set(mid, null);
      }
    }),
  );
  if (i % 100 === 0) console.log(`manufacturers ${i}/${ids.length}`);
  await sleep(250);
}

const records = [];
const seen = new Set();
for (const r of rows) {
  const nafdac = decode(r.NAFDAC ?? '');
  const name = cleanName(r.product_name);
  if (!nafdac || !name || seen.has(nafdac)) continue;
  seen.add(nafdac);
  const applicant = decode(r.applicant?.name ?? r.applicant_name ?? '');
  const manufacturer = manufacturers.get(r.manufacturer_id) || applicant;
  records.push({
    name,
    strength: decode(r.strength ?? ''),
    manufacturer,
    nafdac_no: nafdac,
    status: String(r.status).toLowerCase() === 'active' ? 'active' : 'inactive',
  });
}

await writeFile(OUT, JSON.stringify(records) + '\n');
console.log(`saved ${records.length} records to data/greenbook-sample.json`);
