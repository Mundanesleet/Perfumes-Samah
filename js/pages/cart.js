/* Perfumes Samah — Página de carrito (localStorage + pedido por WhatsApp) */
(function () {
  'use strict';
  const S = window.Samah;
  const I = S.icon;

  function sizeText(l) {
    const p = l.product;
    if (p.category === 'set') return 'Set de regalo';
    if (p.category === 'perfume') return `Perfume completo ${l.size.label}`;
    if (p.category === 'combo') return `${p.includes.length} decants de ${l.size.label} c/u`;
    return `Decant ${l.size.label} con atomizador`;
  }

  function itemView(l) {
    const p = l.product;
    const key = `${S.esc(p.slug)}|${S.esc(l.size.label)}`;
    return `
    <li class="cart-item" data-key="${key}">
      <a class="cart-item__media" href="${S.productUrl(p)}&s=${encodeURIComponent(l.size.label)}" tabindex="-1" aria-hidden="true">
        <img src="${S.asset(p.image)}" alt="" width="80" height="100" loading="lazy">
      </a>
      <div class="cart-item__body">
        <div class="cart-item__top">
          <div>
            <p class="cart-item__brand">${S.esc(p.brand)}</p>
            <h2 class="cart-item__name"><a href="${S.productUrl(p)}&s=${encodeURIComponent(l.size.label)}">${S.esc(p.name)}</a></h2>
            <p class="cart-item__variant">${S.esc(sizeText(l))}${l.qty > 1 ? ` · ${S.money(l.unit)} c/u` : ''}</p>
          </div>
          <button class="icon-btn cart-item__remove" type="button" aria-label="Eliminar ${S.esc(p.name)} (${S.esc(l.size.label)})" data-remove>${I('delete')}</button>
        </div>
        <div class="cart-item__bottom">
          <div class="qty" role="group" aria-label="Cantidad de ${S.esc(p.name)}">
            <button type="button" data-step="-1" aria-label="Disminuir">${I('remove')}</button>
            <output aria-live="polite">${l.qty}</output>
            <button type="button" data-step="1" aria-label="Aumentar"${l.qty >= S.cart.MAX_QTY ? ' disabled' : ''}>${I('add')}</button>
          </div>
          <p class="cart-item__price">${S.money(l.total)}</p>
        </div>
      </div>
    </li>`;
  }

  /** Sugerencia real: decant en oferta (precio rebajado en la tienda) que no esté en el carrito */
  function suggestion(lines) {
    const inCart = new Set(lines.map((l) => l.product.slug));
    const pool = S.products.filter((p) => p.category === 'decant' && p.available && !inCart.has(p.slug) && p.sizes.some((s) => s.compareAt && s.available));
    if (!pool.length) return '';
    const p = pool[(lines.length * 7) % pool.length];
    const s = p.sizes.find((x) => x.compareAt && x.available);
    return `
    <div class="cart-upsell">
      <img src="${S.asset(p.image)}" alt="" width="56" height="70" loading="lazy">
      <div class="cart-upsell__body">
        <span class="cart-upsell__tag">Precio especial</span>
        <a class="cart-upsell__name" href="${S.productUrl(p)}&s=${encodeURIComponent(s.label)}">${S.esc(p.name)} · ${S.esc(s.label)}</a>
        <p class="cart-upsell__price">${S.money(s.price)} <span class="strike">${S.money(s.compareAt)}</span></p>
      </div>
      <button class="btn btn--dark btn--sm" type="button" data-add="${S.esc(p.slug)}" data-size="${S.esc(s.label)}">${I('add')}<span>Añadir</span></button>
    </div>`;
  }

  function render() {
    const root = document.getElementById('cart-root');
    const lines = S.cart.lines();
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const countEl = document.querySelector('[data-cart-items]');
    countEl.textContent = count ? `(${count} ${count === 1 ? 'artículo' : 'artículos'})` : '';
    countEl.hidden = !count;

    if (!lines.length) {
      root.innerHTML = `
        <div class="empty-state cart__empty">
          <span class="empty-state__icon">${I('shopping_bag')}</span>
          <h2>Tu bolsa está vacía</h2>
          <p>Descubre decants, perfumes completos, combos y sets de regalo 100% originales.</p>
          <div class="empty-state__actions">
            <a class="btn btn--amber btn--md" href="${S.page('perfumes')}">Ver perfumes</a>
            <a class="btn btn--ghost btn--md" href="${S.page('encuentra-tu-perfume')}">Encuentra tu perfume</a>
          </div>
        </div>`;
      return;
    }

    const subtotal = S.cart.subtotal();
    const gift = S.cart.giftNote.get();
    root.innerHTML = `
      <div class="cart__layout">
        <div class="cart__items">
          <ul class="cart-list">${lines.map(itemView).join('')}</ul>

          <label class="cart-gift">
            <img src="${S.url('assets/images/editorial/decants-samah.webp')}" alt="" width="80" height="80" loading="lazy">
            <span class="cart-gift__body">
              <span class="cart-gift__title">${I('redeem')}¿Es para un obsequio especial?</span>
              <span class="cart-gift__text">Lo indicaremos en tu mensaje de WhatsApp para preparar el pedido como regalo.</span>
            </span>
            <input class="switch" type="checkbox" role="switch" data-gift${gift ? ' checked' : ''} aria-label="Pedido para regalo">
          </label>

          ${suggestion(lines)}
          <button class="cart__clear" type="button" data-clear-cart>${I('delete')}Vaciar carrito</button>
        </div>

        <aside class="cart__summary" aria-label="Resumen del pedido">
          <div class="summary">
            <h2 class="summary__title">Resumen del Pedido</h2>
            <dl class="summary__rows">
              <div><dt>Subtotal (${count} ${count === 1 ? 'producto' : 'productos'})</dt><dd>${S.cop(subtotal)}</dd></div>
              <div><dt>Envío nacional</dt><dd class="summary__muted">Se confirma por WhatsApp</dd></div>
              <div class="summary__total"><dt>Total estimado</dt><dd>${S.money(subtotal)}<small>COP</small></dd></div>
            </dl>
            <p class="summary__note">El total no incluye el costo de envío, que depende de tu ciudad.</p>
          </div>
          <div class="cart__actions">
            <a class="btn btn--whatsapp btn--block cart__wa" href="${S.waLink(S.cart.whatsappMessage())}" target="_blank" rel="noopener">${I('chat')}<span>Finalizar pedido por WhatsApp</span></a>
            <a class="btn btn--amber btn--block btn--upper" href="${S.page('perfumes')}"><span>Seguir comprando</span>${I('arrow_forward')}</a>
            <p class="cart__assist">${I('verified_user')}<span>Un asesor de Perfumes Samah confirmará disponibilidad, envío y forma de pago por WhatsApp.</span></p>
          </div>
          <ul class="cart-trust">
            <li>${I('verified')}<span>Perfumes 100% Originales</span></li>
            <li>${I('local_shipping')}<span>Envíos a toda Colombia</span></li>
            <li>${I('support_agent')}<span>Asesoría personalizada</span></li>
          </ul>
        </aside>
      </div>`;
  }

  S.ready(() => {
    const root = document.getElementById('cart-root');
    render();
    document.addEventListener('cart:change', render);

    root.addEventListener('click', (e) => {
      const item = e.target.closest('[data-key]');
      if (item) {
        const [slug, size] = item.dataset.key.split('|');
        const line = S.cart.lines().find((l) => l.slug === slug && l.size.label === size);
        if (!line) return;
        const step = e.target.closest('[data-step]');
        if (step) { S.cart.setQty(slug, size, line.qty + Number(step.dataset.step)); return; }
        if (e.target.closest('[data-remove]')) {
          item.classList.add('is-leaving');
          setTimeout(() => { S.cart.remove(slug, size); S.toast(`${S.esc(line.product.name)} eliminado del carrito.`); }, 220);
          return;
        }
      }
      if (e.target.closest('[data-clear-cart]') && window.confirm('¿Vaciar el carrito?')) S.cart.clear();
    });
    root.addEventListener('change', (e) => {
      if (e.target.matches('[data-gift]')) { S.cart.giftNote.set(e.target.checked); render(); }
    });
  });
})();
