import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { PostCard, POSTS_SQL } from '../components/PostCard';
import { useQuery } from '../db/DbContext';
import type { Fase, Post } from '../db/types';

interface Stats {
  partidas: number;
  registros: number;
  comentarios: number;
  diagnosticos: number;
}

export function Home() {
  const fases = useQuery<Fase>('SELECT * FROM fases ORDER BY id');
  const destacados = useQuery<Post>(`${POSTS_SQL} WHERE p.destacado = 1 ORDER BY p.fecha`);
  const recientes = useQuery<Post>(`${POSTS_SQL} ORDER BY p.fecha DESC LIMIT 3`);
  const [stats] = useQuery<Stats>(`
    SELECT
      (SELECT count(*) FROM partidas_reto) AS partidas,
      (SELECT count(*) FROM registros_residuos) AS registros,
      (SELECT count(*) FROM comentarios) AS comentarios,
      (SELECT count(DISTINCT grupo || fecha) FROM respuestas_diagnostico) AS diagnosticos
  `);

  return (
    <>
      <section className="hero">
        <div className="wrap hero__grid">
          <div className="hero__copy">
            <p className="eyebrow">Innovación pedagógica · Educación ambiental · Básica primaria</p>
            <h1>
              Aprender hoy <span>para cuidar el mañana</span>
            </h1>
            <p className="lead">
              Un blog que cuenta, paso a paso, cómo convertimos el reciclaje en un hábito cotidiano: retos
              reales, trabajo en equipo, herramientas digitales sencillas y evidencias del antes y el después.
            </p>
            <div className="hero__actions">
              <Link to="/blog" className="btn btn--primary">
                Leer la propuesta
              </Link>
              <Link to="/reto" className="btn btn--outline">
                Jugar el Reto Reciclador
              </Link>
            </div>
          </div>
          <div className="hero__art" aria-hidden="true">
            <div className="hero__ring">
              <Logo size={280} />
            </div>
            <span className="hero__tag hero__tag--1">🍃 Hoja · naturaleza</span>
            <span className="hero__tag hero__tag--2">♻️ Flechas · reutilización</span>
            <span className="hero__tag hero__tag--3">⭕ Círculo · compromiso colectivo</span>
          </div>
        </div>
      </section>

      <section className="wrap section problem">
        <div className="problem__quote">
          <p className="eyebrow">El problema</p>
          <blockquote>
            Se trabajan contenidos sobre el cuidado del planeta, pero pocas veces se acompañan de experiencias
            prácticas ni se hace seguimiento a los cambios de conducta.
          </blockquote>
        </div>
        <div className="problem__answer">
          <p className="eyebrow">Nuestra respuesta</p>
          <p>
            Una propuesta pedagógica que combina la conciencia ambiental con recursos digitales por medio de
            actividades prácticas: separar residuos, reutilizar materiales y cuidar las zonas verdes, con
            seguimiento y evaluación basada en evidencias.
          </p>
          <Link to="/blog/objetivos-de-la-propuesta" className="link-arrow">
            Ver objetivos →
          </Link>
        </div>
      </section>

      <section className="section section--tint">
        <div className="wrap">
          <header className="section__head">
            <p className="eyebrow">Ruta de innovación educativa</p>
            <h2>Seis pasos, del aula a la comunidad</h2>
            <p>Cada entrada del blog corresponde a un paso del proceso de innovación.</p>
          </header>
          <ol className="steps">
            {fases.map((f) => (
              <li key={f.id} className={`step step--${f.id}`}>
                <Link to={`/blog?paso=${f.slug}`}>
                  <span className="step__num">{f.id}</span>
                  <h3>{f.nombre}</h3>
                  <p className="step__q">{f.pregunta}</p>
                  <p>{f.descripcion}</p>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="wrap section">
        <header className="section__head">
          <p className="eyebrow">Para empezar</p>
          <h2>Entradas destacadas</h2>
        </header>
        <div className="grid grid--3">
          {destacados.map((p) => (
            <PostCard key={p.id} post={p} large />
          ))}
        </div>
      </section>

      <section className="section section--dark">
        <div className="wrap tools">
          <header className="section__head section__head--light">
            <p className="eyebrow">Escenario digital</p>
            <h2>Herramientas para el aula</h2>
            <p>Funcionan en un solo computador o tablet compartida, sin claves ni conexión a servidores.</p>
          </header>
          <div className="grid grid--3">
            <Link to="/diagnostico" className="tool">
              <span className="tool__icon">🔍</span>
              <h3>Diagnóstico de hábitos</h3>
              <p>Encuesta por grupos para conocer hábitos, barreras y acceso digital.</p>
            </Link>
            <Link to="/reto" className="tool">
              <span className="tool__icon">🎯</span>
              <h3>Reto Reciclador</h3>
              <p>Juego para aprender el código de colores: blanca, negra y verde.</p>
            </Link>
            <Link to="/evaluacion" className="tool">
              <span className="tool__icon">📊</span>
              <h3>Registro y observación</h3>
              <p>Residuos bien clasificados y conductas observadas, antes y después.</p>
            </Link>
          </div>
          {stats && (
            <dl className="counters">
              <div>
                <dt>Partidas jugadas</dt>
                <dd>{stats.partidas}</dd>
              </div>
              <div>
                <dt>Diagnósticos</dt>
                <dd>{stats.diagnosticos}</dd>
              </div>
              <div>
                <dt>Registros de residuos</dt>
                <dd>{stats.registros}</dd>
              </div>
              <div>
                <dt>Comentarios</dt>
                <dd>{stats.comentarios}</dd>
              </div>
            </dl>
          )}
        </div>
      </section>

      <section className="wrap section">
        <header className="section__head section__head--row">
          <div>
            <p className="eyebrow">Bitácora</p>
            <h2>Lo más reciente</h2>
          </div>
          <Link to="/blog" className="link-arrow">
            Todas las entradas →
          </Link>
        </header>
        <div className="grid grid--3">
          {recientes.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      </section>
    </>
  );
}
