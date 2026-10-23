# Estado del proyecto · Kambio

> Actualizado: 2026-10-23 · Rama: `feat/kambio-frontend-and-chat` · Versión: 0.8.0 (`frontend/package.json`)

## Estado de un vistazo

- **Backend**: marketplace completo (usuarios y roles, productos con foto, pedidos, chat). `python -m unittest` → 28 tests OK.
- **Frontend**: TypeScript con las seis pantallas más login y registro. `vitest run` → 163 tests OK en 17 ficheros. `typecheck` limpio. `lint` → 0 errores, 27 warnings.
- **Git**: todo commiteado en la rama. Último commit: `7829cb7 docs: add Kambio product and design documentation`. Sin commitear: `CLAUDE.md`, `project_memory.md` y las skills nuevas (`.claude/skills/`).

## Hecho recientemente

- **0.5.0**: marketplace de 4 tablas, roles `user`/`admin`, permisos por dueño y pedidos.
- **0.6.0**: subida de fotos de producto.
- **0.7.0**: página de registro.
- **0.8.0**: chat entre comprador y vendedor (backend y frontend) y frontend reescrito en TypeScript.

## Pendientes

1. **Sin migraciones (Alembic).** Cambiar un modelo no actualiza una BD que ya existe.
3. **Tests**: el backend solo tiene pruebas del chat, con repositorios falsos. Faltan pruebas de endpoints y de repositorios contra una BD real. El frontend no tiene pruebas end-to-end.
4. **Búsqueda**: no hay `?q=` en el backend; el filtrado se hace en el cliente.
5. **Sin endpoint "mi usuario"**: el id sale del claim `sub` del JWT (`frontend/src/utils/jwt.ts`).
6. **Una sola foto por producto** y **sin valoraciones ni número de ventas del vendedor**. La interfaz no debe inventarlos.
7. **CORS** solo admite `localhost`. Hay que ampliarlo al desplegar.
8. **Rate limit** de `/products`: escrituras 30/min por IP, lecturas 120/min. Revisar si es suficiente cuando la app se use de verdad.

## Fallos conocidos

- Los contadores del rate limit viven en memoria: se reinician al reiniciar uvicorn y no se comparten entre workers.
- 27 warnings de lint (sobre todo `no-magic-numbers`), sin errores.
- `use_cases/GetGroductId.py`: el nombre tiene un typo. El contenido es correcto.

## Decisiones tomadas (no reabrir sin motivo)

- El precio es el que escribe el vendedor, sin recálculo por categoría. Decidido por César el 2026-10-23. `services/pricing.py` se eliminó: no lo usaba ningún endpoint desde `9dd6c71`.
- Los enums se guardan como texto con `CHECK`, no con el tipo ENUM nativo de PostgreSQL (sin Alembic es incómodo añadir valores).
- El rol nunca viene del JSON de registro.
- `/login` verifica siempre una contraseña, aunque el email no exista, para que el tiempo de respuesta no revele qué cuentas existen.
- Las fotos se validan con Pillow y el `image_url` solo puede ser una ruta devuelta por `POST /uploads`.
- Estados: producto `available` / `reserved` / `sold`; pedido `pending` / `completed` / `cancelled`.
- Interfaz en español, precios en euros, modo oscuro con acento violeta.
