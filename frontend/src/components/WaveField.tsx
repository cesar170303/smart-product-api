/* eslint-disable no-magic-numbers -- el fichero son parámetros de ajuste visual de la animación (alfas, umbrales, sigma) */
import { useEffect, useRef } from 'react';

// Papel pautado que se ondula alrededor del cursor, en las tintas de Kambio.
// Va detrás de todo (las fotos de producto nunca se tiñen) y solo dibuja mientras el ratón se mueve.
const LINE_GAP = 26;
const RADIUS = 460;
const SIGMA = 210;
const AMPLITUDE = 18;
const WAVELENGTH = 0.05;
const SPEED = 3.2;
const STEP = 8;
const IDLE_MS = 1600;
const FOLLOW = 0.14;
const FADE = 0.07;
const PLATE_OFFSET = 4;
const INK = { bright: '#8b5cf6', deep: '#5b34c9' };

export default function WaveField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    // Quien pide menos movimiento no recibe el efecto
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let dpr = 1;
    let width = 0;
    let height = 0;
    let frameId = 0;
    let running = false;
    let active = false;
    let lastMove = 0;
    let intensity = 0;
    const target = { x: -1000, y: -1000 };
    const position = { x: -1000, y: -1000 };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
    };

    // Una línea del papel pautado, deformada por ondas circulares que salen del cursor
    const buildLine = (baseY: number, time: number): Path2D => {
      const path = new Path2D();
      const from = Math.max(0, position.x - RADIUS);
      const to = Math.min(width, position.x + RADIUS);
      for (let x = from; x <= to; x += STEP) {
        const dx = x - position.x;
        const dy = baseY - position.y;
        const distance = Math.hypot(dx, dy);
        const envelope = Math.exp(-(distance * distance) / (2 * SIGMA * SIGMA));
        const y = baseY + AMPLITUDE * envelope * Math.sin(distance * WAVELENGTH - time * SPEED);
        if (x === from) path.moveTo(x, y);
        else path.lineTo(x, y);
      }
      return path;
    };

    const draw = (time: number) => {
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      context.lineWidth = 1.5;
      context.lineJoin = 'round';

      const first = Math.ceil((position.y - RADIUS) / LINE_GAP);
      const last = Math.floor((position.y + RADIUS) / LINE_GAP);
      const lines: Path2D[] = [];
      for (let index = first; index <= last; index += 1) {
        lines.push(buildLine(index * LINE_GAP, time));
      }

      // Primero la pasada profunda, desplazada; encima, la viva: el mismo registro que los precios
      context.globalAlpha = 0.75 * intensity;
      context.strokeStyle = INK.deep;
      context.save();
      context.translate(PLATE_OFFSET, PLATE_OFFSET);
      lines.forEach((line) => context.stroke(line));
      context.restore();

      context.globalAlpha = 0.9 * intensity;
      context.strokeStyle = INK.bright;
      lines.forEach((line) => context.stroke(line));
    };

    const frame = (now: number) => {
      if (active && now - lastMove > IDLE_MS) active = false;

      position.x += (target.x - position.x) * FOLLOW;
      position.y += (target.y - position.y) * FOLLOW;
      intensity += ((active ? 1 : 0) - intensity) * FADE;

      if (!active && intensity < 0.01) {
        // Se apagó del todo: se limpia el lienzo y el bucle se detiene hasta el próximo movimiento
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
        running = false;
        return;
      }

      canvas.style.setProperty('--mx', `${position.x}px`);
      canvas.style.setProperty('--my', `${position.y}px`);
      draw(now / 1000);
      frameId = requestAnimationFrame(frame);
    };

    const onMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      lastMove = performance.now();
      if (!active && intensity < 0.01) {
        // Primer movimiento tras estar apagado: las ondas nacen ya bajo el cursor, sin viajar desde otro sitio
        position.x = target.x;
        position.y = target.y;
      }
      active = true;
      if (!running) {
        running = true;
        frameId = requestAnimationFrame(frame);
      }
    };

    const onLeave = () => {
      active = false;
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 size-full"
      style={{
        maskImage: `radial-gradient(circle ${RADIUS}px at var(--mx, -999px) var(--my, -999px), #000 0%, transparent 100%)`,
        WebkitMaskImage: `radial-gradient(circle ${RADIUS}px at var(--mx, -999px) var(--my, -999px), #000 0%, transparent 100%)`,
      }}
    />
  );
}
