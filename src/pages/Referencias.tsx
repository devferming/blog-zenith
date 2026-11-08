import { useQuery } from '../db/DbContext';
import type { Referencia } from '../db/types';
import { Markdown } from '../lib/markdown';

export function Referencias() {
  const refs = useQuery<Referencia>('SELECT * FROM referencias ORDER BY apa');
  return (
    <div className="wrap wrap--narrow section">
      <header className="page-head">
        <p className="eyebrow">Fuentes</p>
        <h1>Referencias</h1>
        <p className="lead">Fuentes consultadas para el Dothink Lab y para este escenario digital (normas APA 7).</p>
      </header>
      <ol className="refs">
        {refs.map((r) => (
          <li key={r.id}>
            <Markdown source={r.apa} />
            {r.url && (
              <a href={r.url} target="_blank" rel="noreferrer">
                {r.url.replace(/^https?:\/\//, '').slice(0, 70)}
                {r.url.replace(/^https?:\/\//, '').length > 70 ? '…' : ''}
              </a>
            )}
          </li>
        ))}
      </ol>
      <section className="card about-tech">
        <h2>Sobre este escenario digital</h2>
        <p>
          Blog construido con React y TypeScript. Su contenido y los datos de la comunidad viven en una base de
          datos SQLite que se ejecuta dentro del navegador (sql.js / WebAssembly): no requiere servidor, cuentas ni
          claves para acceder.
        </p>
      </section>
    </div>
  );
}
