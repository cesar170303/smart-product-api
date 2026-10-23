# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Uso real previsto:** el dueño o los empleados de una tienda que gestionan su catálogo de productos en el día a día: dar de alta artículos, corregirlos y retirarlos.
- **Uso actual:** proyecto de portfolio / máster de César. Hoy quien lo usa es alguien que lo evalúa en una demo (reclutador, tribunal), así que tiene que funcionar y entenderse de punta a punta sin explicaciones.
- Se construye como si fuera para la tienda real; la demo no justifica atajos que una tienda real no aceptaría.

## Product Purpose

Quitar dos tareas manuales y propensas a errores al gestionar un catálogo:

1. **Clasificar productos**: si no se indica categoría, Gemini la infiere a partir del nombre.
2. **Calcular el precio final**: se aplica la regla de precios de la categoría (IVA, descuentos, márgenes) de forma consistente.

Éxito: el usuario escribe nombre y precio, guarda, y obtiene un producto categorizado y con su precio final correcto, sin pensar en reglas.

## Positioning

Una sola acción de guardado hace las dos cosas: la IA pone la categoría y el motor de precios (patrón Strategy, una regla por categoría) calcula el precio final. Un CRUD de inventario genérico no hace ninguna de las dos.

## Operating Context

- Superficie de frontend acordada: **panel de gestión** privado tras el login (crear, editar, borrar productos; ver la categoría asignada y el precio final). Hoy solo existe la página de login (`frontend/src/pages/LoginPage.jsx`).
- No hay otras superficies decididas: ni catálogo público ni pantalla de registro en el frontend, aunque la API tenga `GET /products` público y `POST /register`.
- Flujo de autenticación: `POST /login` (OAuth2 password form) devuelve un JWT; las escrituras en `/products` piden `Authorization: Bearer`.

## Capabilities and Constraints

- **API** (FastAPI, `http://localhost:8000`): `POST /register`, `POST /login`, `GET /products`, `GET /products/{id}`, `POST/PUT/DELETE /products` (con token).
- **Producto**: `name` (mín. 3 caracteres), `price` (> 0), `category` (texto libre). La respuesta pública (`ProductPublic`) no incluye `provider_secret_cost`, y la UI tampoco debe mostrarlo.
- **Precio**: el `price` guardado y devuelto ya es el precio final tras aplicar la regla; el precio base no se conserva por separado.
- **Reglas de precio** (`backend/services/pricing.py`): Tecnología +21 % IVA · Deporte −10 % · Ofertas −5 € con mínimo 1 € · Premium +25 % · cualquier otra categoría (incluida General) sin cambios. Las categorías se comparan sin acentos y en minúsculas.
- **Categoría por IA**: la IA puede devolver cualquier palabra (Lácteos, Limpieza…), no solo las cinco con regla. Si Gemini falla o responde algo inútil, se usa `General`.
- **Límite de peticiones**: los endpoints de `/products` comparten 5 peticiones por minuto por IP (`429` con mensaje en español).
- **Errores**: JSON en español con clave `mensaje` (y `detalles` en los 422).
- **Frontend**: React 19 + Vite + Tailwind CSS 3. `API_BASE_URL` está hardcodeada en `frontend/src/api/client.js`. CORS solo admite `localhost:5173` / `127.0.0.1:5173`.
- **Sin decidir**: despliegue, roles de usuario (hoy cualquier usuario autenticado puede escribir), y si el precio base debería guardarse.

## Brand Commitments

- Nombre del proyecto: **Smart Product** (README: "Smart Product API").
- Toda la interfaz va en **español**, con el mismo registro que los mensajes de la API.
- Moneda **euro (€)** y formato numérico español.
- No hay logo, marca visual ni voz definida más allá de esto.

## Evidence on Hand

- README con la descripción funcional, endpoints y tabla de reglas de precio (`README.md`).
- No hay datos reales de productos, capturas, testimonios, clientes ni métricas. No inventarlos: los ejemplos de demo deben presentarse como ejemplos.
- `frontend/src/assets/hero.png`, `react.svg`, `vite.svg` y `components/Counter.jsx` son restos de la plantilla de Vite, no material de marca.

## Product Principles

1. **La IA y el motor de precios se ven.** El usuario debe saber qué categoría se asignó (y si la puso la IA o él) y qué regla dio el precio final.
2. **Tienda real primero, demo después.** Cada pantalla tiene que aguantar el uso diario; si funciona para la tienda, funciona para la demo.
3. **Los fallos no bloquean.** Si la IA falla se guarda con `General`; si la API devuelve 401, 404, 422 o 429, la UI explica qué pasó en español y qué hacer.
4. **Nada interno a la vista.** Lo que la API no expone (`provider_secret_cost`, hashes) tampoco aparece en la interfaz.

## Accessibility & Inclusion

- Objetivo: **WCAG AA** (se asume la versión 2.2 mientras no se diga otra; contraste, uso completo con teclado, etiquetas para lectores de pantalla, mensajes de error asociados a sus campos).
- El panel de gestión tiene que ser **usable en móvil**, no solo en escritorio.
