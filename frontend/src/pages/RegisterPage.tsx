import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { ApiError, loginUser, registerUser } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import AuthShell from '../components/AuthShell';
import FormAlert from '../components/FormAlert';
import { PRIMARY_BUTTON } from '../components/styles';
import TextField from '../components/TextField';
import { loginPath } from '../utils/routes';
import { reasonFor, safeNext, validateRegister, type FieldErrors, type RegisterValues } from '../utils/validation';

const NETWORK_ERROR = 'No hemos podido conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.';
const HTTP_CONFLICT = 409;
const FIELD_ORDER = ['name', 'email', 'password', 'location'] as const;

function focusField(id: string) {
  document.getElementById(id)?.focus();
}

export default function RegisterPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = safeNext(params.get('next'));

  const [values, setValues] = useState<RegisterValues>({ name: '', email: '', password: '', location: '' });
  const [errors, setErrors] = useState<FieldErrors<keyof RegisterValues>>({});
  const [formError, setFormError] = useState('');
  const [sending, setSending] = useState(false);
  const [attempted, setAttempted] = useState(false);

  if (isAuthenticated) return <Navigate to={next} replace />;

  const update = (field: keyof RegisterValues, value: string) => {
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);
    if (attempted) setErrors(validateRegister(nextValues));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError('');
    setAttempted(true);

    const found = validateRegister(values);
    setErrors(found);
    const firstInvalid = FIELD_ORDER.find((field) => found[field]);
    if (firstInvalid) {
      focusField(`register-${firstInvalid}`);
      return;
    }

    setSending(true);
    const email = values.email.trim();
    try {
      await registerUser(values.name.trim(), email, values.password, values.location.trim());
    } catch (caught) {
      setSending(false);
      if (caught instanceof ApiError && caught.status === HTTP_CONFLICT) {
        // El email repetido es un fallo del campo, no del formulario entero
        setErrors({ email: caught.message });
        focusField('register-email');
      } else {
        setFormError(caught instanceof ApiError ? caught.message : NETWORK_ERROR);
      }
      return;
    }

    // Cuenta creada: se entra directamente, sin pedir los mismos datos otra vez
    try {
      const data = await loginUser(email, values.password);
      login(data.access_token);
    } catch {
      navigate(loginPath(next), {
        replace: true,
        state: { notice: 'Tu cuenta está creada. Entra con tu email y tu contraseña.' },
      });
    }
  };

  return (
    <AuthShell mode="register" next={next} reason={reasonFor(next)}>
      <form onSubmit={submit} noValidate className="flex flex-col gap-5">
        <h1 className="font-display text-[32px] leading-tight font-extrabold tracking-[-0.01em]">Crear cuenta</h1>

        <TextField
          id="register-name"
          label="Nombre"
          autoComplete="name"
          value={values.name}
          onChange={(value) => update('name', value)}
          error={errors.name}
          hint="Es el nombre que verán los compradores."
        />
        <TextField
          id="register-email"
          label="Email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(value) => update('email', value)}
          error={errors.email}
        />
        <TextField
          id="register-password"
          label="Contraseña"
          type="password"
          autoComplete="new-password"
          value={values.password}
          onChange={(value) => update('password', value)}
          error={errors.password}
          hint="Mínimo 8 caracteres."
        />
        <TextField
          id="register-location"
          label="Ciudad"
          autoComplete="address-level2"
          optional
          value={values.location}
          onChange={(value) => update('location', value)}
          error={errors.location}
          hint="Aparece en tus anuncios."
        />

        {formError && <FormAlert>{formError}</FormAlert>}

        <button type="submit" disabled={sending} className={`mt-1 h-14 w-full text-lg ${PRIMARY_BUTTON}`}>
          {sending ? 'Creando tu cuenta…' : 'Crear cuenta'}
        </button>
      </form>
    </AuthShell>
  );
}
