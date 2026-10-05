/* ==========================================================================
   Perfumes Samah — Detalle de producto
   Lee ?p=<slug>&s=<presentación> y renderiza galería, presentaciones,
   cantidad, información, pirámide olfativa, relacionados y barra móvil.
   ========================================================================== */
(function () {
  'use strict';
  const S = window.Samah;
  const I = S.icon;

  const CAT_PAGE = { decant: ['Decants', 'decants'], perfume: ['Perfumes', 'perfumes'], combo: ['Combos', 'combos'], set: ['Sets de Regalo', 'sets-regalo'] };
  const SIZE_META = {
    3: { tag: 'Discovery', note: 'Ideal para probar' },
    5: { tag: 'Estándar', note: 'El más elegido' },
    10: { tag: 'Deluxe', note: 'Viaje & temporada' },
    30: { tag: 'Colección', note: 'Uso continuo' },
    100: { tag: 'Frasco completo', note: 'Presentación original' },
  };

  const state = { product: null, size: null, qty: 1, img: 0 };

  function sizeName(p, s) {
    if (p.category === 'set') return 'Set de regalo';
    if (p.category === 'perfume') return `Perfume completo ${s.label}`;
    if (p.category === 'combo') return `Combo ${s.label} c/u`;
    return `Decant ${s.label}`;
  }
  function sizeDetail(p, s) {
    if (p.category === 'set') return (p.setIncludes || []).slice(0, 2).join(' · ') || 'Presentación de regalo';
    if (p.category === 'perfume') return 'Frasco sellado de la casa';
    if (p.category === 'combo') return `${p.includes.length} decants · ${S.sprays(s.ml)} c/u`;
    return S.sprays(s.ml);
  }

  /* ---------------- Plantilla ---------------- */
  function view(p) {
    const [catLabel, catPage] = CAT_PAGE[p.category];
    const gallery = p.gallery.length ? p.gallery : [p.image];
    const famText = (p.families || []).map((f) => S.FAMILY_LABEL[f]).join(' · ');
    const subtitle = p.category === 'combo' ? `${p.includes.length} decants de perfumes originales`
      : p.category === 'set' ? 'Set de regalo original'
        : p.category === 'perfume' ? 'Frasco completo 100 ml' : `Decant de perfume original${p.family ? ` · ${p.family}` : ''}`;

    return `
    <div class="container pd__top">
      <nav class="breadcrumbs" aria-label="Migas de pan">
        <a href="${S.page('home')}">Inicio</a>${I('chevron_right')}
        <a href="${S.page(catPage)}">${catLabel}</a>${I('chevron_right')}
        ${p.category === 'combo' ? '' : `<a href="${S.page(p.category === 'set' ? 'sets-regalo' : 'perfumes')}?marca=${encodeURIComponent(p.brand)}">${S.esc(p.brand)}</a>${I('chevron_right')}`}
        <span aria-current="page">${S.esc(p.name)}</span>
      </nav>
      <p class="pd__stock ${p.available ? '' : 'is-out'}"><span class="pd__dot"></span>${p.available ? 'Disponible para pedido' : 'Agotado por ahora'}</p>
    </div>

    <section class="container pd__main">
      <div class="pd__gallery">
        <div class="pd__stage">
          <span class="pd__seal">${I('verified')}100% Original garantizado</span>
          <img class="pd__img" data-main-img src="${S.asset(gallery[0])}" alt="${S.esc(`${p.brand} ${p.name}`)}" width="600" height="750" fetchpriority="high">
          ${gallery.length > 1 ? `
          <div class="pd__thumbs" role="tablist" aria-label="Imágenes del producto">
            ${gallery.map((g, i) => `<button class="pd__thumb${i === 0 ? ' is-active' : ''}" type="button" role="tab" aria-selected="${i === 0}" aria-label="Imagen ${i + 1}" data-thumb="${i}"><img src="${S.asset(g)}" alt="" loading="lazy" width="64" height="64"></button>`).join('')}
          </div>` : ''}
        </div>
        <ul class="pd__trust">
          <li>${I('verified')}<strong>100% Original</strong><span>Garantía de procedencia</span></li>
          <li>${I('science')}<strong>${p.category === 'perfume' || p.category === 'set' ? 'Presentación sellada' : 'Decants en vidrio'}</strong><span>${p.category === 'perfume' || p.category === 'set' ? 'Producto original de la casa' : 'Atomizador en spray'}</span></li>
          <li>${I('local_shipping')}<strong>Envíos nacionales</strong><span>Toda Colombia</span></li>
        </ul>
      </div>

      <div class="pd__info">
        <p class="pd__brand">${S.esc(p.brand)}</p>
        <h1 class="pd__name">${S.esc(p.name)}</h1>
        <p class="pd__subtitle">${S.esc(subtitle)}</p>
        ${p.description && p.description[0] ? `<p class="pd__lead">${S.esc(p.description[0])}</p>` : ''}
        ${famText ? `<div class="pd__chips">${(p.families || []).map((f) => `<span class="note-chip note-chip--strong">${S.FAMILY_LABEL[f]}</span>`).join('')}${p.gender ? `<span class="note-chip">${S.GENDER_LABEL[p.gender]}</span>` : ''}</div>` : ''}

        <div class="pd__price-card">
          <div>
            <p class="pd__price-label">Precio de la opción seleccionada:</p>
            <p class="pd__price" data-price></p>
          </div>
          <span class="pd__status" data-status></span>
        </div>

        <div class="pd__sizes-head">
          <h2>Selecciona la presentación:</h2>
          <span>${p.category === 'decant' ? 'Formatos auténticos de decant' : p.category === 'combo' ? 'Tamaño de cada decant' : 'Presentación original'}</span>
        </div>
        <div class="pd__sizes" role="radiogroup" aria-label="Presentación">
          ${p.sizes.map((s) => {
            const meta = SIZE_META[s.ml] || {};
            return `
            <button class="pd-size" type="button" role="radio" aria-checked="false" data-size="${S.esc(s.label)}"${s.available ? '' : ' disabled'}>
              ${p.category === 'decant' && s.ml === 5 && s.available ? '<span class="pd-size__flag">Recomendado</span>' : ''}
              <span class="pd-size__top"><span class="pd-size__tag">${meta.tag && p.category === 'decant' ? meta.tag : S.esc(sizeName(p, s))}</span>${p.category === 'decant' ? `<span class="pd-size__ml">${S.esc(s.label)}</span>` : ''}</span>
              <span class="pd-size__price">${S.cop(s.price)}${s.compareAt ? ` <span class="strike">${S.money(s.compareAt)}</span>` : ''}</span>
              <span class="pd-size__desc">${s.available ? S.esc(sizeDetail(p, s)) : 'Agotado'}</span>
            </button>`;
          }).join('')}
        </div>
        <p class="pd__size-note" data-size-note></p>

        <div class="pd__buy">
          <div class="qty qty--lg" aria-label="Cantidad">
            <button type="button" data-qty="-1" aria-label="Disminuir cantidad">${I('remove')}</button>
            <output data-qty-out aria-live="polite">1</output>
            <button type="button" data-qty="1" aria-label="Aumentar cantidad">${I('add')}</button>
          </div>
          <button class="btn btn--amber btn--upper pd__add" type="button" data-add-main>${I('shopping_bag')}<span>Añadir al carrito</span></button>
        </div>
        <a class="btn btn--whatsapp btn--block btn--upper pd__wa" data-wa href="#" target="_blank" rel="noopener">${I('chat')}<span>Comprar por WhatsApp</span></a>

        <div class="pd__ship">
          ${I('local_shipping')}
          <p><strong>Envíos a toda Colombia</strong> Cada pedido se prepara cuidadosamente para que llegue en perfectas condiciones. Costo y tiempo de envío se confirman por WhatsApp.</p>
        </div>
      </div>
    </section>

    ${detailsBlock(p)}

    <section class="container pd__why">
      <div class="dark-banner reveal">
        <div>
          <p class="dark-banner__eyebrow">Cultura de perfumería inteligente</p>
          <h2 class="dark-banner__title">¿Por qué empezar con un decant?</h2>
          <p class="dark-banner__text">Nunca compres a ciegas una botella completa. La química de tu piel cambia cómo evoluciona cada perfume: con un decant de 3, 5 o 10 ml pruebas la evolución real durante días antes de decidir.</p>
          <p class="dark-banner__checks"><span>${I('check_circle')}100% líquido original</span><span>${I('check_circle')}Atomizador en vidrio</span></p>
        </div>
        <div class="dark-banner__actions"><a class="btn btn--gold" href="${S.page('decants')}">Explorar catálogo decants</a></div>
      </div>
    </section>

    <section class="pd__related" aria-labelledby="related-title">
      <div class="container">
        <div class="section-head__row pd__related-head reveal">
          <div class="section-head">
            <span class="eyebrow">Selección curada</span>
            <h2 class="section-title" id="related-title">${p.category === 'combo' ? 'Otros combos' : 'Fragancias relacionadas'}</h2>
          </div>
          <a class="pd__related-link" href="${S.page(catPage)}">Ver catálogo completo</a>
        </div>
      </div>
      <div class="rail pd__related-rail" data-related></div>
    </section>

    <div class="buybar" data-buybar>
      <div class="buybar__row">
        <div>
          <p class="buybar__label">Total estimado</p>
          <p class="buybar__total" data-total></p>
        </div>
        <span class="buybar__chip"><span class="buybar__dot"></span><span data-chip></span></span>
      </div>
      <div class="buybar__actions">
        <button class="btn buybar__add" type="button" data-add-main>${I('shopping_bag')}<span>Añadir a bolsa</span></button>
        <a class="btn btn--whatsapp" data-wa href="#" target="_blank" rel="noopener">${I('chat')}<span>Pedir WhatsApp</span></a>
      </div>
    </div>`;
  }

  function detailsBlock(p) {
    // Combos: fragancias incluidas
    if (p.category === 'combo') {
      return `
      <section class="container pd__details">
        <div class="pd-card reveal">
          <div class="pd-card__head">
            <span class="eyebrow">Contenido del combo</span>
            <h2 class="pd-card__title">Fragancias incluidas</h2>
            <p class="pd-card__sub">${S.esc(p.description[0] || '')}</p>
          </div>
          <div class="pd-includes">
            ${p.includes.map((k) => {
              const d = S.decantOfLine(k);
              const l = (window.SAMAH_LINES || {})[k] || { brand: '', name: k };
              return `
              <a class="pd-include${d ? '' : ' is-static'}" ${d ? `href="${S.productUrl(d)}"` : ''}>
                ${d ? `<img src="${S.asset(d.image)}" alt="" loading="lazy" width="80" height="100">` : ''}
                <span><span class="pd-include__brand">${S.esc(l.brand)}</span><span class="pd-include__name">${S.esc(l.name)}</span>
                ${d ? `<span class="pd-include__fam">${(d.families || []).map((f) => S.FAMILY_LABEL[f]).join(' · ')}</span>` : ''}</span>
                ${d ? I('chevron_right') : ''}
              </a>`;
            }).join('')}
          </div>
          ${statsRow(p)}
        </div>
      </section>`;
    }
    // Pirámide olfativa (si la ficha real trae notas)
    if (p.notes) {
      return `
      <section class="container pd__details">
        <div class="pd-card reveal">
          <div class="pd-card__head pd-card__head--center">
            <span class="eyebrow">Evolución en la piel</span>
            <h2 class="pd-card__title">Pirámide Olfativa</h2>
            <p class="pd-card__sub">Cómo se transforma ${S.esc(p.name)} desde el primer spray hasta el secado final.</p>
          </div>
          <div class="pyramid">
            <div class="pyramid__step">${I('wb_sunny')}<span class="pyramid__time">Primeros minutos</span><h3>Notas de Salida</h3><p>${S.esc(p.notes.top)}</p></div>
            <div class="pyramid__step pyramid__step--heart"><span class="pyramid__flag">Firma del perfume</span>${I('spa')}<span class="pyramid__time">Corazón</span><h3>Notas de Corazón</h3><p>${S.esc(p.notes.heart)}</p></div>
            <div class="pyramid__step">${I('dark_mode')}<span class="pyramid__time">Secado final</span><h3>Notas de Fondo</h3><p>${S.esc(p.notes.base)}</p></div>
          </div>
          ${statsRow(p)}
          ${moreInfo(p)}
        </div>
      </section>`;
    }
    // Información general
    return `
      <section class="container pd__details">
        <div class="pd-card reveal">
          <div class="pd-card__head">
            <span class="eyebrow">${p.category === 'set' ? 'Contenido del set' : 'Perfil olfativo'}</span>
            <h2 class="pd-card__title">Información</h2>
          </div>
          ${p.setIncludes ? `<ul class="pd-list">${p.setIncludes.map((x) => `<li>${I('redeem')}${S.esc(x)}</li>`).join('')}</ul>` : ''}
          ${(p.description || []).slice(p.setIncludes ? 0 : 1).map((d) => `<p class="pd-card__text">${S.esc(d)}</p>`).join('')}
          ${statsRow(p)}
          ${moreInfo(p)}
        </div>
      </section>`;
  }

  function statsRow(p) {
    const cells = [];
    if (p.longevity) cells.push(['Longevidad', p.longevity]);
    if (p.projection) cells.push(['Proyección / estela', p.projection]);
    if (p.occasions) cells.push(['Ocasión recomendada', p.occasions.slice(0, 3).map((o) => S.OCCASION_LABEL[o]).join(', ')]);
    if (p.gender) cells.push(['Género', S.GENDER_LABEL[p.gender]]);
    if (!cells.length) return '';
    return `<dl class="pd-stats">${cells.map(([k, v]) => `<div><dt>${k}</dt><dd>${S.esc(v)}</dd></div>`).join('')}</dl>`;
  }

  function moreInfo(p) {
    const extra = (p.description || []).slice(1);
    const ideal = p.idealFor || [];
    if (!extra.length && !ideal.length) return '';
    return `
      <div class="pd-more">
        ${p.notes ? extra.map((d) => `<p class="pd-card__text">${S.esc(d)}</p>`).join('') : ''}
        ${ideal.length ? `<div><h3 class="pd-more__title">Ideal para</h3><ul class="pd-ideal">${ideal.map((x) => `<li>${I('check')}${S.esc(x)}</li>`).join('')}</ul></div>` : ''}
      </div>`;
  }

  /* ---------------- Interacción ---------------- */
  function update() {
    const p = state.product;
    const s = S.sizeFrom(p, state.size);
    const total = s.price * state.qty;
    document.querySelectorAll('[data-price]').forEach((el) => { el.innerHTML = `${S.cop(s.price)}${s.compareAt ? ` <span class="strike">${S.money(s.compareAt)}</span>` : ''}`; });
    document.querySelectorAll('[data-status]').forEach((el) => { el.textContent = s.available ? 'Disponible' : 'Agotado'; el.classList.toggle('is-out', !s.available); });
    document.querySelectorAll('.pd-size').forEach((b) => { const on = b.dataset.size === s.label; b.classList.toggle('is-active', on); b.setAttribute('aria-checked', String(on)); b.tabIndex = on ? 0 : -1; });
    const note = document.querySelector('[data-size-note]');
    if (note) note.textContent = `${sizeName(p, s)}${p.category === 'decant' ? ` en atomizador de vidrio (${S.sprays(s.ml)})` : ''}.`;
    document.querySelectorAll('[data-qty-out]').forEach((el) => { el.textContent = String(state.qty); });
    document.querySelectorAll('[data-total]').forEach((el) => { el.textContent = S.cop(total); });
    document.querySelectorAll('[data-chip]').forEach((el) => { el.textContent = `${sizeName(p, s)} (x${state.qty})`; });
    document.querySelectorAll('[data-add-main]').forEach((b) => { b.disabled = !s.available; });
    const msg = `Hola Perfumes Samah, quiero comprar:\n• ${state.qty} x ${p.brand !== 'Perfumes Samah' ? `${p.brand} ` : ''}${p.name} (${s.label}) — ${S.cop(total)}\n¿Está disponible?`;
    document.querySelectorAll('[data-wa]').forEach((a) => { a.href = S.waLink(msg); });
    const url = new URL(location.href);
    url.searchParams.set('s', s.label);
    history.replaceState(null, '', url);
  }

  function related(p) {
    const pool = S.products.filter((x) => x.slug !== p.slug && x.available && (p.category === 'combo' ? x.category === 'combo' : x.category === p.category));
    const score = (x) => {
      let n = 0;
      if (x.gender && x.gender === p.gender) n += 2;
      (x.families || []).forEach((f) => { if ((p.families || []).includes(f)) n += 3; });
      (x.occasions || []).forEach((o) => { if ((p.occasions || []).includes(o)) n += 1; });
      if (x.brand === p.brand) n += 1;
      if (x.line && x.line === p.line) n -= 10;
      return n;
    };
    return pool.map((x) => [x, score(x)]).sort((a, b) => b[1] - a[1]).slice(0, 4).map((a) => a[0]);
  }

  S.ready(() => {
    const root = document.getElementById('product-root');
    const p = S.bySlug(S.param('p') || '');
    if (!p) {
      root.innerHTML = `
        <div class="container pd__missing">
          <div class="empty-state">
            <span class="empty-state__icon">${I('search')}</span>
            <h1>No encontramos este perfume</h1>
            <p>Es posible que el enlace esté incompleto. Explora el catálogo o escríbenos y te ayudamos.</p>
            <div class="empty-state__actions"><a class="btn btn--dark btn--md" href="${S.page('perfumes')}">Ver catálogo</a></div>
          </div>
        </div>`;
      return;
    }
    state.product = p;
    const requested = S.param('s');
    const av = S.availableSizes(p);
    const pick = (requested && S.sizeFrom(p, requested)) || av.find((s) => s.ml === 5) || av[0] || p.sizes[0];
    state.size = pick.label;

    document.title = `${p.brand !== 'Perfumes Samah' ? `${p.brand} ` : ''}${p.name} | Perfumes Samah`;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', `${p.name} de ${p.brand}: ${S.sizesSummary(p)} desde ${S.cop(S.fromPrice(p))}. ${(p.description && p.description[0]) || ''}`.slice(0, 300));
    const og = (k, v) => { const m = document.querySelector(`meta[property="og:${k}"]`); if (m) m.setAttribute('content', v); };
    og('title', document.title); og('image', S.asset(p.image));

    root.innerHTML = view(p);
    document.body.classList.add('has-buybar');

    const rel = root.querySelector('[data-related]');
    rel.innerHTML = related(p).map((x) => (x.category === 'combo' ? S.components.comboTile(x) : S.components.productCard(x, { cta: x.category === 'decant' ? 'Ver decant' : 'Ver detalle', reveal: false }))).join('');

    root.addEventListener('click', (e) => {
      const sz = e.target.closest('[data-size]');
      if (sz && !sz.disabled) { state.size = sz.dataset.size; update(); return; }
      const q = e.target.closest('[data-qty]');
      if (q) { state.qty = Math.max(1, Math.min(S.cart.MAX_QTY, state.qty + Number(q.dataset.qty))); update(); return; }
      const th = e.target.closest('[data-thumb]');
      if (th) {
        const i = Number(th.dataset.thumb);
        const img = root.querySelector('[data-main-img]');
        img.style.opacity = '0';
        setTimeout(() => { img.src = S.asset((p.gallery.length ? p.gallery : [p.image])[i]); img.style.opacity = '1'; }, 150);
        root.querySelectorAll('[data-thumb]').forEach((b) => { const on = b === th; b.classList.toggle('is-active', on); b.setAttribute('aria-selected', String(on)); });
        return;
      }
      if (e.target.closest('[data-add-main]')) S.addToCart(p, state.size, state.qty);
    });
    // Navegación con flechas en el grupo de presentaciones
    root.querySelector('.pd__sizes').addEventListener('keydown', (e) => {
      if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;
      const btns = [...root.querySelectorAll('.pd-size:not([disabled])')];
      const i = btns.findIndex((b) => b.dataset.size === state.size);
      const n = btns[(i + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : btns.length - 1)) % btns.length];
      if (n) { e.preventDefault(); state.size = n.dataset.size; update(); n.focus(); }
    });

    update();
    S.observeReveal(root);
  });
})();
