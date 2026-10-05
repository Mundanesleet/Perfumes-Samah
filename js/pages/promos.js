/* Perfumes Samah — Promociones (solo datos reales del catálogo: colecciones 2x y precios rebajados) */
(function () {
  'use strict';
  const S = window.Samah;

  S.ready(() => {
    document.querySelectorAll('[data-promo]').forEach((grid) => {
      const tag = grid.dataset.promo;
      let list = S.products.filter((p) => p.tags.includes(tag));
      if (tag === 'oferta') {
        list = list.filter((p) => p.category === 'decant');
        grid.innerHTML = list.map((p) => {
          const size = p.sizes.find((s) => s.compareAt && s.available) || p.sizes.find((s) => s.compareAt);
          return S.components.productCard(p, { size: size.label });
        }).join('');
      } else {
        list = list.filter((p) => p.available).concat(list.filter((p) => !p.available));
        grid.innerHTML = list.map((p) => S.components.productCard(p)).join('');
      }
      S.observeReveal(grid);
    });
  });
})();
