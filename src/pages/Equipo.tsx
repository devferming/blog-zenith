import { useQuery } from '../db/DbContext';
import type { Miembro } from '../db/types';

const ICONOS: Record<string, string> = {
  'Estudiantes de primaria': '🧒',
  Familias: '👨‍👩‍👧',
  'Directivos y personal de servicios generales': '🏫',
  'Comunidad del barrio': '🏘️',
};

function iniciales(nombre: string) {
  return nombre
    .split(' ')
    .filter((p) => p.length > 2)
    .slice(0, 2)
    .map((p) => p[0])
    .join('');
}

export function Equipo() {
  const miembros = useQuery<Miembro>('SELECT * FROM equipo ORDER BY id');
  const autoras = miembros.filter((m) => m.tipo === 'autora');
  const docente = miembros.filter((m) => m.tipo === 'docente');
  const comunidad = miembros.filter((m) => m.tipo === 'comunidad');

  return (
    <div className="wrap section">
      <header className="page-head">
        <p className="eyebrow">Quiénes hacemos posible la propuesta</p>
        <h1>Equipo y comunidad</h1>
        <p className="lead">
          La propuesta reúne experiencias y saberes distintos: docentes que diseñan y acompañan, estudiantes que
          protagonizan los retos, familias que los continúan en casa y una institución que los sostiene.
        </p>
      </header>

      <h2 className="section-title">Autoras</h2>
      <div className="grid grid--3">
        {autoras.map((m) => (
          <article key={m.id} className="card person">
            <span className="person__avatar" aria-hidden="true">
              {iniciales(m.nombre)}
            </span>
            <h3>{m.nombre}</h3>
            <p className="person__role">{m.rol}</p>
            <p>{m.aporte}</p>
          </article>
        ))}
      </div>

      <h2 className="section-title">Acompañamiento académico</h2>
      <div className="grid grid--3">
        {docente.map((m) => (
          <article key={m.id} className="card person person--alt">
            <span className="person__avatar" aria-hidden="true">
              {iniciales(m.nombre)}
            </span>
            <h3>{m.nombre}</h3>
            <p className="person__role">{m.rol}</p>
            <p>{m.aporte}</p>
          </article>
        ))}
        <article className="card person person--uni">
          <h3>Fundación Universitaria del Área Andina</h3>
          <p className="person__role">Maestría en Innovación Pedagógica</p>
          <p>Electiva III · Economía de la Innovación · Eje 4: Evidencia práctica de la innovación in situ.</p>
        </article>
      </div>

      <h2 className="section-title">Participantes de la comunidad educativa</h2>
      <div className="grid grid--4">
        {comunidad.map((m) => (
          <article key={m.id} className="card community">
            <span className="tool__icon" aria-hidden="true">
              {ICONOS[m.nombre] ?? '🌱'}
            </span>
            <h3>{m.nombre}</h3>
            <p className="person__role">{m.rol}</p>
            <p>{m.aporte}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
