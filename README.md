# Aprender hoy para cuidar el mañana 🌱

Blog digital de la **Actividad Evaluativa Eje 4 – Evidencia práctica de la innovación in situ**
(Maestría en Innovación Pedagógica · Electiva III Economía de la Innovación · Fundación Universitaria del Área Andina, 2026).

Da vida práctica y visual al **Dothink Lab Eje 3**: una propuesta pedagógica que combina la conciencia ambiental
con recursos digitales para convertir el reciclaje en un hábito cotidiano en básica primaria.

**Autoras:** Leidy Yurany Ortiz Garzón · Zenith Yulianis Palencia Pérez · Zuleima Isabel Redondo Garcia
**Docente:** Adriana Del Pilar Romero Rivera

## Qué incluye

| Sección | Contenido | Paso de innovación |
|---|---|---|
| Inicio | Problema, ruta de 6 pasos, herramientas y contadores | Todos |
| Blog | 11 entradas del Dothink Lab, filtro por paso y buscador | 1 → 6 |
| Diagnóstico | Encuesta de hábitos por grupo con resultados y sugerencia de primer reto | 1 · Identificar |
| Reto Reciclador | Juego del código de colores (blanca, negra, verde) con tabla de honor | 4 · Implementar |
| Evaluación | Resultados públicos (solo lectura): indicadores, evolución semana 1 → 4, kilos por caneca, tabla por grupo, conductas observadas y bitácora | 5 · Evaluar |
| `/admin` (privado) | Descargar/importar la base y **registrar** residuos y observaciones por semana | — |
| Equipo | Autoras, docente y participantes de la comunidad educativa | — |
| Referencias | Fuentes en APA 7 | — |

Cada entrada admite comentarios de estudiantes, familias y docentes.

## Tecnología

- **React 18 + TypeScript + Vite**
- **SQLite en el navegador** con [sql.js](https://sql.js.org) (WebAssembly): sin servidor y sin base de datos externa.
  - `src/db/content.sql` → contenido editorial (entradas, pasos, residuos, preguntas, equipo, referencias). Se recarga en cada visita, así que para editar el blog basta con modificar este archivo.
  - `src/db/seed.sql` → datos de la **implementación piloto** (3°A, 4°A y 5°A, 85 estudiantes, semanas 1 a 4 de octubre de 2026): diagnóstico, registros de residuos, observaciones, partidas y comentarios. Se marcan con `origen = 'piloto'` y se recargan en cada visita.
  - `src/db/user-schema.sql` → tablas de la comunidad (comentarios, partidas, diagnósticos, registros, observaciones). Se guardan en `localStorage` del navegador.
  - Descargar, importar o reiniciar la base `.sqlite` solo es posible desde el **panel privado `/admin`** (ver abajo).

> Los datos que ingresa la comunidad quedan en el navegador de cada equipo (no se comparten entre visitantes).
> Para reunir la evidencia de varios equipos, descarguen el archivo `.sqlite` y ábranlo con cualquier visor SQLite.

## Uso local

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # genera dist/
npm run preview    # sirve dist/ para probar el build
```

Requiere Node 18 o superior (recomendado 20).

## Panel privado `/admin`

La ruta `/admin` no aparece en el menú ni en el pie de página y pide una clave. Para configurarla:

1. Genera el hash de tu clave:
   ```bash
   npm run admin:hash -- "tu clave secreta"
   ```
2. Copia la línea `VITE_ADMIN_HASH=...` que imprime:
   - **Local:** en un archivo `.env.local` en la raíz (ya está en `.gitignore`).
   - **Netlify:** *Site configuration → Environment variables* → `VITE_ADMIN_HASH`, y vuelve a desplegar.
3. Entra a `https://tu-sitio.netlify.app/admin`.

En el repositorio solo queda el hash, nunca la clave. Sin la variable, el panel aparece desactivado.

## Despliegue en Netlify

`netlify.toml` ya está configurado:

- Build command: `npm run build`
- Publish directory: `dist`
- Redirección SPA (`/* → /index.html`) para que funcionen las rutas internas al recargar.

El blog público no requiere clave, como pide la actividad. La única variable de entorno es `VITE_ADMIN_HASH`, para el panel privado.

## Estructura

```
src/
  db/          SQLite (sql.js), esquema, contenido y contexto React
  components/  Layout, imagotipo, tarjetas y gráficas
  pages/       Inicio, Blog, Entrada, Diagnóstico, Reto, Evaluación, Equipo, Referencias
  lib/         Renderizador Markdown seguro y formato de fechas
```
