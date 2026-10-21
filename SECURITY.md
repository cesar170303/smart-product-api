# Política de seguridad

## Versiones soportadas

El proyecto todavía no publica versiones numeradas. Solo se mantiene la rama `main`: los arreglos de seguridad se aplican ahí y no se portan a commits anteriores.

| Versión | Soportada          |
| ------- | ------------------ |
| `main`  | :white_check_mark: |
| Commits anteriores | :x: |

## Cómo informar de una vulnerabilidad

**No abras un issue público** para informar de un problema de seguridad: cualquiera podría aprovecharlo antes de que esté resuelto.

1. Ve a la pestaña **Security** del repositorio y pulsa **Report a vulnerability** (aviso privado de GitHub).
2. Describe el problema con el mayor detalle posible:
   - Endpoint o archivo afectado.
   - Pasos para reproducirlo.
   - Impacto que crees que tiene (acceso sin autenticación, fuga de datos, etc.).
3. No incluyas datos reales de usuarios ni claves en el informe.

### Qué puedes esperar

- Respuesta inicial en un plazo de **7 días**.
- Si se confirma, se trabajará en un arreglo y se te avisará cuando esté en `main`. Si quieres, se te mencionará en el commit o en las notas del arreglo.
- Si se descarta, se te explicará el motivo.

Este es un proyecto personal de aprendizaje, así que los plazos son orientativos.

## Medidas de seguridad actuales

- **Contraseñas** guardadas con hash **Argon2** (`pwdlib`); nunca en texto plano ni en las respuestas de la API.
- **JWT** firmado con un algoritmo HMAC (`HS256`/`HS384`/`HS512`); en cada ruta protegida se verifica la firma, la caducidad y el usuario (`sub`).
- **Configuración validada al arrancar**: la app no se inicia si falta `SECRET_KEY` o si `ALGORITHM` o `ACCESS_TOKEN_EXPIRE_MINUTES` no son válidos.
- **Rate limiting** con `slowapi` en `/login` y `/products`.
- **CORS** restringido al frontend local (`http://localhost:5173` y `http://127.0.0.1:5173`).
- **DTOs públicos** (`*Public`) para no exponer campos internos como `provider_secret_cost`.
- **Secretos fuera del repositorio**: `backend/.env` está en `.gitignore`.
