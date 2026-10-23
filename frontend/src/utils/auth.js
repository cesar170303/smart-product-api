const TOKEN_KEY = 'access_token';

// sessionStorage: el token se borra al cerrar la pestaña. Está dentro de try/catch porque
// puede lanzar error (ej. navegación privada con el almacenamiento bloqueado).
export function getToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function saveToken(token) {
  try {
    sessionStorage.setItem(TOKEN_KEY, token);
  } catch {
    // sin almacenamiento: la sesión dura hasta que se recargue la página
  }
}

export function clearToken() {
  try {
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    // nada que borrar
  }
}
