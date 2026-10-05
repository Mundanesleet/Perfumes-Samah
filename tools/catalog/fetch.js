// Descarga el catálogo público de la tienda Shopify a tools/catalog/.cache/
// Uso: node tools/catalog/fetch.js   (Node 18+, usa fetch nativo)
const fs = require('fs');
const path = require('path');

const STORE = 'https://www.perfumessamah.com';
const OUT = path.join(__dirname, '.cache');
const COLLECTIONS = ['perfumes-nuevos', 'perfumes-arabes', 'femeninos', 'perfumes-completos', '2-x-400-000', '2-x-270-000', 'sets-de-regalo', 'combos-decants', 'frontpage'];

async function get(url, file) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  fs.writeFileSync(path.join(OUT, file), await r.text());
  console.log('ok', file);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  await get(`${STORE}/products.json?limit=250`, 'products_1.json');
  for (const c of COLLECTIONS) await get(`${STORE}/collections/${c}/products.json?limit=250`, `col_${c}.json`);
})().catch((e) => { console.error(e.message); process.exit(1); });
