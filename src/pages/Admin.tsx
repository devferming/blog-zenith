import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useDb, useQuery } from '../db/DbContext';
import { downloadDatabase, importDatabase, resetCommunityData } from '../db/database';
import { AdminRegistros } from './AdminRegistros';

/**
 * Panel privado: /admin (no aparece en el menú ni en el pie de página).
 * La clave se valida comparando su SHA-256 con VITE_ADMIN_HASH (variable de entorno).
 * Genera el hash con:  npm run admin:hash -- "tu clave"
 */
const ADMIN_HASH = (import.meta.env.VITE_ADMIN_HASH ?? '').trim().toLowerCase();
const SESSION_KEY = 'blog-zenith:admin';

async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function isUnlocked(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === ADMIN_HASH && ADMIN_HASH !== '';
  } catch {
    return false;
  }
}

export function Admin() {
  const [ok, setOk] = useState(isUnlocked);

  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  if (!ADMIN_HASH) {
    return (
      <div className="wrap wrap--narrow section">
        <h1>Panel no configurado</h1>
        <p className="lead">
          Define la variable de entorno <code>VITE_ADMIN_HASH</code> (ver README) para activar este panel.
        </p>
      </div>
    );
  }

  return ok ? <Panel onLogout={() => { try { sessionStorage.removeItem(SESSION_KEY); } catch { /* */ } setOk(false); }} /> : <Login onOk={() => setOk(true)} />;
}

function Login({ onOk }: { onOk: () => void }) {
  const [clave, setClave] = useState('');
  const [error, setError] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const hash = await sha256(clave);
    if (hash === ADMIN_HASH) {
      try {
        sessionStorage.setItem(SESSION_KEY, hash);
      } catch {
        /* sesión sin almacenamiento */
      }
      onOk();
    } else {
      setError(true);
      setClave('');
    }
  }

  return (
    <div className="wrap section">
      <form className="card form admin-login" onSubmit={onSubmit}>
        <h1>Acceso privado</h1>
        <label>
          Clave
          <input type="password" value={clave} onChange={(e) => { setClave(e.target.value); setError(false); }} autoFocus required autoComplete="current-password" />
        </label>
        {error && <p className="error">Clave incorrecta.</p>}
        <button className="btn btn--primary" type="submit">
          Entrar
        </button>
      </form>
    </div>
  );
}

interface Conteos {
  comentarios: number;
  partidas: number;
  diagnosticos: number;
  registros: number;
  observaciones: number;
}

function Panel({ onLogout }: { onLogout: () => void }) {
  const { db } = useDb();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [c] = useQuery<Conteos>(`
    SELECT
      (SELECT count(*) FROM comentarios) AS comentarios,
      (SELECT count(*) FROM partidas_reto) AS partidas,
      (SELECT count(DISTINCT grupo || fecha) FROM respuestas_diagnostico) AS diagnosticos,
      (SELECT count(*) FROM registros_residuos) AS registros,
      (SELECT count(DISTINCT grupo || semana || fecha) FROM observaciones) AS observaciones
  `);

  async function onImport(file: File | undefined) {
    if (!file) return;
    try {
      await importDatabase(file);
      window.location.reload();
    } catch {
      setMsg('Ese archivo no parece una base SQLite válida.');
    }
  }

  function onReset() {
    if (window.confirm('¿Borrar los datos agregados desde este navegador? Los datos del piloto (semanas 1 a 4) se conservan.')) {
      resetCommunityData();
      window.location.reload();
    }
  }

  return (
    <div className="wrap section">
      <header className="page-head results__head">
        <div>
          <p className="eyebrow">Panel privado</p>
          <h1>Datos del blog</h1>
        </div>
        <button className="btn btn--outline" onClick={onLogout}>
          Cerrar sesión
        </button>
      </header>

      {c && (
        <dl className="admin-counts">
          <div><dt>Comentarios</dt><dd>{c.comentarios}</dd></div>
          <div><dt>Partidas</dt><dd>{c.partidas}</dd></div>
          <div><dt>Diagnósticos</dt><dd>{c.diagnosticos}</dd></div>
          <div><dt>Registros de residuos</dt><dd>{c.registros}</dd></div>
          <div><dt>Observaciones</dt><dd>{c.observaciones}</dd></div>
        </dl>
      )}

      <section className="card">
        <h2>Base de datos SQLite</h2>
        <p className="muted">
          Los datos se guardan en la base SQLite de este navegador. Descarga el archivo para conservar la evidencia
          o llevarla a otro equipo.
        </p>
        <div className="admin-actions">
          <button className="btn btn--primary" disabled={!db} onClick={() => db && downloadDatabase(db)}>
            ⬇ Descargar base .sqlite
          </button>
          <button className="btn btn--outline" onClick={() => fileRef.current?.click()}>
            ⬆ Importar
          </button>
          <button className="btn btn--danger" onClick={onReset}>
            Reiniciar datos
          </button>
          <input ref={fileRef} type="file" accept=".sqlite,.db,.sqlite3" hidden onChange={(e) => onImport(e.target.files?.[0])} />
        </div>
        {msg && <p className="error">{msg}</p>}
      </section>

      <AdminRegistros />
    </div>
  );
}
