const PRICE_WHOLE = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const PRICE_DECIMALS = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });

// 120 -> "120 €"; 12,5 -> "12,50 €". Los enteros salen sin decimales para que el precio se lea de un vistazo
export function formatPrice(price: number): string {
  return Number.isInteger(price) ? PRICE_WHOLE.format(price) : PRICE_DECIMALS.format(price);
}

const RELATIVE = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });
const MS_PER_SECOND = 1000;
// Segundos que dura cada unidad, de mayor a menor
const SECONDS_PER = { year: 31_536_000, month: 2_592_000, week: 604_800, day: 86_400, hour: 3600, minute: 60 };
const UNIT_ORDER = ['year', 'month', 'week', 'day', 'hour', 'minute'] as const;

// "2026-10-21T10:00Z" -> "anteayer", "hace 3 días"... Recibe la fecha actual para poder probarlo sin depender del reloj
export function formatRelativeDate(iso: string, now: number = Date.now()): string {
  const seconds = Math.round((Date.parse(iso) - now) / MS_PER_SECOND);
  for (const unit of UNIT_ORDER) {
    if (Math.abs(seconds) >= SECONDS_PER[unit]) return RELATIVE.format(Math.round(seconds / SECONDS_PER[unit]), unit);
  }
  return 'hace un momento';
}

const CLOCK = new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' });
const DAY = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' });
const MS_PER_DAY = 86_400_000;

// Hora local de un mensaje: "14:05"
export function formatClock(iso: string): string {
  return CLOCK.format(new Date(iso));
}

// Día de un mensaje: "Hoy", "Ayer" o "12 oct". Compara días del calendario local, no tramos de 24 horas.
export function formatDayLabel(iso: string, now: number = Date.now()): string {
  const date = new Date(iso);
  const startOfDay = (value: Date) => new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
  const daysAgo = Math.round((startOfDay(new Date(now)) - startOfDay(date)) / MS_PER_DAY);
  if (daysAgo === 0) return 'Hoy';
  if (daysAgo === 1) return 'Ayer';
  return DAY.format(date).replace('.', '');
}

// Quita acentos y mayúsculas: "Cámara" y "camara" son la misma búsqueda
export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}
