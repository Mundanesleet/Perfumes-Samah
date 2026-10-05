/* ==========================================================================
   Perfumes Samah — Motor de catálogo: filtros, búsqueda y ordenamiento
   Uso:  Samah.catalog.init({ base, chips, facets, sizes, defaultSort })
   El estado se refleja en la URL (?q=&genero=&familia=...) para poder
   compartir/enlazar listados filtrados sin servidor.
   ========================================================================== */
(function () {
  'use strict';
  const S = window.Samah;
  const I = S.icon;

  const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  /* Definición de facetas: clave de URL, título y cómo leer el valor del producto */
  const FACETS = {
    gender: { param: 'genero', title: 'Para quién', options: () => S.GENDER_LABEL, test: (p, v) => p.gender === v },
    family: { param: 'familia', title: 'Familia olfativa', options: () => S.FAMILY_LABEL, test: (p, v) => (p.families || []).includes(v) },
    occasion: { param: 'ocasion', title: 'Ocasión', options: () => S.OCCASION_LABEL, test: (p, v) => (p.occasions || []).includes(v) },
    brand: { param: 'marca', title: 'Marca', options: (list) => Object.fromEntries([...new Set(list.map((p) => p.brand))].sort((a, b) => a.localeCompare(b, 'es')).map((b) => [b, b])), test: (p, v) => p.brand === v },
    price: {
      param: 'precio', title: 'Precio desde',
      options: () => ({ 'a': 'Hasta $30.000', 'b': '$30.000 – $100.000', 'c': '$100.000 – $250.000', 'd': 'Más de $250.000' }),
      test: (p, v, size) => { const x = size ? size.price : S.fromPrice(p); return v === 'a' ? x <= 30000 : v === 'b' ? x > 30000 && x <= 100000 : v === 'c' ? x > 100000 && x <= 250000 : x > 250000; },
    },
  };

  const SORTS = {
    destacados: { label: 'Destacados', fn: null },
    'precio-asc': { label: 'Precio: menor a mayor', fn: (a, b) => a._price - b._price },
    'precio-desc': { label: 'Precio: mayor a menor', fn: (a, b) => b._price - a._price },
    nombre: { label: 'Nombre (A–Z)', fn: (a, b) => a.name.localeCompare(b.name, 'es') },
  };

  function init(cfg) {
    const root = document.querySelector('[data-catalog]');
    if (!root) return;
    const grid = root.querySelector('[data-grid]');
    const countEls = document.querySelectorAll('[data-count]');
    const chipsBox = document.querySelector('[data-chips]');
    const panel = root.querySelector('[data-facets]');
    const sortSel = root.querySelector('[data-sort]');
    const searchInput = root.querySelector('[data-search]');
    const activeBox = root.querySelector('[data-active]');
    const sizeBox = document.querySelector('[data-sizes]');
    const baseList = S.products.filter(cfg.base);

    /* ---- Estado inicial desde la URL ---- */
    const qs = new URLSearchParams(location.search);
    const state = {
      q: qs.get('q') || '',
      chip: qs.get('ver') || (cfg.chips ? cfg.chips[0].id : null),
      size: qs.get('ml') || null,
      sort: SORTS[qs.get('orden')] ? qs.get('orden') : (cfg.defaultSort || 'destacados'),
      facets: {},
    };
    (cfg.facets || []).forEach((k) => { const v = qs.get(FACETS[k].param); state.facets[k] = v ? v.split(',') : []; });
    if (cfg.chips && !cfg.chips.some((c) => c.id === state.chip)) state.chip = cfg.chips[0].id;

    /* ---- Render de controles ---- */
    if (chipsBox && cfg.chips) {
      chipsBox.innerHTML = cfg.chips.map((c) => `<button class="filter-chip" type="button" data-chip="${c.id}" aria-pressed="false">${c.label}</button>`).join('');
    }
    if (sortSel) sortSel.innerHTML = Object.entries(SORTS).map(([k, s]) => `<option value="${k}">${s.label}</option>`).join('');
    if (searchInput) searchInput.value = state.q;

    if (panel) {
      panel.innerHTML = (cfg.facets || []).map((k) => {
        const f = FACETS[k];
        const opts = Object.entries(f.options(baseList)).filter(([v]) => baseList.some((p) => f.test(p, v)));
        return `
        <fieldset class="facet">
          <legend class="facet__title">${f.title}</legend>
          <div class="facet__options">
            ${opts.map(([v, label]) => `
              <label class="facet__opt">
                <input type="checkbox" name="${k}" value="${S.esc(v)}">
                <span>${S.esc(label)}</span>
                <span class="facet__n" data-n="${k}:${S.esc(v)}"></span>
              </label>`).join('')}
          </div>
        </fieldset>`;
      }).join('');
    }

    /* ---- Filtrado ---- */
    function currentSize() { return state.size ? `${state.size} ml` : null; }

    function apply(list, skipFacet) {
      const q = norm(state.q).trim();
      const chip = cfg.chips ? cfg.chips.find((c) => c.id === state.chip) : null;
      const sizeLabel = currentSize();
      return list.filter((p) => {
        if (chip && chip.test && !chip.test(p)) return false;
        if (sizeLabel && !p.sizes.some((s) => s.label === sizeLabel)) return false;
        if (q) {
          const hay = norm([p.name, p.brand, p.family, (p.families || []).map((f) => S.FAMILY_LABEL[f]).join(' '), p.notes ? Object.values(p.notes).join(' ') : '', (p.includes || []).map(S.lineLabel).join(' '), S.CATEGORY_LABEL[p.category]].join(' '));
          if (!q.split(/\s+/).every((w) => hay.includes(w))) return false;
        }
        for (const k of Object.keys(state.facets)) {
          if (k === skipFacet) continue;
          const vals = state.facets[k];
          if (vals.length && !vals.some((v) => FACETS[k].test(p, v, sizeLabel ? S.sizeFrom(p, sizeLabel) : null))) return false;
        }
        return true;
      });
    }

    function syncUrl() {
      const p = new URLSearchParams();
      if (state.q) p.set('q', state.q);
      if (cfg.chips && state.chip !== cfg.chips[0].id) p.set('ver', state.chip);
      if (state.size) p.set('ml', state.size);
      if (state.sort !== (cfg.defaultSort || 'destacados')) p.set('orden', state.sort);
      Object.entries(state.facets).forEach(([k, v]) => { if (v.length) p.set(FACETS[k].param, v.join(',')); });
      const s = p.toString();
      history.replaceState(null, '', s ? `?${s}` : location.pathname);
    }

    function render() {
      const sizeLabel = currentSize();
      let list = apply(baseList).map((p) => {
        const sz = sizeLabel ? S.sizeFrom(p, sizeLabel) : null;
        return Object.assign(Object.create(p), p, { _price: sz ? sz.price : S.fromPrice(p) });
      });
      const sort = SORTS[state.sort];
      if (sort.fn) list.sort(sort.fn);
      // Agotados al final, sin alterar el resto del orden
      list = list.filter((p) => p.available).concat(list.filter((p) => !p.available));

      countEls.forEach((el) => { el.textContent = String(list.length); });
      grid.innerHTML = list.length
        ? list.map((p) => S.components.productCard(p, { size: sizeLabel || undefined })).join('')
        : `<div class="empty-state catalog__empty">
             <span class="empty-state__icon">${I('search')}</span>
             <h3>No encontramos fragancias con esos filtros</h3>
             <p>Prueba quitando algún filtro o escríbenos: te ayudamos a encontrar una alternativa.</p>
             <div class="empty-state__actions">
               <button class="btn btn--dark btn--md" type="button" data-clear>Limpiar filtros</button>
               <a class="btn btn--whatsapp btn--md" href="${S.waLink(`Hola Perfumes Samah, busco una fragancia${state.q ? `: ${state.q}` : ''}.`)}" target="_blank" rel="noopener">${I('chat')}<span>Preguntar por WhatsApp</span></a>
             </div>
           </div>`;
      S.observeReveal(grid);

      // Estado visual de controles
      document.querySelectorAll('[data-chip]').forEach((b) => { const on = b.dataset.chip === state.chip; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', String(on)); });
      document.querySelectorAll('[data-size-pick]').forEach((b) => { const on = b.dataset.sizePick === (state.size || ''); b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', String(on)); });
      if (sortSel) sortSel.value = state.sort;
      if (panel) {
        panel.querySelectorAll('input[type=checkbox]').forEach((c) => { c.checked = state.facets[c.name].includes(c.value); });
        // Conteo por opción (respetando el resto de filtros)
        Object.keys(state.facets).forEach((k) => {
          const sub = apply(baseList, k);
          panel.querySelectorAll(`[data-n^="${k}:"]`).forEach((el) => {
            const v = el.dataset.n.slice(k.length + 1);
            const n = sub.filter((p) => FACETS[k].test(p, v, sizeLabel ? S.sizeFrom(p, sizeLabel) : null)).length;
            el.textContent = n;
            el.parentElement.classList.toggle('is-zero', n === 0);
          });
        });
      }
      // Filtros activos (píldoras removibles)
      if (activeBox) {
        const pills = [];
        if (state.q) pills.push(`<button type="button" class="active-pill" data-remove="q">“${S.esc(state.q)}” ${I('close')}</button>`);
        Object.entries(state.facets).forEach(([k, vals]) => vals.forEach((v) => {
          const label = FACETS[k].options(baseList)[v] || v;
          pills.push(`<button type="button" class="active-pill" data-remove="${k}" data-value="${S.esc(v)}">${S.esc(label)} ${I('close')}</button>`);
        }));
        activeBox.innerHTML = pills.length ? pills.join('') + '<button type="button" class="active-clear" data-clear>Limpiar todo</button>' : '';
        activeBox.hidden = !pills.length;
      }
      const nActive = Object.values(state.facets).reduce((n, v) => n + v.length, 0);
      document.querySelectorAll('[data-facet-count]').forEach((el) => { el.textContent = nActive ? `(${nActive})` : ''; });
      syncUrl();
    }

    /* ---- Eventos ---- */
    document.addEventListener('click', (e) => {
      const chip = e.target.closest('[data-chip]');
      if (chip) { state.chip = chip.dataset.chip; render(); return; }
      const sz = e.target.closest('[data-size-pick]');
      if (sz) { state.size = sz.dataset.sizePick || null; render(); return; }
      const rm = e.target.closest('[data-remove]');
      if (rm) {
        if (rm.dataset.remove === 'q') { state.q = ''; if (searchInput) searchInput.value = ''; }
        else state.facets[rm.dataset.remove] = state.facets[rm.dataset.remove].filter((v) => v !== rm.dataset.value);
        render(); return;
      }
      if (e.target.closest('[data-clear]')) {
        state.q = ''; if (searchInput) searchInput.value = '';
        Object.keys(state.facets).forEach((k) => { state.facets[k] = []; });
        if (cfg.chips) state.chip = cfg.chips[0].id;
        state.size = null;
        render(); return;
      }
      if (e.target.closest('[data-open-filters]')) toggleSheet(true);
      if (e.target.closest('[data-close-filters]')) toggleSheet(false);
    });
    if (panel) panel.addEventListener('change', (e) => {
      const c = e.target;
      if (c.type !== 'checkbox') return;
      const set = new Set(state.facets[c.name]);
      if (c.checked) set.add(c.value); else set.delete(c.value);
      state.facets[c.name] = [...set];
      render();
    });
    if (sortSel) sortSel.addEventListener('change', () => { state.sort = sortSel.value; render(); });
    if (searchInput) {
      let t;
      searchInput.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { state.q = searchInput.value.trim(); render(); }, 200); });
      searchInput.form && searchInput.form.addEventListener('submit', (e) => { e.preventDefault(); state.q = searchInput.value.trim(); render(); });
    }

    // Panel de filtros como hoja inferior en móvil
    const sheet = root.querySelector('[data-filter-sheet]');
    function toggleSheet(open) {
      if (!sheet) return;
      sheet.classList.toggle('is-open', open);
      document.body.classList.toggle('no-scroll', open && window.innerWidth < 1024);
      document.querySelectorAll('[data-open-filters]').forEach((b) => b.setAttribute('aria-expanded', String(open)));
    }
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggleSheet(false); });

    // Tamaños (página de decants): precio mínimo real por presentación
    if (sizeBox) {
      sizeBox.querySelectorAll('[data-size-pick]').forEach((b) => {
        const ml = Number(b.dataset.sizePick);
        const out = b.querySelector('[data-min]');
        if (!out || !ml) return;
        const prices = baseList.flatMap((p) => p.sizes.filter((s) => s.ml === ml && s.available).map((s) => s.price));
        out.textContent = prices.length ? S.money(Math.min(...prices)) : '—';
        const cnt = b.querySelector('[data-size-count]');
        if (cnt) cnt.textContent = baseList.filter((p) => p.sizes.some((s) => s.ml === ml)).length;
      });
    }

    render();
  }

  S.catalog = { init, FACETS, SORTS };
})();
