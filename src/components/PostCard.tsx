import { Link } from 'react-router-dom';
import type { Post } from '../db/types';
import { formatDate } from '../lib/markdown';

export function PostCard({ post, large = false }: { post: Post; large?: boolean }) {
  return (
    <article className={`card post-card ${large ? 'post-card--large' : ''}`}>
      <div className="post-card__meta">
        <span className={`chip chip--fase-${post.fase_id}`}>
          Paso {post.fase_id} · {post.fase_nombre}
        </span>
        <span>{post.minutos} min</span>
      </div>
      <h3>
        <Link to={`/blog/${post.slug}`} className="stretched">
          {post.titulo}
        </Link>
      </h3>
      <p>{post.resumen}</p>
      <time dateTime={post.fecha}>{formatDate(post.fecha)}</time>
    </article>
  );
}

export const POSTS_SQL = `
  SELECT p.*, f.nombre AS fase_nombre, f.slug AS fase_slug
  FROM posts p JOIN fases f ON f.id = p.fase_id
`;
