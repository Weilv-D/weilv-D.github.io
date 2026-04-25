import React, { useEffect, useState } from 'react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let frameId = 0;

    const toggleVisibility = () => {
      frameId = 0;
      setIsVisible(window.scrollY > 400);
    };

    const handleScroll = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(toggleVisibility);
    };

    toggleVisibility();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed bottom-8 right-8 p-3 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-primary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all duration-500 z-40 shadow-sm glow-ring ${
        isVisible ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-12 rotate-45 pointer-events-none'
      }`}
      aria-label="Back to Top"
    >
      {/* Rocket particles */}
      {isHovered && (
        <>
          <span 
            className="absolute left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--color-accent)]"
            style={{ animation: 'particleUp 0.6s ease-out forwards', bottom: '4px', animationDelay: '0ms' }}
          />
          <span 
            className="absolute left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--color-accent)]"
            style={{ animation: 'particleUp 0.6s ease-out forwards', bottom: '4px', animationDelay: '80ms', marginLeft: '-6px' }}
          />
          <span 
            className="absolute left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--color-accent)]"
            style={{ animation: 'particleUp 0.6s ease-out forwards', bottom: '4px', animationDelay: '160ms', marginLeft: '6px' }}
          />
        </>
      )}
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  );
}
