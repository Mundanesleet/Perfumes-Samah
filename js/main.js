/* ==========================================================================
   Perfumes Samah — Núcleo
   Namespace global `Samah`, configuración, utilidades y arranque de página.
   Scripts clásicos (sin módulos) para que funcione en GitHub Pages y en file://
   ========================================================================== */
(function () {
  'use strict';

  const Samah = (window.Samah = window.Samah || {});

  Samah.config = {
    whatsapp: '573118935666',
    whatsappDisplay: '311 8935666',
    instagram: 'https://www.instagram.com/perfumessamah/',
    tiktok: 'https://www.tiktok.com/@perfumes.samah',
    policies: {
      refund: 'https://www.perfumessamah.com/policies/refund-policy',
      privacy: 'https://www.perfumessamah.com/policies/privacy-policy',
      terms: 'https://www.perfumessamah.com/policies/terms-of-service',
    },
  };

  /* ---------- Rutas relativas (funciona en usuario.github.io/repositorio/) ---------- */
  // Cada página declara <body data-root=".."> (o "." en la raíz).
  const root = (document.body && document.body.dataset.root) || '.';
  Samah.url = (path) => `${root}/${String(path).replace(/^\/+/, '')}`;
  Samah.page = (name) => Samah.url(name === 'home' ? 'index.html' : `pages/${name}.html`);
  Samah.productUrl = (p) => Samah.url(`pages/producto.html?p=${encodeURIComponent(p.slug)}`);
  Samah.asset = (p) => (p ? Samah.url(p) : '');

  /* ---------- Formato ---------- */
  const fmt = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 });
  Samah.money = (n) => `$${fmt.format(Math.round(n))}`;
  Samah.cop = (n) => `${Samah.money(n)} COP`;
  Samah.esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  Samah.icon = (name, cls = '') => `<span class="icon ${cls}" aria-hidden="true">${name}</span>`;

  /* ---------- Catálogo ---------- */
  const products = window.SAMAH_PRODUCTS || [];
  const lines = window.SAMAH_LINES || {};
  Samah.products = products;
  Samah.bySlug = (slug) => products.find((p) => p.slug === slug) || null;
  Samah.byCategory = (cat) => products.filter((p) => p.category === cat);
  Samah.lineLabel = (key) => {
    const l = lines[key];
    if (!l) return key;
    return l.name.toLowerCase().startsWith(l.brand.toLowerCase()) ? l.name : `${l.name} · ${l.brand}`;
  };
  // Producto decant representativo de una línea (para enlazar desde combos)
  Samah.decantOfLine = (key) => products.find((p) => p.category === 'decant' && p.line === key) || null;

  Samah.CATEGORY_LABEL = { decant: 'Decant', perfume: 'Perfume completo', combo: 'Combo de decants', set: 'Set de regalo' };
  Samah.GENDER_LABEL = { masculino: 'Masculino', femenino: 'Femenino', unisex: 'Unisex' };
  Samah.FAMILY_LABEL = { citrico: 'Cítrico', fresco: 'Fresco / Acuático', dulce: 'Dulce / Gourmand', floral: 'Floral', amaderado: 'Amaderado', especiado: 'Especiado', oriental: 'Oriental', frutal: 'Frutal' };
  Samah.OCCASION_LABEL = { diario: 'Día a día', oficina: 'Oficina', cita: 'Citas', noche: 'Noche', fiesta: 'Fiesta', formal: 'Eventos formales' };
  Samah.INTENSITY_LABEL = { suave: 'Suave', moderada: 'Moderada', intensa: 'Intensa' };

  Samah.availableSizes = (p) => p.sizes.filter((s) => s.available);
  Samah.fromPrice = (p) => {
    const av = Samah.availableSizes(p);
    return Math.min(...(av.length ? av : p.sizes).map((s) => s.price));
  };
  Samah.sizeFrom = (p, label) => p.sizes.find((s) => s.label === label) || null;
  Samah.sizesSummary = (p) => {
    if (p.category === 'set') return 'Set de regalo';
    if (p.category === 'perfume') return 'Frasco completo 100 ml';
    const ml = p.sizes.map((s) => s.ml).filter(Boolean);
    if (p.category === 'combo') return `${p.includes.length} decants · ${ml.join(' / ')} ml c/u`;
    return `Decant ${ml.join(' · ')} ml`;
  };
  // Atomizaciones aproximadas (~15 por ml, criterio usado en el diseño)
  Samah.sprays = (ml) => `~${ml * 15} atomizaciones`;

  /* ---------- WhatsApp ---------- */
  Samah.waLink = (text) => `https://wa.me/${Samah.config.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

  /* ---------- Query string ---------- */
  Samah.param = (key) => new URLSearchParams(window.location.search).get(key);

  /* ---------- Toast ---------- */
  let toastTimer;
  Samah.toast = (html) => {
    let el = document.getElementById('toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast';
      el.className = 'toast';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
    el.innerHTML = `${Samah.icon('check_circle')}<span>${html}</span>`;
    requestAnimationFrame(() => el.classList.add('is-visible'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-visible'), 3200);
  };

  /* ---------- Revelado al hacer scroll ---------- */
  Samah.observeReveal = (scope = document) => {
    const items = scope.querySelectorAll('.reveal:not(.is-visible)');
    if (!('IntersectionObserver' in window)) { items.forEach((el) => el.classList.add('is-visible')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    items.forEach((el) => io.observe(el));
  };

  /* ---------- Altura real del header -> variable CSS ---------- */
  Samah.syncHeaderHeight = () => {
    const h = document.getElementById('site-header');
    if (!h) return;
    const set = () => document.documentElement.style.setProperty('--header-h', `${h.offsetHeight}px`);
    set();
    if ('ResizeObserver' in window) new ResizeObserver(set).observe(h);
    else window.addEventListener('resize', set);
  };

  /* ---------- Arranque ---------- */
  // Con `defer` los scripts corren con readyState "interactive" pero ANTES de DOMContentLoaded:
  // esperamos siempre a ese evento para que todos los scripts estén cargados y el orden se respete.
  let domReady = false;
  document.addEventListener('DOMContentLoaded', () => { domReady = true; });
  Samah.ready = (fn) => (domReady || document.readyState === 'complete' ? fn() : document.addEventListener('DOMContentLoaded', fn));

  Samah.ready(() => {
    if (Samah.components) Samah.components.mount();
    Samah.syncHeaderHeight();
    Samah.observeReveal();
  });
})();
