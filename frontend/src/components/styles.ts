// Cada botón principal lleva su segunda pasada de tinta desplazada; al enfocar o pulsar, el botón se asienta sobre ella.
// El desplazamiento solo se anima para quien no ha pedido reducir el movimiento.
export const PLATE =
  'shadow-[4px_4px_0_var(--color-violet-deep)] transition-[transform,box-shadow,background-color] duration-200 ease-[var(--ease-out-expo)] motion-reduce:transition-none hover:shadow-none focus-visible:shadow-none active:shadow-none motion-safe:hover:translate-x-1 motion-safe:hover:translate-y-1 motion-safe:focus-visible:translate-x-1 motion-safe:focus-visible:translate-y-1 motion-safe:active:translate-x-1 motion-safe:active:translate-y-1';

export const PRIMARY_BUTTON = `inline-flex items-center justify-center rounded-[10px] bg-violet text-base font-semibold whitespace-nowrap text-paper hover:bg-violet-soft disabled:cursor-not-allowed disabled:opacity-60 ${PLATE}`;

export const SECONDARY_BUTTON =
  'inline-flex items-center justify-center rounded-[10px] border-[1.5px] border-ink-faint/70 text-base font-semibold whitespace-nowrap text-ink transition-colors duration-150 hover:border-violet hover:text-violet-soft';
