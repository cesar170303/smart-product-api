import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { ApiError, loginUser } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import AuthShell from '../components/AuthShell';
import FormAlert from '../components/FormAlert';
import { PRIMARY_BUTTON } from '../components/styles';
import TextField from '../components/TextField';
import { reasonFor, safeNext, validateLogin, type FieldErrors, type LoginValues } from '../utils/validation';

const NETWORK_ERROR = 'No hemos podido conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.';

function focusField(id: string) {
  document.getElementById(id)?.focus();
}

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const [params] = useSearchParams();
  const location = useLocation();
  const next = safeNext(params.get('next'));

  const [values, setValues] = useState<LoginValues>({ email: '', password: '' });
  const [errors, setErrors] = useState<FieldErrors<keyof LoginValues>>({});
  const [formError, setFormError] = useState('');
  const [sending, setSending] = useState(false);
  const [attempted, setAttempted] = useState(false);

  // Aviso que deja la pantalla de registro cuando la cuenta se creó pero el acceso automático falló
  const notice = (location.state as { notice?: string } | null)?.notice;

  // Quien ya tiene sesión no tiene nada que hacer aquí
  if (isAuthenticated) return <Navigate to={next} replace />;

  const update = (field: keyof LoginValues, value: string) => {
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);
    // Tras el primer intento fallido, los avisos se actualizan mientras se corrige
    if (attempted) setErrors(validateLogin(nextValues));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError('');
    setAttempted(true);

    const found = validateLogin(values);
    setErrors(found);
    const firstInvalid = (['email', 'password'] as const).find((field) => found[field]);
    if (firstInvalid) {
      focusField(`login-${firstInvalid}`);
      return;
    }

    setSending(true);
    try {
      const data = await loginUser(values.email.trim(), values.password);
      // Al guardar el token, isAuthenticated cambia y el <Navigate> de arriba vuelve a donde ibas
      login(data.access_token);
    } catch (caught) {
      setSending(false);
      setFormError(caught instanceof ApiError ? caught.message : NETWORK_ERROR);
      // Si la contraseña falla, el cursor vuelve a ella para reintentar
      focusField('login-password');
    }
  };

  return (
    <AuthShell mode="login" next={next} reason={reasonFor(next)}>
      <form onSubmit={submit} noValidate className="flex flex-col gap-5">
        <h1 className="font-display text-[32px] leading-tight font-extrabold tracking-[-0.01em]">Entrar</h1>

        {notice && <FormAlert role="status">{notice}</FormAlert>}

        <TextField
          id="login-email"
          label="Email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(value) => update('email', value)}
          error={errors.email}
        />
        <TextField
          id="login-password"
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          value={values.password}
          onChange={(value) => update('password', value)}
          error={errors.password}
        />

        {formError && <FormAlert>{formError}</FormAlert>}

        <button type="submit" disabled={sending} className={`mt-1 h-14 w-full text-lg ${PRIMARY_BUTTON}`}>
          {sending ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </AuthShell>
  );
}
