import React, { useMemo, useState, useEffect, useRef } from 'react';
import { computeTitleLines, measureTextWidth } from '../utils/textMeasure';

interface Props {
  title: string;
  image?: string;
  category?: string;
  className?: string;
}

// 基于群青/烟栗/冷金的优雅色系
const ELEGANT_COLORS = [
  ['#2E5090', '#3d62a8'], // 群青渐变
  ['#6B5B4F', '#7d6d60'], // 烟栗渐变
  ['#B89B6C', '#c9ac7d'], // 冷金渐变
];

function hashCode(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export default function PostCover({ title, image, category, className = "" }: Props) {
  const baseUrl = import.meta.env.BASE_URL;
  const finalImage = image && (image.startsWith('/') ? baseUrl + image.slice(1) : image);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(400);

  const { colorPair, hash } = useMemo(() => {
    const h = hashCode(title);
    const pairIndex = h % ELEGANT_COLORS.length;
    return {
      hash: h,
      colorPair: ELEGANT_COLORS[pairIndex]
    };
  }, [title]);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth || 400);
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

  // Pretext: 计算标题换行
  const titleLines = useMemo(() => {
    if (!title || finalImage) return null;
    try {
      const font = 'bold 26px "Noto Serif SC", "Bodoni Moda", serif';
      const lineHeight = 38;
      const maxWidth = Math.max(containerWidth - 64, 200);
      const result = computeTitleLines(title, font, maxWidth, lineHeight);
      return result;
    } catch (e) {
      return null;
    }
  }, [title, finalImage, containerWidth]);

  // 竖排装饰字宽度
  const verticalTextWidth = useMemo(() => {
    if (!title) return 0;
    try {
      const font = '400 12px "Newsreader", serif';
      return measureTextWidth(title.slice(0, 6), font);
    } catch (e) {
      return 72;
    }
  }, [title]);

  return (
    <div ref={containerRef} className={`overflow-hidden relative group ${className}`}>
      {finalImage ? (
        <img 
          src={finalImage} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
      ) : (
        <svg 
          className="w-full h-full transition-transform duration-700 group-hover:scale-105" 
          viewBox="0 0 400 300" 
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`grad-${hash}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: colorPair[0], stopOpacity: 1 }}>
                <animate attributeName="stop-color" values={`${colorPair[0]};${colorPair[1]};${colorPair[0]}`} dur="8s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" style={{ stopColor: colorPair[1], stopOpacity: 1 }}>
                <animate attributeName="stop-color" values={`${colorPair[1]};${colorPair[0]};${colorPair[1]}`} dur="8s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
            <filter id={`noise-${hash}`}>
                <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
                <feColorMatrix type="saturate" values="0"/>
                <feBlend mode="overlay" in2="SourceGraphic" result="blend"/>
            </filter>
          </defs>
          <rect width="100%" height="100%" fill={`url(#grad-${hash})`} />
          <rect width="100%" height="100%" filter={`url(#noise-${hash})`} opacity="0.3" />
          
          {/* Abstract Shapes */}
          <circle cx="80%" cy="20%" r="30%" fill="#F7F3EB" fillOpacity="0.08" />
          <circle cx="10%" cy="90%" r="40%" fill="#F7F3EB" fillOpacity="0.06" />
          
          {/* Vertical decorative text on right edge */}
          <text
            x="96%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="#F7F3EB"
            fontFamily="serif"
            fontSize="10"
            fontWeight="400"
            letterSpacing="3"
            opacity="0.25"
            transform="rotate(90, 384, 150)"
          >
            {title.slice(0, 8)}
          </text>
          
          {/* Pretext-driven Text Overlay */}
          {titleLines && titleLines.lines.length > 0 ? (
            <g>
              {titleLines.lines.map((line, i) => {
                const totalHeight = titleLines.lines.length * 38;
                const startY = 150 - totalHeight / 2 + 19;
                return (
                  <text 
                    key={i}
                    x="50%" 
                    y={startY + i * 38}
                    dominantBaseline="middle" 
                    textAnchor="middle" 
                    fill="#F7F3EB" 
                    fontFamily="serif" 
                    fontSize="26"
                    fontWeight="bold"
                    style={{ textShadow: '0 2px 10px rgba(46,80,144,0.35)' }}
                  >
                    {line.text}
                  </text>
                );
              })}
            </g>
          ) : (
            <text 
              x="50%" 
              y="50%" 
              dominantBaseline="middle" 
              textAnchor="middle" 
              fill="#F7F3EB" 
              fontFamily="serif" 
              fontSize="26"
              fontWeight="bold"
              style={{ textShadow: '0 2px 10px rgba(46,80,144,0.35)' }}
            >
              {title.length > 10 ? title.slice(0, 10) + '…' : title}
            </text>
          )}
        </svg>
      )}

      {/* Category Badge */}
      {category && (
        <div className="absolute top-3 right-3 px-3 py-1 bg-[var(--color-background)]/85 border border-[var(--color-border)] rounded-full text-xs font-sans font-semibold text-[var(--color-primary)] tracking-wide z-10 backdrop-blur-sm">
          {category}
        </div>
      )}
    </div>
  );
}
