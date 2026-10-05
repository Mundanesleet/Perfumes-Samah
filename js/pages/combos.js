/* Perfumes Samah — Combos: filtros por ocasión, selector de presentación y añadir al carrito */
(function () {
  'use strict';
  const S = window.Samah;
  const I = S.icon;

  const ARAB = ['Lattafa', 'Rasasi', 'Armaf', 'Afnan', 'Rayhaan', 'French Avenue', 'Maison Alhambra', 'Mast Parfums Bharara', 'Emper', 'Dumont Paris'];
  const NICHE = ['naxos', 'percival', 'tonka'];
  const lineOf = (k) => (window.SAMAH_LINES || {})[k] || { brand: '', name: k };

  // Combos destacados primero (los pedidos en la referencia del proyecto)
  const FEATURED = ['combo-cita', 'combo-clean', 'combo-dupe-copia', 'combo-diario-tropical-1', 'combo-nicho-1', 'combo-colegio-1'];

  const GROUPS = [
    { id: 'todos', label: 'Todos los combos', test: () => true },
    { id: 'noche', label: 'Citas & Noche', test: (p) => p.occasions.includes('noche') || (p.occasions.includes('cita') && p.intensity === 'intensa') },
    { id: 'fresco', label: 'Frescura & Diario (Clean)', test: (p) => { const d = p.includes.filter((k) => { const pr = S.decantOfLine(k); return pr && pr.families.some((f) => f === 'fresco' || f === 'citrico'); }); return d.length >= Math.ceil(p.includes.length / 2); } },
    { id: 'arabe', label: 'Colección Árabe', test: (p) => p.includes.every((k) => ARAB.includes(lineOf(k).brand)) },
    { id: 'nicho', label: 'Nicho de Lujo', test: (p) => p.includes.some((k) => NICHE.includes(k)) },
    { id: 'femenino', label: 'Femeninos & Mom', test: (p) => p.gender === 'femenino' },
  ];
  const groupOf = (p) => (GROUPS.slice(1).find((g) => g.test(p)) || { label: 'Combo de decants' }).label;

  const state = { group: 'todos', size: {} };

  function comboCard(p) {
    const sizes = p.sizes;
    const sel = state.size[p.slug] || (S.availableSizes(p).find((s) => s.ml === 5) || S.availableSizes(p)[0] || sizes[0]).label;
    const size = S.sizeFrom(p, sel);
    const ml = size.ml || 0;
    const items = p.includes.map((k) => {
      const prod = S.decantOfLine(k);
      const l = lineOf(k);
      const fam = prod ? prod.families.map((f) => S.FAMILY_LABEL[f]).join(' · ') : '';
      const name = `${l.name}`;
      return `
        <li class="combo-card__item">
          <div>
            ${prod ? `<a class="combo-card__item-name" href="${S.productUrl(prod)}">${S.esc(name)}</a>` : `<span class="combo-card__item-name">${S.esc(name)}</span>`}
            <span class="combo-card__item-meta">${S.esc(l.brand)}${fam ? ` · ${S.esc(fam)}` : ''}</span>
          </div>
          <span class="combo-card__ml">${ml} ml</span>
        </li>`;
    }).join('');
    const msg = `Hola Perfumes Samah, quiero el ${p.name} en ${size.label} (${S.cop(size.price)}). ¿Está disponible?`;
    return `
    <article class="combo-card reveal${p.available ? '' : ' is-soldout'}" data-slug="${S.esc(p.slug)}">
      <a class="combo-card__media" href="${S.productUrl(p)}" tabindex="-1" aria-hidden="true">
        <img src="${S.asset(p.image)}" alt="" loading="lazy" decoding="async" width="400" height="565">
        <span class="combo-card__badges">
          <span class="badge badge--dark badge--square">${S.esc(groupOf(p))}</span>
          ${p.available ? '' : '<span class="badge badge--light badge--square">Agotado</span>'}
        </span>
        <span class="combo-card__strip">Incluye ${p.includes.length} decants x ${S.esc(size.label)} c/u</span>
      </a>
      <div class="combo-card__body">
        <div>
          <span class="combo-card__eyebrow">${S.esc(groupOf(p))}</span>
          <h2 class="combo-card__name"><a href="${S.productUrl(p)}">${S.esc(p.name)}</a></h2>
          <p class="combo-card__desc">${S.esc(p.description[0])}</p>
          <div class="combo-card__box">
            <span class="combo-card__box-title">Fragancias incluidas en este set:</span>
            <ul>${items}</ul>
          </div>
        </div>
        <div>
          <div class="combo-card__sizes" role="radiogroup" aria-label="Presentación de ${S.esc(p.name)}">
            ${sizes.map((s) => `<button type="button" role="radio" class="combo-size${s.label === sel ? ' is-active' : ''}" aria-checked="${s.label === sel}" data-combo-size="${S.esc(s.label)}"${s.available ? '' : ' disabled'}>${S.esc(s.label)}</button>`).join('')}
          </div>
          <div class="combo-card__price-row">
            <span class="combo-card__price">${S.cop(size.price)}</span>
            <span class="combo-card__total">${p.includes.length * ml} ml en total</span>
          </div>
          <div class="combo-card__actions">
            <button class="btn btn--dark btn--sm btn--upper" type="button" data-add="${S.esc(p.slug)}" data-size="${S.esc(size.label)}"${size.available ? '' : ' disabled'}>${I('shopping_bag')}<span>${size.available ? 'Comprar' : 'Agotado'}</span></button>
            <a class="btn btn--light btn--sm btn--upper combo-card__wa" href="${S.waLink(msg)}" target="_blank" rel="noopener">${I('chat')}<span>WhatsApp</span></a>
          </div>
        </div>
      </div>
    </article>`;
  }

  S.ready(() => {
    const grid = document.querySelector('[data-combos-grid]');
    const chips = document.querySelector('[data-combo-chips]');
    const count = document.querySelector('[data-combo-count]');
    if (!grid) return;

    const all = S.byCategory('combo');
    all.sort((a, b) => {
      const fa = FEATURED.indexOf(a.slug), fb = FEATURED.indexOf(b.slug);
      if (fa !== fb) return (fa < 0 ? 99 : fa) - (fb < 0 ? 99 : fb);
      return (b.available - a.available);
    });

    const min5 = Math.min(...all.flatMap((p) => p.sizes.filter((s) => s.ml === 5 && s.available).map((s) => s.price)));
    const minEl = document.querySelector('[data-combo-min]');
    if (minEl && isFinite(min5)) minEl.textContent = S.money(min5);

    function render() {
      const g = GROUPS.find((x) => x.id === state.group);
      const list = all.filter(g.test);
      const sorted = list.filter((p) => p.available).concat(list.filter((p) => !p.available));
      grid.innerHTML = sorted.map(comboCard).join('');
      count.textContent = String(list.length);
      chips.querySelectorAll('[data-group]').forEach((b) => { const on = b.dataset.group === state.group; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', String(on)); });
      S.observeReveal(grid);
    }

    chips.innerHTML = GROUPS.map((g) => `<button class="filter-chip" type="button" data-group="${g.id}" aria-pressed="false">${g.label}${g.id === 'todos' ? ` (${all.length})` : ''}</button>`).join('');
    chips.addEventListener('click', (e) => { const b = e.target.closest('[data-group]'); if (b) { state.group = b.dataset.group; render(); } });

    grid.addEventListener('click', (e) => {
      const b = e.target.closest('[data-combo-size]');
      if (!b) return;
      const card = b.closest('[data-slug]');
      state.size[card.dataset.slug] = b.dataset.comboSize;
      const fresh = document.createElement('div');
      fresh.innerHTML = comboCard(S.bySlug(card.dataset.slug));
      const el = fresh.firstElementChild;
      el.classList.add('is-visible');
      card.replaceWith(el);
      const again = el.querySelector(`[data-combo-size="${CSS.escape(b.dataset.comboSize)}"]`);
      if (again) again.focus();
    });

    render();
  });
})();
