import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import WaveField from './components/WaveField';
import RequireAuth from './components/RequireAuth';
import ChatPage from './pages/ChatPage';
import ComingSoonPage from './pages/ComingSoonPage';
import ListingPage from './pages/ListingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SalesPage from './pages/SalesPage';
import UploadPage from './pages/UploadPage';
import ProductDetailPage from './pages/ProductDetailPage';

export default function App() {
  return (
    <AuthProvider>
      <WaveField />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ListingPage />} />
          <Route path="/producto/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route
            path="/subir"
            element={
              <RequireAuth>
                <UploadPage />
              </RequireAuth>
            }
          />
          <Route
            path="/mis-ventas"
            element={
              <RequireAuth>
                <SalesPage />
              </RequireAuth>
            }
          />
          {['/chat', '/chat/:productId'].map((path) => (
            <Route
              key={path}
              path={path}
              element={
                <RequireAuth>
                  <ChatPage />
                </RequireAuth>
              }
            />
          ))}
          <Route path="*" element={<ComingSoonPage title="Página no encontrada" screen={0} />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
