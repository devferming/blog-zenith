interface LogoProps {
  size?: number;
  className?: string;
}

/**
 * Imagotipo de la propuesta.
 * Hoja (naturaleza) · flechas (reutilización) · círculo (compromiso colectivo).
 */
export function Logo({ size = 56, className }: LogoProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 200 200"
      role="img"
      aria-label="Imagotipo: una planta dentro de un círculo de flechas. Aprender hoy para cuidar el mañana."
    >
      <defs>
        <linearGradient id="leaf-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8cc63f" />
          <stop offset="1" stopColor="#3f8a3a" />
        </linearGradient>
        <linearGradient id="leaf-b" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a6d45a" />
          <stop offset="1" stopColor="#4f9a3e" />
        </linearGradient>
      </defs>
      {/* círculo de compromiso */}
      <circle cx="100" cy="100" r="92" fill="var(--logo-bg, #f6f1e4)" />
      {/* flechas de reutilización */}
      <g fill="none" stroke="#2f7d4a" strokeWidth="11" strokeLinecap="round">
        <path d="M 38 86 A 64 64 0 0 1 140 48" />
        <path d="M 162 114 A 64 64 0 0 1 60 152" />
      </g>
      <path d="M 132 30 L 156 52 L 126 62 Z" fill="#2f7d4a" />
      <path d="M 68 170 L 44 148 L 74 138 Z" fill="#2f7d4a" />
      {/* suelo */}
      <ellipse cx="100" cy="134" rx="30" ry="9" fill="#6b4a2b" />
      {/* tallo y hojas */}
      <path d="M 100 132 C 100 116 100 104 101 92" stroke="#3f7a2f" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M 100 104 C 80 106 64 94 62 74 C 82 72 98 84 100 104 Z" fill="url(#leaf-a)" />
      <path d="M 101 94 C 104 70 122 56 144 58 C 142 82 124 96 101 94 Z" fill="url(#leaf-b)" />
      <path d="M 100 104 C 88 96 76 86 68 78" stroke="#2c6a2a" strokeWidth="1.6" fill="none" />
      <path d="M 101 94 C 114 84 126 72 138 62" stroke="#2c6a2a" strokeWidth="1.6" fill="none" />
    </svg>
  );
}
