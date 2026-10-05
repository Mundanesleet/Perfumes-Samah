// Herramienta de desarrollo (no forma parte del sitio publicado).
// Genera js/products.js a partir del catálogo Shopify público de perfumessamah.com
// y descarga las imágenes oficiales a assets/images/products/.
// Uso (Node 18+):
//   node tools/catalog/fetch.js            -> descarga el catálogo a tools/catalog/.cache/
//   node tools/catalog/build.js [--no-images]
// Si aparecen productos nuevos, agrégalos a las tablas L (línea olfativa) y H (handle -> línea).
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const SHOP = path.join(__dirname, '.cache');
const IMG_DIR = path.join(ROOT, 'assets/images/products');
const all = JSON.parse(fs.readFileSync(path.join(SHOP, 'products_1.json'))).products;
const col = h => JSON.parse(fs.readFileSync(path.join(SHOP, `col_${h}.json`))).products.map(p => p.handle);
const C = {
  nuevos: col('perfumes-nuevos'), arabes: col('perfumes-arabes'), femeninos: col('femeninos'),
  completos: col('perfumes-completos'), p400: col('2-x-400-000'), p285: col('2-x-270-000'),
  sets: col('sets-de-regalo'), combos: col('combos-decants'), decants: col('frontpage'),
};

// Línea olfativa curada (base para filtros y quiz). g: género, f: familias, o: ocasiones, i: intensidad.
// Clasificación derivada de las descripciones reales de cada producto en perfumessamah.com.
const L = {
  myslf:      { brand: 'Yves Saint Laurent', name: 'MYSLF Le Parfum', g: 'masculino', f: ['amaderado', 'floral'], o: ['noche', 'cita', 'formal'], i: 'intensa' },
  wildcard:   { brand: 'Jo Milano', name: 'Game of Spades Wildcard', g: 'unisex', f: ['amaderado', 'dulce'], o: ['diario', 'cita'], i: 'moderada' },
  powerofyou: { brand: 'Emporio Armani', name: 'Power of You', g: 'masculino', f: ['frutal', 'dulce'], o: ['diario', 'cita'], i: 'moderada' },
  aloha:      { brand: 'Rayhaan', name: 'Pacific Aloha', g: 'unisex', f: ['frutal', 'fresco'], o: ['diario'], i: 'moderada' },
  naxos:      { brand: 'Xerjoff', name: 'XJ Naxos 1861', g: 'unisex', f: ['especiado', 'dulce'], o: ['cita', 'formal', 'noche'], i: 'intensa' },
  asad:       { brand: 'Lattafa', name: 'Asad Bourbon', g: 'masculino', f: ['oriental', 'especiado'], o: ['noche', 'cita'], i: 'intensa' },
  bright:     { brand: 'Versace', name: 'Bright Crystal', g: 'femenino', f: ['floral', 'frutal'], o: ['diario', 'oficina'], i: 'suave' },
  supremacy:  { brand: 'Afnan', name: "Supremacy Collector's Edition", g: 'masculino', f: ['frutal', 'amaderado'], o: ['diario', 'formal'], i: 'moderada' },
  kobra:      { brand: 'Rasasi', name: 'Hawas Kobra', g: 'masculino', f: ['citrico', 'fresco'], o: ['diario', 'fiesta'], i: 'intensa' },
  stallion:   { brand: 'Emper', name: 'Stallion 53', g: 'masculino', f: ['amaderado', 'floral'], o: ['diario', 'oficina'], i: 'moderada' },
  stronger:   { brand: 'Emporio Armani', name: 'Stronger With You Powerfully', g: 'masculino', f: ['dulce', 'especiado'], o: ['noche', 'cita'], i: 'intensa' },
  lebeau:     { brand: 'Jean Paul Gaultier', name: 'Le Beau Le Parfum', g: 'masculino', f: ['dulce', 'frutal'], o: ['cita', 'fiesta'], i: 'intensa' },
  azul:       { brand: 'Rayhaan', name: 'Azul', g: 'masculino', f: ['citrico', 'fresco'], o: ['diario', 'oficina'], i: 'suave' },
  italia:     { brand: 'Rayhaan', name: 'Italia', g: 'masculino', f: ['fresco', 'citrico'], o: ['diario', 'cita'], i: 'moderada' },
  aqua:       { brand: 'Armaf', name: 'Odyssey Aqua', g: 'masculino', f: ['fresco', 'citrico'], o: ['diario', 'oficina'], i: 'moderada' },
  lightblue:  { brand: 'Dolce & Gabbana', name: 'Light Blue EDT', g: 'femenino', f: ['citrico', 'floral'], o: ['diario', 'oficina'], i: 'suave' },
  dunescape:  { brand: 'Armaf', name: 'Dunescape', g: 'masculino', f: ['citrico', 'fresco'], o: ['diario', 'oficina'], i: 'moderada' },
  eter:       { brand: 'Armaf', name: 'Eter Arabian Sky', g: 'masculino', f: ['frutal', 'citrico'], o: ['diario', 'fiesta'], i: 'intensa' },
  tonka:      { brand: 'Montale', name: 'Arabians Tonka', g: 'unisex', f: ['oriental', 'especiado'], o: ['noche', 'formal'], i: 'intensa' },
  cloud:      { brand: 'Ariana Grande', name: 'Cloud', g: 'femenino', f: ['dulce'], o: ['diario', 'cita'], i: 'moderada' },
  aquatica:   { brand: 'Rayhaan', name: 'Aquatica', g: 'masculino', f: ['fresco'], o: ['diario', 'oficina'], i: 'suave' },
  emeraldv:   { brand: 'Versace', name: 'Crystal Emerald', g: 'femenino', f: ['floral', 'frutal'], o: ['diario', 'oficina'], i: 'moderada' },
  verde:      { brand: 'Rasasi', name: 'Hawas Verde', g: 'masculino', f: ['fresco', 'citrico'], o: ['diario'], i: 'moderada' },
  tmw:        { brand: 'Azzaro', name: 'The Most Wanted Parfum', g: 'masculino', f: ['especiado', 'dulce'], o: ['noche', 'cita', 'fiesta'], i: 'intensa' },
  percival:   { brand: 'Parfums de Marly', name: 'Percival', g: 'masculino', f: ['fresco', 'citrico'], o: ['diario', 'oficina', 'cita'], i: 'moderada' },
  delilah:    { brand: 'Maison Alhambra', name: 'Delilah', g: 'femenino', f: ['floral', 'frutal'], o: ['diario', 'cita'], i: 'moderada' },
  yedp:       { brand: 'Yves Saint Laurent', name: 'Y Eau de Parfum', g: 'masculino', f: ['fresco', 'amaderado'], o: ['diario', 'oficina', 'cita'], i: 'moderada' },
  emerald:    { brand: 'Jo Milano', name: 'Game of Spades Emerald', g: 'masculino', f: ['frutal', 'fresco'], o: ['diario', 'fiesta'], i: 'moderada' },
  rome:       { brand: 'Mast Parfums Bharara', name: 'Rome Pour Femme', g: 'femenino', f: ['frutal', 'floral'], o: ['diario', 'cita'], i: 'moderada' },
  nowwomen:   { brand: 'Lattafa', name: 'Now Women Rave', g: 'femenino', f: ['frutal', 'dulce'], o: ['diario', 'fiesta'], i: 'moderada' },
  artuniverse:{ brand: 'Lattafa', name: 'Art of Universe', g: 'unisex', f: ['citrico', 'especiado'], o: ['diario', 'fiesta'], i: 'intensa' },
  ice:        { brand: 'Rasasi', name: 'Hawas Ice', g: 'masculino', f: ['fresco', 'frutal'], o: ['diario', 'oficina'], i: 'moderada' },
  diva:       { brand: 'Rasasi', name: 'Hawas Diva', g: 'femenino', f: ['frutal', 'floral'], o: ['diario', 'cita'], i: 'moderada' },
  nightout:   { brand: 'Afnan', name: '9PM Night Out', g: 'masculino', f: ['dulce', 'especiado'], o: ['noche', 'fiesta', 'cita'], i: 'intensa' },
  tropical:   { brand: 'Rasasi', name: 'Hawas Tropical', g: 'masculino', f: ['frutal', 'dulce'], o: ['diario', 'fiesta'], i: 'moderada' },
  marshmallow:{ brand: 'Armaf', name: 'Odyssey Marshmallow', g: 'unisex', f: ['dulce', 'frutal'], o: ['diario', 'cita'], i: 'moderada' },
  fire:       { brand: 'Rasasi', name: 'Hawas Fire', g: 'masculino', f: ['frutal', 'especiado'], o: ['noche', 'fiesta'], i: 'intensa' },
  gomango:    { brand: 'Armaf', name: 'Odyssey Go Mango', g: 'unisex', f: ['frutal'], o: ['diario'], i: 'moderada' },
  bir:        { brand: 'Valentino', name: 'Born in Roma Intense', g: 'masculino', f: ['dulce', 'oriental'], o: ['noche', 'cita'], i: 'intensa' },
  yaraelixir: { brand: 'Lattafa', name: 'Yara Elixir', g: 'femenino', f: ['dulce', 'frutal'], o: ['cita', 'noche'], i: 'moderada' },
  yara:       { brand: 'Lattafa', name: 'Yara', g: 'femenino', f: ['dulce', 'frutal'], o: ['diario'], i: 'moderada' },
  liquidbrun: { brand: 'French Avenue', name: 'Liquid Brun', g: 'masculino', f: ['dulce', 'especiado'], o: ['noche', 'cita'], i: 'intensa' },
  // Solo en frasco completo / sets
  amethyst:   { brand: 'Lattafa', name: "Bade'e Al Oud Amethyst", g: 'unisex', f: ['oriental', 'floral'], o: ['noche', 'formal'], i: 'intensa' },
  malachite:  { brand: 'Maison Alhambra', name: 'Sceptre Malachite', g: 'masculino', f: ['oriental', 'amaderado'], o: ['noche', 'formal'], i: 'intensa' },
  eclaire:    { brand: 'Lattafa', name: 'Eclaire', g: 'femenino', f: ['dulce'], o: ['cita', 'diario'], i: 'intensa' },
  ninepm:     { brand: 'Afnan', name: '9 PM', g: 'masculino', f: ['oriental', 'dulce'], o: ['noche', 'fiesta'], i: 'intensa' },
  mandarinsky:{ brand: 'Armaf', name: 'Odyssey Mandarin Sky', g: 'masculino', f: ['citrico', 'dulce'], o: ['diario', 'fiesta'], i: 'moderada' },
  candee:     { brand: 'Armaf', name: 'Odyssey Candee', g: 'femenino', f: ['dulce', 'frutal'], o: ['diario', 'cita'], i: 'moderada' },
  paradox:    { brand: 'Mast Parfums Bharara', name: 'Rome Paradox Pour Femme', g: 'femenino', f: ['floral', 'dulce'], o: ['cita', 'diario'], i: 'moderada' },
  melancholia:{ brand: 'Mast Parfums Bharara', name: 'Rome Melancholia Pour Femme', g: 'femenino', f: ['frutal', 'dulce'], o: ['cita', 'diario'], i: 'moderada' },
  cdni:       { brand: 'Armaf', name: 'Club de Nuit Intense Man', g: 'masculino', f: ['amaderado', 'frutal'], o: ['noche', 'formal'], i: 'intensa' },
  khamrah:    { brand: 'Lattafa', name: 'Khamrah', g: 'unisex', f: ['oriental', 'dulce'], o: ['noche', 'cita'], i: 'intensa' },
  pacifichomme:{ brand: 'Rayhaan', name: 'Pacific Homme', g: 'masculino', f: ['fresco', 'amaderado'], o: ['diario', 'oficina'], i: 'moderada' },
  nitro:      { brand: 'Dumont Paris', name: 'Nitro Red', g: 'masculino', f: ['frutal', 'fresco'], o: ['diario', 'fiesta'], i: 'intensa' },
  // Sets de regalo
  ishq:       { brand: 'Lattafa', name: 'Ishq Al Shuyukh Silver', g: 'masculino', f: ['frutal', 'citrico'], o: ['diario', 'fiesta'], i: 'moderada' },
  cdnsillage: { brand: 'Armaf', name: 'Club de Nuit Sillage', g: 'unisex', f: ['citrico', 'floral'], o: ['diario', 'formal'], i: 'moderada' },
  tagrosso:   { brand: 'Armaf', name: 'Tag Uomo Rosso Edition Olympiad', g: 'masculino', f: ['especiado', 'dulce'], o: ['noche', 'cita'], i: 'intensa' },
  yaramoi:    { brand: 'Lattafa', name: 'Yara Moi', g: 'femenino', f: ['dulce', 'floral'], o: ['diario', 'cita'], i: 'moderada' },
  yaratous:   { brand: 'Lattafa', name: 'Yara Tous', g: 'femenino', f: ['frutal', 'dulce'], o: ['diario'], i: 'moderada' },
  honor:      { brand: 'Lattafa', name: "Bade'e Al Oud Honor & Glory", g: 'unisex', f: ['especiado', 'dulce'], o: ['noche', 'formal'], i: 'intensa' },
  myburberry: { brand: 'Burberry', name: 'My Burberry', g: 'femenino', f: ['floral', 'citrico'], o: ['diario', 'formal'], i: 'moderada' },
  lavie:      { brand: 'Lancôme', name: 'La Vie Est Belle', g: 'femenino', f: ['dulce', 'floral'], o: ['cita', 'formal'], i: 'intensa' },
  scandal:    { brand: 'Jean Paul Gaultier', name: 'Scandal Pour Homme', g: 'masculino', f: ['dulce', 'amaderado'], o: ['noche', 'cita'], i: 'intensa' },
  myway:      { brand: 'Giorgio Armani', name: 'My Way', g: 'femenino', f: ['floral'], o: ['diario', 'formal'], i: 'moderada' },
  goodgirl:   { brand: 'Carolina Herrera', name: 'Good Girl', g: 'femenino', f: ['dulce', 'floral'], o: ['noche', 'cita'], i: 'intensa' },
  lemale:     { brand: 'Jean Paul Gaultier', name: 'Le Male Elixir', g: 'masculino', f: ['dulce', 'oriental'], o: ['noche', 'cita'], i: 'intensa' },
  miniyaras:  { brand: 'Lattafa', name: 'Mini Yaras 25 ml', g: 'femenino', f: ['dulce', 'frutal'], o: ['diario'], i: 'moderada' },
  royale:     { brand: 'Jo Milano', name: 'Game of Spades Royale', g: 'masculino', f: ['amaderado', 'dulce'], o: ['noche', 'formal'], i: 'intensa' },
  notonly:    { brand: 'Afnan', name: 'Supremacy Not Only Intense', g: 'masculino', f: ['frutal', 'amaderado'], o: ['noche', 'formal'], i: 'intensa' },
};

// handle -> línea
const H = {
  'myslf-le-parfum-yves-saint-laurent': 'myslf', 'wildcard-game-of-spades-jo-milano': 'wildcard', 'power-of-you-emporio-armani': 'powerofyou',
  'rayhaan-pacific-aloha': 'aloha', 'xj-naxos-1861-xerjoff': 'naxos', 'asad-bourbon-lattafa-1': 'asad', 'asad-bourbon-lattafa': 'asad',
  'bright-crystal-versace': 'bright', 'supremacy-collector-s-edition-afnan': 'supremacy', 'rasasi-kobra': 'kobra', 'rasasi-hawas-kobra': 'kobra',
  'stallion-53-emper': 'stallion', 'stallion-53-emper-1': 'stallion', 'stronger-with-you-powerfully': 'stronger',
  'le-beau-le-parfum-jean-paul-gautlier': 'lebeau', 'rayhaan-azul-1': 'azul', 'rayhaan-azul': 'azul', 'rayhaan-azul-2': 'azul',
  'rayhaan-italia-1': 'italia', 'rayhaan-italia': 'italia', 'rayhaan-italia-2': 'italia',
  'odyssey-aqua-armaf': 'aqua', 'odyssey-aqua-armaf-1': 'aqua', 'odyssey-aqua': 'aqua', 'odyssey-aqua-1': 'aqua',
  'light-blue-dolce-gabbana-edt': 'lightblue', 'armaf-dunescape': 'dunescape', 'eter-arabian-sky-armaf': 'eter', 'eter-arabian-sky-armaf-1': 'eter',
  'montale-arabians-tonka': 'tonka', 'cloud-ariana-grande': 'cloud', 'cloud-ariana-grande-1': 'cloud',
  'rayhaan-aquatica': 'aquatica', 'rayhaan-aquatica-1': 'aquatica', 'crystal-emerald-versace': 'emeraldv', 'hawas-verde-rasasi': 'verde',
  'azzaro-the-most-wanted-parfum': 'tmw', 'percival-parfums-de-marly': 'percival', 'delilah-maison-alhambra-edp': 'delilah', 'delilah-maison-alhambra': 'delilah',
  'y-yves-saint-laurent-edp': 'yedp', 'emerald-game-of-spades-jo-milano': 'emerald',
  'rome-pour-femme-mast-parfums-bharara': 'rome', 'rome-pour-femme-bharara-mast-parfums': 'rome', 'rome-pour-femme-bharara-mast-parfums-1': 'rome',
  'now-women-lataffa-rave': 'nowwomen', 'now-women-lataffa-rave-1': 'nowwomen',
  'lataffa-art-of-universe': 'artuniverse', 'lataffa-art-of-universe-1': 'artuniverse', 'lataffa-art-of-universe-2': 'artuniverse',
  'rasasi-hawas-ice': 'ice', 'rasasi-hawas-ice-1': 'ice', 'preventa-rasasi-hawas-diva': 'diva', 'rasasi-hawas-diva': 'diva',
  'preventa-9pm-night-out-afnan': 'nightout', '9pm-night-out-afnan': 'nightout',
  'rasasi-hawas-tropical': 'tropical', 'rasasi-hawas-tropical-1': 'tropical', 'rasasi-hawas-tropical-2': 'tropical',
  'odyssey-marshmallow-armaf': 'marshmallow', 'rasasi-hawas-fire': 'fire', 'rasasi-hawas-fire-1': 'fire', 'odyssey-go-mango-armaf': 'gomango',
  'valentino-born-in-roma-intense': 'bir', 'valentino-born-in-roma-intense-1': 'bir',
  'lataffa-yara-elixir': 'yaraelixir', 'lataffa-yara-elixir-1': 'yaraelixir', 'lataffa-yara': 'yara', 'lataffa-yara-1': 'yara', 'lataffa-yara-2': 'yara',
  'liquid-brun-french-avenue': 'liquidbrun', 'liquid-brun-french-avenue-1': 'liquidbrun',
  'bade-e-al-oud-amethyst-lataffa': 'amethyst', 'maison-alhambra-sceptre-malachite': 'malachite', 'eclaire-lattafa': 'eclaire', '9-pm-afnan': 'ninepm',
  'armaf-odyssey-mandarinsky': 'mandarinsky', 'armaf-odyssey-candee': 'candee', 'rome-paradox-pour-femme-bharara-mast-parfums': 'paradox',
  'rome-melancholia-pour-femme-bharara-mast-parfums': 'melancholia', 'club-de-nuit-intense-man-armaf': 'cdni', 'lataffa-khamrah': 'khamrah',
  'rayhaan-pacific-homme': 'pacifichomme', 'nitro-red-dumont-paris': 'nitro',
  'ishq-al-shuyukh-silver-lataffa-set-de-regalo': 'ishq', 'club-de-nuit-sillage-armaf-set-de-regalo': 'cdnsillage',
  'tag-uomo-rosso-edition-olympiad-armaf-set-de-regalo': 'tagrosso', 'eclaire-lataffa-set-de-regalo': 'eclaire', 'yara-moi-lataffa-set-de-regalo': 'yaramoi',
  'bade-e-al-oud-amethyst-lataffa-set-de-regalo': 'amethyst', 'yara-tous-lataffa-set-de-regalo': 'yaratous', 'honor-glory-lataffa-set-de-regalo': 'honor',
  'my-burberry-eau-de-parfum-set-de-regalo': 'myburberry', 'yara-lataffa-set-de-regalo': 'yara', 'la-vie-est-belle-lancome-set-de-regalo': 'lavie',
  'scandal-pour-homme-jean-paul-gautlier-set-de-regalo-1': 'scandal', 'my-way-giorgio-armani-set-de-regalo': 'myway',
  'good-girl-carolina-herrera-set-de-regalo': 'goodgirl', 'le-male-elixir-set-de-regalo': 'lemale', 'mini-yaras-lataffa-25ml-set-de-regalo': 'miniyaras',
  'royale-game-of-spades-set-de-regalo': 'royale', 'wildcard-game-of-spades-set-de-regalo': 'wildcard',
  'supremacy-not-only-intense-afnan-set-de-regalo': 'notonly',
};

// Contenido de los combos: palabras clave del texto real "Incluye extracto de..." -> línea
const COMBO_KEYS = [
  [/le ?beau/i, 'lebeau'], [/hawas tropical|tropical de rasasi/i, 'tropical'], [/naxos/i, 'naxos'], [/asad/i, 'asad'],
  [/pacific aloha/i, 'aloha'], [/art of universe/i, 'artuniverse'], [/yara elixir/i, 'yaraelixir'], [/yara(?! elixir)/i, 'yara'],
  [/rayhaan azul|\bazul\b/i, 'azul'], [/aquatica/i, 'aquatica'], [/rayhaan italia|\bitalia\b/i, 'italia'], [/tonka/i, 'tonka'],
  [/percival/i, 'percival'], [/kobra/i, 'kobra'], [/eter|arabiansky/i, 'eter'], [/stronger/i, 'stronger'],
  [/emelrald|crystal emerald|crystal emerald/i, 'emeraldv'], [/bright crystal/i, 'bright'], [/hawas ice|ice de rasasi/i, 'ice'],
  [/dunescape/i, 'dunescape'], [/y yves|yves saint laurent y/i, 'yedp'], [/delilah/i, 'delilah'], [/light blue/i, 'lightblue'],
  [/liquid brun/i, 'liquidbrun'], [/9 ?pm/i, 'nightout'], [/azzaro|tmw/i, 'tmw'], [/cloud/i, 'cloud'], [/odyssey aqua|odyssey aqua/i, 'aqua'],
  [/valentino|bir intense/i, 'bir'], [/hawas verde/i, 'verde'], [/emerald de gos|gos jo milano emerald|game of spades emerald|emerald de gos|spades emerald/i, 'emerald'],
  [/hawas diva/i, 'diva'], [/hawas fire|fire de rasasi/i, 'fire'], [/rave now women|now women/i, 'nowwomen'], [/romme pour femme|rome pour femme/i, 'rome'],
  [/go ?mango/i, 'gomango'], [/nitro red/i, 'nitro'],
];

const clean = h => (h || '')
  .replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|li|h\d|div)>/gi, '\n').replace(/<[^>]+>/g, '')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{2728}]/gu, '')
  .replace(/\?(?=[A-ZÁÉÍÓÚÑ¿])/g, '?\n')
  .replace(/[ \t]+/g, ' ').split('\n').map(s => s.trim()).filter(Boolean);

function notesFrom(lines) {
  const get = re => { const l = lines.find(x => re.test(x)); return l ? l.replace(re, '').replace(/^[:\s]+/, '').replace(/\.$/, '').trim() : null; };
  const top = get(/^Salida\s*:?/i), heart = get(/^Coraz[oó]n\s*:?/i), base = get(/^Fondo\s*:?/i);
  return top && heart && base && top.length < 120 ? { top, heart, base } : null;
}
function field(lines, re) {
  const l = lines.find(x => re.test(x));
  if (!l) return null;
  const v = l.replace(re, '').replace(/^[:\s]+/, '').trim();
  return v && v.length < 90 && !/^[.,]/.test(v) ? v.replace(/Proyecci[oó]n:.*/i, '').replace(/\.$/, '').trim() : null;
}
function summary(lines) {
  const skip = /^(Descripci[oó]n|Lanzamiento|G[ée]nero|¿|Notas|Ideal|Duraci|Proyecci|Familia|Dupe|Inspirado en|Salida|Coraz|Fondo|Desde la salida|Luego|y termina|Rendimiento|\(100%|El set incluye)/i;
  // La línea que responde a "¿Es un dupe?" no sirve como descripción principal
  const bad = new Set();
  lines.forEach((l, i) => { if (/^¿\s*(Es un )?dupe/i.test(l)) bad.add(i + 1); });
  let paras = lines.map((l) => l.replace(/^Descripci[oó]n\s*:\s*/i, ''))
    .filter((l, i) => !bad.has(i) && l.length > 60 && (/[.!)]$/.test(l) || l.length > 90) && !skip.test(l));
  if (!paras.length) {
    const i = lines.findIndex(l => /^¿\s*A qu[ée] huele/i.test(l));
    if (i >= 0 && lines[i + 1] && lines[i + 1].length > 40) paras = [lines[i + 1].replace(/:$/, '.')];
  }
  return paras.slice(0, 2);
}
function idealFor(lines) {
  const i = lines.findIndex(l => /^Ideal para/i.test(l));
  if (i < 0) return [];
  const out = [];
  for (let k = i + 1; k < lines.length && out.length < 5; k++) {
    if (/:$/.test(lines[k]) || /^(Duraci|Proyecci|Familia|Notas)/i.test(lines[k])) break;
    if (lines[k].length < 70) out.push(lines[k].replace(/\.$/, ''));
  }
  return out;
}

const titleCase = s => s.toLowerCase().replace(/(^|[\s/(-])(\p{L})/gu, (m, a, b) => a + b.toUpperCase())
  .replace(/\bX(\d)/g, 'x$1').replace(/\bMl\b/g, 'ml').replace(/\bDe\b/g, 'de').replace(/\bY\b(?= )/g, 'y');

const slugImg = (handle, i, src) => {
  const ext = (src.split('?')[0].match(/\.(\w+)$/) || [, 'jpg'])[1].toLowerCase();
  // El CDN de Shopify entrega WebP con Accept: image/webp; algunos JPG originales se sirven tal cual
  if (fs.existsSync(path.join(IMG_DIR, `${handle}-${i + 1}.jpg`))) return `${handle}-${i + 1}.jpg`;
  return `${handle}-${i + 1}.webp`;
};

const products = [];
const seen = new Set();
let nextId = 1;
const downloads = [];

for (const p of all) {
  const h = p.handle;
  if (h === 'odyssey-go-mango') continue; // registro ambiguo en la tienda (sin descripción)
  if (h === 'odyssey-aqua-1') continue; // duplicado de Odyssey Aqua 100 ml con la descripción de otro producto
  const isSet = C.sets.includes(h);
  const isCombo = !isSet && (h.startsWith('combo') || h === 'set-lattafa');
  const sizesRaw = p.variants.map(v => ({ title: v.title.trim().toUpperCase(), price: +v.price, compareAt: v.compare_at_price ? +v.compare_at_price : null, available: v.available }));
  const isFull = !isSet && !isCombo && sizesRaw.every(s => /^100 ML$/.test(s.title));
  const category = isSet ? 'set' : isCombo ? 'combo' : isFull ? 'perfume' : 'decant';

  const lines = clean(p.body_html);
  const line = L[H[h]];
  let brand, name, includes = null;
  if (category === 'combo') {
    brand = 'Perfumes Samah';
    name = titleCase(p.title).replace(/^Combo /, 'Combo ').replace(/Diseñador/g, 'Diseñador');
    const text = lines.join(' ');
    const inc = text.match(/Incluye[^.]*?(?:perfumes?|extracto de)\s+(.*?)(?:\.|\(100%|\(TOTALMENTE|$)/i);
    const incText = inc ? inc[1] : text;
    includes = [];
    for (const [re, key] of COMBO_KEYS) if (re.test(incText) && !includes.includes(key)) includes.push(key);
    // "Hawas fire, Hawas ice y Hawas tropical" etc ya cubiertos; "Odyssey aqua" vs "Odyssey Go mango" ok.
  } else if (line) {
    brand = line.brand; name = line.name;
    if (category === 'set') name = `${line.name}`;
  } else {
    console.warn('SIN LÍNEA:', h, p.title);
    continue;
  }

  const NAME_FIX = { 'Combo Dia A Dia': 'Combo Día a Día', 'Combo Versatil 2': 'Combo Versátil 2', 'Combo Los Lataffa': 'Combo Los Lattafa' };
  if (NAME_FIX[name]) name = NAME_FIX[name];
  const isPromo = C.p400.includes(h) || C.p285.includes(h);
  if (category === 'perfume' && !isPromo) {
    const lk = 'full|' + H[h];
    if (seen.has(lk)) continue;
    seen.add(lk);
  }
  // Dedupe: mismo nombre + categoría + mismos precios => conservar el primero disponible
  const key = `${category}|${name}|${sizesRaw.map(s => s.title + s.price).join(',')}`;
  if (seen.has(key)) continue;
  seen.add(key);

  const sizes = sizesRaw.map(s => {
    const ml = parseInt(s.title, 10);
    const label = category === 'set' ? 'Set de regalo' : `${ml} ml`;
    const o = { label, price: s.price, available: s.available };
    if (!isNaN(ml)) o.ml = ml;
    if (s.compareAt && s.compareAt > s.price) o.compareAt = s.compareAt;
    return o;
  }).sort((a, b) => (a.ml || 0) - (b.ml || 0));

  const imgs = p.images.slice(0, category === 'combo' ? 1 : 3).map((im, i) => {
    const file = slugImg(h, i, im.src);
    downloads.push({ url: im.src.replace('cdn.shopify.com/s/files/1/1006/4488/0667/files/', 'www.perfumessamah.com/cdn/shop/files/') + '&width=800', file });
    return `assets/images/products/${file}`;
  });

  const tags = [];
  if (C.nuevos.includes(h)) tags.push('nuevo');
  if (C.arabes.includes(h)) tags.push('arabe');
  if (C.p400.includes(h)) tags.push('promo-2x400');
  if (C.p285.includes(h)) tags.push('promo-2x285');
  if (sizes.some(s => s.compareAt)) tags.push('oferta');
  if (/^preventa/.test(h)) tags.push('preventa');

  const o = {
    id: nextId++,
    slug: h,
    name,
    brand,
    category,
    price: Math.min(...sizes.filter(s => s.available).map(s => s.price).concat(sizes.every(s => !s.available) ? sizes.map(s => s.price) : [])),
    available: sizes.some(s => s.available),
    image: imgs[0] || null,
    gallery: imgs,
    sizes,
    tags,
  };
  if (line) Object.assign(o, { gender: line.g, families: line.f, occasions: line.o, intensity: line.i });
  if (includes) {
    o.includes = includes;
    const ls = includes.map(k => L[k]);
    const gs = [...new Set(ls.map(l => l.g))];
    o.gender = gs.length === 1 ? gs[0] : 'unisex';
    o.families = [...new Set(ls.flatMap(l => l.f))];
    o.occasions = [...new Set(ls.flatMap(l => l.o))];
    o.intensity = ls.some(l => l.i === 'intensa') ? 'intensa' : ls.every(l => l.i === 'suave') ? 'suave' : 'moderada';
  }
  if (H[h]) o.line = H[h];

  if (h !== 'mini-yaras-lataffa-25ml-set-de-regalo') { // descripción de la tienda duplicada por error (es la de GOS Royale)
    const sum = summary(lines);
    if (sum.length) o.description = sum;
    const n = notesFrom(lines);
    if (n) o.notes = n;
    const dur = field(lines, /^Duraci[oó]n\s*:?/i); if (dur) o.longevity = dur;
    const proj = field(lines, /^Proyecci[oó]n\s*:?/i); if (proj) o.projection = proj;
    const fam = field(lines, /^Familia olfativa\s*:?/i); if (fam) o.family = fam;
    const ideal = idealFor(lines); if (ideal.length) o.idealFor = ideal;
    if (category === 'set') {
      const i = lines.findIndex(l => /El set incluye/i.test(l));
      if (i >= 0) {
        const items = [];
        for (let k = i + 1; k < lines.length && items.length < 6; k++) { if (/:$/.test(lines[k]) || /^Notas/i.test(lines[k])) break; items.push(lines[k].replace(/\.$/, '')); }
        if (items.length) o.setIncludes = items;
      }
    }
  }
  if (category === 'combo') {
    const inc = lines.join(' ').match(/Incluye.*?(?=\(100%|\(TOTALMENTE|$)/i);
    o.description = [inc ? inc[0].trim().replace(/\s*\/\s*$/, '').replace(/\.?$/, '.') : ''];
  }
  products.push(o);
}

// Orden: decants (colección frontpage en su orden), luego perfumes, combos (orden colección), sets
const orderIn = (arr, h) => { const i = arr.indexOf(h); return i < 0 ? 999 : i; };
products.sort((a, b) => {
  const cat = { decant: 0, perfume: 1, combo: 2, set: 3 };
  if (cat[a.category] !== cat[b.category]) return cat[a.category] - cat[b.category];
  const ref = a.category === 'decant' ? C.decants : a.category === 'combo' ? C.combos : a.category === 'set' ? C.sets : C.completos.concat(C.p400, C.p285);
  return orderIn(ref, a.slug) - orderIn(ref, b.slug);
});
products.forEach((p, i) => { p.id = i + 1; });

const lines = L;
const out = `/* Perfumes Samah — catálogo de demostración.
 * GENERADO a partir del catálogo público de perfumessamah.com (${new Date().toISOString().slice(0, 10)}).
 * Precios en COP. Estructura pensada para reemplazarse por una API en la siguiente etapa.
 * Campos: id, slug, name, brand, category (decant|perfume|combo|set), price (desde), available,
 * image, gallery[], sizes[{label, ml, price, compareAt?, available}], tags[], gender, families[],
 * occasions[], intensity, description[], notes{top,heart,base}, longevity, projection, includes[] (combos).
 */
window.SAMAH_LINES = ${JSON.stringify(Object.fromEntries(Object.entries(lines).map(([k, v]) => [k, { brand: v.brand, name: v.name }])))};
window.SAMAH_PRODUCTS = ${JSON.stringify(products, null, 1)};
`;
fs.writeFileSync(path.join(ROOT, 'js/products.js'), out);
console.log('productos:', products.length, Object.entries(products.reduce((a, p) => (a[p.category] = (a[p.category] || 0) + 1, a), {})));


if (!process.argv.includes('--no-images')) {
  fs.mkdirSync(IMG_DIR, { recursive: true });
  (async () => {
    let ok = 0, fail = 0, renamed = 0;
    const queue = downloads.filter(d => !fs.existsSync(path.join(IMG_DIR, d.file)));
    async function worker() {
      while (queue.length) {
        const d = queue.shift();
        try {
          const r = await fetch(d.url, { headers: { Accept: 'image/webp' } });
          if (!r.ok) throw new Error(r.status);
          let file = d.file;
          // Algunos JPG originales no se convierten: se guardan con su extensión real
          if (/jpe?g/.test(r.headers.get('content-type') || '')) { file = d.file.replace(/\.webp$/, '.jpg'); renamed++; }
          fs.writeFileSync(path.join(IMG_DIR, file), Buffer.from(await r.arrayBuffer()));
          ok++;
        } catch (e) { fail++; console.warn('FAIL', d.url, e.message); }
      }
    }
    await Promise.all(Array.from({ length: 8 }, worker));
    console.log('imágenes ok', ok, 'fallidas', fail);
    if (renamed) console.log(`${renamed} imágenes se guardaron como .jpg: vuelve a ejecutar build.js para actualizar las rutas.`);
  })();
}
