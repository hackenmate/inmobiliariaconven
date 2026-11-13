import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Mountain } from 'lucide-react';

export const ORGANIC_EASE = [0.22, 1, 0.36, 1] as const;

interface RevealTextProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function RevealText({ children, delay = 0, className = '' }: RevealTextProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        whileInView={{ y: '0%', opacity: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{
          duration: 0.85,
          delay,
          ease: ORGANIC_EASE,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

interface MediaImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export function MediaImage({ src, alt, className = '', fallbackTitle }: MediaImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#18241E] via-[#213329] to-[#2A4736] text-[#FAF9F6]/85 p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Mountain className="w-8 h-8 mb-2 text-[#E4CFAF]" strokeWidth={1.5} />
        {fallbackTitle && (
          <span className="font-serif text-lg tracking-wide text-[#FAF9F6]">
            {fallbackTitle}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}

interface AutoPlayVideoProps {
  src: string;
  poster?: string;
  className?: string;
  ariaLabel?: string;
  ariaHidden?: boolean;
}

export function AutoPlayVideo({
  src,
  poster,
  className = '',
  ariaLabel,
  ariaHidden = false,
}: AutoPlayVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    el.defaultMuted = true;
    el.muted = true;
    el.playsInline = true;

    const tryPlay = () => {
      if (el.paused) {
        el.play().catch(() => {});
      }
    };

    tryPlay();
    el.addEventListener('canplay', tryPlay);

    return () => {
      el.removeEventListener('canplay', tryPlay);
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      key={src}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      className={className}
    />
  );
}
