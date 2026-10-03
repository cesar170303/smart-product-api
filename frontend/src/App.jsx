
import  LoginPage  from "./pages/LoginPage.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-start gap-4 p-4">
      <h1 className="text-3xl font-bold text-sky-400 bg-slate-800 p-8 rounded-xl shadow-lg text-center w-full max-w-md ">
        Bienvenido a la aplicación
      </h1>
      <LoginPage />
    </div>
    
  )

}