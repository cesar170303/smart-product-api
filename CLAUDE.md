# smart_product_app

API de inventario con clasificación de productos por IA y motor de precios dinámico, más un frontend en React. Está a medias: el backend está bastante completo y el frontend solo tiene el login.

## Cómo trabajar conmigo en este proyecto (reglas para Claude)

- **Idioma**: explica todo en español. Nombres de variables, funciones, clases y términos técnicos, en inglés.
- **Modo tutor por defecto**: ante un bug o una feature, da primero pistas y preguntas guía. No des el código completo hasta que César diga "dame el código" (o equivalente).
- **Nivel**: base sólida de Python (listas, tuplas, sets, bucles, condicionales, POO básica). Introduce los conceptos nuevos paso a paso, sin jerga sin explicar.
- **Tono**: amistoso pero directo, sin repetir. Feedback honesto, sin adornos.
- **Respuestas largas**: con encabezados y viñetas.
- **Antes de editar**: explica qué vas a cambiar y por qué. Cambios pequeños y revisables, un tema por vez.
- **Nunca leas, imprimas ni subas `backend/.env`** (contiene `SECRET_KEY`, `DATABASE_URL`, `GEMINI_API_KEY`).
- **Commits**: solo cuando César lo pida.

## Stack

- **Backend** (`backend/`): Python 3.10+, FastAPI, SQLModel/SQLAlchemy 2.0, Pydantic v2, PostgreSQL (psycopg2), JWT con PyJWT, hash Argon2 con pwdlib, Google Gemini (`google-genai`).
- **Frontend** (`frontend/`): React 19, Vite, Tailwind CSS 3, ESLint.

## Cómo ejecutarlo

```bash
# Backend (con el entorno virtual de la raíz activado: .venv\Scripts\activate en Windows)
pip install -r requirements.txt  # desde la raíz: es el único requirements.txt
cd backend
uvicorn main:app --reload        # http://localhost:8000  ·  docs en /docs

# Frontend (desde frontend/)
npm install
npm run dev                      # http://localhost:5173
npm run lint
```

- Variables de entorno en `backend/.env`: `DATABASE_URL`, `GEMINI_API_KEY`, `SECRET_KEY`, `ALGORITHM`, `ACCESS_TOKEN_EXPIRE_MINUTES`.
- Los imports del backend son sin prefijo (`from core.database import ...`), así que se ejecuta **desde `backend/`**.
- Las tablas se crean solas al arrancar (`SQLModel.metadata.create_all` en el lifespan de `main.py`). No hay migraciones (Alembic).
- CORS solo permite `http://localhost:5173` y `http://127.0.0.1:5173`.
- No hay tests todavía.

## Arquitectura del backend (capas)

Flujo de una petición: `router/ → use_cases/ → repository/ → BD`, con `services/` como apoyo.

| Capa | Carpeta | Responsabilidad |
|---|---|---|
| Transporte | `router/` | Endpoints HTTP; delegan en los casos de uso |
| Lógica de negocio | `use_cases/` | Una función por operación (`create_new_product`, `update_products`, `register_user`...) |
| Persistencia | `repository/` | Único sitio que habla con la sesión de SQLModel |
| Servicios | `services/` | `pricing.py` (Strategy) y `ai_services.py` (Gemini) |
| Modelos | `models/` | Tablas y DTOs (`ProductBase`, `ProductCreate`, `ProductModel`, `ProductPublic`; igual en `User`) |
| Infraestructura | `core/` | Conexión BD, seguridad (JWT/Argon2) y manejo global de excepciones |

Convenciones a respetar:
- Los routers no contienen lógica de negocio ni tocan la sesión directamente: crean el `Repository` y llaman al caso de uso.
- Las respuestas públicas usan `response_model` con un DTO `*Public` para no exponer campos internos (ej. `provider_secret_cost`).
- Errores de dominio como excepciones propias (`ProductNotFoundException`) con handler en `core/exceptions.py`; las respuestas de error son JSON en español con clave `mensaje`.
- Motor de precios: para una regla nueva, crear una clase que herede de `PricingStrategy` y registrarla en `PRICING_CALCULATORS` (claves de categoría normalizadas: minúsculas y sin acentos). No añadir cadenas de `if/else`.
- Si `category` llega vacía al crear o actualizar, se pide a Gemini (`get_ai_category`).

## Endpoints

`POST /register`, `POST /login` (OAuth2 password form) · `GET /products`, `GET /products/{id}` (públicos) · `POST/PUT/DELETE /products` (con Bearer token).

## Frontend

- `src/api/client.js`: llamadas a la API (`API_BASE_URL = http://localhost:8000`, hoy hardcodeada).
- `src/pages/LoginPage.jsx`: única página. `src/App.jsx` y `src/main.jsx` son el punto de entrada.
- Estilos con Tailwind (`tailwind.config.js`, `postcss.config.js`).

## Puntos conocidos por resolver (César los quiere encontrar y arreglar él, guiado)

- Los endpoints protegidos reciben el token con `Depends(oauth2_scheme)`, pero hay que comprobar si en algún punto se valida de verdad la firma y la caducidad del JWT.
- `POST /register` devuelve el objeto de usuario completo: revisar qué campos salen en la respuesta.
- `get_ai_category` no gestiona fallos de Gemini ni respuestas de más de una palabra.
- `core/security.py` hace `int(os.getenv(...))` sin comprobar que la variable exista.
- Limpieza pendiente: código comentado en `router/products.py`, dependencias duplicadas de Google en `requirements.txt` (`google-genai` y la antigua `google-generativeai`), README con rutas desactualizadas y `SECURITY.md` sin rellenar.
