-- Tablas con los datos de la implementación.
-- Viven en una base SQLite dentro del navegador (sql.js) y se guardan en localStorage.
-- origen = 'piloto' → datos de la implementación piloto (seed.sql, se recargan en cada visita)
-- origen = 'aula'   → datos registrados desde el sitio (comentarios, juego, diagnóstico, panel /admin)

CREATE TABLE IF NOT EXISTS comentarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_slug TEXT NOT NULL,
  autor TEXT NOT NULL,
  rol TEXT NOT NULL DEFAULT 'Visitante',
  texto TEXT NOT NULL,
  fecha TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
  origen TEXT NOT NULL DEFAULT 'aula'
);

CREATE TABLE IF NOT EXISTS partidas_reto (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  jugador TEXT NOT NULL,
  grupo TEXT NOT NULL,
  aciertos INTEGER NOT NULL,
  total INTEGER NOT NULL,
  fecha TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
  origen TEXT NOT NULL DEFAULT 'aula'
);

CREATE TABLE IF NOT EXISTS respuestas_diagnostico (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  grupo TEXT NOT NULL,
  pregunta_id INTEGER NOT NULL,
  valor INTEGER NOT NULL CHECK (valor BETWEEN 0 AND 2),
  fecha TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
  origen TEXT NOT NULL DEFAULT 'aula'
);

CREATE TABLE IF NOT EXISTS registros_residuos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fecha TEXT NOT NULL,
  grupo TEXT NOT NULL,
  semana INTEGER NOT NULL CHECK (semana BETWEEN 1 AND 4),
  aprovechables_kg REAL NOT NULL DEFAULT 0,
  organicos_kg REAL NOT NULL DEFAULT 0,
  no_aprovechables_kg REAL NOT NULL DEFAULT 0,
  bien_clasificados_pct INTEGER NOT NULL CHECK (bien_clasificados_pct BETWEEN 0 AND 100),
  notas TEXT,
  origen TEXT NOT NULL DEFAULT 'aula'
);

CREATE TABLE IF NOT EXISTS observaciones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fecha TEXT NOT NULL,
  grupo TEXT NOT NULL,
  semana INTEGER NOT NULL CHECK (semana BETWEEN 1 AND 4),
  indicador_id INTEGER NOT NULL,
  nivel INTEGER NOT NULL CHECK (nivel BETWEEN 1 AND 3),
  origen TEXT NOT NULL DEFAULT 'aula'
);
