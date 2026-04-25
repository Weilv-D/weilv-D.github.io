import React, { useMemo, useRef, useState, useEffect } from 'react';
import { computeTitleLines } from '../utils/textMeasure';

interface Props {
  text: string;
  font?: string;
  className?: string;
  maxLines?: number;
  lineHeight?: number;
  wordStagger?: number;
  threshold?: number;
}

/**
 * PretextPullQuote — 杂志大引号组件
 *
 * 大引号装饰 + 文字从引号后方滑出 + 左侧冷金竖线从 0 到 100% 生长。
 * 按词 stagger 揭示，营造杂志 Pull Quote 效果。
 */
export default function PretextPullQuote({
  text,
  font,
  className = '',
  maxLines,
  lineHeight = 1.7,
  wordStagger = 60,
  threshold = 0.15,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(600);
  const [isRevealed, setIsRevealed] = useState(false);

  const computedFont = font || `400 20px "Source Serif 4", "LXGW WenKai", "Noto Serif SC", serif`;
  const computedLineHeightPx = lineHeight * 20;

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
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsRevealed(true);
            observer.unobserve(el);
          }
        });
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const wordLines = useMemo(() => {
    if (!text) return [];
    try {
      const result = computeTitleLines(text, computedFont, containerWidth - 48, computedLineHeightPx);
      const lines = maxLines && result.lines.length > maxLines
        ? result.lines.slice(0, maxLines)
        : result.lines;

      return lines.map((line, lineIdx) => {
        const words = line.text.split(/(\s+)/).filter(Boolean);
        return {
          words: words.map((word, wordIdx) => ({
            text: word,
            isSpace: /^\s+$/.test(word),
            delay: wordIdx * wordStagger + lineIdx * 100,
          })),
        };
      });
    } catch (e) {
      const words = text.split(/(\s+)/).filter(Boolean);
      return [{
        words: words.map((word, wordIdx) => ({
          text: word,
          isSpace: /^\s+$/.test(word),
          delay: wordIdx * wordStagger,
        })),
      }];
    }
  }, [text, computedFont, containerWidth, computedLineHeightPx, maxLines, wordStagger]);

  return (
    <div ref={containerRef} className={`relative pl-6 ${className}`}>
      {/* Golden vertical line that grows */}
      <div
        className="absolute left-0 top-0 w-[3px] bg-[var(--color-accent)] origin-top"
        style={{
          height: isRevealed ? '100%' : '0%',
          transition: 'height 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
        }}
      />

      {/* Giant decorative quote mark */}
      <span
        className="absolute -top-2 -left-1 font-display text-[5rem] leading-none text-[var(--color-primary)] opacity-[0.06] pointer-events-none select-none"
        style={{
          opacity: isRevealed ? 0.06 : 0,
          transform: isRevealed ? 'scale(1)' : 'scale(0.8)',
          transition: 'opacity 0.8s ease 0.1s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
        }}
      >
        &ldquo;
      </span>

      <blockquote className="relative font-serif text-lg md:text-xl text-[var(--color-primary)] leading-relaxed not-italic">
        {wordLines.map((line, lineIdx) => (
          <span
            key={`line-${lineIdx}`}
            className="block overflow-hidden"
            style={{ lineHeight: `${lineHeight}em` }}
          >
            <span className="inline-block">
              {line.words.map((word, wordIdx) => (
                <span
                  key={`word-${lineIdx}-${wordIdx}`}
                  className="inline-block will-change-transform"
                  style={{
                    whiteSpace: word.isSpace ? 'pre' : 'normal',
                    transitionProperty: 'opacity, transform',
                    transitionDuration: '700ms',
                    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    opacity: isRevealed ? 1 : 0,
                    transform: isRevealed
                      ? 'translateY(0)'
                      : 'translateY(16px)',
                    transitionDelay: `${word.delay + 400}ms`,
                  }}
                >
                  {word.text}
                </span>
              ))}
            </span>
          </span>
        ))}
      </blockquote>
    </div>
  );
}
