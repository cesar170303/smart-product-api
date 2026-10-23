# Changelog

Resumen breve de cada feature y de los fallos que han ido saliendo. Formato inspirado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y versionado [SemVer](https://semver.org/lang/es/) (`0.x` mientras el proyecto esté a medias).

La versión del proyecto vive en [`frontend/package.json`](frontend/package.json) (es el único `package.json`). Cada entrada tiene tres bloques opcionales:

- **Añadido / Cambiado**: qué se hizo, en una o dos líneas.
- **Corregido**: fallos que se arreglaron en esa versión.
- **Fallos conocidos**: problemas que se detectaron y siguen abiertos al cerrar esa versión.

## Fallos conocidos abiertos

> Salen del apartado "Pendientes" de `CLAUDE.md` y de lo visto en el repo. Verifica cada uno antes de darlo por cierto y bórralo de aquí cuando se resuelva.

- No hay migraciones (Alembic): las tablas se crean con `create_all`, así que cambiar un modelo (o añadir un índice) no actualiza una BD ya existente. Para el índice de mensajes de 0.8.0 en una base que ya tenía la tabla: `CREATE INDEX IF NOT EXISTS ix_messages_conversation ON messages (product_id, buyer_id, id);`
- CORS solo permite `localhost:5173` y `127.0.0.1:5173`.
- Tests del backend: solo cubren el chat y los productos (`backend/tests`, con `unittest`); faltan pedidos y autenticación.
- Las fotos que se suben y luego no llegan a publicarse (el anuncio falla o el vendedor cambia de foto) quedan en `backend/uploads`: no hay endpoint ni tarea que las limpie.
- La IA puede devolver variantes de una misma categoría ("Deporte" / "Deportes"), que parten los filtros del listado.
- El pedido solo trae `buyer_id`: Mis ventas muestra "comprador nº N" en vez del nombre.
- `ProductNotFoundException` responde en inglés ("Product with ID n not found"); el resto de errores, en español.

## [0.8.0] - 2026-10-23

### Añadido / Cambiado
- **Mensajería entre usuarios**: conversaciones y mensajes por producto (`GET /conversations`, `GET`/`POST /products/{id}/messages`), con su modelo, repositorio y casos de uso. El chat del frontend consulta las novedades cada 3 s (`after_id`); los WebSockets quedan para más adelante.
- **Frontend reescrito en TypeScript** con `react-router-dom`, Tailwind 4 vía `@tailwindcss/vite` y fuentes Bricolage Grotesque / Hanken Grotesk.
- Páginas nuevas: listado, detalle de producto, entrar y crear cuenta, subida de producto con vista previa, Mis ventas y chat; más `RequireAuth` y contexto de autenticación.
- Tests con Vitest para páginas y componentes; `npm run typecheck` y `build` con `tsc --noEmit`.
- Se eliminan `autoprefixer` y `postcss` (Tailwind 4 ya no los necesita).
- **El precio publicado es el que escribe el vendedor**: `POST`/`PUT /products` ya no recalculan el precio según la categoría (IVA, descuentos, márgenes). `services/pricing.py` se conserva como ejemplo del patrón *Strategy*, pero ningún endpoint lo usa.
- `GET /products` admite `?seller_id=` para pedir solo los anuncios de un vendedor (Mis ventas y el recuento de la ficha ya no descargan todo el catálogo).
- Límites de peticiones: las lecturas de `/products` tienen su propio contador (120/min por IP); las escrituras siguen en 30/min.

### Corregido
- Borrar un anuncio con conversaciones fallaba con un 500 (la clave foránea de `messages`): ahora se borran sus mensajes con el anuncio. Un anuncio con pedidos sigue sin poder borrarse.
- Chat: enviar un mensaje antes de que cargara el historial podía dejar sin mostrar los mensajes anteriores si esa carga fallaba; y un fallo suelto en una conversación vacía la tapaba con una pantalla de error.
- La sesión se cierra sola cuando el token caduca, en lugar de seguir pareciendo abierta hasta recibir un 401.
- Índice compuesto `ix_messages_conversation (product_id, buyer_id, id)` para la consulta que repite cada chat abierto.

## [0.7.0] - 2026-10-23

### Añadido
- Página de registro en el frontend (`RegisterPage`) conectada a `POST /register`.

## [0.6.0] - 2026-10-23

### Añadido
- **Subida de fotos de producto** (`POST` de imagen, `services/image_storage.py`): se validan y se guardan en disco, y se borran al actualizar o eliminar el producto.
- Frontend mínimo: listado de productos (`ProductCard`), formulario con foto y utilidades de sesión.

### Corregido
- La vista previa de la foto se dibuja en un `<canvas>` en vez de usar `<img src>`.

## [0.5.0] - 2026-10-23

### Cambiado
- **Backend reestructurado como marketplace de segunda mano** con 4 tablas (`users`, `categories`, `products`, `orders`).
- Roles `user` / `admin` y permisos (`core/permissions.py`): solo el dueño o un admin gestiona un producto.
- Pedidos: crear, listar, ver y cambiar de estado, con reglas de compra.
- La categoría ya no es texto libre: se resuelve contra la tabla `categories` (con Gemini como apoyo si llega vacía).

## [0.4.0] - 2026-10-21

### Corregido
- `POST /register` ya no devuelve `hashed_password`.
- El JWT se valida entero (firma, caducidad y `sub`) en las rutas protegidas.
- Si Gemini falla, da timeout o responde algo inservible, el producto se guarda con categoría `"General"` en vez de romper.
- `ACCESS_TOKEN_EXPIRE_MINUTES` se valida al arrancar.
- Dependencias vulnerables actualizadas (alertas de Dependabot); se quita `google-generativeai`.

### Cambiado
- `requirements.txt` unificado en la raíz (UTF-8); README y `SECURITY.md` al día.

## [0.3.0] - 2026-10-16

### Añadido
- Rate limiting con `slowapi`: `/login` 5/min por IP y `/products` con contador compartido.
- Repositorio base (`BaseRepository`) y reglas de lint para limpiar code smells.
- Utilidad `calculate` del carrito y componente `Counter`, con tests de Vitest.

### Fallos conocidos
- El límite de `/products` cuenta también los `GET` y es demasiado estricto para un frontend.

## [0.2.0] - 2026-10-03

### Añadido
- Frontend inicial con React, Vite y Tailwind, con página de login y cliente de API.

### Cambiado
- Imports del backend sin prefijo `backend.`; hay que ejecutarlo desde `backend/`.

## [0.1.0] - 2026-09-08

### Añadido
- API de inventario con FastAPI y PostgreSQL: CRUD de productos, registro y login con JWT y Argon2.
- Arquitectura por capas (router → use_cases → repository) y motor de precios con patrón Strategy.
- Clasificación de productos con Gemini cuando no llega categoría.
- Documentación en README y política `SECURITY.md`.

### Fallos conocidos
- `/register` filtraba `hashed_password` y el JWT no se validaba bien (corregidos en 0.4.0).
