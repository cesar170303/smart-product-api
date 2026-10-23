import type { ProductStatus } from '../api/types';

// Cada estado conserva siempre el mismo color Y la misma forma (lleno, con borde, punteado),
// así no depende solo del color para distinguirse.
const STATUS: Record<ProductStatus, { label: string; className: string }> = {
  available: {
    label: 'En venta',
    className: 'bg-violet text-paper',
  },
  reserved: {
    label: 'Pendiente de envío',
    className: 'border-[1.5px] border-amber text-amber',
  },
  sold: {
    label: 'Vendido',
    className: 'border-[1.5px] border-dashed border-ink-faint text-ink-faint',
  },
};

export default function StatusTag({ status }: { status: ProductStatus }) {
  const { label, className } = STATUS[status];
  return (
    <span className={`inline-block rounded-md px-2.5 py-0.5 text-[13px] leading-5 font-semibold whitespace-nowrap ${className}`}>
      {label}
    </span>
  );
}
