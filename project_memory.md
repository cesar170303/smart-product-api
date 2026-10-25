# Estado del proyecto · Kambio

> Actualizado: 2026-10-25 · Rama: `docs/code-smells-analysis` · Versión: 0.9.0 (`frontend/package.json`)

## Estado de un vistazo

- **Backend**: marketplace completo (usuarios y roles, productos con foto, pedidos, chat, subida segura de fotos). `python -m unittest discover -s tests -t .` → 41 tests OK.
- **Frontend**: TypeScript con las seis pantallas más login y registro. `vitest run` → 163 tests OK en 17 ficheros. `typecheck` limpio. `lint` → 0 errores (hay warnings de `no-magic-numbers` y de literales duplicados en tests).
- **Git**: sin commitear. Último commit: `54e1f93 docs: add manual code smells analysis of the frontend`. Cambios pendientes de commit: popup `BusyDialog` en la subida, subida segura de fotos (backend), versión 0.9.0 y su entrada en `CHANGELOG.md`. Los PR #15 y #16 (eliminación de pricing) ya están mergeados.

## Hecho recientemente

- **0.9.0 (2026-10-25)**: aviso a pantalla completa (`BusyDialog`) mientras se sube la foto y mientras la IA elige la categoría.
- **0.9.0 (2026-10-25)**: subida segura de fotos. La extensión y la firma del archivo deben coincidir; tabla `uploaded_files` con nombre original y de almacenamiento; `/media` es una ruta propia con `nosniff`.
- **2026-10-23**: eliminado `services/pricing.py` (`31e81ae`) y `.claude/launch.json` ignorado por git (`0d62fb1`).
- **2026-10-23**: análisis manual de code smells del frontend (`54e1f93`).
- **2026-10-23**: `CLAUDE.md`, `project_memory.md` y las skills `inicio-sesion` / `cierre-sesion` añadidos al repo.

## Pendientes

1. **Probar la subida segura contra PostgreSQL real.** Solo se ha probado con SQLite en memoria y TestClient.
2. **Ver el aviso de publicación en el navegador.** Los tests lo cubren, pero no se ha mirado en pantalla. Decidir si `BusyDialog` necesita bloquear el foco con Tab.
3. **Sin migraciones (Alembic).** Cambiar un modelo no actualiza una BD que ya existe. Las tablas nuevas sí se crean.
4. **Tests**: el backend tiene pruebas del chat, los productos y la subida, con repositorios falsos. Faltan pruebas de endpoints y de repositorios contra una BD real. El frontend no tiene pruebas end-to-end.
5. **Búsqueda**: no hay `?q=` en el backend; el filtrado se hace en el cliente.
6. **Sin endpoint "mi usuario"**: el id sale del claim `sub` del JWT (`frontend/src/utils/jwt.ts`).
7. **Una sola foto por producto** y **sin valoraciones ni número de ventas del vendedor**. La interfaz no debe inventarlos.
8. **CORS** solo admite `localhost`. Hay que ampliarlo al desplegar.
9. **Rate limit** de `/products`: escrituras 30/min por IP, lecturas 120/min. Revisar si es suficiente cuando la app se use de verdad.

## Fallos conocidos

- Los contadores del rate limit viven en memoria: se reinician al reiniciar uvicorn y no se comparten entre workers.
- Las fotos subidas antes de 0.9.0 no tienen fila en `uploaded_files`, así que no tienen nombre original.
- `/media` ya no atiende peticiones HEAD (antes lo hacía `StaticFiles`).
- Warnings de lint (sobre todo `no-magic-numbers`), sin errores.
- `use_cases/GetGroductId.py`: el nombre tiene un typo. El contenido es correcto.

## Decisiones tomadas (no reabrir sin motivo)

- El precio es el que escribe el vendedor, sin recálculo por categoría. Decidido por César el 2026-10-23. `services/pricing.py` se eliminó: no lo usaba ningún endpoint desde `9dd6c71`.
- Los enums se guardan como texto con `CHECK`, no con el tipo ENUM nativo de PostgreSQL (sin Alembic es incómodo añadir valores).
- El rol nunca viene del JSON de registro.
- `/login` verifica siempre una contraseña, aunque el email no exista, para que el tiempo de respuesta no revele qué cuentas existen.
- Las fotos se validan con Pillow, la firma del archivo debe coincidir con su extensión, y el `image_url` solo puede ser una ruta devuelta por `POST /uploads`.
- `/media` es una ruta propia (no `StaticFiles`): solo sirve nombres con nuestro formato y añade `nosniff`.
- Estados: producto `available` / `reserved` / `sold`; pedido `pending` / `completed` / `cancelled`.
- Interfaz en español, precios en euros, modo oscuro con acento violeta.
