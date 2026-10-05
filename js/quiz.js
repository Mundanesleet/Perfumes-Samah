/* ==========================================================================
   Perfumes Samah — Quiz "Encuentra tu perfume"
   5 pasos: para quién · familia olfativa · ocasión · intensidad · presupuesto.
   La recomendación se calcula en el navegador puntuando el catálogo local
   (simulación de lo que más adelante hará un backend).
   ========================================================================== */
(function () {
  'use strict';
  const S = window.Samah;
  const I = S.icon;

  const range = (cat, ml) => {
    const prices = S.products.filter((p) => p.category === cat && p.available)
      .map((p) => { const av = S.availableSizes(p); const s = ml ? av.find((x) => x.ml === ml) : null; return s ? s.price : S.fromPrice(p); });
    return prices.length ? `${S.money(Math.min(...prices))} – ${S.money(Math.max(...prices))} COP` : '';
  };
  const img = (slug, i = 0) => { const p = S.bySlug(slug); return p ? S.asset(p.gallery[i] || p.image) : ''; };

  const STEPS = [
    {
      key: 'recipient', pill: 'Para quién', title: '¿Para quién buscas la fragancia hoy?', sub: 'Selecciona el perfil base para comenzar a calibrar las notas dominantes.', layout: 'cards',
      options: [
        { value: 'hombre', title: 'Hombre', text: 'Carácter, maderas nobles, frescura azul y especias profundas.', tag: 'Masculino', img: () => img('azzaro-the-most-wanted-parfum') },
        { value: 'mujer', title: 'Mujer', text: 'Gourmand adictivo, flores blancas y frutas dulces aterciopeladas.', tag: 'Femenino', img: () => img('crystal-emerald-versace') },
        { value: 'unisex', title: 'Unisex / Nicho', text: 'Acordes vanguardistas, ámbares, especias y casas de nicho.', tag: 'Nicho universal', img: () => img('xj-naxos-1861-xerjoff') },
        { value: 'regalo', title: 'Para regalo especial', text: 'Aromas infalibles y presentaciones de regalo originales.', tag: 'Set de regalo', tagClass: 'is-amber', img: () => img('yara-lataffa-set-de-regalo', 1), cover: true },
      ],
    },
    {
      key: 'family', pill: 'Familia olfativa', title: '¿Qué tipo de aroma prefieres?', sub: 'Elige la familia olfativa que más te atrae en tu día a día.', layout: 'icons',
      options: [
        { value: 'citrico', title: 'Cítrico', text: 'Bergamota, limón, mandarina y pomelo energizante.', feel: 'Chispeante & vital', icon: 'energy_savings_leaf', warm: true },
        { value: 'fresco', title: 'Fresco / Acuático', text: 'Brisa marina, notas acuáticas, menta y lavanda limpia.', feel: 'Pulcritud absoluta', icon: 'water_drop' },
        { value: 'dulce', title: 'Dulce / Gourmand', text: 'Vainilla, haba tonka, praliné y caramelo.', feel: 'Cálido & adictivo', icon: 'cookie', warm: true },
        { value: 'floral', title: 'Floral elegante', text: 'Jazmín, rosa, iris y flores blancas.', feel: 'Sofisticada distinción', icon: 'local_florist' },
        { value: 'amaderado', title: 'Amaderado seductor', text: 'Cedro, sándalo, vetiver y maderas oscuras.', feel: 'Presencia & fortaleza', icon: 'forest', warm: true },
        { value: 'especiado', title: 'Especiado cálido', text: 'Canela, cardamomo, pimienta rosa y jengibre.', feel: 'Magnético & envolvente', icon: 'local_fire_department' },
        { value: 'oriental', title: 'Oriental misterioso', text: 'Ámbar, oud, incienso y resinas.', feel: 'Opulencia nocturna', icon: 'auto_awesome', warm: true },
        { value: 'frutal', title: 'Frutal jugoso', text: 'Manzana, piña, frutos rojos y frutas tropicales.', feel: 'Juvenil & provocativo', icon: 'nutrition' },
      ],
    },
    {
      key: 'occasion', pill: 'Ocasión de uso', title: '¿En qué momentos planeas usarlo?', sub: 'El contexto y la temperatura condicionan cómo evoluciona la fragancia en tu piel.', layout: 'icons',
      options: [
        { value: 'diario', title: 'Día a día', text: 'Firma personal versátil, salidas casuales y clima templado o cálido.', feel: 'Versatilidad', icon: 'wb_sunny', warm: true },
        { value: 'oficina', title: 'Oficina / Estudio', text: 'Aroma pulcro, nada invasivo, que inspira confianza.', feel: 'Discreto & elegante', icon: 'work' },
        { value: 'cita', title: 'Cita romántica', text: 'Distancia corta, notas sensuales, dulces o amaderadas.', feel: 'Atracción íntima', icon: 'favorite', warm: true },
        { value: 'fiesta', title: 'Noche / Fiesta', text: 'Alta proyección, magnetismo y elogios asegurados.', feel: 'Modo fiesta', icon: 'celebration' },
        { value: 'formal', title: 'Eventos formales', text: 'Bodas, cenas y celebraciones con acordes refinados.', feel: 'Alta distinción', icon: 'stars', warm: true },
      ],
    },
    {
      key: 'intensity', pill: 'Intensidad', title: '¿Qué intensidad y duración buscas?', sub: 'Una burbuja personal discreta o una estela que deje rastro.', layout: 'meter',
      options: [
        { value: 'suave', title: 'Suave y sutil', text: 'Burbuja íntima, perceptible de cerca. Ideal para gimnasio o espacios cerrados.', feel: 'Estela íntima', level: 1 },
        { value: 'moderada', title: 'Moderada y versátil', text: 'Se hace notar sin saturar a los demás a lo largo del día.', feel: 'Estela moderada', level: 2 },
        { value: 'intensa', title: 'Intensa y proyectora', text: 'Deja estela al caminar y acompaña el día y la noche.', feel: 'Estela fuerte y duradera', level: 3 },
      ],
    },
    {
      key: 'budget', pill: 'Presupuesto', title: '¿Cuál es tu formato o presupuesto preferido?', sub: 'En Samah puedes probar desde decants de 3 ml hasta frascos completos sellados.', layout: 'budget',
      options: [
        { value: 'decants', title: 'Decants individuales', price: () => range('decant', 5), text: 'Atomizadores de 3 a 30 ml con el perfume original para probar en tu piel.', tag: 'Ideal para probar sin riesgo', bullets: ['Atomizador en vidrio', 'Precio por presentación de 5 ml'] },
        { value: 'combos', title: 'Combos temáticos', price: () => range('combo', 5), text: 'Colecciones de 2 a 4 fragancias en decants seleccionadas por ocasión.', tag: 'Más variedad', bullets: ['Diversidad para toda la semana', 'Combo Cita, Clean, Día a Día y más'] },
        { value: 'completo', title: 'Perfume completo', price: () => range('perfume'), text: 'Frascos sellados de la casa. Para regalo, también sets originales.', tag: 'Frasco sellado', bullets: ['Presentación original', 'Promos 2 x $400.000 y 2 x $285.000'] },
      ],
    },
  ];

  const state = { step: 0, answers: {} };

  /* ---------------- Render de pasos ---------------- */
  function optionView(step, o) {
    const id = `${step.key}-${o.value}`;
    const checked = state.answers[step.key] === o.value ? ' checked' : '';
    const input = `<input class="sr-only" type="radio" name="${step.key}" id="${id}" value="${o.value}"${checked}>`;
    if (step.layout === 'cards') {
      return `
      <label class="q-opt q-opt--card" for="${id}">
        ${input}
        <span class="q-opt__media${o.cover ? ' is-cover' : ''}"><img src="${o.img()}" alt="" loading="lazy" width="300" height="300"><span class="q-opt__tag ${o.tagClass || ''}">${o.tag}</span></span>
        <span class="q-opt__title">${o.title}</span>
        <span class="q-opt__text">${o.text}</span>
        <span class="q-opt__cta">Seleccionar${I('arrow_forward')}</span>
      </label>`;
    }
    if (step.layout === 'meter') {
      return `
      <label class="q-opt q-opt--meter" for="${id}">
        ${input}
        <span class="q-meter" aria-hidden="true">${[1, 2, 3].map((n) => `<span class="${n <= o.level ? 'on' : ''}"></span>`).join('')}</span>
        <span class="q-opt__title">${o.title}</span>
        <span class="q-opt__text">${o.text}</span>
        <span class="q-opt__feel">${o.feel}</span>
      </label>`;
    }
    if (step.layout === 'budget') {
      return `
      <label class="q-opt q-opt--budget" for="${id}">
        ${input}
        <span class="q-opt__ribbon">${o.tag}</span>
        <span class="q-opt__title">${o.title}</span>
        <span class="q-opt__price">${o.price()}</span>
        <span class="q-opt__text">${o.text}</span>
        <span class="q-opt__bullets">${o.bullets.map((b) => `<span>${I('check')}${b}</span>`).join('')}</span>
      </label>`;
    }
    return `
      <label class="q-opt q-opt--icon" for="${id}">
        ${input}
        <span class="q-opt__icon${o.warm ? ' is-warm' : ''}">${I(o.icon)}</span>
        <span class="q-opt__title">${o.title}</span>
        <span class="q-opt__text">${o.text}</span>
        <span class="q-opt__feel">Sensación: ${o.feel}</span>
      </label>`;
  }

  function stepView(step, i) {
    const last = i === STEPS.length - 1;
    const next = STEPS[i + 1];
    return `
    <fieldset class="quiz-step" data-step="${i}"${i === state.step ? '' : ' hidden'}>
      <legend class="quiz-step__head">
        <span class="eyebrow">Paso 0${i + 1} / 0${STEPS.length}</span>
        <span class="quiz-step__title">${step.title}</span>
        <span class="quiz-step__sub">${step.sub}</span>
      </legend>
      <div class="quiz-grid quiz-grid--${step.layout}">${step.options.map((o) => optionView(step, o)).join('')}</div>
      <p class="quiz-step__error" data-error hidden>Elige una opción para continuar.</p>
      <div class="quiz-nav">
        ${i > 0 ? `<button class="btn btn--light quiz-nav__back" type="button" data-prev>${I('arrow_back')}<span>Anterior</span></button>` : '<span></span>'}
        ${last
          ? `<button class="btn btn--dark" type="submit">${I('auto_awesome')}<span>Generar mis recomendaciones</span></button>`
          : `<button class="btn btn--dark" type="button" data-next><span>Continuar a ${next.pill}</span>${I('arrow_forward')}</button>`}
      </div>
    </fieldset>`;
  }

  function syncProgress() {
    const n = STEPS.length;
    const pct = Math.round(((state.step + 1) / n) * 100);
    document.querySelector('[data-step-text]').textContent = `Paso ${state.step + 1} de ${n} • ${STEPS[state.step].pill}`;
    document.querySelector('[data-step-pct]').textContent = `${pct}% completado`;
    document.querySelector('[data-bar]').style.width = `${pct}%`;
    document.querySelector('[role="progressbar"]').setAttribute('aria-valuenow', String(pct));
    document.querySelectorAll('[data-pill]').forEach((b) => {
      const i = Number(b.dataset.pill);
      b.classList.toggle('is-current', i === state.step);
      b.classList.toggle('is-done', state.answers[STEPS[i].key] != null && i !== state.step);
      b.disabled = i > state.step && !STEPS.slice(0, i).every((s) => state.answers[s.key]);
      if (i === state.step) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    });
  }

  function go(i, focus = true) {
    state.step = Math.max(0, Math.min(STEPS.length - 1, i));
    document.querySelectorAll('.quiz-step').forEach((f) => { f.hidden = Number(f.dataset.step) !== state.step; });
    syncProgress();
    const cur = document.querySelector(`.quiz-step[data-step="${state.step}"]`);
    cur.querySelector('[data-error]').hidden = true;
    if (focus) {
      const top = document.querySelector('[data-progress]').getBoundingClientRect().top + window.scrollY - parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) - 16;
      if (window.scrollY > top) window.scrollTo({ top, behavior: 'smooth' });
      const first = cur.querySelector('input:checked') || cur.querySelector('input');
      if (first) first.focus({ preventScroll: true });
    }
  }

  /* ---------------- Recomendación ---------------- */
  const GENDER = { hombre: { masculino: 3, unisex: 2 }, mujer: { femenino: 3, unisex: 2 }, unisex: { unisex: 3, masculino: 1, femenino: 1 }, regalo: { masculino: 1, femenino: 1, unisex: 1 } };
  const LEVEL = { suave: 1, moderada: 2, intensa: 3 };

  function recommend(a) {
    let pool;
    if (a.budget === 'decants') pool = S.byCategory('decant');
    else if (a.budget === 'combos') pool = S.byCategory('combo');
    else pool = S.products.filter((p) => p.category === 'perfume' || (a.recipient === 'regalo' && p.category === 'set'));
    pool = pool.filter((p) => p.available);

    const max = 3 + 4 + 3 + 2 + (a.recipient === 'regalo' ? 2 : 0) + 1;
    const scored = pool.map((p) => {
      let s = (GENDER[a.recipient] || {})[p.gender] || 0;
      if ((p.families || []).includes(a.family)) s += 4;
      const occ = p.occasions || [];
      if (occ.includes(a.occasion) || (a.occasion === 'fiesta' && occ.includes('noche')) || (a.occasion === 'formal' && occ.includes('noche'))) s += 3;
      const d = Math.abs((LEVEL[p.intensity] || 2) - LEVEL[a.intensity]);
      s += d === 0 ? 2 : d === 1 ? 1 : 0;
      if (a.recipient === 'regalo' && p.category === 'set') s += 2;
      if (p.notes || p.description) s += 0.5; // fichas más completas primero en empates
      if (p.tags.includes('nuevo')) s += 0.5;
      return { p, s };
    }).sort((x, y) => y.s - x.s);

    // Evitar repetir la misma fragancia en distintas presentaciones
    const out = [];
    const lines = new Set();
    for (const r of scored) {
      const k = r.p.line || r.p.slug;
      if (lines.has(k)) continue;
      lines.add(k); out.push(r);
      if (out.length === 3) break;
    }
    return out.map((r) => ({ ...r, match: Math.min(99, Math.round(55 + (r.s / max) * 44)) }));
  }

  function shortText(p) {
    const t = (p.description && p.description[0]) || '';
    const first = t.split(/(?<=\.)\s/)[0];
    return first.length > 150 ? `${first.slice(0, 147).trim()}…` : first;
  }

  function resultCard({ p, match }, i) {
    const av = S.availableSizes(p);
    const size = av.find((s) => s.ml === 5) || av[0];
    const full = p.line && p.category === 'decant' ? S.products.find((x) => x.category === 'perfume' && x.line === p.line && x.available) : null;
    const notes = p.notes ? [['Salida', p.notes.top], ['Corazón', p.notes.heart], ['Fondo', p.notes.base]].map(([k, v]) => `<span class="note-chip${k === 'Fondo' ? ' note-chip--strong' : ''}">${k}: ${S.esc(v.split(',').slice(0, 2).join(' &').trim())}</span>`).join('')
      : p.includes ? p.includes.map((k) => `<span class="note-chip">${S.esc(S.lineLabel(k).split(' · ')[0])}</span>`).join('')
        : (p.families || []).map((f) => `<span class="note-chip">${S.FAMILY_LABEL[f]}</span>`).join('');
    const label = p.category === 'decant' ? `Decant ${p.sizes.map((s) => s.ml).join(' / ')} ml` : S.CATEGORY_LABEL[p.category];
    return `
    <article class="q-result" style="animation-delay:${i * 120}ms">
      <div class="q-result__top"><span class="q-result__match">${match}% match</span><span class="q-result__brand">${S.esc(p.brand)}</span></div>
      <a class="q-result__media" href="${S.productUrl(p)}"><img src="${S.asset(p.image)}" alt="${S.esc(`${p.brand} ${p.name}`)}" loading="lazy" width="300" height="300">
        ${p.tags.includes('nuevo') ? '<span class="badge badge--dark badge--square">Nuevo</span>' : p.tags.includes('oferta') ? '<span class="badge badge--amber badge--square">Oferta especial</span>' : ''}</a>
      <h3 class="q-result__name">${S.esc(p.name)}</h3>
      <p class="q-result__desc line-clamp-2">${S.esc(shortText(p))}</p>
      <div class="q-result__notes">${notes}</div>
      <div class="q-result__prices">
        <div><span>${S.esc(label)}</span><strong>Desde ${S.cop(S.fromPrice(p))}</strong></div>
        ${full ? `<div class="is-right"><span>Perfume 100 ml</span><em>${S.cop(full.price)}</em></div>` : `<div class="is-right"><span>Garantía</span><em>100% original</em></div>`}
      </div>
      <button class="btn btn--dark btn--block btn--sm btn--upper q-result__add" type="button" data-add="${S.esc(p.slug)}" data-size="${S.esc(size.label)}">${I('shopping_bag')}<span>Añadir ${p.category === 'decant' ? `decant ${S.esc(size.label)}` : ''} al carrito</span></button>
      <div class="q-result__links">
        <a class="btn btn--soft btn--sm" href="${S.productUrl(p)}">Ver completo</a>
        <a class="btn btn--sm q-result__wa" href="${S.waLink(`Hola Perfumes Samah, hice el test olfativo y me interesa ${p.brand !== 'Perfumes Samah' ? `${p.brand} ` : ''}${p.name}.`)}" target="_blank" rel="noopener">${I('chat')}<span>Pedir WhatsApp</span></a>
      </div>
    </article>`;
  }

  function label(stepKey, value) { const st = STEPS.find((s) => s.key === stepKey); const o = st && st.options.find((x) => x.value === value); return o ? o.title : value; }

  function showResults() {
    const form = document.querySelector('[data-quiz]');
    const loader = document.querySelector('[data-loader]');
    const results = document.querySelector('[data-results]');
    form.hidden = true; loader.hidden = false; results.hidden = true;
    document.querySelector('[data-progress]').classList.add('is-complete');
    document.querySelector('[data-step-text]').textContent = 'Test completado';
    document.querySelector('[data-step-pct]').textContent = '100% completado';
    document.querySelector('[data-bar]').style.width = '100%';

    const list = recommend(state.answers);
    const a = state.answers;
    setTimeout(() => {
      loader.hidden = true; results.hidden = false;
      document.querySelector('[data-summary]').innerHTML = ['recipient', 'family', 'occasion', 'intensity', 'budget'].map((k) => `<span class="note-chip">${S.esc(label(k, a[k]))}</span>`).join('');
      document.querySelector('[data-results-grid]').innerHTML = list.length ? list.map(resultCard).join('')
        : '<div class="empty-state"><h3>No encontramos coincidencias exactas</h3><p>Ajusta tus respuestas o escríbenos para una recomendación personalizada.</p></div>';
      const msg = `Hola Perfumes Samah, acabo de hacer el test olfativo (${['recipient', 'family', 'occasion', 'intensity', 'budget'].map((k) => label(k, a[k])).join(', ')}) y quiero asesoría personalizada.`;
      document.querySelector('[data-advisor]').href = S.waLink(msg);
      results.focus({ preventScroll: true });
      const top = results.getBoundingClientRect().top + window.scrollY - parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }, 900);
  }

  /* ---------------- Arranque ---------------- */
  S.ready(() => {
    const form = document.querySelector('[data-quiz]');
    if (!form) return;
    form.innerHTML = STEPS.map(stepView).join('');
    document.querySelector('[data-pills]').innerHTML = STEPS.map((s, i) => `<li><button type="button" class="quiz-pill" data-pill="${i}">${i + 1}. ${s.pill}</button></li>`).join('');
    const combos = S.byCategory('combo').filter((p) => p.available).map((p) => S.fromPrice(p));
    document.querySelectorAll('[data-combo-from]').forEach((el) => { el.textContent = S.money(Math.min(...combos)); });
    syncProgress();

    form.addEventListener('change', (e) => {
      if (e.target.type !== 'radio') return;
      state.answers[e.target.name] = e.target.value;
      syncProgress();
      const i = STEPS.findIndex((s) => s.key === e.target.name);
      if (i < STEPS.length - 1 && !e.target.closest('form').dataset.noAuto) setTimeout(() => { if (state.step === i) go(i + 1); }, 380);
    });
    // Teclado: las flechas mueven la selección sin avanzar automáticamente
    form.addEventListener('keydown', (e) => { if (e.key.startsWith('Arrow')) { form.dataset.noAuto = '1'; setTimeout(() => { delete form.dataset.noAuto; }, 50); } });

    form.addEventListener('click', (e) => {
      if (e.target.closest('[data-prev]')) go(state.step - 1);
      if (e.target.closest('[data-next]')) {
        if (!state.answers[STEPS[state.step].key]) { form.querySelector(`[data-step="${state.step}"] [data-error]`).hidden = false; return; }
        go(state.step + 1);
      }
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const missing = STEPS.findIndex((s) => !state.answers[s.key]);
      if (missing >= 0) { go(missing); form.querySelector(`[data-step="${missing}"] [data-error]`).hidden = false; return; }
      showResults();
    });
    document.querySelector('[data-pills]').addEventListener('click', (e) => {
      const b = e.target.closest('[data-pill]');
      if (b && !b.disabled) { if (form.hidden) restart(); go(Number(b.dataset.pill)); }
    });
    // "Ajustar respuestas": vuelve al paso 1 conservando lo elegido
    function restart() {
      form.hidden = false;
      document.querySelector('[data-results]').hidden = true;
      document.querySelector('[data-progress]').classList.remove('is-complete');
      go(0);
    }
    document.querySelector('[data-restart]').addEventListener('click', () => restart());
  });
})();
