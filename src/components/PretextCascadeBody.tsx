import React, { useMemo, useRef, useState, useEffect } from 'react';
import { computeTitleLines } from '../utils/textMeasure';

interface Props {
  text: string;
  font?: string;
  className?: string;
  maxLines?: number;
  lineHeight?: number;
  wordStagger?: number;
  waveIntensity?: number;
  threshold?: number;
  as?: 'div' | 'p' | 'span';
}

/**
 * PretextCascadeBody — 波浪级联正文动画
 *
 * 每行文字从下方滑入，行内字符带有微妙的 scale 弹性。
 * 使用 Pretext layoutWithLines 预计算行数后按词 stagger。
 */
export default function PretextCascadeBody({
  text,
  font,
  className = '',
  maxLines,
  lineHeight = 1.92,
  wordStagger = 40,
  waveIntensity = 60,
  threshold = 0.1,
  as: Tag = 'p',
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(600);
  const [isRevealed, setIsRevealed] = useState(false);

  const computedFont = font || `400 18px "Source Serif 4", "LXGW WenKai", "Noto Serif SC", serif`;
  const computedLineHeightPx = lineHeight * 18;

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
      const result = computeTitleLines(text, computedFont, containerWidth, computedLineHeightPx);
      const lines = maxLines && result.lines.length > maxLines
        ? result.lines.slice(0, maxLines)
        : result.lines;

      return lines.map((line, lineIdx) => {
        const words = line.text.split(/(\s+)/).filter(Boolean);
        return {
          words: words.map((word, wordIdx) => ({
            text: word,
            isSpace: /^\s+$/.test(word),
            delay: Math.sin(wordIdx * 0.35) * waveIntensity + wordIdx * wordStagger + lineIdx * 120,
          })),
        };
      });
    } catch (e) {
      const words = text.split(/(\s+)/).filter(Boolean);
      return [{
        words: words.map((word, wordIdx) => ({
          text: word,
          isSpace: /^\s+$/.test(word),
          delay: Math.sin(wordIdx * 0.35) * waveIntensity + wordIdx * wordStagger,
        })),
      }];
    }
  }, [text, computedFont, containerWidth, computedLineHeightPx, maxLines, wordStagger, waveIntensity]);

  return (
    <div ref={containerRef}>
      <Tag className={className}>
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
                    transitionDuration: '650ms',
                    transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                    opacity: isRevealed ? 1 : 0,
                    transform: isRevealed
                      ? 'translateY(0) scale(1)'
                      : 'translateY(14px) scale(0.9)',
                    transitionDelay: `${word.delay}ms`,
                  }}
                >
                  {word.text}
                </span>
              ))}
            </span>
          </span>
        ))}
      </Tag>
    </div>
  );
}
