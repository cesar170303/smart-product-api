# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React 19 + TypeScript + Tailwind CSS (decidido por César). Vite como bundler. Frontend y backend conviven en la misma carpeta (`frontend/` y `backend/`). Por ahora solo escritorio: no hace falta diseño responsive para móvil.

## Users

- **Público objetivo:** gente joven que compra y vende objetos de segunda mano entre particulares (estilo Wallapop): ropa, tecnología, muebles, deporte.
- **Quien visita sin cuenta:** puede ver el listado y las fichas de producto. Se le pide iniciar sesión o registrarse solo al comprar, chatear con el vendedor o subir un producto.
- **Quien vende:** sube anuncios, los ve en "Mis ventas" y avanza su estado hasta cerrar la venta.
- **Uso actual:** proyecto de portfolio / máster de César; quien lo evalúa en una demo tiene que entenderlo de punta a punta sin explicaciones. Se construye como un marketplace real.

## Product Purpose

Que dos particulares se pongan de acuerdo y cierren una compraventa sin fricción: el vendedor sube un artículo en un minuto, el comprador lo encuentra, lo reserva y habla con el vendedor, y ambos ven en qué punto está la venta.

Éxito: un anuncio subido aparece en el listado, se puede comprar, pasa a "Pendiente de envío" y el vendedor lo cierra como "Vendido", con todo el estado visible en pantalla.

## Positioning

Dos cosas que un marketplace de segunda mano genérico no hace:

1. **La IA pone la categoría.** Si el vendedor deja la categoría vacía al subir, Gemini la asigna (si falla, queda "General" y el anuncio se guarda igual).
2. **Estados claros de la venta.** Cada artículo pasa por En venta → Pendiente de envío → Vendido, y el vendedor lo gestiona desde "Mis ventas".

## Operating Context

- Autenticación: `POST /login` (OAuth2 password form, el campo `username` lleva el email) devuelve un JWT; `POST /register` recibe JSON con `name`, `email`, `password` (mín. 8) y `location` opcional.
- Compra: `POST /orders` con `product_id` crea un pedido pendiente (el producto pasa a reservado). El vendedor lo completa (producto vendido) o cualquiera de las dos partes lo cancela (el producto vuelve a estar disponible). Completado y cancelado son finales.
- Correspondencia de estados en pantalla: `available` = **En venta**, `reserved` (pedido pendiente) = **Pendiente de envío**, `sold` = **Vendido**.

## Capabilities and Constraints

- **API** (FastAPI, `http://localhost:8000`, configurable con `VITE_API_URL`): `POST /register`, `POST /login`, `GET /products`, `GET /products/{id}` (públicos), `POST/PUT/DELETE /products` (con token), `POST /uploads` (foto), `GET /orders`, `GET /orders/{id}`, `POST /orders`, `PATCH /orders/{id}/status` (todos con token). Las fotos se sirven en `/media/<archivo>`.
- **Producto** (`ProductRead`): `id`, `name`, `description`, `price`, `image_url` (una sola foto), `status`, `created_at`, `category {…}`, `seller {id, name, location}`. Para crear: `name` (mín. 3), `description`, `price` (> 0), `image_url` (la ruta que devuelve `/uploads`), `category` opcional.
- **Pedido** (`OrderRead`): `id`, `buyer_id`, `status` (`pending`/`completed`/`cancelled`), `created_at`, `product`. `GET /orders` devuelve los pedidos en los que participas (como comprador o vendedor).
- **No existe todavía en el backend:** buscador (`?q=`; se filtra en el cliente), endpoint de "mi usuario" (el id sale del claim `sub` del JWT), varias fotos por producto, valoraciones o número de ventas del vendedor, y **chat** (hay que construirlo en el backend antes de la pantalla 6).
- **Límite de peticiones:** `/products` 30/min por IP, `/orders` 20/min, `/login` 5/min (`429` con mensaje en español).
- **Errores:** JSON en español con clave `mensaje` (y `detalles` en los 422).
- CORS solo admite `localhost:5173` y `127.0.0.1:5173`.

## Brand Commitments

- Nombre de la marca: **Kambio** (el Figma de referencia usa "Smart Product" como logotipo provisional; el nombre del repositorio y de la API sigue siendo Smart Product).
- Toda la interfaz va en **español**, con el mismo registro que los mensajes de la API. Moneda **euro (€)** y formato numérico español.
- Restricciones visuales que César fijó expresamente: **modo oscuro** (fondo casi negro o gris muy oscuro), **violeta eléctrico `#8B5CF6`** como acento (botones, enlaces, etiquetas de estado), sensación **moderna y fresca**. Quiere personalidad propia y evitar el aspecto genérico de IA. El Figma (`ZrK4ZfeWoe8ljJFfVqSbbf`, opción violeta y ficha de producto) es referencia de **estructura**, no de diseño final.

## Evidence on Hand

- Figma de referencia: cabecera (logotipo, buscador, "+ Subir producto"), rejilla de tarjetas (foto, precio, nombre, etiqueta de estado) y ficha de producto (galería, estado, precio, título, ubicación y antigüedad, descripción, Comprar, Chatear, vendedor).
- Los datos del Figma (Bicicleta urbana, iPhone 12, "Laura M. ★ 4,8 · 23 ventas") son ejemplos de maqueta, no datos reales. No hay valoraciones reales: no inventarlas en la interfaz.
- Existe un frontend previo en JavaScript (`frontend/src/pages/LoginPage.jsx`, `RegisterPage.jsx`, `ProductsPage.jsx`, `components/ProductForm.jsx`) con estilo provisional; se sustituye pantalla a pantalla, pasando a TypeScript.
- No hay logotipo ni fotos de marca. Los ejemplos de demo se presentan como ejemplos.

## Product Principles

1. **El estado de la venta siempre se ve.** En listado, ficha y "Mis ventas", el estado (En venta, Pendiente de envío, Vendido) es información de primer nivel, no un detalle.
2. **Mirar es libre; actuar pide cuenta.** Nadie necesita cuenta para ver; el login aparece justo al comprar, chatear o subir, y devuelve a la persona a lo que estaba haciendo.
3. **Nada se inventa.** Si el backend no lo da (valoraciones, ventas del vendedor, varias fotos), la interfaz no lo aparenta.
4. **Los fallos no bloquean.** Si la IA falla se guarda como "General"; los errores 401, 404, 409, 422 y 429 se explican en español y dicen qué hacer.

## Accessibility & Inclusion

- Objetivo: **WCAG AA** (contraste en modo oscuro, uso completo con teclado, etiquetas para lectores de pantalla, errores asociados a sus campos, foco visible).
- Por ahora **solo escritorio**; el uso en móvil queda fuera del alcance actual.
