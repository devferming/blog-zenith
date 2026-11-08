import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Logo } from './components/Logo';
import { DbProvider, useDb } from './db/DbContext';
import { Admin } from './pages/Admin';
import { Blog } from './pages/Blog';
import { Diagnostico } from './pages/Diagnostico';
import { Equipo } from './pages/Equipo';
import { Evaluacion } from './pages/Evaluacion';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { PostPage } from './pages/PostPage';
import { Referencias } from './pages/Referencias';
import { Reto } from './pages/Reto';

function Routed() {
  const { db, error } = useDb();

  if (error) {
    return (
      <div className="loading">
        <Logo size={96} />
        <p>No se pudo iniciar la base de datos del blog.</p>
        <code>{error}</code>
      </div>
    );
  }

  if (!db) {
    return (
      <div className="loading" role="status">
        <Logo size={96} className="spin" />
        <p>Sembrando el blog…</p>
      </div>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<PostPage />} />
        <Route path="/diagnostico" element={<Diagnostico />} />
        <Route path="/reto" element={<Reto />} />
        <Route path="/evaluacion" element={<Evaluacion />} />
        <Route path="/equipo" element={<Equipo />} />
        <Route path="/referencias" element={<Referencias />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <DbProvider>
      <BrowserRouter>
        <Routed />
      </BrowserRouter>
    </DbProvider>
  );
}
