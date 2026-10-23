---
name: inicio-sesion
description: Pone al día a Claude al reabrir el proyecto Kambio. Lee project_memory.md, compara con git, pasa los tests rápidos y resume el estado. Úsala al empezar cada sesión de trabajo.
---

# Inicio de sesión (Kambio)

Objetivo: saber en qué punto estamos sin releer toda la documentación. No edites nada en esta skill.

## Pasos

1. Lee `CLAUDE.md` y `project_memory.md`. No leas `backend/.env` ni `DESIGN.md`.
2. Desde la raíz del repo, ejecuta `git status --short`, `git branch --show-current` y `git log --oneline -5`.
3. Compara con la sección "Estado de un vistazo" de `project_memory.md`:
   - Si la rama o el último commit no coinciden, dilo: alguien ha commiteado algo sin registrarlo.
   - Si hay cambios sin commitear, lístalos. No los toques.
4. Pasa los tests rápidos:
   - Frontend: `npx vitest run` desde `frontend/`.
   - Backend: `python -m unittest discover -s tests -t .` desde `backend/`, con el `.venv` de la raíz.
   - Si el backend falla por entorno (falta `DATABASE_URL`, por ejemplo), dilo tal cual. No abras `.env` para arreglarlo.
5. Responde en español con este formato:
   - **Rama y último commit**
   - **Cambios sin commitear** (o "ninguno")
   - **Tests**: resultado de cada suite
   - **Siguiente pendiente** de `project_memory.md`
   - Pregunta en qué quiere trabajar César.
