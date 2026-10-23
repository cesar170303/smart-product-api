import { useState } from "react";
import LoginPage from "./pages/LoginPage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import { clearToken, getToken, saveToken } from "./utils/auth.js";

export default function App() {
  const [token, setToken] = useState(() => getToken());

  const handleLogin = (newToken) => {
    saveToken(newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    clearToken();
    setToken(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-start gap-4 p-4">
      {token ? (
        <ProductsPage token={token} onLogout={handleLogout} />
      ) : (
        <>
          <h1 className="text-3xl font-bold text-sky-400 bg-slate-800 p-8 rounded-xl shadow-lg text-center w-full max-w-md ">
            Bienvenido a la aplicación
          </h1>
          <LoginPage onLogin={handleLogin} />
        </>
      )}
    </div>
  )

}
