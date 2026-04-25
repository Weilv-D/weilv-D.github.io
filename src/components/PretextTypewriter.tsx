import React, { useState, useEffect, useRef } from 'react';

interface Props {
  text: string;
  className?: string;
  speed?: number;
  startDelay?: number;
  showCursor?: boolean;
  cursorChar?: string;
  onComplete?: () => void;
  as?: 'div' | 'p' | 'span';
}

/**
 * PretextTypewriter — 打字机效果
 *
 * 逐字显示，配合冷金色光标闪烁。
 * 支持多行文本，打完一行后光标继续闪烁。
 */
export default function PretextTypewriter({
  text,
  className = '',
  speed = 55,
  startDelay = 300,
  showCursor = true,
  cursorChar = '|',
  onComplete,
  as: Tag = 'span',
}: Props) {
  const [displayed, setDisplayed] = useState('');
  const [isCursorVisible, setIsCursorVisible] = useState(true);
  const [isDone, setIsDone] = useState(false);
  const [started, setStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            setStarted(true);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    const startTimer = setTimeout(() => {
      const interval = setInterval(() => {
        const idx = indexRef.current;
        if (idx >= text.length) {
          clearInterval(interval);
          setIsDone(true);
          onComplete?.();
          return;
        }
        indexRef.current = idx + 1;
        setDisplayed(text.slice(0, idx + 1));
      }, speed);

      return () => clearInterval(interval);
    }, startDelay);

    return () => clearTimeout(startTimer);
  }, [started, text, speed, startDelay, onComplete]);

  useEffect(() => {
    if (!showCursor) return;
    const blink = setInterval(() => {
      setIsCursorVisible((v) => !v);
    }, 530);
    return () => clearInterval(blink);
  }, [showCursor]);

  return (
    <div ref={containerRef}>
      <Tag className={className}>
        {displayed}
        {showCursor && (
          <span
            style={{
              opacity: isCursorVisible ? 1 : 0,
              transition: 'opacity 0.05s',
              color: 'var(--color-accent)',
              fontWeight: 300,
              marginLeft: '1px',
            }}
          >
            {cursorChar}
          </span>
        )}
      </Tag>
    </div>
  );
}
