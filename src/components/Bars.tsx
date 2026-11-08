export interface BarDatum {
  label: string;
  value: number;
  max?: number;
  color?: string;
  suffix?: string;
}

/** Gráfica de barras horizontal y accesible, sin librerías. */
export function Bars({ data, max }: { data: BarDatum[]; max?: number }) {
  const top = max ?? Math.max(1, ...data.map((d) => d.value));
  return (
    <ul className="bars">
      {data.map((d) => {
        const limit = d.max ?? top;
        const pct = limit > 0 ? Math.min(100, (d.value / limit) * 100) : 0;
        return (
          <li key={d.label}>
            <span className="bars__label">{d.label}</span>
            <span className="bars__track" aria-hidden="true">
              <span className="bars__fill" style={{ width: `${pct}%`, background: d.color }} />
            </span>
            <span className="bars__value">
              {Number.isInteger(d.value) ? d.value : d.value.toFixed(1)}
              {d.suffix ?? ''}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
