import React, { useMemo, useRef, useState, useEffect } from 'react';
import { computeTitleLines } from '../utils/textMeasure';

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
}

/**
 * PretextMagazineTitle — 杂志封面标题动画
 *
 * 字符从随机角度旋转飞入，带有轻微的 overshoot 回弹。
 * 使用 Pretext layoutWithLines 精确计算行断点后按行 stagger。
 */
export default function PretextMagazineTitle({
  text,
  font,
  maxWidth: propMaxWidth,
  lineHeight = 1.1,
  className = '',
  as: Tag = 'h1',
  reveal = true,
  revealDelay = 0,
  charStagger = 45,
  showCursor = true,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(propMaxWidth || 800);
  const [isRevealed, setIsRevealed] = useState(!reveal);
  const [hasAnimated, setHasAnimated] = useState(false);

  const computedFont = font || `700 56px "Playfair Display", "Bodoni Moda", "Noto Serif SC", serif`;
  const computedLineHeight = lineHeight * 56;

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
            setTimeout(() => setHasAnimated(true), 2000);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
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

  const charMap = useMemo(() => {
    if (!titleLayout) return [];
    let globalCharIndex = 0;
    return titleLayout.lines.map((line, lineIdx) => {
      const chars = Array.from(line.text);
      const charData = chars.map((char, charIdx) => {
        const delay = revealDelay + globalCharIndex * charStagger + lineIdx * 100;
        const startRotate = (Math.random() - 0.5) * 16; // -8deg to 8deg
        globalCharIndex++;
        return { char, delay, startRotate, key: `${lineIdx}-${charIdx}-${char}` };
      });
      return { chars: charData, lineIdx };
    });
  }, [titleLayout, revealDelay, charStagger]);

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
  const cursorDelay = revealDelay + totalChars * charStagger + 300;

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
              {line.chars.map(({ char, delay, startRotate, key }) => (
                <span
                  key={key}
                  className="inline-block will-change-transform"
                  style={{
                    transitionDuration: '750ms',
                    transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transitionProperty: 'opacity, transform, letter-spacing',
                    opacity: isRevealed ? 1 : 0,
                    transform: isRevealed
                      ? 'translateY(0) rotate(0deg) scaleX(1)'
                      : `translateY(40px) rotate(${startRotate}deg) scaleX(0.94)`,
                    letterSpacing: isRevealed ? 'inherit' : '0.06em',
                    transitionDelay: `${delay}ms`,
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
              {showCursor && lineIdx === charMap.length - 1 && (
                <span
                  className="inline-block align-baseline"
                  style={{
                    width: '2px',
                    height: '0.85em',
                    backgroundColor: 'var(--color-accent)',
                    marginLeft: '3px',
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
