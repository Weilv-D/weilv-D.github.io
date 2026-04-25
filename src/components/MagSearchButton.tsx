import React, { useState } from 'react';

interface Props {
  onClick: () => void;
}

export default function MagSearchButton({ onClick }: Props) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      onClick={() => {
        setIsPressed(true);
        setTimeout(() => setIsPressed(false), 400);
        onClick();
      }}
      className="relative flex items-center justify-center w-10 h-10 group"
      aria-label="搜索"
    >
      {/* Ripple effect on press */}
      <span
        className="absolute inset-0 rounded-full border-2 border-[var(--color-accent)] transition-all duration-500"
        style={{
          transform: isPressed ? 'scale(1.6)' : 'scale(1)',
          opacity: isPressed ? 0 : 0.35,
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />

      {/* Rotating dashed ring */}
      <svg
        className="absolute inset-0 w-full h-full transition-all duration-500 group-hover:scale-110"
        viewBox="0 0 40 40"
      >
        <circle
          cx="20"
          cy="20"
          r="16"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1"
          strokeDasharray="4 3"
          opacity="0.5"
          className="origin-center"
          style={{
            animation: 'spin 12s linear infinite',
            transition: 'all 0.4s ease',
          }}
        />
        <circle
          cx="20"
          cy="20"
          r="16"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          opacity="0"
          className="origin-center transition-opacity duration-300 group-hover:opacity-60"
          style={{
            strokeDasharray: '100 0',
          }}
        />
      </svg>

      {/* Magnifier icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="relative w-4 h-4 text-[var(--color-secondary)] group-hover:text-[var(--color-primary)] transition-colors duration-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
}
