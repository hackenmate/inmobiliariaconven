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
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
}

export function MediaImage({
  src,
  alt,
  className = '',
  fallbackTitle,
  loading = 'lazy',
  fetchPriority = 'auto',
}: MediaImageProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#0E2F1E] via-[#1B4730] to-[#0E2F1E] text-[#FAF8F3]/85 p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Mountain className="w-8 h-8 mb-2 text-[#E3C992]" strokeWidth={1.5} />
        {fallbackTitle && (
          <span className="font-serif text-lg tracking-wide text-[#FAF8F3]">
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
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}

interface AutoPlayVideoProps {
  src: string;
  poster?: string;
  fallbackImage?: string;
  className?: string;
  ariaLabel?: string;
  ariaHidden?: boolean;
  lazyMount?: boolean;
}

export function AutoPlayVideo({
  src,
  poster,
  fallbackImage,
  className = '',
  ariaLabel,
  ariaHidden = false,
  lazyMount = false,
}: AutoPlayVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldMountVideo, setShouldMountVideo] = useState(!lazyMount);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!lazyMount || shouldMountVideo) return;
    const target = containerRef.current;
    if (!target || typeof IntersectionObserver === 'undefined') {
      setShouldMountVideo(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldMountVideo(true);
          observer.disconnect();
        }
      },
      { rootMargin: '420px 0px' },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [lazyMount, shouldMountVideo]);

  useEffect(() => {
    setHasError(false);
    if (!shouldMountVideo) return;
    const el = videoRef.current;
    if (!el) return;

    el.defaultMuted = true;
    el.muted = true;
    el.playsInline = true;
    el.setAttribute('muted', '');
    el.setAttribute('playsinline', '');

    const tryPlay = () => {
      if (el.paused) {
        el.play().catch(() => {});
      }
    };

    tryPlay();
    el.addEventListener('loadeddata', tryPlay);
    el.addEventListener('canplay', tryPlay);

    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            tryPlay();
          }
        },
        { threshold: 0.05 },
      );
      observer.observe(el);
    }

    return () => {
      el.removeEventListener('loadeddata', tryPlay);
      el.removeEventListener('canplay', tryPlay);
      observer?.disconnect();
    };
  }, [src, shouldMountVideo]);

  if (hasError && (fallbackImage || poster)) {
    return (
      <MediaImage
        src={fallbackImage ?? poster ?? ''}
        alt={ariaLabel ?? 'Vista aérea de Huayopata en La Convención'}
        loading="eager"
        className={className}
      />
    );
  }

  if (!shouldMountVideo) {
    return (
      <div ref={containerRef} className={`w-full h-full ${className}`}>
        {(poster || fallbackImage) && (
          <img
            src={poster ?? fallbackImage}
            alt={ariaLabel ?? ''}
            aria-hidden={ariaHidden}
            loading="lazy"
            decoding="async"
            className={className}
          />
        )}
      </div>
    );
  }

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
      preload={lazyMount ? 'metadata' : 'auto'}
      onError={() => setHasError(true)}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      className={className}
    />
  );
}
