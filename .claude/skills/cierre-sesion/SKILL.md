---
name: cierre-sesion
description: Actualiza la memoria de Kambio antes de cerrar la sesión. Revisa project_memory.md, CHANGELOG.md si hubo features o fixes, CLAUDE.md si cambió la arquitectura y las memorias personales. Úsala al terminar cada sesión de trabajo.
---

# Cierre de sesión (Kambio)

Objetivo: que la siguiente sesión arranque sin releer nada. Antes de editar cada archivo, di en una línea qué vas a cambiar. No hagas commit: solo cuando César lo pida.

## Pasos

1. **Qué cambió.** Ejecuta `git status --short` y `git log --oneline` desde el último commit que aparezca en `project_memory.md`. Identifica qué se hizo en esta sesión.

2. **`project_memory.md`** (estado, máximo ~80 líneas):
   - Actualiza "Estado de un vistazo" con la rama, el último commit y los cambios sin commitear.
   - Añade a "Hecho recientemente" lo de esta sesión (máximo 5 líneas). Quita lo más antiguo.
   - En "Pendientes", quita lo resuelto y añade lo nuevo.
   - En "Fallos conocidos", quita lo corregido y añade lo que haya aparecido.
   - Pon fechas absolutas (`2026-10-23`), nunca "hoy" o "ayer".

3. **Versión y changelog.** Solo si esta sesión cerró una feature o un fix terminado:
   - Sube `version` en `frontend/package.json` (feature = minor, fix = patch).
   - Añade la entrada en `CHANGELOG.md` (Añadido/Cambiado, Corregido, Fallos conocidos).
   - Si el trabajo sigue a medias, no subas la versión: anótalo en `project_memory.md`.

4. **`CLAUDE.md`.** Solo si cambió algo que no es estado: arquitectura, convenciones, comandos o variables de entorno. No metas aquí pendientes ni fechas.

5. **Memoria personal** en `C:\Users\cesar\.claude\projects\C--Users-cesar-Desktop-master-IA-smart-product-app\memory\`:
   - Lee `MEMORY.md` y los archivos que enlaza. Si no existe, la carpeta está vacía: crea solo las memorias que tengan contenido real.
   - Corrige o borra los hechos que ya no sean ciertos.
   - Guarda solo lo que no se deduce del código ni de git: decisiones de César, preferencias y correcciones de cómo trabajar.
   - No dupliques lo que ya está en `CLAUDE.md` o `project_memory.md`.

6. **Verificación.** Comprueba que los enlaces de `CLAUDE.md` y `project_memory.md` apuntan a archivos que existen.

7. **Respuesta.** Resume en 3 a 6 líneas: qué se actualizó y qué queda abierto.
