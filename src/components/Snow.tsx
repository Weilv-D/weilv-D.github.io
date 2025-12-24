import React, { useEffect, useRef } from 'react';

interface Snowflake {
  x: number;
  y: number;
  radius: number;
  speed: number;
  wind: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  type: 'circle' | 'hexagon';
}

export default function Snow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let snowflakes: Snowflake[] = [];
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const createSnowflakes = () => {
      const count = Math.floor((width * height) / 12000); // Increased density slightly
      snowflakes = [];
      for (let i = 0; i < count; i++) {
        const isLarge = Math.random() > 0.85; // 15% chance of being a large snowflake
        snowflakes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: isLarge ? Math.random() * 3 + 2 : Math.random() * 2 + 0.5,
          speed: isLarge ? Math.random() * 0.8 + 0.4 : Math.random() * 1 + 0.2,
          wind: Math.random() * 0.5 - 0.25,
          opacity: isLarge ? Math.random() * 0.4 + 0.2 : Math.random() * 0.5 + 0.1,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
          type: isLarge ? 'hexagon' : 'circle',
        });
      }
    };

    const drawHexagon = (x: number, y: number, radius: number, rotation: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        ctx.lineTo(radius * Math.cos((i * Math.PI) / 3), radius * Math.sin((i * Math.PI) / 3));
      }
      ctx.closePath();
      ctx.fill();
      
      // Inner detail for structure
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      
      ctx.restore();
    };

    const update = () => {
      ctx.clearRect(0, 0, width, height);
      
      const isDark = document.documentElement.classList.contains('dark');

      snowflakes.forEach((flake) => {
        flake.y += flake.speed;
        flake.x += flake.wind;
        flake.rotation += flake.rotationSpeed;

        if (flake.y > height) {
          flake.y = -10;
          flake.x = Math.random() * width;
        }
        if (flake.x > width) {
          flake.x = 0;
        } else if (flake.x < 0) {
          flake.x = width;
        }

        ctx.fillStyle = isDark 
            ? `rgba(255, 255, 255, ${flake.opacity})` 
            : `rgba(148, 163, 184, ${flake.opacity})`;

        if (flake.type === 'hexagon') {
           drawHexagon(flake.x, flake.y, flake.radius, flake.rotation);
        } else {
           ctx.beginPath();
           ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
           ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(update);
    };

    window.addEventListener('resize', resize);
    resize();
    createSnowflakes();
    update();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
