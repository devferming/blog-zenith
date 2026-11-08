import type { ReactNode } from 'react';

/** Renderizador mínimo y seguro de Markdown (sin HTML crudo) para el contenido de las entradas. */

function inline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) out.push(text.slice(last, match.index));
    const token = match[0];
    if (token.startsWith('**')) out.push(<strong key={`${keyBase}-b${i}`}>{token.slice(2, -2)}</strong>);
    else out.push(<em key={`${keyBase}-i${i}`}>{token.slice(1, -1)}</em>);
    last = match.index + token.length;
    i++;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Markdown({ source }: { source: string }) {
  const blocks = source.trim().split(/\n\s*\n/);
  return (
    <>
      {blocks.map((block, idx) => {
        const key = `blk-${idx}`;
        const lines = block.split('\n').map((l) => l.trim());
        if (lines[0].startsWith('### ')) return <h3 key={key}>{inline(lines[0].slice(4), key)}</h3>;
        if (lines[0].startsWith('## ')) return <h2 key={key}>{inline(lines[0].slice(3), key)}</h2>;
        if (lines.every((l) => l.startsWith('> '))) {
          return (
            <blockquote key={key}>{inline(lines.map((l) => l.slice(2)).join(' '), key)}</blockquote>
          );
        }
        if (lines.every((l) => l.startsWith('- '))) {
          return (
            <ul key={key}>
              {lines.map((l, j) => (
                <li key={`${key}-${j}`}>{inline(l.slice(2), `${key}-${j}`)}</li>
              ))}
            </ul>
          );
        }
        if (lines.every((l) => /^\d+\.\s/.test(l))) {
          return (
            <ol key={key}>
              {lines.map((l, j) => (
                <li key={`${key}-${j}`}>{inline(l.replace(/^\d+\.\s/, ''), `${key}-${j}`)}</li>
              ))}
            </ol>
          );
        }
        return <p key={key}>{inline(lines.join(' '), key)}</p>;
      })}
    </>
  );
}

/** Versión en texto plano (para resúmenes). */
export function plain(source: string): string {
  return source.replace(/[*#>]/g, '').replace(/\s+/g, ' ').trim();
}

export function formatDate(iso: string): string {
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00` : iso.replace(' ', 'T'));
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
}
