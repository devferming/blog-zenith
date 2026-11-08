import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PostCard, POSTS_SQL } from '../components/PostCard';
import { useQuery } from '../db/DbContext';
import type { Fase, Post } from '../db/types';

export function Blog() {
  const [params, setParams] = useSearchParams();
  const paso = params.get('paso') ?? '';
  const [texto, setTexto] = useState('');
  const fases = useQuery<Fase>('SELECT * FROM fases ORDER BY id');

  const posts = useQuery<Post>(
    `${POSTS_SQL}
     WHERE (:paso = '' OR f.slug = :paso)
       AND (:q = '' OR p.titulo LIKE :like OR p.resumen LIKE :like OR p.contenido LIKE :like OR p.etiquetas LIKE :like)
     ORDER BY p.fase_id, p.fecha`,
    { ':paso': paso, ':q': texto.trim(), ':like': `%${texto.trim()}%` },
  );

  const fase = useMemo(() => fases.find((f) => f.slug === paso), [fases, paso]);

  return (
    <div className="wrap section">
      <header className="page-head">
        <p className="eyebrow">Blog</p>
        <h1>{fase ? `Paso ${fase.id}: ${fase.nombre}` : 'Bitácora de la propuesta'}</h1>
        <p className="lead">
          {fase
            ? fase.descripcion
            : 'Todas las entradas, organizadas según los pasos de la innovación educativa.'}
        </p>
      </header>

      <div className="filters">
        <div className="filters__chips" role="group" aria-label="Filtrar por paso">
          <button className={!paso ? 'chip chip--on' : 'chip'} onClick={() => setParams({})}>
            Todos
          </button>
          {fases.map((f) => (
            <button
              key={f.id}
              className={paso === f.slug ? 'chip chip--on' : 'chip'}
              onClick={() => setParams({ paso: f.slug })}
            >
              {f.id}. {f.verbo}
            </button>
          ))}
        </div>
        <label className="search">
          <span className="sr-only">Buscar</span>
          <input
            type="search"
            placeholder="Buscar: reciclaje, familias, evaluación…"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
        </label>
      </div>

      {posts.length === 0 ? (
        <p className="empty">No encontramos entradas con esa búsqueda.</p>
      ) : (
        <div className="grid grid--3">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}
