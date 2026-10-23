import { useState } from "react";
import { loginUser, registerUser } from "../api/client.js";

export default function RegisterPage({ onLogin, onShowLogin }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);
        try {
            await registerUser(name, email, password);
            // Para poder probar rápido: tras registrarse se hace login con las mismas credenciales
            const data = await loginUser('login', email, password);
            onLogin(data.access_token);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-900 text-white flex flex-col items-center justify-center gap-4 w-full max-w-md">
            <form onSubmit={handleRegister} className="flex flex-col gap-4 w-full">
                <input className="w-full bg-slate-800 p-3 rounded-xl shadow-lg border border-slate-700"
                    type="text"
                    placeholder="Nombre"
                    autoComplete="name"
                    minLength={2}
                    maxLength={100}
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input className="w-full bg-slate-800 p-3 rounded-xl shadow-lg border border-slate-700"
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input className="w-full bg-slate-800 p-3 rounded-xl shadow-lg border border-slate-700"
                    type="password"
                    placeholder="Contraseña (mínimo 8 caracteres)"
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={128}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p role="alert" className="text-red-400 text-sm">{error}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-sky-500 hover:bg-sky-700 disabled:opacity-50 text-white font-bold p-3 rounded-xl shadow-lg border border-sky-700"
                >
                    {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                </button>
            </form>
            <button type="button" onClick={onShowLogin} className="text-sky-400 hover:underline text-sm">
                Ya tengo cuenta
            </button>
        </div>
    )
}
