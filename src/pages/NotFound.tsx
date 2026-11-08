import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="wrap section center">
      <p className="big-emoji" aria-hidden="true">
        🍂
      </p>
      <h1>Esta página se fue al compost</h1>
      <p className="lead">No encontramos lo que buscabas.</p>
      <Link className="btn btn--primary" to="/">
        Volver al inicio
      </Link>
    </div>
  );
}
