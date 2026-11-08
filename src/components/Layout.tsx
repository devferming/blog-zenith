import { useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Logo } from './Logo';

const NAV = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/blog', label: 'Blog' },
  { to: '/diagnostico', label: 'Diagnóstico' },
  { to: '/reto', label: 'Reto Reciclador' },
  { to: '/evaluacion', label: 'Evaluación' },
  { to: '/equipo', label: 'Equipo' },
  { to: '/referencias', label: 'Referencias' },
];

export function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="shell">
      <a className="skip" href="#contenido">Saltar al contenido</a>
      <header className="topbar">
        <div className="wrap topbar__inner">
          <Link to="/" className="brand" aria-label="Inicio">
            <Logo size={44} />
            <span className="brand__text">
              <strong>Aprender hoy</strong>
              <small>para cuidar el mañana</small>
            </span>
          </Link>
          <button
            className="menu-btn"
            aria-expanded={open}
            aria-controls="nav-principal"
            onClick={() => setOpen((o) => !o)}
          >
            <span aria-hidden="true">{open ? '✕' : '☰'}</span>
            <span className="sr-only">Menú</span>
          </button>
          <nav id="nav-principal" className={`nav ${open ? 'nav--open' : ''}`}>
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main id="contenido">{children}</main>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__grid">
        <div className="footer__brand">
          <Logo size={52} />
          <p>
            <strong>Aprender hoy para cuidar el mañana</strong>
            <br />
            Propuesta de innovación pedagógica en educación ambiental para básica primaria.
          </p>
        </div>
        <p className="footer__meta">
          Maestría en Innovación Pedagógica · Electiva III Economía de la Innovación · Fundación Universitaria
          del Área Andina · Colombia, 2026
        </p>
      </div>
    </footer>
  );
}
