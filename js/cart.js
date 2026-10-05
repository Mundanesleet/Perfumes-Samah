/* ==========================================================================
   Perfumes Samah — Carrito (localStorage)
   Guarda solo { slug, size, qty }; precios y nombres se leen siempre del
   catálogo, así un cambio de precio en products.js se refleja al instante.
   ========================================================================== */
(function () {
  'use strict';

  const Samah = (window.Samah = window.Samah || {});
  const KEY = 'samah.cart.v1';
  const NOTE_KEY = 'samah.cart.gift.v1';
  const MAX_QTY = 20;

  function read() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
      return Array.isArray(raw) ? raw.filter((i) => i && i.slug && i.size && i.qty > 0) : [];
    } catch (e) { return []; }
  }
  function write(items) {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) { /* modo privado */ }
    document.dispatchEvent(new CustomEvent('cart:change', { detail: { count: count(items) } }));
  }
  const count = (items = read()) => items.reduce((n, i) => n + i.qty, 0);

  /** Líneas del carrito enriquecidas con datos del catálogo */
  function lines() {
    return read().map((i) => {
      const product = Samah.bySlug(i.slug);
      const size = product && Samah.sizeFrom(product, i.size);
      if (!product || !size) return null;
      return { ...i, product, size, unit: size.price, total: size.price * i.qty };
    }).filter(Boolean);
  }

  function add(slug, size, qty = 1) {
    const items = read();
    const found = items.find((i) => i.slug === slug && i.size === size);
    if (found) found.qty = Math.min(MAX_QTY, found.qty + qty);
    else items.push({ slug, size, qty: Math.min(MAX_QTY, qty) });
    write(items);
  }
  function setQty(slug, size, qty) {
    let items = read();
    if (qty <= 0) items = items.filter((i) => !(i.slug === slug && i.size === size));
    else items.forEach((i) => { if (i.slug === slug && i.size === size) i.qty = Math.min(MAX_QTY, qty); });
    write(items);
  }
  const remove = (slug, size) => setQty(slug, size, 0);
  const clear = () => write([]);
  const subtotal = () => lines().reduce((s, l) => s + l.total, 0);

  const giftNote = {
    get() { try { return JSON.parse(localStorage.getItem(NOTE_KEY) || 'false'); } catch (e) { return false; } },
    set(v) { try { localStorage.setItem(NOTE_KEY, JSON.stringify(!!v)); } catch (e) { /* noop */ } },
  };

  /** Mensaje de WhatsApp con el pedido */
  function whatsappMessage() {
    const ls = lines();
    if (!ls.length) return 'Hola Perfumes Samah, quiero asesoría para elegir mi perfume.';
    const rows = ls.map((l) => `• ${l.qty} x ${l.product.brand !== 'Perfumes Samah' ? `${l.product.brand} ` : ''}${l.product.name} (${l.size.label}) — ${Samah.cop(l.total)}`);
    const parts = [
      'Hola Perfumes Samah, quiero hacer este pedido:',
      '',
      ...rows,
      '',
      `Total estimado: ${Samah.cop(subtotal())}`,
    ];
    if (giftNote.get()) parts.push('', 'Es para regalo.');
    parts.push('', '¿Me confirman disponibilidad y costo de envío?');
    return parts.join('\n');
  }

  Samah.cart = { read, lines, add, setQty, remove, clear, count, subtotal, giftNote, whatsappMessage, MAX_QTY };

  /** Añadir con feedback visual (toast + badge) */
  Samah.addToCart = (product, sizeLabel, qty = 1) => {
    const size = Samah.sizeFrom(product, sizeLabel) || Samah.availableSizes(product)[0];
    if (!size || !size.available) { Samah.toast('Esta presentación está agotada.'); return false; }
    add(product.slug, size.label, qty);
    Samah.toast(`${Samah.esc(product.name)} (${Samah.esc(size.label)}) añadido. <a href="${Samah.page('carrito')}">Ver carrito</a>`);
    document.querySelectorAll('[data-cart-count]').forEach((el) => { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); });
    return true;
  };

  // Sincroniza el contador entre pestañas
  window.addEventListener('storage', (e) => { if (e.key === KEY) document.dispatchEvent(new CustomEvent('cart:change', { detail: { count: count() } })); });
})();
