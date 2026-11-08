import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDb, useQuery } from '../db/DbContext';
import type { Caneca, Residuo } from '../db/types';

const RONDA = 10;

interface Partida {
  id: number;
  jugador: string;
  grupo: string;
  aciertos: number;
  total: number;
  fecha: string;
}

function barajar<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Estado = 'inicio' | 'jugando' | 'fin';

export function Reto() {
  const { run } = useDb();
  const canecas = useQuery<Caneca>("SELECT * FROM canecas ORDER BY CASE id WHEN 'blanca' THEN 1 WHEN 'negra' THEN 2 ELSE 3 END");
  const residuos = useQuery<Residuo>('SELECT * FROM residuos');
  const ranking = useQuery<Partida>(
    'SELECT * FROM partidas_reto ORDER BY (aciertos * 1.0 / total) DESC, aciertos DESC, id ASC LIMIT 10',
  );
  const porGrupo = useQuery<{ grupo: string; partidas: number; promedio: number }>(
    `SELECT grupo, count(*) AS partidas, round(avg(aciertos * 100.0 / total)) AS promedio
     FROM partidas_reto GROUP BY grupo ORDER BY promedio DESC`,
  );

  const [estado, setEstado] = useState<Estado>('inicio');
  const [jugador, setJugador] = useState('');
  const [grupo, setGrupo] = useState('');
  const [ronda, setRonda] = useState<Residuo[]>([]);
  const [i, setI] = useState(0);
  const [aciertos, setAciertos] = useState(0);
  const [elegida, setElegida] = useState<Caneca['id'] | null>(null);

  const actual = ronda[i];
  const canecaPorId = useMemo(() => new Map(canecas.map((c) => [c.id, c])), [canecas]);

  function empezar() {
    if (!jugador.trim() || !grupo.trim()) return;
    setRonda(barajar(residuos).slice(0, RONDA));
    setI(0);
    setAciertos(0);
    setElegida(null);
    setEstado('jugando');
  }

  function elegir(id: Caneca['id']) {
    if (elegida || !actual) return;
    setElegida(id);
    if (id === actual.caneca_id) setAciertos((a) => a + 1);
  }

  function siguiente() {
    if (i + 1 < ronda.length) {
      setI(i + 1);
      setElegida(null);
      return;
    }
    run('INSERT INTO partidas_reto (jugador, grupo, aciertos, total) VALUES (?, ?, ?, ?)', [
      jugador.trim().slice(0, 40),
      grupo.trim().slice(0, 20),
      aciertos,
      ronda.length,
    ]);
    setEstado('fin');
  }

  const total = ronda.length || RONDA;
  const medalla = aciertos >= 9 ? '🏆' : aciertos >= 7 ? '🥈' : aciertos >= 5 ? '🌱' : '🍂';

  return (
    <div className="wrap section">
      <header className="page-head">
        <p className="eyebrow">Paso 4 · Implementar</p>
        <h1>Reto Reciclador</h1>
        <p className="lead">
          ¿En qué caneca va cada residuo? Clasifica 10 residuos con el código de colores. La meta del grupo es
          lograr al menos 8 de 10.
        </p>
      </header>

      <div className="split split--game">
        <section className="card game" aria-live="polite">
          {estado === 'inicio' && (
            <div className="game__start">
              <div className="bins-preview" aria-hidden="true">
                {canecas.map((c) => (
                  <span key={c.id} className={`bin bin--${c.id}`} />
                ))}
              </div>
              <h2>¿Listo para el reto?</h2>
              <div className="form__row">
                <label>
                  Tu nombre
                  <input value={jugador} onChange={(e) => setJugador(e.target.value)} maxLength={40} />
                </label>
                <label>
                  Tu grupo
                  <input value={grupo} onChange={(e) => setGrupo(e.target.value)} maxLength={20} placeholder="3°A" />
                </label>
              </div>
              <button className="btn btn--primary btn--big" onClick={empezar} disabled={!jugador.trim() || !grupo.trim() || residuos.length === 0}>
                ¡Empezar!
              </button>
            </div>
          )}

          {estado === 'jugando' && actual && (
            <div className="game__play">
              <div className="game__progress">
                <span>
                  Residuo {i + 1} de {total}
                </span>
                <span>⭐ {aciertos}</span>
              </div>
              <div className="progress" aria-hidden="true">
                <span style={{ width: `${((i + (elegida ? 1 : 0)) / total) * 100}%` }} />
              </div>
              <div className="game__item">
                <span className="game__emoji" aria-hidden="true">
                  {actual.emoji}
                </span>
                <h2>{actual.nombre}</h2>
              </div>
              <div className="game__bins">
                {canecas.map((c) => {
                  const correcta = elegida && c.id === actual.caneca_id;
                  const mal = elegida === c.id && c.id !== actual.caneca_id;
                  return (
                    <button
                      key={c.id}
                      className={`bin-btn bin-btn--${c.id} ${correcta ? 'is-right' : ''} ${mal ? 'is-wrong' : ''}`}
                      onClick={() => elegir(c.id)}
                      disabled={!!elegida}
                    >
                      <span className={`bin bin--${c.id}`} aria-hidden="true" />
                      {c.nombre}
                    </button>
                  );
                })}
              </div>
              {elegida && (
                <div className={`feedback ${elegida === actual.caneca_id ? 'feedback--ok' : 'feedback--bad'}`}>
                  <strong>
                    {elegida === actual.caneca_id
                      ? '¡Muy bien!'
                      : `Casi. Va en la ${canecaPorId.get(actual.caneca_id)?.nombre.toLowerCase()}.`}
                  </strong>{' '}
                  {actual.explicacion}
                  <button className="btn btn--primary" onClick={siguiente} autoFocus>
                    {i + 1 < total ? 'Siguiente →' : 'Ver resultado'}
                  </button>
                </div>
              )}
            </div>
          )}

          {estado === 'fin' && (
            <div className="game__end">
              <p className="big-emoji" aria-hidden="true">
                {medalla}
              </p>
              <h2>
                {aciertos} de {total} aciertos
              </h2>
              <p>
                {aciertos >= 8
                  ? `¡Reto cumplido, ${jugador}! Ya eres Guardián Ambiental de ${grupo}.`
                  : `Vas por buen camino, ${jugador}. Repasa el código de colores y vuelve a intentarlo.`}
              </p>
              <div className="hero__actions center">
                <button className="btn btn--primary" onClick={empezar}>
                  Jugar otra vez
                </button>
                <Link className="btn btn--outline" to="/blog/codigo-de-colores">
                  Repasar el código
                </Link>
              </div>
            </div>
          )}
        </section>

        <aside className="stack">
          <section className="card">
            <h2>Código de colores</h2>
            <ul className="legend">
              {canecas.map((c) => (
                <li key={c.id}>
                  <span className={`bin bin--${c.id}`} aria-hidden="true" />
                  <div>
                    <strong>{c.nombre}</strong>
                    <p>{c.que_va}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
          <section className="card">
            <h2>Tabla de honor</h2>
            {ranking.length === 0 ? (
              <p className="empty">Todavía nadie ha jugado. ¡Sé el primero!</p>
            ) : (
              <ol className="ranking">
                {ranking.map((p) => (
                  <li key={p.id}>
                    <span>
                      {p.jugador} <small>{p.grupo}</small>
                    </span>
                    <strong>
                      {p.aciertos}/{p.total}
                    </strong>
                  </li>
                ))}
              </ol>
            )}
            {porGrupo.length > 0 && (
              <>
                <h3>Promedio por grupo</h3>
                <ul className="ranking ranking--groups">
                  {porGrupo.map((g) => (
                    <li key={g.grupo}>
                      <span>
                        {g.grupo} <small>{g.partidas} partidas</small>
                      </span>
                      <strong>{g.promedio}%</strong>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
