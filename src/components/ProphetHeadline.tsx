import { layoutWithLines, prepareWithSegments } from '@chenglou/pretext';
import React, { useEffect, useRef, useState } from 'react';

type Props = {
  title: string;
  kicker?: string;
  deck?: string;
};

type FitResult = {
  font: string;
  lineHeight: number;
  lines: string[];
};

const FONT_FAMILY = '"Bodoni Moda", "Noto Serif SC", serif';

function fitHeadline(text: string, width: number): FitResult {
  let low = 42;
  let high = width < 720 ? 70 : 94;
  let best: FitResult = {
    font: `700 ${low}px ${FONT_FAMILY}`,
    lineHeight: low * 0.94,
    lines: [text],
  };

  while (low <= high) {
    const size = Math.floor((low + high) / 2);
    const font = `700 ${size}px ${FONT_FAMILY}`;
    const prepared = prepareWithSegments(text, font);
    const lineHeight = Math.round(size * 0.94);
    const result = layoutWithLines(prepared, width, lineHeight);
    const fits = result.lines.length <= 4;

    if (fits) {
      best = {
        font,
        lineHeight,
        lines: result.lines.map(line => line.text),
      };
      low = size + 1;
    } else {
      high = size - 1;
    }
  }

  return best;
}

export default function ProphetHeadline({ title, kicker, deck }: Props) {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const [fit, setFit] = useState<FitResult | null>(null);

  useEffect(() => {
    let mounted = true;

    async function compute() {
      await document.fonts.ready;
      if (!mounted || shellRef.current === null) return;
      const width = Math.max(280, shellRef.current.clientWidth);
      setFit(fitHeadline(title, width));
    }

    void compute();
    const handleResize = () => void compute();
    window.addEventListener('resize', handleResize);
    return () => {
      mounted = false;
      window.removeEventListener('resize', handleResize);
    };
  }, [title]);

  return (
    <div ref={shellRef} className="prophet-masthead">
      <span className="prophet-masthead-kicker">{kicker}</span>
      <h1
        className="prophet-fitted-headline"
        style={{
          font: fit?.font,
          lineHeight: fit?.lineHeight ? `${fit.lineHeight}px` : undefined,
        }}
      >
        {(fit?.lines ?? [title]).map((line, index) => (
          <span key={`${index}-${line}`} className="prophet-headline-line">
            {line}
          </span>
        ))}
      </h1>
      {deck ? <p>{deck}</p> : null}
    </div>
  );
}
