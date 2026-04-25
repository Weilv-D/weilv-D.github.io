import React, { useMemo } from 'react';
import { measureTextHeight } from '../utils/textMeasure';

interface MasonryItem {
  id: string;
  title: string;
  excerpt: string;
  image?: string;
  category?: string;
  date?: string;
  href?: string;
}

interface Props {
  items: MasonryItem[];
  columns?: number;
  columnGap?: number;
  baseUrl?: string;
}

/**
 * PretextMasonry - Pretext 高度预测的瀑布流布局
 *
 * 使用 measureTextHeight 在渲染前预测每张卡片的高度，
 * 基于标题 + 摘要的真实文本高度计算，实现零 CLS 的 masonry 布局。
 */
export default function PretextMasonry({
  items,
  columns = 3,
  columnGap = 24,
  baseUrl = '',
}: Props) {
  const titleFont = '700 18px "Bodoni Moda", "Noto Serif SC", serif';
  const excerptFont = '400 14px "Source Serif 4", "LXGW WenKai", serif';
  const titleLineHeight = 28;
  const excerptLineHeight = 22;

  // Approximate card width (accounting for gaps)
  const cardWidth = useMemo(() => {
    if (typeof window === 'undefined') return 300;
    const containerWidth = Math.min(window.innerWidth - 48, 1200);
    return (containerWidth - (columns - 1) * columnGap) / columns;
  }, [columns, columnGap]);

  // Calculate predicted heights for each item
  const itemsWithHeight = useMemo(() => {
    return items.map((item) => {
      const titleResult = measureTextHeight(item.title, titleFont, cardWidth - 32, titleLineHeight);
      const excerptResult = measureTextHeight(item.excerpt, excerptFont, cardWidth - 32, excerptLineHeight);
      const imageHeight = item.image ? 180 : 0;
      const padding = 32;
      const metaHeight = 28;
      const totalHeight = imageHeight + titleResult.height + excerptResult.height + metaHeight + padding;
      return { ...item, predictedHeight: totalHeight };
    });
  }, [items, cardWidth, titleFont, excerptFont, titleLineHeight, excerptLineHeight]);

  // Distribute items into columns using shortest-column-first algorithm
  const columnItems = useMemo(() => {
    const cols: MasonryItem[][] = Array.from({ length: columns }, () => []);
    const colHeights = new Array(columns).fill(0);

    itemsWithHeight.forEach((item) => {
      const shortestCol = colHeights.indexOf(Math.min(...colHeights));
      cols[shortestCol].push(item);
      colHeights[shortestCol] += item.predictedHeight + columnGap;
    });

    return cols;
  }, [itemsWithHeight, columns, columnGap]);

  return (
    <div
      className="flex"
      style={{ gap: `${columnGap}px` }}
    >
      {columnItems.map((col, colIndex) => (
        <div key={colIndex} className="flex-1 flex flex-col" style={{ gap: `${columnGap}px` }}>
          {col.map((item) => (
            <a
              key={item.id}
              href={item.href ? `${baseUrl}${item.href}` : '#'}
              className="group block paper-panel overflow-hidden"
            >
              {item.image && (
                <div className="overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ aspectRatio: '16/10' }}
                  />
                </div>
              )}
              <div className="p-5">
                {item.category && (
                  <span className="tag-elegant mb-3">{item.category}</span>
                )}
                <h3 className="font-display font-bold text-lg text-[var(--color-primary)] group-hover:text-[var(--color-accent)] transition-colors leading-snug mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-[var(--color-secondary)] leading-relaxed opacity-85 line-clamp-3">
                  {item.excerpt}
                </p>
                {item.date && (
                  <time className="block mt-3 text-xs text-[var(--color-secondary)] font-sans tracking-wide uppercase">
                    {item.date}
                  </time>
                )}
              </div>
            </a>
          ))}
        </div>
      ))}
    </div>
  );
}
