import { useState } from "react";
import { loginUser } from "../api/client.js";

export default  function LoginPage() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const data = await loginUser('login', username, password);
            console.log('Login successful:', data);
        } catch (error) {
            console.error('Error during login:', error);
        }
    };
    return (
        
        <div className=" bg-slate-900 text-white flex items-center justify-center">
            <form onSubmit={handleLogin} className="flex flex-col gap-4 ">
                <input className="w-full max-w-md bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    />
                    <input className="w-full max-w-md bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
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