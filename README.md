# Perfumes Samah — Demo frontend (etapa 1)

Sitio estático, responsive y mobile-first que implementa el diseño aprobado en Google Stitch
(proyecto **"Perfumes Samah Redesign"**). Es una demo para validar diseño y experiencia con el
cliente: **no hay backend, base de datos, login, pagos ni pedidos reales.**

- HTML5 + CSS3 + JavaScript (scripts clásicos, sin build ni dependencias).
- Funciona en GitHub Pages dentro de una subcarpeta (`usuario.github.io/repositorio/`): todas las rutas son relativas.
- Carrito con `localStorage`; el pedido se envía como mensaje de WhatsApp al 311 8935666.

## Ejecutar en local

Cualquier servidor estático sirve (recomendado para que `localStorage` y las rutas se comporten como en producción):

```bash
python -m http.server 8080        # luego abrir http://localhost:8080/
# o
npx serve .
```

## Publicar en GitHub Pages

1. Subir el contenido de esta carpeta a la rama `main` del repositorio.
2. *Settings → Pages → Build and deployment*: **Deploy from a branch**, rama `main`, carpeta `/ (root)`.
3. El archivo `.nojekyll` ya está incluido para que Pages sirva los archivos tal cual.

Cuando exista el dominio definitivo, conviene cambiar `og:image` por una URL absoluta (las redes sociales no resuelven rutas relativas).

## Estructura

```
index.html                    Home
pages/
  encuentra-tu-perfume.html   Quiz de 5 pasos con recomendaciones
  perfumes.html               Catálogo (decants + frascos completos) con filtros y orden
  decants.html                Decants por presentación (3 / 5 / 10 / 30 ml)
  combos.html                 Combos por ocasión
  sets-regalo.html            Sets de regalo
  promociones.html            Promos reales 2 x $400.000 / 2 x $285.000 y decants rebajados
  producto.html               Detalle: producto.html?p=<slug>&s=<presentación>
  carrito.html                Carrito (localStorage) + pedido por WhatsApp
css/
  variables.css               Tokens del sistema de diseño de Stitch (colores, tipografía, radios, sombras)
  global.css                  Reset, tipografía, layout, utilidades, animaciones
  components.css              Header, menú, tab bar, footer, botones, tarjetas, chips, toast…
  pages.css                   Estilos por página (base móvil)
  responsive.css              Ampliaciones tablet/desktop (640 / 768 / 1024 / 1280)
js/
  products.js                 Catálogo (GENERADO — ver "Datos")
  main.js                     Namespace Samah: rutas, formato COP, WhatsApp, toast, revelado al scroll
  components.js               Header, drawer, tab bar, footer, botón de asesoría, ProductCard, ComboTile
  cart.js                     Carrito: añadir, cantidades, eliminar, subtotal, mensaje de WhatsApp
  filters.js                  Motor de catálogo: facetas, búsqueda, orden y estado en la URL
  quiz.js                     Quiz y algoritmo de recomendación (en el navegador)
  pages/                      Lógica de cada página (home, catalog, combos, promos, product, cart)
assets/
  images/products/            Fotos oficiales de los productos (WebP, desde la tienda)
  images/editorial/           Banners e imágenes editoriales
  logo/                       Logo y favicons
tools/catalog/                Herramienta de desarrollo para regenerar products.js (no se publica como página)
```

Cada página solo declara `<div id="app-header">` y `<div id="app-footer">`; `components.js` inyecta el
mismo header, menú, footer y navegación inferior en todas, y `data-root` en `<body>` resuelve las rutas.

## Datos

`js/products.js` se generó desde el catálogo público de **perfumessamah.com** (162 productos: 42 decants,
40 perfumes completos, 61 combos, 19 sets) con precios en COP, presentaciones reales, disponibilidad,
descripciones, notas y fotos oficiales. Modelo de cada producto:

```js
{
  id, slug, name, brand,
  category: 'decant' | 'perfume' | 'combo' | 'set',
  price,              // "desde" (presentación disponible más barata)
  available, image, gallery: [...],
  sizes: [{ label: '5 ml', ml: 5, price, compareAt?, available }],
  tags: ['nuevo', 'arabe', 'oferta', 'promo-2x400', ...],
  gender, families: [...], occasions: [...], intensity,   // usados por filtros y quiz
  description: [...], notes?: { top, heart, base }, longevity?, projection?,
  includes?: [...]    // combos: líneas olfativas incluidas
}
```

Para actualizar el catálogo desde la tienda:

```bash
node tools/catalog/fetch.js && node tools/catalog/build.js
```

En la siguiente etapa basta con reemplazar `window.SAMAH_PRODUCTS` por una llamada a la API manteniendo este formato.

## Decisiones frente al diseño de Stitch

- **Home**: el proyecto de Stitch tiene dos versiones del Inicio. Se usó como estructura la pantalla
  *Inicio – Mobile* cuyas secciones coinciden con el brief (Perfumería de lujo → categorías → Encuentra tu
  perfume → Prueba antes de comprar → Combos → Los favoritos → Sets → Confianza → CTA → Footer). En desktop
  se aplican el header, footer y la composición del hero de las pantallas desktop de Stitch.
- **Contenido real en lugar del de ejemplo**: Stitch traía productos y precios ficticios (Creed Aventus,
  Tom Ford, Baccarat…). Se reemplazaron por productos reales de la tienda. Los "desde" de 3/5/10 ml se
  calculan del catálogo real.
- **Datos inventados retirados** (no están en la tienda): calificaciones y número de reseñas, montos de
  "Ahorra $…", umbral de envío gratis, costo de envío fijo, precio del empaque de regalo, lista de medios de
  pago, porcentajes de acierto y transportadoras. El envío se muestra como "se confirma por WhatsApp".
- **Sin funciones fuera de alcance**: se quitaron los iconos de favoritos y de cuenta del header (no hay
  wishlist ni login) y el botón "Continuar con el pago" (no hay checkout): el pedido se cierra por WhatsApp.
- **Legibilidad y accesibilidad**: textos de 9 px del diseño subieron a 10 px; los botones que en Stitch usan
  una clase inexistente (`h-13`) tienen 52 px de alto; objetivos táctiles ≥ 40 px en móvil.
- La foto del hero móvil es la imagen editorial del diseño de Stitch (no representa un producto); la
  tarjeta del hero desktop usa la foto oficial de XJ Naxos 1861.

## Puntos a validar con el cliente

- La clasificación de género, familia, ocasión e intensidad (filtros y quiz) se redactó a partir de las
  descripciones de la tienda; conviene que el cliente la revise.
- La promoción 2 x $400.000 / 2 x $285.000 indica vigencia del 1/09/26 al 30/09/26 en el banner oficial.
- Datos de la tienda con inconsistencias que se dejaron fuera: la descripción del set *Mini Yaras 25 ml*
  (es la de Game of Spades Royale) y un duplicado de *Odyssey Aqua 100 ml* con la descripción de otro producto.

## Fuera de alcance en esta etapa

Backend, base de datos, API, autenticación, pagos, inventario real, panel administrativo y sistema de pedidos.
