# Code Smells Analysis

## Metodología

- **Fecha:** 2026-10-23
- **Rama:** `chore/remove-pricing-module`
- **Scope:** `frontend/src/components/`, `frontend/src/pages/`, `frontend/src/hooks/`, `frontend/src/utils/`, `frontend/src/api/` y `frontend/src/auth/`. Se excluyen los ficheros `*.test.*`. El scope original (`src/features/`) no existe en este proyecto.
- **Criterios:** Martin Fowler (*Refactoring*, catálogo de smells) + antipatrones de React (componentes grandes, lógica duplicada, props drilling).
- **Herramientas:** inspección manual del código y ESLint con las reglas del proyecto (`no-magic-numbers` y `sonarjs/*`). No se ejecutó SonarJS como herramienta aparte.

### Leyenda de severidad

- 🔴 **Alta:** el mismo dato o regla vive en varios sitios y ya hay una divergencia posible, o afecta a varias piezas a la vez.
- 🟡 **Media:** duplicación o acoplamiento que encarece cualquier cambio, sin error visible hoy.
- ⚠ **Baja:** cosmético o local.

### Resumen de lint (solo código de producción, medido antes de PR #17)

| Regla | Avisos |
|---|---|
| `no-magic-numbers` | 10 |
| `sonarjs/no-duplicate-string` | 0 (todos en tests) |

El resto de avisos de lint del proyecto (14 de `sonarjs/no-duplicate-string`) están en ficheros de test y no entran en este análisis.

---

## 🚨 Code Smells Identificados

### Comprobación de estado HTTP repetida y constantes duplicadas (Duplicate Code) - Severidad: 🔴

**Ubicación:** `hooks/useThread.ts:10`, `hooks/useSales.ts:11`, `hooks/useConversations.ts:10`, `pages/SalesPage.tsx:16`, `pages/UploadPage.tsx:25`, `components/BuyPanel.tsx:10-11`, `pages/RegisterPage.tsx:13`

**Código:**

```typescript
// hooks/useThread.ts (el mismo patrón aparece en los otros seis ficheros)
const HTTP_UNAUTHORIZED = 401;
// ...
if (caught instanceof ApiError && caught.status === HTTP_UNAUTHORIZED) {
  onUnauthorized();
  return;
}
```

**Problema:** Seis ficheros definen su propia `HTTP_UNAUTHORIZED = 401` y repiten la misma condición `instanceof ApiError && status === ...`. `HTTP_CONFLICT` y `HTTP_TOO_LARGE` / `HTTP_UNSUPPORTED` siguen el mismo patrón en otros dos. Es el mismo conocimiento ("qué significa un 401 para esta app") copiado en siete sitios.

**Impacto:** Si mañana el backend cambia un código o se añade una comprobación de `403`, hay que tocar seis ficheros y es fácil dejar uno sin cambiar. Además, el lector tiene que comprobar en cada fichero que la constante es la misma.

**Refactor sugerido:** Centralizar los códigos en un módulo (`api/status.ts` o junto a `ApiError` en `api/client.ts`) y dar a `ApiError` un método que responda a la pregunta directamente:

```typescript
// api/client.ts
export const HTTP_STATUS = { unauthorized: 401, conflict: 409, notFound: 404 } as const;

export class ApiError extends Error {
  // ...
  hasStatus(status: number): boolean {
    return this.status === status;
  }
}
// Uso: if (caught instanceof ApiError && caught.hasStatus(HTTP_STATUS.unauthorized)) ...
```

---

### Mismo bloque de "sesión caducada" en cuatro sitios (Duplicate Code) - Severidad: 🟡

**Ubicación:** `pages/UploadPage.tsx:141-145`, `components/BuyPanel.tsx:53-57`, `pages/SalesPage.tsx:70`, `pages/ChatPage.tsx:90-91`

**Código:**

```tsx
// pages/UploadPage.tsx
if (caught instanceof ApiError && caught.status === HTTP_UNAUTHORIZED) {
  // La sesión caducó mientras rellenabas el formulario
  logout();
  navigate(loginPath('/subir'), { replace: true });
  return;
}
```

**Problema:** Cuatro pantallas hacen `logout()` y después navegan al login con `loginPath(...)`. Cada una cambia un poco (`replace`, la ruta de vuelta, un comentario distinto), y la lógica de "qué hacer al caducar" está repartida.

**Impacto:** Un cambio de flujo (por ejemplo, mostrar un aviso "tu sesión ha caducado") obliga a tocar cuatro componentes. Hoy ya hay pequeñas diferencias que no tienen motivo.

**Refactor sugerido:** Un hook `useSessionExpired()` que devuelva una función `(returnTo: string) => void` y haga `logout()` + `navigate(loginPath(returnTo), { replace: true })`. Así cada pantalla solo indica a dónde volver.

---

### Constantes de validación duplicadas entre la capa de validación y la interfaz (Duplicate Code / Magic Numbers) - Severidad: 🔴

**Ubicación:** `pages/UploadPage.tsx:28` (`DESCRIPTION_MAX`), `utils/validation.ts:58` (`DESCRIPTION_MAX`), `pages/UploadPage.tsx:173` (`maxLength={150}`), `pages/UploadPage.tsx:207` (`maxLength={50}`), `pages/RegisterPage.tsx:112` (texto `"Mínimo 8 caracteres."`), `components/PhotoField.tsx:97` (texto `"5 MB"`)

**Código:**

```tsx
// pages/UploadPage.tsx
const DESCRIPTION_MAX = 5000;          // duplicado de utils/validation.ts
// ...
<TextField ... maxLength={150} />      // PRODUCT_NAME_MAX = 150 en validation.ts
<TextField ... maxLength={50} />       // CATEGORY_MAX = 50 en validation.ts
```

```tsx
// pages/RegisterPage.tsx
hint="Mínimo 8 caracteres."            // PASSWORD_MIN = 8 en validation.ts
```

**Problema:** Los límites viven en `validation.ts` (`PRODUCT_NAME_MAX`, `CATEGORY_MAX`, `PASSWORD_MIN`, `MAX_IMAGE_BYTES`), pero la interfaz los vuelve a escribir como literales o copia la constante. Los `maxLength` de la pantalla y las reglas de validación pueden divergir sin que nada falle. `DESCRIPTION_MAX` está definido dos veces con el mismo valor.

**Impacto:** Si se cambia el límite de categoría en `validation.ts`, el campo de la pantalla sigue en 50 y el usuario ve que el campo deja escribir algo que luego se rechaza (o al revés). Es el riesgo típico de un dato que existe en dos sitios.

**Refactor sugerido:** Exportar los límites desde `validation.ts` y usarlos en las pantallas (`maxLength={PRODUCT_NAME_MAX}`, `hint={`Mínimo ${PASSWORD_MIN} caracteres.`}`). Eliminar la copia de `DESCRIPTION_MAX` en `UploadPage.tsx`. Para `"5 MB"`, derivarlo de `MAX_IMAGE_BYTES`.

---

### Constantes de tiempo repetidas (Duplicate Code / Magic Numbers) - Severidad: 🟡

**Ubicación:** `utils/jwt.ts:6` y `utils/format.ts:10` (`MS_PER_SECOND = 1000`), `utils/format.ts:12` (`SECONDS_PER` con `3600` y `86_400`), `utils/format.ts:26` (`MS_PER_DAY = 86_400_000`), `testUtils.ts:9` (`ONE_HOUR_SECONDS = 3600`)

**Código:**

```typescript
// utils/format.ts
const MS_PER_SECOND = 1000;
const SECONDS_PER = { year: 31_536_000, month: 2_592_000, week: 604_800, day: 86_400, hour: 3600, minute: 60 };
const MS_PER_DAY = 86_400_000;
```

**Problema:** `MS_PER_SECOND` está definido en dos ficheros. Dentro de `format.ts`, la constante del día vive en dos formas (`SECONDS_PER.day` en segundos y `MS_PER_DAY` en milisegundos), y el literal `3600` no sigue el mismo estilo que `86_400` (separador de miles) ni que `31_536_000`.

**Impacto:** Mezclar segundos y milisegundos es una fuente clásica de errores de un factor 1000. Ahora mismo cada cálculo es correcto, pero el código no deja claro cuál usar.

**Refactor sugerido:** Un único `utils/time.ts` con `MS_PER_SECOND`, `SECONDS_PER_HOUR`, `MS_PER_DAY`, etc., derivando unas de otras (`MS_PER_DAY = 24 * 60 * 60 * 1000`). `jwt.ts` y `format.ts` lo importan.

---

### Mensaje de error de red copiado en siete ficheros (Duplicate Code) - Severidad: 🟡

**Ubicación:** `hooks/useThread.ts:9`, `hooks/useSales.ts:10`, `hooks/useConversations.ts:9`, `hooks/useProduct.ts:11`, `pages/LoginPage.tsx:11`, `pages/RegisterPage.tsx:12`, `pages/UploadPage.tsx:24`

**Código:**

```typescript
const NETWORK_ERROR = 'No hemos podido conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.';
```

**Problema:** La misma frase de error aparece siete veces. Si se corrige el texto (un acento, un tono distinto), hay que cambiarlo en todos los sitios.

**Impacto:** Bajo en riesgo funcional, pero es el ejemplo más claro de texto de interfaz duplicado que debería vivir en un único sitio.

**Refactor sugerido:** Exportar `NETWORK_ERROR` desde `api/client.ts` (que ya es la capa que sabe de red) y eliminar las siete copias.

---

### Longitud de parámetros: `sendMessage` con cuatro posicionales (Long Parameter List) - Severidad: 🟡

**Ubicación:** `api/client.ts:156`

**Código:**

```typescript
export function sendMessage(productId: number, body: string, token: string, buyerId?: number | null): Promise<Message> {
```

**Problema:** Cuatro parámetros posicionales, y el último es opcional y admite `null`. Dos de ellos (`productId` y `buyerId`) son números, así que el orden se puede confundir sin que TypeScript proteste. En la misma API, `getMessages` ya usa un objeto de opciones (`MessagesQuery`), por lo que la convención no es coherente.

**Impacto:** Una llamada como `sendMessage(id, body, token, buyerId)` intercambiada por error compila y puede enviar un mensaje a la conversación equivocada.

**Refactor sugerido:** Pasar un objeto, igual que `getMessages`:

```typescript
export function sendMessage(
  { productId, body, buyerId }: { productId: number; body: string; buyerId?: number | null },
  token: string,
): Promise<Message> {
```

Es un cambio pequeño y lo usan solo `hooks/useThread.ts` y los tests.

---

### Props drilling de `token` y `onUnauthorized` (Props Drilling) - Severidad: 🟡

**Ubicación:** `pages/ChatPage.tsx:90` (define `onUnauthorized`), `pages/ChatPage.tsx:33` y `:115` (`ThreadPane`), `components/ChatThread.tsx:21-22` y `:25`, `hooks/useThread.ts:18-19`

**Código:**

```tsx
// pages/ChatPage.tsx
<ThreadPane productId={productId} buyerParam={buyerParam} userId={userId} token={token} onUnauthorized={onUnauthorized} />
// ... ThreadPane pasa token y onUnauthorized a ChatThread, que los pasa a useThread
```

**Problema:** `token` y `onUnauthorized` viajan por tres niveles de componentes. Ninguno de los intermedios los usa; solo los reenvían. `AuthContext` ya da el token y el `logout` a cualquier componente con `useAuth()`.

**Impacto:** Añadir una pantalla de chat o cambiar la forma de cerrar sesión obliga a cambiar las firmas de tres componentes. Es el antipatrón que describe la lista de React.

**Refactor sugerido:** Que `useThread` y `useConversations` lean el token con `useAuth()` y usen el hook de sesión caducada del smell anterior. Así `ChatPage`, `ThreadPane` y `ChatThread` no reciben esas props.

---

### Método largo en `UploadPage` (Long Method / Large Component) - Severidad: 🟡

**Ubicación:** `pages/UploadPage.tsx:57-238` (componente completo), `pages/UploadPage.tsx:102-155` (función `submit`)

**Código:**

```tsx
const submit = async (event: FormEvent) => {
  // validación, subida de foto en dos pasos, creación del producto,
  // manejo de 401, de 413/415, de error de red y de estados de envío
  // ... 50 líneas
};
```

**Problema:** Un solo componente de 238 líneas mezcla: estado del formulario, validación, subida de foto con reintento, creación del producto, traducción de errores HTTP a mensajes, sugerencias de categoría (`useCategorySuggestions`) y el diseño de la página. `submit` tiene cinco salidas distintas.

**Impacto:** Cuesta probar la lógica de subida sin montar la pantalla. El reintento con `uploaded.current` es delicado y está enterrado en el componente.

**Refactor sugerido:** Extraer un hook `usePublishProduct()` que devuelva `{ publish, step, formError }` y deje en el componente solo el render. `useCategorySuggestions` ya está bien aislado y puede moverse a `hooks/`.

---

### Números mágicos en la animación del fondo (Magic Numbers) - Severidad: 🟡

**Ubicación:** `components/WaveField.tsx:37-38` (`-1000`), `:68` (`1.5`), `:79` (`0.75`), `:86` (`0.9`), `:98` y `:116` (`0.01`), `:108` (`1000`)

**Código:**

```tsx
context.globalAlpha = 0.75 * intensity;   // línea 79
context.globalAlpha = 0.9 * intensity;    // línea 86
if (!active && intensity < 0.01) {        // línea 98
// ...
if (!active && intensity < 0.01) {        // línea 116
```

**Problema:** Las constantes de la animación ya tienen nombre (`LINE_GAP`, `RADIUS`, `FOLLOW`...), pero las opacidades (`0.75`, `0.9`), el grosor de línea (`1.5`), el umbral de apagado (`0.01`, dos veces) y la posición "fuera de pantalla" (`-1000`) no. El umbral aparece duplicado en la misma función.

**Impacto:** Ajustar la sensación de la animación requiere leer el bucle entero para encontrar cada número. Si se cambia el umbral en una línea y no en la otra, el fondo se apaga en un momento y se reanima en otro.

**Refactor sugerido:** Añadir `LINE_WIDTH`, `DEEP_ALPHA`, `BRIGHT_ALPHA`, `OFF_SCREEN` y `SWITCH_OFF_INTENSITY` a las constantes del fichero, y usar `SWITCH_OFF_INTENSITY` en las dos comprobaciones.

---

### Números mágicos en los esqueletos de carga (Magic Numbers) - Severidad: ⚠ - Resuelto en `refactor/magic-numbers` (PR #17)

> Nota: esta sección describe el código antes de PR #17. `ConversationList.tsx` (`SKELETON_ROWS`) y `SalesPage.tsx` (`SKELETON_COLUMNS`) ya usan constantes con nombre en `main`.

**Ubicación original:** `components/ConversationList.tsx:37` (`[0, 1, 2, 3].map`), `pages/SalesPage.tsx:127` (`[0, 1, 2].map`), `pages/ListingPage.tsx:11` (`SKELETON_COUNT = 6`)

**Código:**

```tsx
// components/ConversationList.tsx
{[0, 1, 2, 3].map((row) => (
```

**Problema:** `ListingPage` ya usa una constante con nombre (`SKELETON_COUNT`). Los otros dos esqueletos usan arrays literales. Es una inconsistencia menor, pero `no-magic-numbers` avisa por el `2` y el `3` de ConversationList.tsx:37 y el `2` de SalesPage.tsx:127.

**Impacto:** Bajo. Solo afecta a la coherencia del código.

**Refactor sugerido:** Constantes `SKELETON_ROWS` en cada componente, o una función compartida `skeletonKeys(n)`.

---

### Precio: formato centralizado, pero con parseo repetido en el render (Primitive Obsession) - Severidad: ⚠

**Ubicación:** `pages/UploadPage.tsx:71` (`const price = parsePrice(values.price);`), `pages/UploadPage.tsx:229` (`price !== null ? formatPrice(price) : null`), `components/ListingPreview.tsx:25` (`'— €'`)

**Código:**

```tsx
// pages/UploadPage.tsx
const price = parsePrice(values.price);          // se recalcula en cada render
// ...
price={price !== null ? formatPrice(price) : null}
```

**Problema:** El formateo del precio sí está bien centralizado (`formatPrice` en `utils/format.ts` lo usan siete componentes). El problema es de tipo: el precio se guarda como texto en el formulario y se convierte a número en cada render. La marca `'— €'` de `ListingPreview` es un literal que repite el símbolo que `formatPrice` ya sabe poner.

**Impacto:** Bajo. No hay bug, pero la vista previa y el envío dependen de dos conversiones distintas (`parsePrice` aquí y en `validateProduct`).

**Refactor sugerido:** Que `ListingPreview` reciba el precio ya formateado o `null` y el símbolo de "sin precio" venga de `format.ts`. Mantener `parsePrice` como única fuente de la conversión.

---

### Efecto con dependencias suprimidas (Smell de React: dependencias ocultas) - Severidad: ⚠

**Ubicación:** `hooks/useSales.ts:33-35`

**Código:**

```typescript
// onUnauthorized cambia en cada render del padre; solo importa al cargar o reintentar
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [token, userId, attempt]);
```

**Problema:** El comentario explica por qué se omite `onUnauthorized`, pero el efecto sigue leyendo esa función. Si la dependencia cambia de significado, el efecto usará una versión antigua sin aviso.

**Impacto:** Bajo mientras `onUnauthorized` sea estable en la práctica. Es un atajo que se perdería de vista.

**Refactor sugerido:** Guardar la función en un `useRef` (o usar `useEffectEvent` si la versión de React lo permite) en vez de suprimir la regla. Es la misma solución que resuelve el props drilling anterior.

---

## ✅ Revisado sin smell relevante

- **Magic numbers de validación:** `NAME_MIN`, `PASSWORD_MAX`, `PRICE_PATTERN`, `MAX_IMAGE_BYTES` ya tienen nombre en `utils/validation.ts`. Los avisos de lint que quedaban en ese fichero (`2`, `5` y `1024`) se resolvieron en PR #17 con `AT_SIGN_PARTS`, `KILOBYTE`, `BYTES_PER_MB` y `MAX_IMAGE_MB`.
- **Dead code:** solo se comprobaron a mano algunas funciones exportadas (`normalize`, `formatRelativeDate`, `getTokenExpiry`, `isValidEmail`, `MAX_IMAGE_BYTES`): todas tienen uso fuera de sus tests. No se ha hecho una búsqueda exhaustiva de exports ni de imports sin usar; para eso, `ts-prune` o `knip` darían una lista completa.
- **Long Parameter List en el resto:** `useSales(token, userId, onUnauthorized)` tiene tres parámetros, en el límite. El resto de funciones usan objetos o tienen dos.

## Notas sobre el scope

- El prompt pedía buscar "validación de cantidad" y `0.15` como magic number. En Kambio no existe el concepto de cantidad (cada producto es único) y no hay ningún `0.15` en el código de producción.
- El formateo de precios sí se repite, pero la lógica está centralizada: el duplicado real es el de las constantes de límites (ver más arriba), no el formato.
