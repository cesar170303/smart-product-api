import { Link } from 'react-router-dom';
import PageShell from '../components/PageShell';

interface ComingSoonPageProps {
  title: string;
  // número de pantalla en el plan de trabajo
  screen: number;
}

// Marcador de una pantalla que todavía no se ha construido. Se sustituye pantalla a pantalla.
export default function ComingSoonPage({ title, screen }: ComingSoonPageProps) {
  return (
    <PageShell>
      <section className="max-w-xl rounded-2xl border-[1.5px] border-dashed border-line p-8">
        <h1 className="font-display text-3xl font-extrabold">{title}</h1>
        <p className="mt-2 text-ink-dim">Esta pantalla aún no está construida: es la número {screen} del plan.</p>
        <Link to="/" className="mt-5 inline-block font-semibold text-violet-soft underline underline-offset-4 hover:text-ink">
          ← Volver al listado
        </Link>
      </section>
    </PageShell>
  );
}
