import React, { useEffect, useRef, useState } from 'react';

interface Props {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  parallax?: boolean;
  parallaxSpeed?: number;
}

/**
 * MagazineImage — 杂志级图片组件
 *
 * - 4px 宣纸色内边距（装裱感）
 * - 冷金边框从四角展开
 * - 视差滚动
 * - Caption 滑入
 */
export default function MagazineImage({
  src,
  alt,
  caption,
  className = '',
  parallax = false,
  parallaxSpeed = 0.08,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (!parallax) return;
    let raf = 0;
    const handleScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = containerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const viewportCenter = window.innerHeight / 2;
        const elementCenter = rect.top + rect.height / 2;
        const distance = (viewportCenter - elementCenter) * parallaxSpeed;
        setOffset(distance);
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [parallax, parallaxSpeed]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden group ${className}`}
    >
      {/* Corner frame lines */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <span className="absolute top-0 left-0 w-[20%] h-px bg-[var(--color-accent)] origin-left transition-transform duration-500 ease-out scale-x-0 group-hover:scale-x-100" />
        <span className="absolute top-0 left-0 w-px h-[20%] bg-[var(--color-accent)] origin-top transition-transform duration-500 ease-out scale-y-0 group-hover:scale-y-100" />
        <span className="absolute bottom-0 right-0 w-[20%] h-px bg-[var(--color-accent)] origin-right transition-transform duration-500 ease-out scale-x-0 group-hover:scale-x-100" />
        <span className="absolute bottom-0 right-0 w-px h-[20%] bg-[var(--color-accent)] origin-bottom transition-transform duration-500 ease-out scale-y-0 group-hover:scale-y-100" />
      </div>

      {/* Paper matting */}
      <div className="p-1 bg-[var(--color-surface)]">
        <div className="relative overflow-hidden">
          <img
            src={src}
            alt={alt}
            className="w-full h-auto object-cover transition-all duration-700 ease-out group-hover:-translate-y-1 group-hover:scale-[1.03]"
            style={parallax ? { transform: `translateY(${offset}px)` } : undefined}
          />
          {/* Subtle paper texture overlay */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: '256px 256px',
            }}
          />
        </div>
      </div>

      {/* Caption slide-up */}
      {caption && (
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-20">
          <div className="bg-[var(--color-background)]/90 backdrop-blur-sm border border-[var(--color-border)] rounded-lg px-4 py-2">
            <p className="text-sm text-[var(--color-secondary)] font-serif">{caption}</p>
          </div>
        </div>
      )}
    </div>
  );
}
