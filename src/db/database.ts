import initSqlJs, { type BindParams, type Database } from 'sql.js';
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url';
import userSchema from './user-schema.sql?raw';
import content from './content.sql?raw';
import seed from './seed.sql?raw';

/**
 * Base de datos SQLite que corre 100 % en el navegador (sql.js / WebAssembly).
 * - El contenido del blog (content.sql) se recarga siempre al iniciar.
 * - Los datos de la implementación piloto (seed.sql) también se recargan siempre.
 * - Los datos nuevos (comentarios, partidas, registros…) se guardan
 *   en localStorage como un archivo SQLite serializado.
 * No hay servidor ni base de datos externa: ideal para un sitio estático en Netlify.
 */

const STORAGE_KEY = 'blog-zenith:sqlite:v2';

let dbPromise: Promise<Database> | null = null;

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function fromBase64(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function readSaved(): Uint8Array | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? fromBase64(saved) : null;
  } catch {
    return null;
  }
}

export function getDb(): Promise<Database> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const SQL = await initSqlJs({ locateFile: () => wasmUrl });
      let db: Database | null = null;
      const saved = readSaved();
      if (saved) {
        try {
          db = new SQL.Database(saved);
          db.exec('SELECT 1');
        } catch {
          db = null;
        }
      }
      if (!db) db = new SQL.Database();
      db.run('PRAGMA foreign_keys = ON;');
      db.exec(userSchema);
      db.exec(content);
      db.exec(seed);
      return db;
    })();
  }
  return dbPromise;
}

export function persist(db: Database): void {
  try {
    localStorage.setItem(STORAGE_KEY, toBase64(db.export()));
  } catch {
    // Sin almacenamiento disponible (modo privado): los datos viven solo en esta sesión.
  }
}

export function queryAll<T>(db: Database, sql: string, params: BindParams = []): T[] {
  const stmt = db.prepare(sql);
  try {
    stmt.bind(params);
    const rows: T[] = [];
    while (stmt.step()) rows.push(stmt.getAsObject() as unknown as T);
    return rows;
  } finally {
    stmt.free();
  }
}

export function queryOne<T>(db: Database, sql: string, params: BindParams = []): T | undefined {
  return queryAll<T>(db, sql, params)[0];
}

export function execute(db: Database, sql: string, params: BindParams = []): void {
  db.run(sql, params);
  persist(db);
}

/** Descarga el archivo .sqlite completo (contenido + datos de la comunidad). */
export function downloadDatabase(db: Database): void {
  const bytes = db.export();
  const blob = new Blob([bytes], { type: 'application/x-sqlite3' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `aprender-hoy-${new Date().toISOString().slice(0, 10)}.sqlite`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Restaura un archivo .sqlite descargado antes (por ejemplo, desde otro equipo del colegio). */
export async function importDatabase(file: File): Promise<void> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const SQL = await initSqlJs({ locateFile: () => wasmUrl });
  const test = new SQL.Database(bytes);
  test.exec('SELECT count(*) FROM sqlite_master');
  test.close();
  localStorage.setItem(STORAGE_KEY, toBase64(bytes));
}

export function resetCommunityData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* nada que borrar */
  }
}
