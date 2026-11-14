import { useId } from 'react';

interface MonogramProps {
  className?: string;
}

/**
 * Monograma oficial de Terrantier Inmobiliaria:
 * Cumbres andino-amazónicas integradas sobre una "T" arquitectónica dividida.
 */
export function TerrantierMonogram({ className = 'w-9 h-9' }: MonogramProps) {
  const uid = useId().replace(/:/g, '');
  const goldGradId = `terrantier-gold-${uid}`;
  const goldLightId = `terrantier-gold-light-${uid}`;

  return (
    <svg
      viewBox="0 0 80 74"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id={goldGradId} x1="8" y1="8" x2="72" y2="68" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E6CC8F" />
          <stop offset="45%" stopColor="#C8A562" />
          <stop offset="100%" stopColor="#9C7A3C" />
        </linearGradient>
        <linearGradient id={goldLightId} x1="20" y1="10" x2="55" y2="45" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F4E1B2" />
          <stop offset="100%" stopColor="#C8A562" />
        </linearGradient>
      </defs>

      {/* Cumbre izquierda secundaria */}
      <path
        d="M12 31L26 16L33.5 23.5L29 28L25.5 24.5L17.5 31H12Z"
        fill={`url(#${goldGradId})`}
      />

      {/* Cumbre principal con plano iluminado y sombra */}
      <path
        d="M27.5 28.5L44 10L64 31H56.5L44 17.5L33 28.5H27.5Z"
        fill={`url(#${goldLightId})`}
      />
      <path
        d="M44 10L64 31H56.5L44 17.5V10Z"
        fill={`url(#${goldGradId})`}
        opacity="0.88"
      />

      {/* Arista sutil del pico secundario */}
      <path
        d="M35.5 21.5L40 16.5L47.5 24.5L43.5 24.5L39.5 20.5L37.5 22.8L35.5 21.5Z"
        fill={`url(#${goldLightId})`}
        opacity="0.9"
      />

      {/* Brazo izquierdo de la "T" dividida */}
      <path
        d="M11 36H37.5V67L32.5 62.5V41H15.5L11 36Z"
        fill={`url(#${goldGradId})`}
      />

      {/* Brazo derecho de la "T" dividida */}
      <path
        d="M69 36H42.5V67L47.5 62.5V41H64.5L69 36Z"
        fill={`url(#${goldLightId})`}
      />
    </svg>
  );
}

interface TerrantierLogoProps {
  variant?: 'horizontal' | 'stacked';
  theme?: 'dark' | 'light';
}

export function TerrantierLogo({
  variant = 'horizontal',
  theme = 'dark',
}: TerrantierLogoProps) {
  const isDark = theme === 'dark';
  const titleColor = isDark ? 'text-[#FAF8F3]' : 'text-[#0E2F1E]';
  const subColor = isDark ? 'text-[#E3C992]' : 'text-[#8D6B32]';
  const metaColor = isDark ? 'text-[#FAF8F3]/75' : 'text-[#2D3332]/75';
  const lineColor = isDark ? 'bg-[#C8A562]/55' : 'bg-[#C8A562]/70';

  if (variant === 'stacked') {
    return (
      <div className="inline-flex flex-col items-start select-none">
        <div className="flex flex-col items-center">
          <TerrantierMonogram className="w-12 h-11 mb-2" />
          <span
            className={`font-brand text-2xl sm:text-[26px] font-medium tracking-[0.22em] leading-none ${titleColor}`}
          >
            TERRANTIER
          </span>
          <div className="mt-1.5 w-full flex items-center justify-center gap-2.5">
            <span className={`h-px flex-1 ${lineColor}`} />
            <span
              className={`font-brand text-[10px] font-medium tracking-[0.34em] leading-none ${subColor}`}
            >
              INMOBILIARIA
            </span>
            <span className={`h-px flex-1 ${lineColor}`} />
          </div>
          <span
            className={`mt-2 font-brand text-[9px] font-medium tracking-[0.26em] uppercase ${metaColor}`}
          >
            La Convención · Cusco · Perú
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-3 select-none">
      <TerrantierMonogram className="w-8 h-8 sm:w-9 sm:h-8 shrink-0" />
      <div className="flex flex-col">
        <span
          className={`font-brand text-base sm:text-lg font-medium tracking-[0.2em] leading-none ${titleColor}`}
        >
          TERRANTIER
        </span>
        <div className="mt-1 flex items-center gap-1.5">
          <span className={`h-px w-3 ${lineColor}`} />
          <span
            className={`font-brand text-[8.5px] sm:text-[9px] font-medium tracking-[0.32em] leading-none ${subColor}`}
          >
            INMOBILIARIA
          </span>
          <span className={`h-px w-3 ${lineColor}`} />
        </div>
      </div>
    </div>
  );
}

/**
 * Motivo decorativo sutil inspirado en la retícula diagonal de la guía de marca.
 */
export function TerrantierPatternOverlay({
  opacityClass = 'opacity-[0.045]',
}: {
  opacityClass?: string;
}) {
  const uid = useId().replace(/:/g, '');
  const patternId = `terrantier-lattice-${uid}`;

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 w-full h-full ${opacityClass}`}
    >
      <defs>
        <pattern id={patternId} width="72" height="72" patternUnits="userSpaceOnUse">
          <path
            d="M36 0L72 36L36 72L0 36Z"
            fill="none"
            stroke="#C8A562"
            strokeWidth="0.9"
          />
          <g transform="translate(23, 24) scale(0.32)">
            <path
              d="M12 31L26 16L33.5 23.5L29 28L25.5 24.5L17.5 31H12Z"
              fill="none"
              stroke="#C8A562"
              strokeWidth="2.4"
            />
            <path
              d="M27.5 28.5L44 10L64 31H56.5L44 17.5L33 28.5H27.5Z"
              fill="none"
              stroke="#C8A562"
              strokeWidth="2.4"
            />
            <path
              d="M11 36H37.5V67L32.5 62.5V41H15.5L11 36Z"
              fill="none"
              stroke="#C8A562"
              strokeWidth="2.4"
            />
            <path
              d="M69 36H42.5V67L47.5 62.5V41H64.5L69 36Z"
              fill="none"
              stroke="#C8A562"
              strokeWidth="2.4"
            />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

/**
 * Doble filete metálico dorado inspirado en el sistema de marca Terrantier.
 */
export function TerrantierGoldRule({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`w-full flex flex-col gap-[3px] ${className}`}>
      <div className="h-[2px] w-full bg-gradient-to-r from-[#9A783A]/30 via-[#C8A562] to-[#9A783A]/30" />
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#E6CC8F]/70 to-transparent" />
    </div>
  );
}

