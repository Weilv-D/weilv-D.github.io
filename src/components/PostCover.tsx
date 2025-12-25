import React, { useMemo } from 'react';

interface Props {
  title: string;
  image?: string;
  category?: string;
  className?: string;
}

// Simple hash function to generate deterministic numbers from string
function hashCode(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

export default function PostCover({ title, image, category, className = "" }: Props) {
  const baseUrl = import.meta.env.BASE_URL;
  const finalImage = image && (image.startsWith('/') ? baseUrl + image.slice(1) : image);

  const { color1, color2, hash } = useMemo(() => {
    const h = hashCode(title);
    const hue1 = Math.abs(h % 360);
    const hue2 = Math.abs((h + 90) % 360);
    return {
      hash: h,
      color1: `hsl(${hue1}, 70%, 60%)`,
      color2: `hsl(${hue2}, 70%, 60%)`
    };
  }, [title]);

  return (
    <div className={`overflow-hidden relative group ${className}`}>
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
              <stop offset="0%" style={{ stopColor: color1, stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: color2, stopOpacity: 1 }} />
            </linearGradient>
            <filter id={`noise-${hash}`}>
                <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
                <feColorMatrix type="saturate" values="0"/>
                <feBlend mode="overlay" in2="SourceGraphic" result="blend"/>
            </filter>
          </defs>
          <rect width="100%" height="100%" fill={`url(#grad-${hash})`} />
          <rect width="100%" height="100%" filter={`url(#noise-${hash})`} opacity="0.4" />
          
          {/* Abstract Shapes */}
          <circle cx="80%" cy="20%" r="30%" fill="white" fillOpacity="0.1" />
          <circle cx="10%" cy="90%" r="40%" fill="white" fillOpacity="0.1" />
          
          {/* Text Overlay */}
          <text 
            x="50%" 
            y="50%" 
            dominantBaseline="middle" 
            textAnchor="middle" 
            fill="white" 
            fontFamily="serif" 
            fontSize="32"
            fontWeight="bold"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
          >
            {title.length > 10 ? title.slice(0, 10) + '...' : title}
          </text>
        </svg>
      )}

      {/* Unified Category Badge */}
      {category && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full text-xs font-bold text-white shadow-sm tracking-wide z-10">
              {category}
          </div>
      )}
    </div>
  );
}
