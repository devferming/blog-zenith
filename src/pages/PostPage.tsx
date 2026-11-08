import { useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { POSTS_SQL } from '../components/PostCard';
import { useDb, useQuery } from '../db/DbContext';
import type { Comentario, Post } from '../db/types';
import { Markdown, formatDate } from '../lib/markdown';
import { NotFound } from './NotFound';

const ROLES = ['Estudiante', 'Docente', 'Familia', 'Directivo', 'Visitante'];

export function PostPage() {
  const { slug = '' } = useParams();
  const { run } = useDb();
  const [post] = useQuery<Post>(`${POSTS_SQL} WHERE p.slug = ?`, [slug]);
  const all = useQuery<Pick<Post, 'slug' | 'titulo' | 'id'>>('SELECT id, slug, titulo FROM posts ORDER BY fase_id, fecha');
  const comentarios = useQuery<Comentario>(
    'SELECT * FROM comentarios WHERE post_slug = ? ORDER BY id DESC',
    [slug],
  );
  const [autor, setAutor] = useState('');
  const [rol, setRol] = useState(ROLES[0]);
  const [texto, setTexto] = useState('');

  if (!post) return <NotFound />;

  const idx = all.findIndex((p) => p.slug === slug);
  const prev = idx > 0 ? all[idx - 1] : undefined;
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : undefined;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!autor.trim() || !texto.trim()) return;
    run('INSERT INTO comentarios (post_slug, autor, rol, texto) VALUES (?, ?, ?, ?)', [
      slug,
      autor.trim().slice(0, 60),
      rol,
      texto.trim().slice(0, 1000),
    ]);
    setTexto('');
  }

  return (
    <article className="post">
      <header className={`post__head post__head--${post.fase_id}`}>
        <div className="wrap wrap--narrow">
          <Link to={`/blog?paso=${post.fase_slug}`} className="chip chip--light">
            Paso {post.fase_id} · {post.fase_nombre}
          </Link>
          <h1>{post.titulo}</h1>
          <p className="lead">{post.resumen}</p>
          <p className="post__meta">
            <time dateTime={post.fecha}>{formatDate(post.fecha)}</time> · {post.minutos} min de lectura ·
            Ortiz, Palencia y Redondo
          </p>
        </div>
      </header>

      <div className="wrap wrap--narrow prose">
        <Markdown source={post.contenido} />
        <p className="tags">
          {post.etiquetas.split(',').map((t) => (
            <span key={t} className="tag">
              #{t.trim()}
            </span>
          ))}
        </p>
      </div>

      <nav className="wrap wrap--narrow post__nav" aria-label="Entradas cercanas">
        {prev ? (
          <Link to={`/blog/${prev.slug}`}>
            <small>← Anterior</small>
            {prev.titulo}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link to={`/blog/${next.slug}`} className="post__nav-next">
            <small>Siguiente →</small>
            {next.titulo}
          </Link>
        )}
      </nav>

      <section className="wrap wrap--narrow comments" aria-labelledby="comentarios">
        <h2 id="comentarios">Conversación ({comentarios.length})</h2>
        <p className="muted">
          Estudiantes, familias y docentes pueden dejar su experiencia. Los comentarios se guardan en la base
          SQLite de este navegador.
        </p>
        <form className="form comments__form" onSubmit={onSubmit}>
          <div className="form__row">
            <label>
              Nombre
              <input value={autor} onChange={(e) => setAutor(e.target.value)} maxLength={60} required />
            </label>
            <label>
              Participo como
              <select value={rol} onChange={(e) => setRol(e.target.value)}>
                {ROLES.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </label>
          </div>
          <label>
            Comentario
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              rows={3}
              maxLength={1000}
              required
              placeholder="¿Qué hiciste en tu salón o en tu casa?"
            />
          </label>
          <button className="btn btn--primary" type="submit">
            Publicar comentario
          </button>
        </form>
        <ul className="comments__list">
          {comentarios.map((c) => (
            <li key={c.id}>
              <div className="comments__who">
                <span className="avatar" aria-hidden="true">
                  {c.autor.charAt(0).toUpperCase()}
                </span>
                <strong>{c.autor}</strong>
                <span className="chip chip--small">{c.rol}</span>
                <time>{formatDate(c.fecha)}</time>
              </div>
              <p>{c.texto}</p>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
