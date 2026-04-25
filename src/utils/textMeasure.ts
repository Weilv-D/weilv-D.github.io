import { prepare, layout, prepareWithSegments, layoutWithLines, measureNaturalWidth } from '@chenglou/pretext';
import { useState, useEffect } from 'react';

// ============================================
// Pretext Text Measurement Utilities
// 文本测量工具 - 无 DOM reflow
// ============================================

const cache = new Map<string, any>();

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function getCacheKey(text: string, font: string, options?: object) {
  return JSON.stringify({ text, font, options });
}

/**
 * 测量文本在给定宽度下的高度和行数
 */
export function measureTextHeight(text: string, font: string, maxWidth: number, lineHeight: number) {
  if (!isBrowser()) return { height: lineHeight * 2, lineCount: 2 };
  const key = getCacheKey(text, font, { maxWidth, lineHeight });
  if (cache.has(key)) {
    const prepared = cache.get(key);
    return layout(prepared, maxWidth, lineHeight);
  }
  const prepared = prepare(text, font);
  cache.set(key, prepared);
  return layout(prepared, maxWidth, lineHeight);
}

/**
 * 计算标题换行（用于封面 SVG / 艺术排版）
 */
export function computeTitleLines(text: string, font: string, maxWidth: number, lineHeight: number) {
  if (!isBrowser()) return {
    height: lineHeight,
    lineCount: 1,
    lines: [{ text: text.slice(0, 20), width: 0, start: { segmentIndex: 0, graphemeIndex: 0 }, end: { segmentIndex: 0, graphemeIndex: 0 } }]
  };
  const prepared = prepareWithSegments(text, font);
  return layoutWithLines(prepared, maxWidth, lineHeight);
}

/**
 * 测量文本自然宽度（用于 shrinkwrap 布局）
 */
export function measureTextWidth(text: string, font: string) {
  if (!isBrowser()) return text.length * 16;
  const prepared = prepareWithSegments(text, font);
  return measureNaturalWidth(prepared);
}

/**
 * 智能截断文本到指定行数
 */
export function smartTruncate(text: string, font: string, maxWidth: number, lineHeight: number, maxLines: number = 2): { text: string; height: number; lineCount: number } {
  if (!isBrowser()) {
    const approxCharsPerLine = Math.floor(maxWidth / 16);
    const maxChars = approxCharsPerLine * maxLines;
    if (text.length <= maxChars) {
      return { text, height: lineHeight * Math.ceil(text.length / approxCharsPerLine), lineCount: Math.ceil(text.length / approxCharsPerLine) };
    }
    return { text: text.slice(0, maxChars - 1) + '…', height: lineHeight * maxLines, lineCount: maxLines };
  }

  const { height, lineCount } = measureTextHeight(text, font, maxWidth, lineHeight);
  
  if (lineCount <= maxLines) {
    return { text, height, lineCount };
  }
  
  let low = 0;
  let high = text.length;
  let bestLength = 0;
  
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const truncated = text.slice(0, mid) + '…';
    const result = measureTextHeight(truncated, font, maxWidth, lineHeight);
    
    if (result.lineCount <= maxLines) {
      bestLength = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  
  const finalText = text.slice(0, bestLength) + '…';
  const finalResult = measureTextHeight(finalText, font, maxWidth, lineHeight);
  
  return {
    text: finalText,
    height: finalResult.height,
    lineCount: finalResult.lineCount,
  };
}

// ============================================
// React Hooks
// ============================================

export function useSmartTruncate(text: string, font: string, maxWidth: number, lineHeight: number, maxLines: number = 2) {
  const [result, setResult] = useState(() => smartTruncate(text, font, maxWidth, lineHeight, maxLines));
  
  useEffect(() => {
    setResult(smartTruncate(text, font, maxWidth, lineHeight, maxLines));
  }, [text, font, maxWidth, lineHeight, maxLines]);
  
  return result;
}


