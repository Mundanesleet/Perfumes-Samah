/* Perfumes Samah — Home: secciones con datos del catálogo */
(function () {
  'use strict';
  const S = window.Samah;

  // Combos y favoritos destacados (productos reales del catálogo)
  const HOME_COMBOS = ['combo-cita', 'combo-clean', 'combo-dupe-copia', 'combo-diario-tropical-1', 'combo-nicho-1', 'combo-colegio-1'];
  const FAVORITES = [
    { slug: 'percival-parfums-de-marly', badge: 'Nicho' },
    { slug: 'preventa-9pm-night-out-afnan' },
    { slug: 'rasasi-hawas-fire' },
    { slug: 'xj-naxos-1861-xerjoff', badge: 'Nicho' },
  ];

  /** Precio mínimo real por tamaño de decant (solo presentaciones disponibles) */
  function minDecantPrice(ml) {
    const prices = S.byCategory('decant').flatMap((p) => p.sizes.filter((s) => s.ml === ml && s.available).map((s) => s.price));
    return prices.length ? Math.min(...prices) : null;
  }

  S.ready(() => {
    document.querySelectorAll('[data-size-from]').forEach((el) => {
      const v = minDecantPrice(Number(el.dataset.sizeFrom));
      el.textContent = v ? S.money(v) : 'Consultar';
    });

    const feat = S.bySlug('xj-naxos-1861-xerjoff');
    const featBox = document.querySelector('[data-hero-feature]');
    if (feat && featBox) {
      featBox.innerHTML = `
        <div>
          <span class="hero__card-tag">Novedad disponible</span>
          <p class="hero__card-name">${S.esc(feat.name)}</p>
          <p class="hero__card-brand">${S.esc(feat.brand)} • Eau de Parfum</p>
        </div>
        <div class="hero__card-price">
          <span>Decant ${S.esc(feat.sizes[0].label)}</span>
          <strong>${S.money(feat.sizes[0].price)}</strong>
        </div>`;
    }

    const rail = document.querySelector('[data-home-combos]');
    if (rail) {
      rail.innerHTML = HOME_COMBOS.map(S.bySlug).filter(Boolean).map((p) => S.components.comboTile(p)).join('');
    }

    const fav = document.querySelector('[data-home-favorites]');
    if (fav) {
      fav.innerHTML = FAVORITES.map((f) => {
        const p = S.bySlug(f.slug);
        return p ? S.components.productCard(p, { badge: f.badge }) : '';
      }).join('');
      S.observeReveal(fav);
    }
  });
})();
