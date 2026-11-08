import { useState, type FormEvent } from 'react';
import { Bars } from '../components/Bars';
import { useDb, useQuery } from '../db/DbContext';
import type { Pregunta } from '../db/types';

const OPCIONES = [
  { valor: 2, label: 'Sí', emoji: '😀' },
  { valor: 1, label: 'A veces', emoji: '🤔' },
  { valor: 0, label: 'No', emoji: '🙁' },
];

interface Resumen {
  id: number;
  texto: string;
  dimension: string;
  respuestas: number;
  si: number;
  aveces: number;
  no: number;
}

export function Diagnostico() {
  const { run } = useDb();
  const preguntas = useQuery<Pregunta>('SELECT * FROM preguntas_diagnostico ORDER BY id');
  const grupos = useQuery<{ grupo: string }>('SELECT DISTINCT grupo FROM respuestas_diagnostico ORDER BY grupo');
  const [filtro, setFiltro] = useState('');
  const resumen = useQuery<Resumen>(
    `SELECT q.id, q.texto, q.dimension,
            count(r.id) AS respuestas,
            coalesce(sum(r.valor = 2), 0) AS si,
            coalesce(sum(r.valor = 1), 0) AS aveces,
            coalesce(sum(r.valor = 0), 0) AS no
     FROM preguntas_diagnostico q
     LEFT JOIN respuestas_diagnostico r ON r.pregunta_id = q.id AND (:g = '' OR r.grupo = :g)
     GROUP BY q.id ORDER BY q.id`,
    { ':g': filtro },
  );

  const [grupo, setGrupo] = useState('');
  const [respuestas, setRespuestas] = useState<Record<number, number>>({});
  const [enviado, setEnviado] = useState(false);

  const completas = preguntas.length > 0 && preguntas.every((p) => respuestas[p.id] !== undefined);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!grupo.trim() || !completas) return;
    const fecha = new Date().toISOString().replace('T', ' ').slice(0, 19);
    for (const p of preguntas) {
      run('INSERT INTO respuestas_diagnostico (grupo, pregunta_id, valor, fecha) VALUES (?, ?, ?, ?)', [
        grupo.trim(),
        p.id,
        respuestas[p.id],
        fecha,
      ]);
    }
    setRespuestas({});
    setEnviado(true);
  }

  const total = resumen[0]?.respuestas ?? 0;

  return (
    <div className="wrap section">
      <header className="page-head">
        <p className="eyebrow">Paso 1 · Identificar</p>
        <h1>Diagnóstico de hábitos ambientales</h1>
        <p className="lead">
          Antes de cambiar un hábito hay que conocerlo. Cada estudiante responde ocho preguntas; las respuestas
          se agrupan por salón para decidir por dónde empezar.
        </p>
      </header>

      <div className="split">
        <form className="card form survey" onSubmit={onSubmit}>
          <h2>Mi encuesta</h2>
          <label>
            Mi grupo (por ejemplo, 3°A)
            <input
              value={grupo}
              onChange={(e) => {
                setGrupo(e.target.value);
                setEnviado(false);
              }}
              maxLength={20}
              required
              list="grupos-existentes"
            />
            <datalist id="grupos-existentes">
              {grupos.map((g) => (
                <option key={g.grupo} value={g.grupo} />
              ))}
            </datalist>
          </label>
          <ol className="survey__list">
            {preguntas.map((p) => (
              <li key={p.id}>
                <fieldset>
                  <legend>
                    <span className="chip chip--small">{p.dimension}</span> {p.texto}
                  </legend>
                  <div className="survey__opts">
                    {OPCIONES.map((o) => (
                      <label key={o.valor} className={respuestas[p.id] === o.valor ? 'opt opt--on' : 'opt'}>
                        <input
                          type="radio"
                          name={`p${p.id}`}
                          checked={respuestas[p.id] === o.valor}
                          onChange={() => {
                            setRespuestas((r) => ({ ...r, [p.id]: o.valor }));
                            setEnviado(false);
                          }}
                        />
                        <span aria-hidden="true">{o.emoji}</span> {o.label}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </li>
            ))}
          </ol>
          <button className="btn btn--primary" type="submit" disabled={!completas || !grupo.trim()}>
            Enviar mis respuestas
          </button>
          {enviado && <p className="success">¡Gracias! Tus respuestas quedaron guardadas. Ya puede responder el siguiente compañero.</p>}
        </form>

        <section className="card results" aria-live="polite">
          <div className="results__head">
            <h2>Resultados</h2>
            <select value={filtro} onChange={(e) => setFiltro(e.target.value)} aria-label="Filtrar por grupo">
              <option value="">Todos los grupos</option>
              {grupos.map((g) => (
                <option key={g.grupo}>{g.grupo}</option>
              ))}
            </select>
          </div>
          {total === 0 ? (
            <p className="empty">Aún no hay respuestas. Cuando el primer estudiante responda, aquí verás el porcentaje de “Sí” por pregunta.</p>
          ) : (
            <>
              <p className="muted">{total} estudiantes · porcentaje que respondió “Sí”</p>
              <Bars
                max={100}
                data={resumen.map((r) => ({
                  label: `${r.id}. ${r.texto}`,
                  value: r.respuestas ? Math.round((r.si / r.respuestas) * 100) : 0,
                  suffix: '%',
                }))}
              />
              <Lectura resumen={resumen} />
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function Lectura({ resumen }: { resumen: Resumen[] }) {
  const conPct = resumen
    .filter((r) => r.respuestas > 0)
    .map((r) => ({ ...r, pct: r.si / r.respuestas }));
  if (conPct.length === 0) return null;
  const debil = [...conPct].sort((a, b) => a.pct - b.pct)[0];
  const fuerte = [...conPct].sort((a, b) => b.pct - a.pct)[0];
  return (
    <div className="reading">
      <h3>¿Por dónde empezar?</h3>
      <p>
        <strong>Fortaleza:</strong> {fuerte.texto} ({Math.round(fuerte.pct * 100)} % dice que sí).
      </p>
      <p>
        <strong>Primer reto sugerido:</strong> trabajar la dimensión <em>{debil.dimension}</em>, porque es
        donde menos estudiantes responden que sí ({Math.round(debil.pct * 100)} %).
      </p>
    </div>
  );
}
