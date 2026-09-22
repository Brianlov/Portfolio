import { useRef, useEffect, useCallback } from 'react';

const FIREWORK_COLORS = [
  '#FFD700', // gold
  '#FF4500', // orange-red
  '#00FFFF', // cyan
  '#FF69B4', // hot pink
  '#39FF14', // neon green
  '#FF6347', // tomato
  '#BF5FFF', // violet
  '#00BFFF', // deep sky blue
  '#FF8C00', // dark orange
  '#FF1493', // deep pink
];

const ClickSpark = ({
  sparkSize = 20,
  sparkRadius = 60,
  sparkCount = 12,
  duration = 700,
  easing = 'ease-out',
  extraScale = 1.0,
  children,
}) => {
  const canvasRef = useRef(null);
  const sparksRef = useRef([]);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let resizeTimeout;

    const resizeCanvas = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 100);
    };

    window.addEventListener('resize', handleResize);
    resizeCanvas();

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  const easeFunc = useCallback(
    t => {
      switch (easing) {
        case 'linear':
          return t;
        case 'ease-in':
          return t * t;
        case 'ease-in-out':
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        default:
          return t * (2 - t);
      }
    },
    [easing]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationId;

    const draw = timestamp => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparksRef.current = sparksRef.current.filter(spark => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) return false;

        const progress = elapsed / duration;
        const eased = easeFunc(progress);

        const distance = eased * sparkRadius * extraScale;
        const lineLength = sparkSize * (1 - eased);

        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

        ctx.strokeStyle = spark.color;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.globalAlpha = 1 - progress * 0.6;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.globalAlpha = 1;

        return true;
      });

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationId);
  }, [sparkSize, sparkRadius, sparkCount, duration, easeFunc, extraScale]);

  const handleClick = e => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const now = performance.now();
    const color = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];
    const color2 = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];

    // primary burst
    const burst1 = Array.from({ length: sparkCount }, (_, i) => ({
      x,
      y,
      angle: (2 * Math.PI * i) / sparkCount,
      startTime: now,
      color,
    }));

    // offset burst — slightly rotated, slightly delayed, different color
    const burst2 = Array.from({ length: Math.floor(sparkCount / 2) }, (_, i) => ({
      x,
      y,
      angle: (2 * Math.PI * i) / Math.floor(sparkCount / 2) + Math.PI / sparkCount,
      startTime: now + 80,
      color: color2,
    }));

    sparksRef.current.push(...burst1, ...burst2);
  };

  return (
    <div
      style={{ position: 'relative', width: '100%', height: '100%' }}
      onClick={handleClick}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          userSelect: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />
      {children}
    </div>
  );
};

export default ClickSpark;
