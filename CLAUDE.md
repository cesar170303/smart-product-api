# Kambio (repositorio `smart_product_app`)

Marketplace de segunda mano entre particulares, estilo Wallapop. Proyecto de portfolio y máster de César: tiene que entenderse de punta a punta en una demo. La marca es **Kambio**; el repo y la API siguen llamándose *Smart Product*.

> Estado actual, pendientes y fallos conocidos: [project_memory.md](project_memory.md). Aquí solo va lo que cambia poco.

## Qué hace la app

- **Sin cuenta:** ver el listado y las fichas de producto.
- **Con cuenta:** registrarse (`/registro`), iniciar sesión (`/login`), subir un producto con foto (`/subir`), comprar, chatear con el vendedor (`/chat`) y ver sus ventas (`/mis-ventas`).
- **Compra:** `POST /orders` crea un pedido `pending` y el producto pasa a `reserved`. Lo completa el vendedor (producto `sold`) o lo cancela el comprador, el vendedor o un admin (producto vuelve a `available`). `completed` y `cancelled` son finales.
- **Estados en pantalla:** `available` = En venta · `reserved` = Pendiente de envío · `sold` = Vendido.
- **Editar o borrar un producto:** solo su dueño o un admin (`core/permissions.py`, `ensure_can_manage_product`).
- **Categoría:** si el vendedor la deja vacía, Gemini la asigna. Si falla, queda `"General"` y el producto se guarda igual.
- **Roles:** `user` (por defecto) y `admin`. Nadie puede darse el rol desde el JSON de registro.

## Stack

- **Backend** (`backend/`): Python 3.10+ (el entorno local usa 3.13), FastAPI, SQLModel 0.0.39 (SQLAlchemy 2.0), Pydantic v2, PostgreSQL (psycopg2), JWT con PyJWT, Argon2 con pwdlib, slowapi (rate limit), Pillow (fotos), Gemini con `google-genai`.
- **Frontend** (`frontend/`): React 19 con TypeScript, Vite 8, Tailwind CSS 4 (`@tailwindcss/vite`), react-router-dom 7, Vitest, ESLint 10. Fuentes Bricolage Grotesque y Hanken Grotesk.

## Mapa del repositorio

```
backend/
  main.py          app FastAPI: CORS, handlers de error, /media, routers
  core/            database.py (engine y sesión), security.py (JWT y Argon2),
                   dependencies.py (get_current_user), permissions.py (roles y propiedad),
                   exceptions.py (errores de dominio), rate_limit.py (Limiter)
  router/          endpoints: auth, products, uploads, orders, messages
  use_cases/       una función por operación. OJO: GetGroductId.py (con typo) = get_product_id
  repository/      único sitio que toca la sesión (BaseRepository + uno por entidad)
  models/          tablas y DTOs: User, Product, Category, Order, Message, common
  services/        ai_services.py (Gemini), image_storage.py (validar y guardar fotos)
  tests/           unittest del chat, con repositorios falsos (sin BD)
frontend/src/
  App.tsx          rutas
  api/             client.ts (llamadas a la API), types.ts
  auth/            AuthContext: sesión por token
  pages/           listado, ficha, login, registro, subir, mis ventas, chat, ComingSoon
  components/      piezas de interfaz (PhotoField, ProductCard, ChatThread...)
  hooks/           datos con polling (useProducts, useProduct, useSales, useConversations, useThread)
  utils/           lógica pura con test al lado (jwt, validation, format, sales, chat...)
raíz/
  PRODUCT.md       producto, usuarios y marca (la fuente de verdad del producto)
  DESIGN.md        sistema visual generado con Impeccable (es muy grande: no lo leas entero)
  CHANGELOG.md     versiones, fallos corregidos y fallos conocidos
  README.md        documentación original de la API (puede estar desfasada)
  SECURITY.md      política de seguridad
  requirements.txt único archivo de dependencias de Python
  .impeccable/     configuración y superficies del sistema de diseño
  .claude/         skills y agentes del proyecto
```

## Convenciones (no romperlas)

**Backend**
- Flujo de una petición: `router/ → use_cases/ → repository/ → BD`. Los routers no tocan la sesión ni tienen lógica: crean el repositorio y llaman al caso de uso.
- Los imports no llevan prefijo (`from core.database import ...`), así que se ejecuta **desde `backend/`**.
- Tres DTOs por entidad: `*Create` (entrada, sin id ni dueño), `*Read` (salida pública, nunca `hashed_password`) y `*Model` (tabla). Todas las rutas declaran `response_model`.
- El dueño y el rol salen siempre del token (`get_current_user`), nunca del body.
- Errores: excepciones propias en `core/exceptions.py`. La respuesta es JSON en español con la clave `mensaje` (los 422 añaden `detalles`).
- Rate limit: un contador por IP compartido por grupo, con `shared_limit`: `/products` escrituras 30/min y lecturas 120/min, `/orders` 20/min, `/messages` 120/min, `/uploads` 10/min. `/login` tiene 5/min. Los endpoints limitados reciben `request: Request`. Los contadores viven en memoria.
- El precio es el que escribe el vendedor. Ningún endpoint lo recalcula.
- Fotos: el `image_url` del producto solo puede ser la ruta que devuelve `POST /uploads` (la valida `IMAGE_URL_PATTERN`). Se sirven en `/media/`.
- Sin Alembic: las tablas se crean con `create_all` al arrancar. Cambiar un modelo no altera una tabla que ya existe.

**Frontend**
- Las llamadas a la API salen solo de `api/client.ts`. La lógica de negocio va en `utils/`, con su test al lado (`*.test.ts`).
- Textos de interfaz en español, precios en euros y formato numérico español (PRODUCT.md).
- Modo oscuro con acento violeta `#8B5CF6` (PRODUCT.md y DESIGN.md).

## Comandos

```bash
# Backend: con el .venv de la raíz activado (.venv\Scripts\activate en Windows)
pip install -r requirements.txt        # desde la raíz
cd backend
uvicorn main:app --reload              # http://localhost:8000 · docs en /docs
python -m unittest discover -s tests -t . -v

# Frontend: desde frontend/
npm install
npm run dev                            # http://localhost:5173
npm test                               # Vitest
npm run typecheck
npm run lint
```

## Configuración

- **`backend/.env`** (nunca lo leas, imprimas ni subas): `DATABASE_URL` y `SECRET_KEY` son obligatorias; también `ALGORITHM` (`HS256`, `HS384` o `HS512`), `ACCESS_TOKEN_EXPIRE_MINUTES` (por defecto 30), `GEMINI_API_KEY` y `SQL_ECHO` (opcional). Si falta una obligatoria, o los valores no son válidos, la app no arranca.
- **`frontend/.env.local`**: `VITE_API_URL` opcional. Por defecto `http://localhost:8000`.
- CORS solo permite `http://localhost:5173` y `http://127.0.0.1:5173`.

## Cómo trabajar conmigo

- **Idioma**: todo en español. Nombres de código, variables, funciones y términos técnicos en inglés.
- **Modo tutor por defecto**: ante un bug o una feature, da primero pistas y preguntas guía. No des el código completo hasta que César diga "dame el código" (o equivalente).
- **Nivel**: base sólida de Python (listas, tuplas, sets, bucles, condicionales, POO básica). Introduce los conceptos nuevos paso a paso.
- **Tono**: amistoso y directo, sin repetir. Feedback honesto.
- **Respuestas largas**: con encabezados y viñetas.
- **Antes de editar**: explica qué vas a cambiar y por qué. Cambios pequeños y revisables, un tema por vez.
- **Commits**: solo cuando César lo pida.
- **Versión**: cada feature o fix sube `frontend/package.json` (SemVer `0.x`: feature = minor, fix = patch) y añade su entrada en `CHANGELOG.md`.
- **Secretos**: nunca leas, imprimas ni subas `backend/.env`.

## Memoria y sesiones

- Al empezar una sesión en este proyecto, ejecuta la skill `inicio-sesion` antes de responder. Al terminar, o cuando César diga que cierra, ejecuta `cierre-sesion`.
- `project_memory.md` guarda el estado del proyecto. Lo actualiza `cierre-sesion`.
- Las preferencias y decisiones personales de César van en la memoria de Claude, no en el repo.
