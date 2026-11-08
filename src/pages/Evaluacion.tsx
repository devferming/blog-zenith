import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bars } from '../components/Bars';
import { useQuery } from '../db/DbContext';

/** Vista pública: solo resultados. Los formularios de registro están en /admin. */

const SEMANAS = [1, 2, 3, 4];
const NIVEL_TXT = ['', 'Poco', 'A veces', 'Siempre'];

interface Semanal {
  semana: number;
  registros: number;
  pct: number | null;
  aprovechables: number | null;
  organicos: number | null;
  no_aprovechables: number | null;
}

interface PorGrupo {
  grupo: string;
  semana: number;
  pct: number;
}

interface ObsSemana {
  semana: number;
  promedio: number | null;
}

interface ObsIndicador {
  id: number;
  texto: string;
  dimension: string;
  s1: number | null;
  s4: number | null;
}

interface Nota {
  grupo: string;
  semana: number;
  notas: string;
}

function fmt(n: number | null | undefined, dec = 1) {
  if (n == null) return '—';
  return n.toLocaleString('es-CO', { maximumFractionDigits: dec, minimumFractionDigits: 0 });
}

export function Evaluacion() {
  const grupos = useQuery<{ grupo: string }>(
    'SELECT grupo FROM registros_residuos UNION SELECT grupo FROM observaciones ORDER BY grupo',
  );
  const [g, setG] = useState('');
  const p = { ':g': g };

  const semanal = useQuery<Semanal>(
    `SELECT s.semana,
            count(r.id) AS registros,
            round(avg(r.bien_clasificados_pct)) AS pct,
            round(sum(r.aprovechables_kg), 1) AS aprovechables,
            round(sum(r.organicos_kg), 1) AS organicos,
            round(sum(r.no_aprovechables_kg), 1) AS no_aprovechables
     FROM (SELECT 1 AS semana UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4) s
     LEFT JOIN registros_residuos r ON r.semana = s.semana AND (:g = '' OR r.grupo = :g)
     GROUP BY s.semana ORDER BY s.semana`,
    p,
  );
  const porGrupo = useQuery<PorGrupo>(
    `SELECT grupo, semana, round(avg(bien_clasificados_pct)) AS pct
     FROM registros_residuos WHERE (:g = '' OR grupo = :g)
     GROUP BY grupo, semana ORDER BY grupo, semana`,
    p,
  );
  const obsSemana = useQuery<ObsSemana>(
    `SELECT s.semana, round(avg(o.nivel), 2) AS promedio
     FROM (SELECT 1 AS semana UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4) s
     LEFT JOIN observaciones o ON o.semana = s.semana AND (:g = '' OR o.grupo = :g)
     GROUP BY s.semana ORDER BY s.semana`,
    p,
  );
  const obsInd = useQuery<ObsIndicador>(
    `SELECT i.id, i.texto, i.dimension,
            round(avg(CASE WHEN o.semana = 1 THEN o.nivel END), 1) AS s1,
            round(avg(CASE WHEN o.semana = 4 THEN o.nivel END), 1) AS s4
     FROM indicadores_observacion i
     LEFT JOIN observaciones o ON o.indicador_id = i.id AND (:g = '' OR o.grupo = :g)
     GROUP BY i.id ORDER BY i.id`,
    p,
  );
  const notas = useQuery<Nota>(
    `SELECT grupo, semana, notas FROM registros_residuos
     WHERE notas IS NOT NULL AND notas <> '' AND (:g = '' OR grupo = :g)
     ORDER BY semana, grupo`,
    p,
  );

  const s1 = semanal.find((s) => s.semana === 1);
  const s4 = semanal.find((s) => s.semana === 4);
  const o1 = obsSemana.find((s) => s.semana === 1)?.promedio ?? null;
  const o4 = obsSemana.find((s) => s.semana === 4)?.promedio ?? null;
  const hayDatos = semanal.some((s) => s.registros > 0);

  const tabla = useMemo(() => {
    const map = new Map<string, Record<number, number>>();
    for (const r of porGrupo) {
      if (!map.has(r.grupo)) map.set(r.grupo, {});
      map.get(r.grupo)![r.semana] = r.pct;
    }
    return [...map.entries()];
  }, [porGrupo]);

  const reduccion =
    s1?.no_aprovechables && s4?.no_aprovechables != null
      ? Math.round((1 - s4.no_aprovechables / s1.no_aprovechables) * 100)
      : null;

  return (
    <div className="wrap section">
      <header className="page-head">
        <p className="eyebrow">Paso 5 · Evaluar</p>
        <h1>Resultados de la implementación</h1>
        <p className="lead">
          Evidencias registradas cada viernes, de la semana 1 (antes) a la semana 4 (después): residuos bien
          clasificados, kilos por caneca y conductas observadas. <Link to="/blog/como-evaluamos">¿Cómo evaluamos?</Link>
        </p>
      </header>

      <div className="results__head results__head--page">
        <p className="muted">
          {grupos.length} grupos · semanas 1 a 4
        </p>
        <select value={g} onChange={(e) => setG(e.target.value)} aria-label="Filtrar por grupo">
          <option value="">Todos los grupos</option>
          {grupos.map((x) => (
            <option key={x.grupo}>{x.grupo}</option>
          ))}
        </select>
      </div>

      {!hayDatos ? (
        <p className="empty">Aún no hay resultados publicados.</p>
      ) : (
        <>
          <dl className="kpis">
            <div className="kpi">
              <dt>Residuos bien clasificados</dt>
              <dd>
                {fmt(s1?.pct, 0)}% <span aria-hidden="true">→</span> <strong>{fmt(s4?.pct, 0)}%</strong>
              </dd>
              {s1?.pct != null && s4?.pct != null && (
                <span className="delta delta--up">+{s4.pct - s1.pct} pts</span>
              )}
            </div>
            <div className="kpi">
              <dt>No aprovechables por semana</dt>
              <dd>
                {fmt(s1?.no_aprovechables)} <span aria-hidden="true">→</span> <strong>{fmt(s4?.no_aprovechables)} kg</strong>
              </dd>
              {reduccion != null && <span className="delta delta--up">−{reduccion}%</span>}
            </div>
            <div className="kpi">
              <dt>Aprovechables recuperados</dt>
              <dd>
                {fmt(s1?.aprovechables)} <span aria-hidden="true">→</span> <strong>{fmt(s4?.aprovechables)} kg</strong>
              </dd>
            </div>
            <div className="kpi">
              <dt>Conductas observadas (1 a 3)</dt>
              <dd>
                {fmt(o1)} <span aria-hidden="true">→</span> <strong>{fmt(o4)}</strong>
              </dd>
              {o1 != null && o4 != null && (
                <span className="delta delta--up">{NIVEL_TXT[Math.round(o1)]} → {NIVEL_TXT[Math.round(o4)]}</span>
              )}
            </div>
          </dl>

          <div className="split split--even">
            <section className="card">
              <h2>Evolución semanal</h2>
              <p className="muted">Promedio de residuos bien clasificados</p>
              <div className="columns" role="img" aria-label={semanal.map((s) => `Semana ${s.semana}: ${s.pct ?? 0}%`).join(', ')}>
                {semanal.map((s) => (
                  <div key={s.semana} className="columns__col">
                    <span className="columns__val">{s.pct != null ? `${s.pct}%` : '—'}</span>
                    <span className="columns__bar" style={{ height: `${s.pct ?? 0}%` }} />
                    <span className="columns__lbl">Sem. {s.semana}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="card">
              <h2>Kilos por caneca</h2>
              <p className="muted">Total semanal de los grupos seleccionados</p>
              <div className="kg-legend">
                <span><i className="dot dot--blanca" /> Aprovechables</span>
                <span><i className="dot dot--verde" /> Orgánicos</span>
                <span><i className="dot dot--negra" /> No aprovechables</span>
              </div>
              <ul className="stacks">
                {semanal.map((s) => {
                  const total = (s.aprovechables ?? 0) + (s.organicos ?? 0) + (s.no_aprovechables ?? 0);
                  const w = (v: number | null) => `${total ? ((v ?? 0) / total) * 100 : 0}%`;
                  return (
                    <li key={s.semana}>
                      <span className="stacks__lbl">Semana {s.semana}</span>
                      <span className="stacks__bar">
                        <span className="seg-b" style={{ width: w(s.aprovechables) }} title={`Aprovechables: ${fmt(s.aprovechables)} kg`} />
                        <span className="seg-v" style={{ width: w(s.organicos) }} title={`Orgánicos: ${fmt(s.organicos)} kg`} />
                        <span className="seg-n" style={{ width: w(s.no_aprovechables) }} title={`No aprovechables: ${fmt(s.no_aprovechables)} kg`} />
                      </span>
                      <span className="stacks__val">
                        {fmt(s.aprovechables)} / {fmt(s.organicos)} / {fmt(s.no_aprovechables)} kg
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>

          <div className="split split--even">
            <section className="card">
              <h2>Por grupo</h2>
              <p className="muted">% de residuos bien clasificados</p>
              <div className="table-wrap">
                <table className="table table--center">
                  <thead>
                    <tr>
                      <th>Grupo</th>
                      {SEMANAS.map((s) => (
                        <th key={s}>Sem. {s}</th>
                      ))}
                      <th>Cambio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tabla.map(([grupo, vals]) => (
                      <tr key={grupo}>
                        <td><strong>{grupo}</strong></td>
                        {SEMANAS.map((s) => (
                          <td key={s}>
                            {vals[s] != null ? (
                              <span className="heat" style={{ background: `rgb(63 138 58 / ${(vals[s] / 100) * 0.55})` }}>
                                {vals[s]}%
                              </span>
                            ) : (
                              '—'
                            )}
                          </td>
                        ))}
                        <td className="up">
                          {vals[1] != null && vals[4] != null ? `+${vals[4] - vals[1]}` : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="card">
              <h2>Conductas observadas</h2>
              <p className="muted">Semana 1 vs. semana 4 · 1 = poco · 2 = a veces · 3 = siempre</p>
              <ul className="obs-results">
                {obsInd.map((o) => (
                  <li key={o.id}>
                    <p>{o.texto}</p>
                    <Bars
                      max={3}
                      data={[
                        { label: 'Semana 1', value: o.s1 ?? 0, color: '#c8a86b' },
                        { label: 'Semana 4', value: o.s4 ?? 0, color: '#3f8a3a' },
                      ]}
                    />
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {notas.length > 0 && (
            <section className="card">
              <h2>Bitácora de la docente</h2>
              <ol className="timeline">
                {SEMANAS.map((s) => {
                  const del = notas.filter((n) => n.semana === s);
                  if (del.length === 0) return null;
                  return (
                    <li key={s}>
                      <strong>Semana {s}</strong>
                      <ul>
                        {del.map((n, i) => (
                          <li key={i}>
                            <span className="chip chip--small">{n.grupo}</span> {n.notas}
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                })}
              </ol>
            </section>
          )}
        </>
      )}
    </div>
  );
}
