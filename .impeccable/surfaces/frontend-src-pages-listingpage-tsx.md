---
version: 1
slug: "frontend-src-pages-listingpage-tsx"
primary_target: "frontend/src/pages/ListingPage.tsx"
related_targets: []
---

# Kambio — listado de productos (pantalla 1)

Mode: Operate. Escritorio solamente por ahora. Esta dirección visual rige también el resto de pantallas de Kambio (ficha, login, subida, Mis ventas, chat) hasta que César cambie el mundo.

Audiencia, tarea, contenido: gente joven que busca o vende cosas de segunda mano. Tarea: encontrar un anuncio (buscar, filtrar por categoría) y abrir su ficha. Contenido real: `GET /products` (foto, precio, nombre, estado, categoría, vendedor). Estados a cubrir: cargando, vacío, sin resultados de búsqueda, error de API, 429.

## Direction contract

THESIS: Un solo mundo, la risografía a una tinta: Kambio se imprime en violeta sobre papel negro con el registro un punto desplazado. Rechaza el aspecto de marketplace oscuro genérico (tarjetas grises redondeadas, sombras suaves, Inter).

OWN-WORLD: Papel #0F0E13, superficies #17151D con filete de 1,5 px #2C2838, tinta violeta #8B5CF6 con su segunda pasada #5B34C9 como sombra de registro, texto #F2EFFA. Títulos y precios en Bricolage Grotesque pesada; texto en Hanken Grotesk. Sin fotos: trama de puntos violeta (halftone). Estados: En venta violeta lleno, Pendiente de envío ámbar con borde, Vendido gris punteado. Las fotos reales nunca se tiñen ni se tramán.

STORY: Quien entra ve de un vistazo qué hay a la venta y cuánto cuesta; el precio es lo primero que se lee y el estado nunca se esconde. Al buscar, la rejilla responde sin saltos. Para comprar, chatear o subir se pide cuenta justo en ese momento.

FIRST VIEWPORT: Cabecera de 48 px: logotipo "Kambio" (tinta doble) a la izquierda, buscador que ocupa el ancho, botón violeta "+ Subir producto" a la derecha. Debajo, fila de chips de categoría (Todo + categorías reales). Luego rejilla de 3 columnas (1304 px, hueco 24): tarjeta con foto de 236 px de alto, precio en título pesado con sombra de registro, nombre, etiqueta de estado. Contador "Mostrando N de M anuncios" al pie de la rejilla. Signature move: el registro: el precio y el logotipo llevan una segunda pasada violeta desplazada; al enfocar o pasar sobre una tarjeta la pasada se "encaja" (offset 0) y la tarjeta pasa a filete violeta.

FORM: Tinta Riso, posición 7 de mi lista de siete direcciones. seed:83a00330411d4cfd

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
