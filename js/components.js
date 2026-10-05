/* ==========================================================================
   Perfumes Samah — Componentes de interfaz
   Header, menú móvil, buscador, tab bar, botón de asesoría, footer,
   tarjeta de producto y tarjeta de combo. Se inyectan en cada página desde
   un único lugar para no duplicar markup.
   ========================================================================== */
(function () {
  'use strict';

  const S = window.Samah;
  const I = S.icon;

  const NAV = [
    { id: 'home', label: 'Inicio', href: () => S.page('home') },
    { id: 'quiz', label: 'Encuentra tu Perfume', href: () => S.page('encuentra-tu-perfume'), badge: 'Exclusivo' },
    { id: 'perfumes', label: 'Perfumes', href: () => S.page('perfumes') },
    { id: 'decants', label: 'Decants', href: () => S.page('decants') },
    { id: 'combos', label: 'Combos', href: () => S.page('combos') },
    { id: 'sets', label: 'Sets de Regalo', href: () => S.page('sets-regalo') },
    { id: 'promos', label: 'Promociones', href: () => S.page('promociones') },
  ];

  const current = () => document.body.dataset.page || '';
  const aria = (id) => (current() === id ? ' aria-current="page"' : '');
  const mark = (cls = 'brand__mark') => `<img class="${cls}" src="${S.url('assets/logo/samah-mark-64.png')}" width="32" height="32" alt="">`;

  /* ---------------- Header ---------------- */
  function header() {
    const detail = document.body.dataset.header === 'detail';
    const nav = NAV.map((n) => `
      <a class="header-nav__link" href="${n.href()}"${aria(n.id)}>
        <span>${n.label}</span>${n.badge ? `<span class="header-nav__badge">${n.badge}</span>` : ''}
      </a>`).join('');

    return `
    <a class="skip-link" href="#main">Saltar al contenido</a>
    <header class="site-header${detail ? ' site-header--detail' : ''}" id="site-header">
      <div class="announce" role="note">
        <span class="announce__text">+1000 Clientes Satisfechos</span>
        <span class="announce__sep" aria-hidden="true">•</span>
        <span class="announce__text">Envíos a toda Colombia</span>
        <span class="announce__sep" aria-hidden="true">•</span>
        <span class="announce__text">Perfumes 100% Originales</span>
        <span class="announce__sep announce__sep--md" aria-hidden="true">•</span>
        <span class="announce__item--md">WhatsApp ${S.config.whatsappDisplay}</span>
      </div>

      <div class="header-main header-main--default">
        <div class="header-main__left">
          <button class="icon-btn header-menu-btn" type="button" aria-label="Abrir menú" aria-controls="drawer" aria-expanded="false" data-open-drawer>${I('menu')}</button>
          <a class="brand" href="${S.page('home')}" aria-label="Perfumes Samah — Inicio">
            ${mark()}<span class="brand__name">PERFUMES SAMAH</span>
          </a>
        </div>
        <form class="header-search" role="search" action="${S.page('perfumes')}">
          <label class="search-field">
            ${I('search')}
            <span class="sr-only">Buscar</span>
            <input type="search" name="q" placeholder="Buscar perfume, casa, notas olfativas..." autocomplete="off">
          </label>
        </form>
        <div class="header-main__right">
          <button class="icon-btn header-search-btn" type="button" aria-label="Buscar fragancias" aria-expanded="false" data-toggle-search>${I('search')}</button>
          <a class="icon-btn" href="${S.page('carrito')}" aria-label="Carrito de compras">
            ${I('shopping_bag')}<span class="count-badge is-empty" data-cart-count>0</span>
          </a>
        </div>
      </div>

      <div class="header-main header-detail">
        <div class="header-main__left">
          <button class="icon-btn" type="button" aria-label="Volver" data-back>${I('arrow_back')}</button>
          <a class="brand" href="${S.page('home')}" aria-label="Perfumes Samah — Inicio">${mark()}</a>
          <span class="header-detail__title">${S.esc(document.body.dataset.headerTitle || 'Detalle de perfume')}</span>
        </div>
        <div class="header-main__right">
          <button class="icon-btn" type="button" aria-label="Compartir" data-share>${I('share')}</button>
          <a class="icon-btn" href="${S.page('carrito')}" aria-label="Carrito de compras">
            ${I('shopping_bag')}<span class="count-badge is-empty" data-cart-count>0</span>
          </a>
        </div>
      </div>

      <div class="search-panel" id="search-panel">
        <form role="search" action="${S.page('perfumes')}">
          <label class="search-field">
            ${I('search')}
            <span class="sr-only">Buscar</span>
            <input type="search" name="q" placeholder="Buscar perfume, casa, notas..." autocomplete="off">
          </label>
        </form>
      </div>

      <div class="header-nav">
        <div class="header-nav__inner">
          <nav class="header-nav__links" aria-label="Principal">${nav}</nav>
          <div class="header-nav__trust">${I('verified', 'icon--sm')}<span>Garantía de Originalidad</span></div>
        </div>
      </div>
    </header>`;
  }

  /* ---------------- Drawer móvil ---------------- */
  function drawer() {
    const links = NAV.map((n) => `<a class="drawer__link" href="${n.href()}"${aria(n.id)}><span>${n.label}</span>${I('chevron_right')}</a>`).join('');
    return `
    <div class="drawer" id="drawer" aria-hidden="true">
      <div class="drawer__scrim" data-close-drawer></div>
      <aside class="drawer__panel" role="dialog" aria-modal="true" aria-label="Menú">
        <div class="drawer__head">
          <a class="brand" href="${S.page('home')}">${mark()}<span class="t-headline-sm">Samah</span></a>
          <button class="icon-btn" type="button" aria-label="Cerrar menú" data-close-drawer>${I('close')}</button>
        </div>
        <nav class="drawer__nav" aria-label="Menú móvil">
          ${links}
          <a class="drawer__link" href="${S.page('carrito')}"${aria('carrito')}><span>Carrito</span>${I('shopping_bag')}</a>
        </nav>
        <div class="drawer__foot">
          <a class="btn btn--whatsapp btn--block" href="${S.waLink('Hola Perfumes Samah, quiero asesoría para elegir mi perfume.')}" target="_blank" rel="noopener">${I('chat')}<span>Asesoría por WhatsApp</span></a>
          <p class="drawer__trust">${I('verified')}<span>Garantía de Originalidad</span></p>
        </div>
      </aside>
    </div>`;
  }

  /* ---------------- Tab bar ---------------- */
  function tabbar() {
    const t = (id, href, icon, label, extra = '') => `<a class="tabbar__item" href="${href}"${aria(id)}><span class="tabbar__icon">${I(icon)}${extra}</span><span>${label}</span></a>`;
    return `
    <nav class="tabbar" aria-label="Navegación inferior">
      <div class="tabbar__inner">
        ${t('home', S.page('home'), 'home', 'Inicio')}
        ${t('perfumes', S.page('perfumes'), 'explore', 'Explorar')}
        ${t('quiz', S.page('encuentra-tu-perfume'), 'auto_awesome', 'Descubre')}
        ${t('combos', S.page('combos'), 'dashboard_customize', 'Combos')}
        ${t('carrito', S.page('carrito'), 'shopping_bag', 'Carrito', '<span class="tabbar__badge is-empty" data-cart-count>0</span>')}
      </div>
    </nav>`;
  }

  /* ---------------- Botón de asesoría ---------------- */
  const fab = () => `
    <a class="fab" href="${S.waLink('Hola Perfumes Samah, quiero asesoría para elegir mi perfume.')}" target="_blank" rel="noopener" aria-label="Asesoría Samah por WhatsApp">
      ${I('chat')}<span class="fab__label">Asesoría Samah</span>
    </a>`;

  /* ---------------- Footer ---------------- */
  function footer() {
    const social = `
      <div class="footer-socials">
        <a href="${S.config.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${I('photo_camera')}</a>
        <a href="${S.config.tiktok}" target="_blank" rel="noopener" aria-label="TikTok">${I('music_note')}</a>
        <a href="${S.waLink()}" target="_blank" rel="noopener" aria-label="WhatsApp">${I('chat')}</a>
      </div>`;
    const year = 2026;
    return `
    <footer class="site-footer">
      <div class="site-footer--mobile">
        <div class="footer-m__top">
          <div class="footer-m__brand">${mark('')}<span>SAMAH</span></div>
          ${social}
        </div>
        <nav class="footer-m__links" aria-label="Enlaces del sitio">
          <a href="${S.page('perfumes')}">Explorar Perfumes</a>
          <a href="${S.page('decants')}">Catálogo Decants</a>
          <a href="${S.page('combos')}">Combos &amp; Ocasión</a>
          <a href="${S.page('encuentra-tu-perfume')}">Quiz Olfativo</a>
          <a href="${S.page('sets-regalo')}">Sets de Regalo</a>
          <a href="${S.config.policies.refund}" target="_blank" rel="noopener">Política de Reembolso</a>
        </nav>
        <div class="footer-m__copy">
          <p>© ${year} Perfumes Samah. Alta Perfumería en Colombia.</p>
          <p>Todos los derechos reservados • Fragancias 100% Originales</p>
        </div>
      </div>

      <div class="site-footer--desktop">
        <div class="container footer-d__grid">
          <div class="footer-d__brand">
            <a class="brand" href="${S.page('home')}">${mark()}<span class="brand__name">PERFUMES SAMAH</span></a>
            <p>Un aroma para cada versión de ti. Perfumes 100% originales y decants preparados con cuidado, con envíos a toda Colombia.</p>
            ${social}
          </div>
          <div>
            <h2 class="footer-d__title">Navegación</h2>
            <ul class="footer-d__list">
              <li><a href="${S.page('perfumes')}">Catálogo Completo</a></li>
              <li><a href="${S.page('decants')}">Muestras y Decants</a></li>
              <li><a href="${S.page('combos')}">Combos por Ocasión</a></li>
              <li><a href="${S.page('sets-regalo')}">Sets de Regalo</a></li>
              <li><a href="${S.page('encuentra-tu-perfume')}">Encuentra tu Perfume</a></li>
            </ul>
          </div>
          <div>
            <h2 class="footer-d__title">Atención al Cliente</h2>
            <ul class="footer-d__list">
              <li><a href="${S.waLink()}" target="_blank" rel="noopener">WhatsApp: +57 ${S.config.whatsappDisplay}</a></li>
              <li><a href="${S.config.policies.refund}" target="_blank" rel="noopener">Política de Reembolso</a></li>
              <li><a href="${S.config.policies.privacy}" target="_blank" rel="noopener">Política de Privacidad</a></li>
              <li><a href="${S.config.policies.terms}" target="_blank" rel="noopener">Términos del Servicio</a></li>
            </ul>
          </div>
          <div>
            <h2 class="footer-d__title">Club Samah</h2>
            <p class="footer-d__text">Tu próximo aroma favorito empieza aquí. Recibe novedades, lanzamientos e inspiración.</p>
            <form class="footer-d__form" data-newsletter novalidate>
              <label class="sr-only" for="newsletter-email">Correo electrónico</label>
              <input id="newsletter-email" type="email" name="email" placeholder="Tu correo electrónico" required autocomplete="email">
              <button class="btn btn--dark btn--sm" type="submit">Unirme</button>
            </form>
            <p class="footer-d__msg" data-newsletter-msg hidden></p>
          </div>
        </div>
        <div class="container footer-d__bottom">
          <p>© ${year} Perfumes Samah Colombia. Fragancias 100% Originales.</p>
          <p class="footer-d__tag">Envíos a toda Colombia</p>
        </div>
      </div>
    </footer>`;
  }

  /* ---------------- Tarjeta de producto ---------------- */
  function productCard(p, opts = {}) {
    const size = opts.size ? S.sizeFrom(p, opts.size) : null;
    const price = size ? size.price : S.fromPrice(p);
    const compare = size ? size.compareAt : null;
    const badges = [];
    if (!p.available) badges.push('<span class="badge badge--light">Agotado</span>');
    else if (p.tags.includes('promo-2x400')) badges.push('<span class="badge badge--amber">2 x $400.000</span>');
    else if (p.tags.includes('promo-2x285')) badges.push('<span class="badge badge--amber">2 x $285.000</span>');
    else if (p.tags.includes('oferta')) badges.push('<span class="badge badge--peach">Oferta</span>');
    if (opts.badge) badges.unshift(`<span class="badge ${opts.badgeClass || 'badge--light'}">${opts.badge}</span>`);
    else if (p.tags.includes('nuevo') && p.available) badges.push('<span class="badge badge--navy">Nuevo</span>');

    const fromLabel = size ? size.label : (p.category === 'perfume' || p.category === 'set' ? 'Precio' : 'Desde');
    const href = S.productUrl(p) + (size ? `&s=${encodeURIComponent(size.label)}` : '');
    return `
    <article class="product-card${p.available ? '' : ' is-soldout'}${opts.reveal === false ? '' : ' reveal'}">
      <a class="product-card__media" href="${href}" tabindex="-1" aria-hidden="true">
        <img src="${S.asset(p.image)}" alt="${S.esc(`${p.brand} ${p.name}`)}" loading="lazy" decoding="async" width="300" height="375">
        ${badges.length ? `<span class="product-card__badges">${badges.slice(0, 2).join('')}</span>` : ''}
      </a>
      <div class="product-card__body">
        <div>
          <span class="product-card__brand">${S.esc(p.brand)}</span>
          <h3 class="product-card__name" title="${S.esc(p.name)}"><a href="${href}">${S.esc(p.name)}</a></h3>
          <p class="product-card__sizes">${S.esc(S.sizesSummary(p))}</p>
        </div>
        <div>
          <span class="product-card__from">${fromLabel}</span>
          <span class="product-card__price">${S.cop(price)}${compare ? `<span class="strike">${S.money(compare)}</span>` : ''}</span>
        </div>
        <a class="product-card__cta" href="${href}">${opts.cta || 'Ver detalle'}</a>
      </div>
    </article>`;
  }

  /* ---------------- Tarjeta de combo (carrusel) ---------------- */
  function comboTile(p, opts = {}) {
    const n = p.includes.length;
    const badge = !p.available ? '<span class="badge badge--light">Agotado</span>'
      : opts.badge ? `<span class="badge ${opts.badgeClass || 'badge--dark'}">${opts.badge}</span>`
        : `<span class="badge badge--dark">${n} Decants</span>`;
    const desc = p.includes.map(S.lineLabel).map((s) => s.split(' · ')[0]).join(' + ');
    const first = S.availableSizes(p)[0] || p.sizes[0];
    return `
    <article class="combo-tile">
      <div class="combo-tile__media">
        <img src="${S.asset(p.image)}" alt="${S.esc(p.name)}: ${S.esc(desc)}" loading="lazy" decoding="async" width="256" height="320">
        ${badge}
      </div>
      <div class="combo-tile__body">
        <div>
          <h3 class="combo-tile__name"><a href="${S.productUrl(p)}">${S.esc(p.name)}</a></h3>
          <p class="combo-tile__desc line-clamp-2">${S.esc(desc)}</p>
        </div>
        <div class="combo-tile__foot">
          <span class="combo-tile__price">${S.cop(S.fromPrice(p))}</span>
          <button class="round-add" type="button" aria-label="Agregar ${S.esc(p.name)} (${S.esc(first.label)}) al carrito" data-add="${S.esc(p.slug)}" data-size="${S.esc(first.label)}"${p.available ? '' : ' disabled'}>${I('add')}</button>
        </div>
      </div>
    </article>`;
  }

  /* ---------------- Montaje e interacciones ---------------- */
  function updateCartCount() {
    const n = S.cart ? S.cart.count() : 0;
    document.querySelectorAll('[data-cart-count]').forEach((el) => {
      el.textContent = n > 99 ? '99+' : String(n);
      el.classList.toggle('is-empty', n === 0);
    });
    document.querySelectorAll('a[aria-label^="Carrito"]').forEach((a) => a.setAttribute('aria-label', `Carrito de compras${n ? ` con ${n} productos` : ''}`));
  }

  function openDrawer(open) {
    const d = document.getElementById('drawer');
    const btn = document.querySelector('[data-open-drawer]');
    if (!d) return;
    d.classList.toggle('is-open', open);
    d.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('no-scroll', open);
    if (btn) btn.setAttribute('aria-expanded', String(open));
    if (open) { const f = d.querySelector('.drawer__link'); if (f) setTimeout(() => f.focus(), 50); }
    else if (btn) btn.focus();
  }

  function bind() {
    document.addEventListener('click', (e) => {
      const t = e.target;
      if (t.closest('[data-open-drawer]')) openDrawer(true);
      else if (t.closest('[data-close-drawer]')) openDrawer(false);

      const sBtn = t.closest('[data-toggle-search]');
      if (sBtn) {
        const panel = document.getElementById('search-panel');
        const open = !panel.classList.contains('is-open');
        panel.classList.toggle('is-open', open);
        sBtn.setAttribute('aria-expanded', String(open));
        if (open) panel.querySelector('input').focus();
      }

      if (t.closest('[data-back]')) {
        if (document.referrer && new URL(document.referrer).origin === location.origin) history.back();
        else location.href = S.page('perfumes');
      }

      const share = t.closest('[data-share]');
      if (share) {
        const data = { title: document.title, url: location.href };
        if (navigator.share) navigator.share(data).catch(() => {});
        else if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(() => S.toast('Enlace copiado.'));
      }

      // Añadir rápido: <button data-add="slug" data-size="5 ml">
      const add = t.closest('[data-add]');
      if (add && !add.disabled) {
        const p = S.bySlug(add.dataset.add);
        if (p) S.addToCart(p, add.dataset.size, Number(add.dataset.qty || 1));
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const d = document.getElementById('drawer');
        if (d && d.classList.contains('is-open')) openDrawer(false);
      }
    });

    document.addEventListener('submit', (e) => {
      const form = e.target.closest('[data-newsletter]');
      if (!form) return;
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const msg = form.parentElement.querySelector('[data-newsletter-msg]');
      const ok = input.value && input.checkValidity();
      msg.hidden = false;
      msg.textContent = ok ? '¡Gracias por unirte al Club Samah! (Demostración: aún no se envían correos.)' : 'Escribe un correo electrónico válido.';
      if (ok) form.reset();
    });

    document.addEventListener('cart:change', updateCartCount);
  }

  function mount() {
    const top = document.getElementById('app-header');
    const bottom = document.getElementById('app-footer');
    if (top) top.outerHTML = header() + drawer();
    if (bottom) bottom.outerHTML = footer() + fab() + (document.body.dataset.tabbar === 'off' ? '' : tabbar());
    bind();
    updateCartCount();
  }

  S.components = { mount, productCard, comboTile, updateCartCount };
})();
