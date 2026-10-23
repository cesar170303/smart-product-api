import { useEffect, useRef } from 'react';

// Ejecuta `task` nada más montarse y luego cada `intervalMs`, pero solo mientras la pestaña esté visible.
// Al volver a la pestaña lanza una consulta enseguida, para no enseñar datos viejos.
// `task` recibe una señal que se cancela al desmontar o al cambiar `deps`.
// Si una consulta tarda más que el intervalo, no se apilan: se salta la siguiente.
export function usePolling(task: (signal: AbortSignal) => Promise<void>, intervalMs: number, deps: unknown[]) {
  const taskRef = useRef(task);
  useEffect(() => {
    taskRef.current = task;
  });

  useEffect(() => {
    const controller = new AbortController();
    let running = false;

    const run = async () => {
      if (running || controller.signal.aborted) return;
      running = true;
      try {
        await taskRef.current(controller.signal);
      } finally {
        running = false;
      }
    };

    void run();
    const timer = setInterval(() => {
      if (!document.hidden) void run();
    }, intervalMs);
    const onVisible = () => {
      if (!document.hidden) void run();
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      controller.abort();
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intervalMs, ...deps]);
}
