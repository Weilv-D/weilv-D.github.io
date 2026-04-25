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
  direction?: 'up' | 'left' | 'right' | 'random';
}

/**
 * PretextReveal — 波浪逐词揭示
 *
 * 使用 Pretext 的 layoutWithLines 预计算行数后，
 * 将每行拆分为单词，每个单词独立动画。
 * 正弦波 stagger 产生从左到右的波浪扫过效果。
 * Scale 脉冲配合 overshoot 弹性曲线。
 */
export default function PretextReveal({
  text,
  font,
  className = '',
  maxLines,
  lineHeight = 1.8,
  wordStagger = 45,
  waveIntensity = 80,
  threshold = 0.15,
  as: Tag = 'div',
  direction = 'up',
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

  const getTransform = (isRevealed: boolean) => {
    if (isRevealed) return 'translateY(0) scale(1)';
    switch (direction) {
      case 'left': return 'translateX(-20px) scale(0.95)';
      case 'right': return 'translateX(20px) scale(0.95)';
      case 'random':
        const dir = Math.random() > 0.5 ? -1 : 1;
        return `translateX(${dir * 15}px) translateY(16px) scale(0.93)`;
      default: return 'translateY(16px) scale(0.92)';
    }
  };

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
            delay: Math.sin(wordIdx * 0.3) * waveIntensity + wordIdx * wordStagger + lineIdx * 60,
          })),
        };
      });
    } catch (e) {
      const words = text.split(/(\s+)/).filter(Boolean);
      return [{
        words: words.map((word, wordIdx) => ({
          text: word,
          isSpace: /^\s+$/.test(word),
          delay: Math.sin(wordIdx * 0.3) * waveIntensity + wordIdx * wordStagger,
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
                    transitionDuration: '600ms',
                    transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                    opacity: isRevealed ? 1 : 0,
                    transform: getTransform(isRevealed),
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
