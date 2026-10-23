import { useState } from "react";
import { loginUser } from "../api/client.js";

export default  function LoginPage({ onLogin }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();
        setError('');
        try {
            // La API (OAuth2) llama "username" a este campo, pero lo que se envía es el email
            const data = await loginUser('login', email, password);
            onLogin(data.access_token);
        } catch (error) {
            setError(error.message);
        }
    };
    return (

        <div className=" bg-slate-900 text-white flex items-center justify-center">
            <form onSubmit={handleLogin} className="flex flex-col gap-4 ">
                <input className="w-full max-w-md bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700"
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                    <input className="w-full max-w-md bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700"
                    type="password"
                    placeholder="Password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p role="alert" className="text-red-400 text-sm">{error}</p>}
                <button
                    type="submit"
                    className=" w-full max-w-md bg-sky-500 hover:bg-sky-700 text-white font-bold p-6 rounded-xl shadow-lg border border-sky-700"
                >
                    Login
                </button>
            </form>
        </div>
    )
}
