import { prepareWithSegments, layoutNextLine, type LayoutCursor, type PreparedTextWithSegments } from '@chenglou/pretext';
import React, { useEffect, useRef, useState } from 'react';
import {
  carveSlots,
  getPolygonIntervalForBand,
  getRectIntervalForBand,
  getWrapHull,
  transformWrapPoints,
  type Point,
  type Rect,
} from './prophet/wrapGeometry';

export type ProphetStageBlock = {
  type: 'portrait' | 'quote' | 'note' | 'seal';
  title?: string;
  text?: string;
  items?: string[];
  src?: string;
  caption?: string;
  desktop: { x: number; y: number; w: number; h: number };
  mobile?: { x: number; y: number; w: number; h: number };
  motion?: { dx?: number; dy?: number; speed?: number };
};

type PositionedLine = {
  text: string;
  x: number;
  y: number;
  width: number;
};

type ResolvedStageBlock = ProphetStageBlock & {
  rect: Rect;
  points?: Point[];
};

type LayoutModel = {
  height: number;
  lines: PositionedLine[];
  blocks: ResolvedStageBlock[];
  columns: {
    x: number;
    width: number;
  }[];
  truncated: boolean;
};

type Props = {
  text: string;
  stageBlocks: ProphetStageBlock[];
  sidebarTitle?: string;
  sidebarItems?: string[];
};

const BODY_FONT = '400 18px "Bodoni Moda", "Noto Serif SC", serif';
const BODY_LINE_HEIGHT = 31;
const MAX_STAGE_HEIGHT = 980;

function resolveBlockRect(
  block: ProphetStageBlock,
  narrow: boolean,
  timeMs: number,
  inset: number,
  innerWidth: number,
  stageHeight: number,
): Rect {
  const basis = narrow && block.mobile ? block.mobile : block.desktop;
  const motion = block.motion ?? {};
  const speed = motion.speed ?? 1;
  const dx = (motion.dx ?? 0) * Math.sin(timeMs / (1800 / speed));
  const dy = (motion.dy ?? 0) * Math.cos(timeMs / (2200 / speed));

  return {
    x: inset + basis.x * innerWidth + dx,
    y: basis.y * stageHeight + dy,
    width: basis.w * innerWidth,
    height: basis.h * stageHeight,
  };
}

function resolveBlocks(
  blocks: ProphetStageBlock[],
  narrow: boolean,
  timeMs: number,
  inset: number,
  innerWidth: number,
  stageHeight: number,
  hullsBySrc: Map<string, Point[]>,
): ResolvedStageBlock[] {
  return blocks.map(block => {
    const rect = resolveBlockRect(block, narrow, timeMs, inset, innerWidth, stageHeight);
    const baseHull = block.type === 'portrait' && block.src ? hullsBySrc.get(block.src) : undefined;
    return {
      ...block,
      rect,
      points: baseHull ? transformWrapPoints(baseHull, rect) : undefined,
    };
  });
}

function computeLayout(
  prepared: PreparedTextWithSegments,
  width: number,
  timeMs: number,
  stageBlocks: ProphetStageBlock[],
  hullsBySrc: Map<string, Point[]>,
): LayoutModel {
  const narrow = width < 960;
  const inset = narrow ? 24 : 36;
  const stageHeight = narrow ? MAX_STAGE_HEIGHT : 840;
  const colGap = narrow ? 0 : 44;
  const columns = narrow ? 1 : 2;
  const columnWidth = (width - inset * 2 - colGap * (columns - 1)) / columns;
  const innerWidth = width - inset * 2;
  const columnDescriptors = Array.from({ length: columns }, (_, index) => ({
    x: inset + index * (columnWidth + colGap),
    width: columnWidth,
  }));
  const resolvedBlocks = resolveBlocks(
    stageBlocks,
    narrow,
    timeMs,
    inset,
    innerWidth,
    stageHeight,
    hullsBySrc,
  );

  let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };
  const lines: PositionedLine[] = [];
  const bandTopStart = narrow ? 368 : 84;
  const columnBottom = stageHeight - 48;
  let truncated = false;

  for (let columnIndex = 0; columnIndex < columnDescriptors.length; columnIndex++) {
    const column = columnDescriptors[columnIndex]!;
    let y = bandTopStart;

    while (y + BODY_LINE_HEIGHT <= columnBottom) {
      const blocked: { left: number; right: number }[] = [];
      const bandTop = y;
      const bandBottom = y + BODY_LINE_HEIGHT;

      for (let index = 0; index < resolvedBlocks.length; index++) {
        const block = resolvedBlocks[index]!;

        switch (block.type) {
          case 'quote': {
            if (!(narrow || columnIndex === 0)) break;
            const interval = getRectIntervalForBand(block.rect, bandTop, bandBottom, 18, 12);
            if (interval !== null) blocked.push({ left: interval.left - column.x, right: interval.right - column.x });
            break;
          }
          case 'note': {
            if (!(narrow || columnIndex === columnDescriptors.length - 1)) break;
            const interval = getRectIntervalForBand(block.rect, bandTop, bandBottom, 22, 16);
            if (interval !== null) blocked.push({ left: interval.left - column.x, right: interval.right - column.x });
            break;
          }
          case 'seal': {
            if (columnIndex !== 0) break;
            const interval = getRectIntervalForBand(block.rect, bandTop, bandBottom, 20, 14);
            if (interval !== null) blocked.push({ left: interval.left - column.x, right: interval.right - column.x });
            break;
          }
          case 'portrait': {
            if (block.points === undefined) break;
            if (narrow && y >= 360) break;
            const interval = getPolygonIntervalForBand(block.points, bandTop, bandBottom, 24, 16);
            if (interval !== null) blocked.push({ left: interval.left - column.x, right: interval.right - column.x });
            break;
          }
        }
      }

      const slots = carveSlots({ left: 0, right: column.width }, blocked, 96).sort((a, b) => a.left - b.left);
      if (slots.length === 0) {
        y += BODY_LINE_HEIGHT;
        continue;
      }

      let consumedOnBand = false;
      for (let slotIndex = 0; slotIndex < slots.length; slotIndex++) {
        const slot = slots[slotIndex]!;
        const line = layoutNextLine(prepared, cursor, slot.right - slot.left);
        if (line === null) {
          return {
            height: stageHeight,
            lines,
            blocks: resolvedBlocks,
            columns: columnDescriptors,
            truncated,
          };
        }
        lines.push({
          text: line.text,
          x: column.x + slot.left,
          y,
          width: line.width,
        });
        cursor = line.end;
        consumedOnBand = true;
      }

      if (!consumedOnBand) break;
      y += BODY_LINE_HEIGHT;
    }
  }

  const remaining = layoutNextLine(prepared, cursor, columnWidth);
  if (remaining !== null) truncated = true;

  return {
    height: stageHeight,
    lines,
    blocks: resolvedBlocks,
    columns: columnDescriptors,
    truncated,
  };
}

export default function ProphetEditorial({
  text,
  stageBlocks,
  sidebarTitle,
  sidebarItems = [],
}: Props) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const preparedRef = useRef<PreparedTextWithSegments | null>(null);
  const hullsRef = useRef<Map<string, Point[]>>(new Map());
  const frameRef = useRef<number | null>(null);
  const [layoutModel, setLayoutModel] = useState<LayoutModel | null>(null);

  useEffect(() => {
    let mounted = true;

    async function boot() {
      await document.fonts.ready;
      if (!mounted) return;

      const portraitSources = [
        ...new Set(
          stageBlocks
            .filter(block => block.type === 'portrait' && block.src)
            .map(block => block.src!),
        ),
      ];
      const hullEntries = await Promise.all(
        portraitSources.map(async src => [src, await getWrapHull(src)] as const),
      );

      if (!mounted) return;
      preparedRef.current = prepareWithSegments(text, BODY_FONT);
      hullsRef.current = new Map(hullEntries);

      const render = (time: number) => {
        if (!mounted) return;
        const node = stageRef.current;
        const prepared = preparedRef.current;
        if (node === null || prepared === null) return;
        const width = node.clientWidth;
        if (width === 0) return;
        setLayoutModel(computeLayout(prepared, width, time, stageBlocks, hullsRef.current));
        frameRef.current = window.requestAnimationFrame(render);
      };

      frameRef.current = window.requestAnimationFrame(render);
    }

    void boot();

    const handleResize = () => {
      const node = stageRef.current;
      const prepared = preparedRef.current;
      if (node === null || prepared === null) return;
      setLayoutModel(computeLayout(prepared, node.clientWidth, performance.now(), stageBlocks, hullsRef.current));
    };

    window.addEventListener('resize', handleResize);
    return () => {
      mounted = false;
      window.removeEventListener('resize', handleResize);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, [stageBlocks, text]);

  return (
    <section className="prophet-editorial-shell">
      <div className="prophet-editorial-meta">
        <span>动态版面实验</span>
        <span>Pretext 驱动</span>
        <span>多障碍流排</span>
      </div>
      <div
        ref={stageRef}
        className="prophet-stage"
        style={{ height: layoutModel?.height ?? 840 }}
      >
        <div className="sr-only">{text}</div>
        {layoutModel?.columns.map((column, index) => (
          <div
            key={index}
            className="prophet-column-guide"
            aria-hidden="true"
            style={{
              left: column.x,
              top: 0,
              width: column.width,
              height: layoutModel.height,
            }}
          />
        ))}
        {layoutModel?.blocks.map((block, index) => {
          switch (block.type) {
            case 'quote':
              return (
                <aside
                  key={`${block.type}-${index}`}
                  className="prophet-pullquote"
                  style={{ left: block.rect.x, top: block.rect.y, width: block.rect.width, height: block.rect.height }}
                >
                  <p>{block.text}</p>
                </aside>
              );
            case 'note':
              return (
                <aside
                  key={`${block.type}-${index}`}
                  className="prophet-stage-note"
                  style={{ left: block.rect.x, top: block.rect.y, width: block.rect.width, height: block.rect.height }}
                >
                  <h4>{block.title ?? sidebarTitle ?? 'Dispatch Box'}</h4>
                  <ul>
                    {(block.items?.length ? block.items : sidebarItems).slice(0, 4).map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </aside>
              );
            case 'seal':
              return (
                <div
                  key={`${block.type}-${index}`}
                  className="prophet-stage-seal"
                  aria-hidden="true"
                  style={{ left: block.rect.x, top: block.rect.y, width: block.rect.width, height: block.rect.height }}
                >
                  <span>{block.title ?? 'Extra'}</span>
                  <strong>{block.text ?? 'Edition'}</strong>
                </div>
              );
            case 'portrait':
              return (
                <figure
                  key={`${block.type}-${index}`}
                  className="prophet-portrait"
                  style={{ left: block.rect.x, top: block.rect.y, width: block.rect.width, height: block.rect.height }}
                  aria-hidden="true"
                >
                  <img src={block.src} alt="" className="prophet-portrait-image" />
                  <figcaption>{block.caption ?? '动态肖像窗'}</figcaption>
                </figure>
              );
          }
        })}
        {layoutModel?.lines.map((line, index) => (
          <span
            key={`${index}-${line.x}-${line.y}`}
            className="prophet-line"
            aria-hidden="true"
            style={{
              left: line.x,
              top: line.y,
              width: line.width + 2,
            }}
          >
            {line.text}
          </span>
        ))}
      </div>
      <div className="prophet-sidebar-strip">
        <div>
          <h3>{sidebarTitle ?? '版面说明'}</h3>
          <p>正文由 `layoutNextLine()` 按列逐行推进，所有 `stageBlocks` 都会作为 obstacle 参与排版，因此每篇专题都能声明自己的版心构件。</p>
        </div>
        <ul>
          {sidebarItems.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      {layoutModel?.truncated && (
        <p className="prophet-truncation-note">当前专题演示区高度固定，正文在第二栏末端后被截断。这是刻意保留的报纸版心约束。</p>
      )}
    </section>
  );
}
