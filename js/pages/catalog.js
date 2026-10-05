/* Perfumes Samah — Configuración de los listados (Perfumes, Decants, Sets de regalo) */
(function () {
  'use strict';
  const S = window.Samah;

  const CONFIGS = {
    perfumes: {
      base: (p) => p.category === 'decant' || p.category === 'perfume',
      chips: [
        { id: 'todos', label: 'Todos' },
        { id: 'decants', label: 'Decants', test: (p) => p.category === 'decant' },
        { id: 'completos', label: 'Frasco completo', test: (p) => p.category === 'perfume' },
        { id: 'nuevos', label: 'Nuevos', test: (p) => p.tags.includes('nuevo') },
        { id: 'arabes', label: 'Árabes', test: (p) => p.tags.includes('arabe') },
        { id: 'ofertas', label: 'En oferta', test: (p) => p.tags.includes('oferta') || p.tags.some((t) => t.startsWith('promo-')) },
      ],
      facets: ['gender', 'family', 'occasion', 'brand', 'price'],
    },
    decants: {
      base: (p) => p.category === 'decant',
      facets: ['gender', 'family', 'occasion', 'brand', 'price'],
    },
    sets: {
      base: (p) => p.category === 'set',
      facets: ['gender', 'family', 'brand', 'price'],
    },
  };

  S.ready(() => {
    const cfg = CONFIGS[document.body.dataset.page];
    if (cfg) S.catalog.init(cfg);
  });
})();
