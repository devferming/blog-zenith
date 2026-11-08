/// <reference types="vite/client" />

declare module '*.sql?raw' {
  const content: string;
  export default content;
}

interface ImportMetaEnv {
  readonly VITE_ADMIN_HASH?: string;
}
