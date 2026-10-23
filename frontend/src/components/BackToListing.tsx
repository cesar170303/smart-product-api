import { useLocation, useNavigate } from 'react-router-dom';

export default function BackToListing() {
  const navigate = useNavigate();
  const location = useLocation();
  // Si llegaste desde dentro de la app, "volver" conserva tu búsqueda y tu categoría; si entraste directo, va al inicio
  const cameFromApp = location.key !== 'default';

  return (
    <button
      type="button"
      onClick={() => (cameFromApp ? navigate(-1) : navigate('/'))}
      className="font-semibold text-violet-soft underline decoration-violet-deep decoration-2 underline-offset-4 hover:text-ink"
    >
      ← Volver al listado
    </button>
  );
}
