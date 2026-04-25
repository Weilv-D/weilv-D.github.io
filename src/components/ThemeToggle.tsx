import React, { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2.5 rounded-full hover:bg-[var(--color-surface)] transition-colors text-[var(--color-secondary)] hover:text-[var(--color-accent)] overflow-hidden glow-ring"
      aria-label="Toggle Dark Mode"
    >
      {/* Eclipse ring effect */}
      <div 
        className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500"
        style={{
          opacity: isAnimating ? 0.3 : 0,
          background: theme === 'light' 
            ? 'radial-gradient(circle at 70% 30%, transparent 30%, var(--color-accent-20) 50%, transparent 70%)'
            : 'radial-gradient(circle at 30% 70%, transparent 30%, var(--color-primary-20) 50%, transparent 70%)',
        }}
      />
      
      <div
        className="relative transition-transform duration-500 ease-out"
        style={{
          transform: isAnimating ? 'rotate(180deg) scale(0.7)' : 'rotate(0deg) scale(1)',
        }}
      >
        {theme === 'light' ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
        )}
      </div>
    </button>
  );
}
