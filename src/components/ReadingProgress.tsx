import React, { useEffect, useState } from 'react';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId = 0;

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;
      const clamped = Math.min(100, Math.max(0, scrollPercent * 100));
      setProgress(clamped);
    };

    const scheduleUpdate = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        updateProgress();
      });
    };

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    scheduleUpdate();

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] z-[60] bg-transparent pointer-events-none">
      <div
        className="h-full relative"
        style={{ 
          width: `${progress}%`,
          backgroundColor: 'var(--color-accent)',
          opacity: 0.6,
          transition: 'width 0.15s ease-out',
        }}
      >
        {/* Leading diamond */}
        <div 
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[5px] h-[5px] rotate-45"
          style={{
            backgroundColor: 'var(--color-accent)',
            opacity: progress > 2 ? 0.8 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />
      </div>
    </div>
  );
}
