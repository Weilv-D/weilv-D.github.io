import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { computeTitleLines, measureTextWidth } from '../utils/textMeasure';

interface Props {
  text: string;
  font?: string;
  maxWidth?: number;
  lineHeight?: number;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  reveal?: boolean;
  revealDelay?: number;
  charStagger?: number;
  showCursor?: boolean;
  variant?: 'magazine' | 'cascade' | 'editorial';
}

/**
 * PretextEditorial — 活字排版动画引擎
 *
 * ResizeObserver 驱动 computeTitleLines 实时重计算，
 * 断点变化时文字在行与行之间"流动重组"。
 *
 * variant 模式：
 * - 'magazine': 字符旋转飞入 + overshoot 回弹（封面标题）
 * - 'cascade': 行内字符级联滑入（正文首段）
 * - 'editorial': 经典编辑式逐字显现（默认）
 */
export default function PretextEditorial({
  text,
  font,
  maxWidth: propMaxWidth,
  lineHeight = 1.15,
  className = '',
  as: Tag = 'h1',
  reveal = true,
  revealDelay = 0,
  charStagger = 35,
  showCursor = true,
  variant = 'editorial',
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(propMaxWidth || 800);
  const [isRevealed, setIsRevealed] = useState(!reveal);
  const [hasAnimated, setHasAnimated] = useState(false);

  const computedFont = font || `700 48px "Playfair Display", "Bodoni Moda", "Noto Serif SC", serif`;
  const computedLineHeight = lineHeight * 48;

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
    }
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!reveal) return;
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsRevealed(true);
            setTimeout(() => setHasAnimated(true), 1800);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reveal]);

  const titleLayout = useMemo(() => {
    if (!text) return null;
    try {
      return computeTitleLines(text, computedFont, containerWidth, computedLineHeight);
    } catch (e) {
      return null;
    }
  }, [text, computedFont, containerWidth, computedLineHeight]);

  // Generate per-char animation data based on variant
  const charMap = useMemo(() => {
    if (!titleLayout) return [];
    let globalCharIndex = 0;
    return titleLayout.lines.map((line, lineIdx) => {
      const chars = Array.from(line.text);
      const charData = chars.map((char, charIdx) => {
        const baseDelay = revealDelay + globalCharIndex * charStagger + lineIdx * 80;
        let startRotate = 0;
        let startY = 40;
        let startScale = 0.95;
        let startLetterSpacing = '0.08em';
        let easing = 'cubic-bezier(0.16, 1, 0.3, 1)';
        let duration = '700ms';

        if (variant === 'magazine') {
          startRotate = (Math.random() - 0.5) * 14;
          startY = 45;
          startScale = 0.93;
          easing = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
          duration = '750ms';
        } else if (variant === 'cascade') {
          startRotate = 0;
          startY = 22;
          startScale = 0.88;
          startLetterSpacing = '0.04em';
          easing = 'cubic-bezier(0.16, 1, 0.3, 1)';
          duration = '650ms';
        }

        globalCharIndex++;
        return { char, delay: baseDelay, startRotate, startY, startScale, startLetterSpacing, easing, duration, key: `${lineIdx}-${charIdx}-${char}` };
      });
      return { chars: charData, lineIdx };
    });
  }, [titleLayout, revealDelay, charStagger, variant]);

  // Fallback for SSR
  if (!titleLayout || titleLayout.lines.length === 0) {
    return (
      <div ref={containerRef} className={className}>
        <Tag
          className={`transition-all duration-1000 ${isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: `${revealDelay}ms` }}
        >
          {text}
        </Tag>
      </div>
    );
  }

  const totalChars = charMap.reduce((sum, line) => sum + line.chars.length, 0);
  const cursorDelay = revealDelay + totalChars * charStagger + 200;

  return (
    <div ref={containerRef} className={className}>
      <Tag className="relative">
        {charMap.map((line, lineIdx) => (
          <span
            key={`line-${lineIdx}`}
            className="block overflow-hidden"
            style={{ lineHeight: `${lineHeight}em` }}
          >
            <span className="inline-block">
              {line.chars.map(({ char, delay, startRotate, startY, startScale, startLetterSpacing, easing, duration, key }) => (
                <span
                  key={key}
                  className="inline-block transition-all will-change-transform"
                  style={{
                    transitionDuration: duration,
                    transitionTimingFunction: easing,
                    transitionProperty: 'opacity, transform, letter-spacing',
                    opacity: isRevealed ? 1 : 0,
                    transform: isRevealed
                      ? 'translateY(0) rotate(0deg) scaleX(1)'
                      : `translateY(${startY}px) rotate(${startRotate}deg) scaleX(${startScale})`,
                    letterSpacing: isRevealed ? 'inherit' : startLetterSpacing,
                    transitionDelay: `${delay}ms`,
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
              {/* Cold-gold cursor on last line */}
              {showCursor && lineIdx === charMap.length - 1 && (
                <span
                  className="inline-block align-baseline"
                  style={{
                    width: '2px',
                    height: '0.85em',
                    backgroundColor: 'var(--color-accent)',
                    marginLeft: '2px',
                    opacity: hasAnimated ? 1 : 0,
                    animation: hasAnimated ? 'cursorBlink 1.2s step-end infinite' : 'none',
                    transition: `opacity 0.4s ease ${cursorDelay}ms`,
                    verticalAlign: 'baseline',
                  }}
                />
              )}
            </span>
          </span>
        ))}
      </Tag>
    </div>
  );
}
