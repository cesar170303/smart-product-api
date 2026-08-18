# Smart Product App - Backend API
> Desarrollado por César Martínez

API RESTful construida con **FastAPI** para gestionar el inventario de una tienda inteligente. El sistema clasifica productos automáticamente mediante **IA generativa (Google Gemini)** y aplica un motor de precios dinámico basado en reglas de negocio.

---

## 🚀 Características Principales

* **CRUD completo de productos:** Crear, leer, actualizar y eliminar productos a través de endpoints REST.
* **Categorización automática con IA real:** Integración con **Google Gemini** (`gemini-3.5-flash`) que asigna la categoría del producto a partir de su nombre. Si el cliente envía una categoría, esta no se sobreescribe.
* **Motor de precios dinámico:** Aplica impuestos o descuentos según la categoría del producto mediante el patrón *Strategy*.
* **Persistencia en PostgreSQL:** Base de datos relacional gestionada con **SQLModel** y **SQLAlchemy 2.0**.
* **Validación estricta de datos:** DTOs con Pydantic/SQLModel (`Field(min_length=...)`, `Field(gt=0)`) que garantizan la integridad de los datos de entrada.
* **Manejo global de excepciones:** Handlers centralizados para errores de validación (422), HTTP (Starlette), no encontrado (404) y errores de servidor (500) con respuestas JSON consistentes en español.
* **Patrón Repository y Clean Architecture:** Separación clara entre transporte, lógica de negocio y acceso a datos.

---

## 🏗️ Arquitectura y Principios de Diseño

El proyecto sigue una arquitectura en capas orientada a la mantenibilidad y escalabilidad:

| Capa | Directorio | Responsabilidad |
|------|------------|-----------------|
| **Presentación / Transporte** | `router/` | Define los endpoints HTTP y delega en los casos de uso. |
| **Lógica de negocio** | `use_cases/` | Orquesta las reglas de negocio (crear, actualizar, eliminar, consultar). |
| **Persistencia** | `repository/` | Aisla el acceso a datos del resto de la aplicación. |
| **Servicios** | `services/` | Lógica reutilizable: motor de precios y cliente de IA. |
| **Modelos** | `models/` | DTOs y tablas (SQLModel) con validaciones Pydantic. |
| **Infraestructura** | `core/` | Conexión a BD y manejo global de excepciones. |

### Patrones de diseño aplicados

* **Repository Pattern:** `ProductRepository` centraliza todas las operaciones contra la base de datos (consultas, inserciones, actualizaciones y borrados), de modo que los casos de uso no dependen directamente de SQLModel.
* **Use Cases:** Cada operación del dominio está encapsulada en su propia función (`CreateProduct`, `GetAllProduct`, `GetGroductId`, `UpdateProduct`, `DeleteProduct`).
* **Strategy Pattern (OCP):** El cálculo de precios está aislado en `services/pricing.py`. Un **diccionario estratégico** (`PRICING_CALCULATORS`) asocia cada categoría con su clase de cálculo, evitando cadenas de `if/else`. Añadir una nueva regla solo requiere crear una clase y registrarla en el diccionario.
* **Inyección de Dependencias:** Los endpoints reciben la sesión de base de datos a través de `Depends(get_session)`.
* **Open/Closed Principle:** El modelo de producto expone `apply_pricing_rules()`; la lógica de precios se extiende sin modificar los endpoints.

---

## 🤖 Motor de IA (Categorización Automática)

El servicio `services/ai_services.py` utiliza el cliente oficial **`google-genai`** para clasificar productos:

* El prompt define el rol (calificador de productos), el contexto y una restricción estricta: **devolver una única palabra** como categoría.
* Si al crear o actualizar un producto no se especifica `category`, la IA la infiere automáticamente a partir del nombre.
* La API key se lee automáticamente desde la variable de entorno `GEMINI_API_KEY`.

---

## 💰 Motor de Precios Dinámico

En `services/pricing.py`, cada categoría tiene su propia estrategia de precios:

| Categoría | Estrategia | Regla |
|-----------|-----------|-------|
| `Tecnologia` | `IvaPricing` | +21% IVA sobre el precio base. |
| `Deporte` | `PercentageDiscountPricing` | -10% de descuento sobre el precio base. |
| `Ofertas` | `FixedDiscountPricing` | -5€ con precio mínimo de 1€. |
| `Premium` | `PremiumPricing` | +25% de margen sobre el precio base. |
| Otras / `General` | `StandardPricing` | Precio sin modificaciones. |

> 💡 Las categorías se normalizan (sin acentos y en minúsculas) antes de buscar su estrategia, de modo que valores de la IA como "Tecnología" o "Tecnologia" apuntan a la misma regla. Añadir una nueva regla solo requiere crear una clase y registrarla en `PRICING_CALCULATORS`.

---

## 🔌 Endpoints de la API

| Método | Ruta | Descripción | Respuesta |
|--------|------|-------------|-----------|
| `GET` | `/products` | Lista todos los productos. | `200` - lista de `ProductPublic` |
| `GET` | `/products/{product_id}` | Obtiene un producto por su ID. | `200` - `ProductPublic` \| `404` - no encontrado |
| `POST` | `/products` | Crea un producto (categoría opcional, la IA la infiere). | `200` - mensaje de confirmación |
| `PUT` | `/products/{product_id}` | Actualiza un producto existente. | `200` - producto actualizado \| `404` - no encontrado |
| `DELETE` | `/products/{product_id}` | Elimina un producto. | `200` - mensaje de confirmación \| `404` - no encontrado |

### Ejemplo de petición (crear producto)

```bash
curl -X POST "http://localhost:8000/products" \
  -H "Content-Type: application/json" \
  -d '{"name": "Auriculares inalámbricos", "price": 50.0, "category": ""}'
```

La documentación interactiva (Swagger) está disponible en `http://localhost:8000/docs`.

---

## 🛡️ Manejo de Errores

Todos los errores se responden con un JSON uniforme en español gracias a `core/exceptions.py`:

| Código | Escenario | Respuesta |
|--------|-----------|-----------|
| `404` | Producto no encontrado (`ProductNotFoundException`) | `{"mensaje": "Product with ID {id} not found"}` |
| `422` | Datos de entrada inválidos | `{"mensaje": "...", "detalles": [...]}` |
| `404+` | Errores HTTP de Starlette | `{"mensaje": exc.detail}` |
| `500` | Error inesperado del servidor | `{"mensaje": "Ha ocurrido un error en el servidor"}` |

---

## ⚙️ Instalación y Configuración

### 1. Requisitos previos

* Python 3.10+
* PostgreSQL en ejecución

### 2. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto (no se sube a git):

```env
DATABASE_URL = "postgresql://usuario:contraseña@localhost:5432/nombre_bd"
GEMINI_API_KEY = "TU_API_KEY_DE_GEMINI"
```

> ⚠️ **Importante:** Nunca subas el archivo `.env` al repositorio. Si no existe `DATABASE_URL`, la aplicación falla al arrancar con un error claro.

### 4. Iniciar el servidor

```bash
uvicorn main:app --reload
```

Al arrancar, el *lifespan* de la aplicación crea automáticamente las tablas en la base de datos (`SQLModel.metadata.create_all`).

---

## 📁 Estructura del Proyecto

```
smart_product_app/
├── main.py                     # Configuración de FastAPI, lifespan y handlers globales
├── requirements.txt            # Dependencias del proyecto
├── .env                        # Variables de entorno (no versionado)
├── .gitignore
├── core/
│   ├── database.py             # Motor y sesiones de SQLAlchemy
│   └── exceptions.py           # Excepciones y handlers globales de error
├── models/
│   └── models.py               # DTOs y modelo de tabla (SQLModel)
├── repository/
│   └── product_repository.py   # Acceso a datos (Repository Pattern)
├── router/
│   └── products.py             # Endpoints REST de productos
├── services/
│   ├── ai_services.py          # Integración con Google Gemini
│   └── pricing.py              # Motor de precios (Strategy Pattern)
└── use_cases/
    ├── CreateProduct.py        # Caso de uso: crear producto
    ├── GetAllProduct.py        # Caso de uso: listar productos
    ├── GetGroductId.py         # Caso de uso: consultar por ID
    ├── UpdateProduct.py        # Caso de uso: actualizar producto
    └── DeleteProduct.py        # Caso de uso: eliminar producto
```

---

## 🧰 Stack Tecnológico

`Python 3` | `FastAPI` | `SQLModel` / `SQLAlchemy 2.0` | `Pydantic v2` | `PostgreSQL` | `Google Gemini` (`google-genai`) | `Uvicorn` | `python-dotenv` | `Clean Architecture` | `SOLID`
