import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
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
  scrambleChars?: string;
}

const DEFAULT_SCRAMBLE = '@#$%&*+=?/~<>{}[]';

/**
 * PretextScrambleReveal — 字符解密动画
 *
 * 每个字符先从随机符号开始，按 stagger delay 逐个 resolve 到目标字符。
 * 类似电影黑客文字的解密效果。
 */
export default function PretextScrambleReveal({
  text,
  font,
  maxWidth: propMaxWidth,
  lineHeight = 1.15,
  className = '',
  as: Tag = 'h1',
  reveal = true,
  revealDelay = 0,
  charStagger = 50,
  scrambleChars = DEFAULT_SCRAMBLE,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(propMaxWidth || 800);
  const [isRevealed, setIsRevealed] = useState(!reveal);
  const [resolvedChars, setResolvedChars] = useState<Set<string>>(new Set());

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
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reveal]);

  // Resolve chars one by one
  useEffect(() => {
    if (!isRevealed) return;
    let globalIdx = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    charMap.forEach((line) => {
      line.chars.forEach(({ delay, key }) => {
        const timer = setTimeout(() => {
          setResolvedChars((prev) => new Set(prev).add(key));
        }, delay);
        timers.push(timer);
      });
    });

    return () => timers.forEach(clearTimeout);
  }, [isRevealed]);

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
        const delay = revealDelay + globalCharIndex * charStagger + lineIdx * 60;
        globalCharIndex++;
        return { char, delay, key: `${lineIdx}-${charIdx}-${char}` };
      });
      return { chars: charData, lineIdx };
    });
  }, [titleLayout, revealDelay, charStagger]);

  const getRandomChar = useCallback(() => {
    return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
  }, [scrambleChars]);

  const [scrambleMap, setScrambleMap] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!charMap.length) return;
    const map: Record<string, string> = {};
    charMap.forEach((line) => {
      line.chars.forEach(({ key }) => {
        map[key] = getRandomChar();
      });
    });
    setScrambleMap(map);
  }, [charMap, getRandomChar]);

  // Scramble cycling for unresolved chars
  useEffect(() => {
    if (!isRevealed) return;
    const interval = setInterval(() => {
      setScrambleMap((prev) => {
        const next = { ...prev };
        charMap.forEach((line) => {
          line.chars.forEach(({ key }) => {
            if (!resolvedChars.has(key)) {
              next[key] = getRandomChar();
            }
          });
        });
        return next;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [isRevealed, charMap, resolvedChars, getRandomChar]);

  if (!titleLayout || titleLayout.lines.length === 0) {
    return (
      <div ref={containerRef} className={className}>
        <Tag className={`transition-opacity duration-700 ${isRevealed ? 'opacity-100' : 'opacity-0'}`}>
          {text}
        </Tag>
      </div>
    );
  }

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
              {line.chars.map(({ char, key }) => {
                const isResolved = resolvedChars.has(key);
                return (
                  <span
                    key={key}
                    className="inline-block will-change-transform transition-all duration-150"
                    style={{
                      opacity: isRevealed ? 1 : 0,
                      transform: isRevealed ? 'translateY(0)' : 'translateY(20px)',
                      color: isResolved ? 'inherit' : 'var(--color-accent)',
                    }}
                  >
                    {char === ' ' ? '\u00A0' : (isResolved ? char : (scrambleMap[key] || scrambleChars[0]))}
                  </span>
                );
              })}
            </span>
          </span>
        ))}
      </Tag>
    </div>
  );
}
