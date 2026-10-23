// Ruta del login que, tras entrar, devuelve a la persona a donde estaba (parámetro "next")
export function loginPath(next: string): string {
  return `/login?next=${encodeURIComponent(next)}`;
}
