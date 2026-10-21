# Smart Product API

> Backend para la gestión inteligente de inventario en una tienda.

Una **API RESTful** construida con **FastAPI** que automatiza el ciclo de vida del catálogo de productos: los clasifica automáticamente mediante **IA generativa (Google Gemini)** y aplica un **motor de precios dinámico** basado en reglas de negocio por categoría. Incluye autenticación segura con **JWT** y **Argon2**.

---

## 📌 ¿Qué problema resuelve?

En una tienda, dos tareas manuales consumen demasiado tiempo y son propensas a errores:

1. **Clasificar productos.** Asignar manualmente la categoría de cada artículo (Tecnología, Deporte, Ofertas, etc.).
2. **Calcular precios finales.** Aplicar IVA, descuentos o márgenes según la categoría, manteniendo reglas consistentes.

Esta API **elimina esa fricción**: recibe el nombre y precio base de un producto y, en tiempo real:

- **Infiere la categoría** con IA si no se proporciona una.
- **Calcula el precio final** aplicando la estrategia de pricing correspondiente a esa categoría.
- **Persiste y expone** los datos a través de endpoints REST documentados con Swagger.

---

## ✨ Características Principales

- **CRUD completo de productos** — crear, consultar, actualizar y eliminar vía REST.
- **Autenticación con JWT + Argon2** — registro de usuarios (`/register`) e inicio de sesión (`/login`) para proteger las operaciones de escritura.
- **Clasificación automática con IA** — integración con Google Gemini (`gemini-3.5-flash`); si el cliente no envía categoría, la IA la infiere a partir del nombre.
- **Motor de precios dinámico** — IVA, descuentos y márgenes aplicados según categoría mediante el patrón *Strategy*.
- **Persistencia en PostgreSQL** — mediante **SQLModel** (SQLAlchemy 2.0).
- **Validación estricta de datos** — DTOs con Pydantic v2 y `Field(min_length=...)` / `Field(gt=0)`.
- **Manejo global de excepciones** — respuestas JSON uniformes en español para errores (422, 404, 500, etc.).
- **Clean Architecture + SOLID** — separación clara entre transporte, lógica de negocio y acceso a datos.

---

## 🏗️ Arquitectura y Principios de Diseño

El proyecto sigue una **arquitectura en capas** orientada a la mantenibilidad y escalabilidad:

| Capa | Directorio | Responsabilidad |
|------|------------|-----------------|
| **Presentación / Transporte** | `router/` | Define los endpoints HTTP y delega en los casos de uso. |
| **Lógica de negocio** | `use_cases/` | Orquesta las reglas de negocio (CRUD y autenticación). |
| **Persistencia** | `repository/` | Aísla el acceso a datos del resto de la aplicación. |
| **Servicios** | `services/` | Lógica reutilizable: motor de precios y cliente de IA. |
| **Modelos** | `models/` | DTOs y tablas (SQLModel) con validación Pydantic. |
| **Infraestructura** | `core/` | Conexión a BD, seguridad (JWT/Argon2) y manejo de errores. |

### Patrones aplicados

- **Repository Pattern** — `ProductRepository` y `UserRepository` centralizan todas las operaciones de base de datos; los casos de uso no dependen de SQLModel directamente.
- **Use Cases** — cada operación de dominio está encapsulada en su propia función (`CreateProduct`, `GetAllProduct`, `GetProductById`, `UpdateProduct`, `DeleteProduct`, `RegisterUser`).
- **Strategy Pattern (OCP)** — el cálculo de precios vive en `services/pricing.py`. Un diccionario estratégico (`PRICING_CALCULATORS`) asocia cada categoría con su clase de cálculo, evitando cadenas de `if/else`. Añadir una regla nueva solo requiere crear una clase y registrarla.
- **Inyección de Dependencias** — los endpoints reciben la sesión de BD y el token JWT vía `Depends(...)`.
- **Open/Closed Principle** — el modelo de producto expone `apply_pricing_rules()`; la lógica de precios se extiende sin tocar los endpoints.

---

## 🤖 Motor de IA (Clasificación Automática)

`services/ai_services.py` usa el cliente oficial **`google-genai`** para clasificar productos:

- El prompt define el rol (calificador con 15 años de experiencia), el contexto y una **restricción estricta: devolver una única palabra** como categoría.
- Si al crear o actualizar un producto no se especifica `category`, la IA la infiere automáticamente a partir del nombre.
- La API key se lee automáticamente de la variable de entorno `GEMINI_API_KEY`.

---

## 💰 Motor de Precios Dinámico

En `services/pricing.py`, cada categoría tiene su propia estrategia:

| Categoría | Estrategia | Regla |
|-----------|-----------|-------|
| `Tecnologia` | `IvaPricing` | +21% IVA sobre el precio base. |
| `Deporte` | `PercentageDiscountPricing` | −10% de descuento sobre el precio base. |
| `Ofertas` | `FixedDiscountPricing` | −5 € con precio mínimo de 1 €. |
| `Premium` | `PremiumPricing` | +25% de margen sobre el precio base. |
| Otras / `General` | `StandardPricing` | Precio sin modificaciones. |

> Las categorías se **normalizan** (sin acentos, en minúsculas) antes de buscar su estrategia, de modo que valores como "Tecnología" o "Tecnologia" apuntan a la misma regla. Añadir una regla nueva solo requiere crear una clase y registrarla en `PRICING_CALCULATORS`.

---

## 🔐 Autenticación y Seguridad

- **Registro** (`POST /register`) — las contraseñas se guardan con hash **Argon2** (`pwdlib`).
- **Login** (`POST /login`) — valida credenciales (OAuth2 *password flow*) y devuelve un token **JWT** firmado.
- Las operaciones de escritura sobre productos (`POST`/`PUT`/`DELETE`) requieren autenticación `Bearer`; se valida la firma, la caducidad y el usuario del token (`core/dependencies.py`).
- **Rate limiting** con `slowapi` (`core/rate_limit.py`): los endpoints de `/products` comparten un límite de 5 peticiones por minuto por IP.

Documentación    | Ruta
-----------------|-----------------------------------
Swagger UI       | `http://localhost:8000/docs`
ReDoc            | `http://localhost:8000/redoc`

---

## 🔌 Endpoints de la API

| Método | Ruta | Descripción | Autenticación | Respuesta |
|--------|------|-------------|:-------------:|-----------|
| `POST` | `/register` | Registra un nuevo usuario. | — | `200` - confirmación |
| `POST` | `/login` | Inicia sesión y devuelve un JWT. | — | `200` - token |
| `GET` | `/products` | Lista todos los productos. | — | `200` - lista de `ProductPublic` |
| `GET` | `/products/{product_id}` | Obtiene un producto por su ID. | — | `200` - `ProductPublic` \| `404` |
| `POST` | `/products` | Crea un producto (la IA infiere la categoría si es vacía). | Bearer | `200` - confirmación |
| `PUT` | `/products/{product_id}` | Actualiza un producto existente. | Bearer | `200` - producto actualizado \| `404` |
| `DELETE` | `/products/{product_id}` | Elimina un producto. | Bearer | `200` - confirmación \| `404` |

### 🖥️ Interfaz interactiva (Swagger UI)

La forma más rápida de explorar y probar la API es abrir la documentación interactiva:

```
http://localhost:8000/docs
```

Ahí podrás ejecutar cada endpoint directamente desde el navegador, ver los esquemas de entrada/salida (JSON) y autenticarte con el botón *Authorize* para probar los endpoints protegidos.

### Ejemplo de petición (crear producto)

```bash
curl -X POST "http://localhost:8000/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"name": "Auriculares inalámbricos", "price": 50.0, "category": "Tecnologia"}'
```

> Si envías `"category": ""`, la IA la inferirá automáticamente a partir del nombre del producto.

---

## 🛡️ Manejo de Errores

Todos los errores responden con un JSON uniforme en español gracias a `core/exceptions.py`:

| Código | Escenario | Respuesta |
|--------|-----------|-----------|
| `401` | Credenciales inválidas en `/login` | `{"mensaje": "Incorrect username or password"}` |
| `401` | Token caducado o inválido | `{"mensaje": "El token ha expirado"}` / `{"mensaje": "No se han podido validar las credenciales"}` |
| `404` | Producto no encontrado | `{"mensaje": "Product with ID {id} not found"}` |
| `422` | Datos de entrada inválidos | `{"mensaje": "...", "detalles": [...]}` |
| `429` | Límite de peticiones superado | `{"mensaje": "Demasiadas peticiones. Inténtalo de nuevo en un minuto"}` |
| `5xx` | Error HTTP de Starlette / error de servidor | `{"mensaje": "..."}` |

---

## 🚀 Instalación y Puesta en Marcha

### Requisitos previos

- **Python 3.10+**
- **PostgreSQL** en ejecución
- (Opcional) Cuenta de Google con acceso a la API de **Gemini**

### 1. Clonar el repositorio

```bash
git clone https://github.com/cesar170303/smart-product-api.git
cd smart-product-api
```

### 2. Crear y activar el entorno virtual

**Windows:**
```bash
python -m venv .venv
.venv\Scripts\activate
```

**macOS / Linux:**
```bash
python -m venv .venv
source .venv/bin/activate
```

### 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 4. Configurar variables de entorno

Crea un archivo `.env` dentro de la carpeta `backend/` (no se sube a git):

```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_bd"
GEMINI_API_KEY="TU_API_KEY_DE_GEMINI"
SECRET_KEY="clave_secreta_para_firmar_jwt"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

> **Nota:** Si falta `DATABASE_URL` o `SECRET_KEY`, o si `ALGORITHM` o `ACCESS_TOKEN_EXPIRE_MINUTES` tienen un valor no válido, la aplicación falla al arrancar con un mensaje claro. Si no defines `ACCESS_TOKEN_EXPIRE_MINUTES`, se usan 30 minutos. El archivo `.env` está ignorado por git (`.gitignore`) por seguridad.

### 5. Iniciar el servidor

Los imports del backend son relativos a `backend/`, así que el servidor se lanza desde esa carpeta:

```bash
cd backend
uvicorn main:app --reload
```

Al arrancar, el *lifespan* crea automáticamente las tablas en la base de datos (`SQLModel.metadata.create_all`). Luego abre:

- API: `http://localhost:8000`
- Documentación Swagger: `http://localhost:8000/docs`

---

## ✅ Ejemplo de flujo completo

```bash
# 1. Registrar un usuario
curl -X POST "http://localhost:8000/register" \
  -H "Content-Type: application/json" \
  -d '{"username": "cesar", "password": "clave123"}'

# 2. Iniciar sesión y obtener el token
curl -X POST "http://localhost:8000/login" \
  -d "username=cesar&password=clave123"

# 3. Crear un producto (requiere el token)
curl -X POST "http://localhost:8000/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"name": "Laptop gaming", "price": 1000.0, "category": ""}'
```

---

## 📁 Estructura del Proyecto

```
smart_product_app/
├── requirements.txt                # Dependencias del backend (único requirements.txt)
├── .gitignore
├── backend/
│   ├── main.py                     # Configuración de FastAPI, lifespan, CORS y handlers globales
│   ├── .env                        # Variables de entorno (NO versionado)
│   ├── ruff.toml                   # Configuración del linter
│   ├── core/
│   │   ├── database.py             # Motor y sesiones de SQLAlchemy/SQLModel
│   │   ├── dependencies.py         # get_current_user: valida el JWT de las rutas protegidas
│   │   ├── exceptions.py           # Excepciones y handlers globales de error
│   │   ├── rate_limit.py           # Limitador de peticiones (slowapi)
│   │   └── security.py             # Hash Argon2 y creación/verificación de tokens JWT
│   ├── models/
│   │   ├── Product.py              # DTOs y modelo de tabla de productos (SQLModel)
│   │   └── User.py                 # DTOs y modelo de tabla de usuarios (SQLModel)
│   ├── repository/
│   │   ├── base_repository.py      # Repositorio base
│   │   ├── product_repository.py   # Acceso a datos de productos (Repository Pattern)
│   │   └── user_repository.py      # Acceso a datos de usuarios (Repository Pattern)
│   ├── router/
│   │   ├── auth.py                 # Endpoints de registro y login
│   │   └── products.py             # Endpoints REST de productos
│   ├── services/
│   │   ├── ai_services.py          # Integración con Google Gemini (clasificación)
│   │   └── pricing.py              # Motor de precios (Strategy Pattern)
│   └── use_cases/
│       ├── CreateProduct.py        # Caso de uso: crear producto
│       ├── GetAllProduct.py        # Caso de uso: listar productos
│       ├── GetGroductId.py         # Caso de uso: consultar por ID
│       ├── UpdateProduct.py        # Caso de uso: actualizar producto
│       ├── DeleteProduct.py        # Caso de uso: eliminar producto
│       └── RegisterUser.py         # Caso de uso: registrar usuario
└── frontend/                       # React 19 + Vite + Tailwind (de momento solo el login)
    └── src/
        ├── api/client.js           # Llamadas a la API
        ├── pages/LoginPage.jsx     # Página de login
        ├── App.jsx
        └── main.jsx
```

---

## 🧰 Stack Tecnológico

**Lenguaje y frameworks**

`Python 3.10+` · `FastAPI` · `SQLModel` / `SQLAlchemy 2.0` · `Pydantic v2` · `Uvicorn`

**Persistencia y seguridad**

`PostgreSQL` · `psycopg2-binary` · `PyJWT` · `pwdlib (Argon2)`

**IA**

`Google Gemini` · `google-genai`

**Configuración y utilidades**

`python-dotenv` · `CORS` · `OAuth2` · `slowapi`

**Frontend**

`React 19` · `Vite` · `Tailwind CSS 3`

**Arquitectura**

`Clean Architecture` · `SOLID` · `Repository Pattern` · `Strategy Pattern` · `Dependency Injection`

---

## 🙌 Autor

Desarrollado por **César Martínez** — [GitHub](https://github.com/cesar170303)

---

## 📄 Licencia

Este proyecto se distribuye bajo la licencia **MIT**. Consulta el archivo `LICENSE` para más detalles.
