import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { BindParams, Database } from 'sql.js';
import { execute, getDb, queryAll } from './database';

interface DbState {
  db: Database | null;
  error: string | null;
  revision: number;
  run: (sql: string, params?: BindParams) => void;
}

const DbContext = createContext<DbState>({ db: null, error: null, revision: 0, run: () => {} });

export function DbProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<Database | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    getDb()
      .then(setDb)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  const run = useCallback(
    (sql: string, params: BindParams = []) => {
      if (!db) return;
      execute(db, sql, params);
      setRevision((r) => r + 1);
    },
    [db],
  );

  const value = useMemo(() => ({ db, error, revision, run }), [db, error, revision, run]);
  return <DbContext.Provider value={value}>{children}</DbContext.Provider>;
}

export function useDb() {
  return useContext(DbContext);
}

/** Ejecuta una consulta SELECT y vuelve a ejecutarla cada vez que cambian los datos. */
export function useQuery<T>(sql: string, params: BindParams = []): T[] {
  const { db, revision } = useDb();
  const key = JSON.stringify(params);
  return useMemo(() => {
    if (!db) return [];
    return queryAll<T>(db, sql, params);
  }, [db, sql, key, revision]);
}
