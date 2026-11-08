import { useState, type FormEvent } from 'react';
import { useDb, useQuery } from '../db/DbContext';
import type { Indicador, RegistroResiduos } from '../db/types';
import { formatDate } from '../lib/markdown';

/** Herramientas privadas de registro (solo dentro de /admin). */

const SEMANAS = [1, 2, 3, 4];
const NIVELES = [
  { valor: 1, label: 'Poco' },
  { valor: 2, label: 'A veces' },
  { valor: 3, label: 'Siempre' },
];
const hoy = () => new Date().toISOString().slice(0, 10);

export function AdminRegistros() {
  const [tab, setTab] = useState<'registro' | 'observacion'>('registro');
  const grupos = useQuery<{ grupo: string }>(
    'SELECT grupo FROM registros_residuos UNION SELECT grupo FROM observaciones ORDER BY grupo',
  );
  return (
    <section className="admin-block">
      <div className="results__head results__head--page">
        <h2>Registrar evidencias</h2>
        <div className="tabs" role="tablist">
          <button role="tab" aria-selected={tab === 'registro'} className={tab === 'registro' ? 'tab tab--on' : 'tab'} onClick={() => setTab('registro')}>
            ♻️ Registro de residuos
          </button>
          <button role="tab" aria-selected={tab === 'observacion'} className={tab === 'observacion' ? 'tab tab--on' : 'tab'} onClick={() => setTab('observacion')}>
            👀 Lista de observación
          </button>
        </div>
      </div>
      <datalist id="grupos-admin">
        {grupos.map((g) => (
          <option key={g.grupo} value={g.grupo} />
        ))}
      </datalist>
      {tab === 'registro' ? <Registro /> : <Observacion />}
    </section>
  );
}

function SemanaPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <fieldset className="seg">
      <legend>Semana</legend>
      {SEMANAS.map((s) => (
        <label key={s} className={value === s ? 'opt opt--on' : 'opt'}>
          <input type="radio" name="semana" checked={value === s} onChange={() => onChange(s)} />
          Semana {s}
          {s === 1 ? ' (antes)' : s === 4 ? ' (después)' : ''}
        </label>
      ))}
    </fieldset>
  );
}

function Registro() {
  const { run } = useDb();
  const [form, setForm] = useState({ fecha: hoy(), grupo: '', semana: 1, aprovechables: '', organicos: '', noAprov: '', pct: '50', notas: '' });
  const registros = useQuery<RegistroResiduos & { origen: string }>(
    'SELECT * FROM registros_residuos ORDER BY semana DESC, grupo, id DESC',
  );
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.grupo.trim()) return;
    run(
      `INSERT INTO registros_residuos
       (fecha, grupo, semana, aprovechables_kg, organicos_kg, no_aprovechables_kg, bien_clasificados_pct, notas)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        form.fecha,
        form.grupo.trim().slice(0, 20),
        form.semana,
        Number(form.aprovechables) || 0,
        Number(form.organicos) || 0,
        Number(form.noAprov) || 0,
        Math.max(0, Math.min(100, Math.round(Number(form.pct) || 0))),
        form.notas.trim().slice(0, 300) || null,
      ],
    );
    setForm((f) => ({ ...f, aprovechables: '', organicos: '', noAprov: '', notas: '' }));
  }

  function borrar(id: number) {
    if (window.confirm('¿Eliminar este registro?')) run('DELETE FROM registros_residuos WHERE id = ?', [id]);
  }

  return (
    <div className="split">
      <form className="card form" onSubmit={onSubmit}>
        <h3>Nuevo registro</h3>
        <div className="form__row">
          <label>
            Fecha
            <input type="date" value={form.fecha} onChange={set('fecha')} required />
          </label>
          <label>
            Grupo
            <input value={form.grupo} onChange={set('grupo')} maxLength={20} required list="grupos-admin" placeholder="3°A" />
          </label>
        </div>
        <SemanaPicker value={form.semana} onChange={(semana) => setForm((f) => ({ ...f, semana }))} />
        <div className="form__row form__row--3">
          <label>
            <span><i className="dot dot--blanca" /> Aprovechables (kg)</span>
            <input type="number" min="0" step="0.1" inputMode="decimal" value={form.aprovechables} onChange={set('aprovechables')} />
          </label>
          <label>
            <span><i className="dot dot--verde" /> Orgánicos (kg)</span>
            <input type="number" min="0" step="0.1" inputMode="decimal" value={form.organicos} onChange={set('organicos')} />
          </label>
          <label>
            <span><i className="dot dot--negra" /> No aprovechables (kg)</span>
            <input type="number" min="0" step="0.1" inputMode="decimal" value={form.noAprov} onChange={set('noAprov')} />
          </label>
        </div>
        <label>
          Residuos bien clasificados: <strong>{form.pct}%</strong>
          <input type="range" min="0" max="100" step="1" value={form.pct} onChange={set('pct')} />
        </label>
        <label>
          Notas (se publican en la bitácora)
          <textarea rows={2} value={form.notas} onChange={set('notas')} placeholder="Ej.: muchas envolturas en la caneca blanca" />
        </label>
        <button className="btn btn--primary" type="submit">
          Guardar registro
        </button>
      </form>

      <section className="card">
        <h3>Registros ({registros.length})</h3>
        <p className="muted">Los registros del piloto se cargan con el blog y no se pueden eliminar aquí.</p>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Sem.</th>
                <th>Grupo</th>
                <th>Fecha</th>
                <th>Bien clasif.</th>
                <th>kg (B/V/N)</th>
                <th><span className="sr-only">Acciones</span></th>
              </tr>
            </thead>
            <tbody>
              {registros.map((r) => (
                <tr key={r.id} title={r.notas ?? undefined}>
                  <td>{r.semana}</td>
                  <td>{r.grupo}</td>
                  <td>{formatDate(r.fecha)}</td>
                  <td>{r.bien_clasificados_pct}%</td>
                  <td>
                    {r.aprovechables_kg}/{r.organicos_kg}/{r.no_aprovechables_kg}
                  </td>
                  <td>
                    {r.origen === 'piloto' ? (
                      <span className="chip chip--small">piloto</span>
                    ) : (
                      <button className="icon-btn" onClick={() => borrar(r.id)} aria-label="Eliminar registro">
                        ✕
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Observacion() {
  const { run } = useDb();
  const indicadores = useQuery<Indicador>('SELECT * FROM indicadores_observacion ORDER BY id');
  const [fecha, setFecha] = useState(hoy());
  const [grupo, setGrupo] = useState('');
  const [semana, setSemana] = useState(1);
  const [niveles, setNiveles] = useState<Record<number, number>>({});
  const [ok, setOk] = useState(false);
  const completo = indicadores.length > 0 && indicadores.every((i) => niveles[i.id]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!grupo.trim() || !completo) return;
    for (const ind of indicadores) {
      run('INSERT INTO observaciones (fecha, grupo, semana, indicador_id, nivel) VALUES (?, ?, ?, ?, ?)', [
        fecha,
        grupo.trim().slice(0, 20),
        semana,
        ind.id,
        niveles[ind.id],
      ]);
    }
    setNiveles({});
    setOk(true);
  }

  return (
    <form className="card form" onSubmit={onSubmit}>
      <h3>Lista de observación</h3>
      <div className="form__row">
        <label>
          Fecha
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
        </label>
        <label>
          Grupo
          <input value={grupo} onChange={(e) => { setGrupo(e.target.value); setOk(false); }} maxLength={20} required list="grupos-admin" placeholder="3°A" />
        </label>
      </div>
      <SemanaPicker value={semana} onChange={(s) => { setSemana(s); setOk(false); }} />
      <ul className="obs">
        {indicadores.map((ind) => (
          <li key={ind.id}>
            <p>
              <span className="chip chip--small">{ind.dimension}</span> {ind.texto}
            </p>
            <div className="survey__opts" role="radiogroup" aria-label={ind.texto}>
              {NIVELES.map((n) => (
                <label key={n.valor} className={niveles[ind.id] === n.valor ? 'opt opt--on' : 'opt'}>
                  <input
                    type="radio"
                    name={`ind${ind.id}`}
                    checked={niveles[ind.id] === n.valor}
                    onChange={() => { setNiveles((v) => ({ ...v, [ind.id]: n.valor })); setOk(false); }}
                  />
                  {n.label}
                </label>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <button className="btn btn--primary" type="submit" disabled={!completo || !grupo.trim()}>
        Guardar observación
      </button>
      {ok && <p className="success">Observación guardada.</p>}
    </form>
  );
}
