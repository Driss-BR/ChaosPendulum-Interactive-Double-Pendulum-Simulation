'use client';
import { useEffect, useRef } from 'react';
import { rk4Step } from '@/lib/physics';

type Props = {
  count: number;
  angleDiff: number;
  length: number;
  friction: number;
  g: number;
};

type Trail = { x: number; y: number };

export default function PendulumCanvas({ count, angleDiff, length, friction, g }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;

    const handleResize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const baseAngle = Math.PI / 1.1;
    const originY = () => Math.max(200, Math.min(window.innerHeight * 0.42, 480));

    const pendulums = Array.from({ length: count }).map((_, i) => {
      const offset = i * angleDiff * (Math.PI / 180);
      const hue = (i / count) * 360;
      return {
        state: [baseAngle + offset, baseAngle + offset, 0, 0] as number[],
        hue,
        trail: [] as Trail[],
        l1: length,
        l2: length * 0.95,
        m1: 10,
        m2: 5,
      };
    });

    const trailLen = count > 140 ? 28 : 40;
    const lineW = count > 140 ? 1.5 : 2;

    let lastTime = performance.now();
    const dt = 0.008;

    const animate = (now: number) => {
      const elapsed = (now - lastTime) / 1000;
      lastTime = now;
      // تثبيت الخطوة الزمنية لتبقى الفيزياء مستقرة ومتسقة
      void elapsed;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.fillStyle = '#05050a';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      const originX = window.innerWidth / 2;
      const oy = originY();

      for (const p of pendulums) {
        p.state = rk4Step(p.state, dt, p.m1, p.m2, p.l1, p.l2, g);
        p.state[2] -= friction * p.state[2];
        p.state[3] -= friction * p.state[3];

        const [a1, a2] = p.state;
        const x1 = originX + p.l1 * Math.sin(a1);
        const y1 = oy + p.l1 * Math.cos(a1);
        const x2 = x1 + p.l2 * Math.sin(a2);
        const y2 = y1 + p.l2 * Math.cos(a2);

        p.trail.push({ x: x2, y: y2 });
        if (p.trail.length > trailLen) p.trail.shift();

        // المسار بتدرّج شفافية (أقدم نقطة = أبهت)
        const n = p.trail.length;
        if (n > 1) {
          for (let i = 1; i < n; i++) {
            const t = i / n;
            ctx.strokeStyle = `hsl(${p.hue} 100% 68% / ${0.05 + t * 0.6})`;
            ctx.lineWidth = lineW * (0.6 + t * 0.6);
            ctx.beginPath();
            ctx.moveTo(p.trail[i - 1].x, p.trail[i - 1].y);
            ctx.lineTo(p.trail[i].x, p.trail[i].y);
            ctx.stroke();
          }
        }

        // القضيبان
        ctx.strokeStyle = `hsl(${p.hue} 100% 72% / 0.85)`;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(originX, oy);
        ctx.lineTo(x1, y1);
        ctx.stroke();

        ctx.strokeStyle = `hsl(${p.hue} 100% 58% / 0.9)`;
        ctx.lineWidth = 1.75;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // الكرتان
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(originX, oy, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `hsl(${p.hue} 100% 62%)`;
        ctx.beginPath();
        ctx.arc(x1, y1, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `hsl(${p.hue} 90% 70%)`;
        ctx.beginPath();
        ctx.arc(x2, y2, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
    };
  }, [count, angleDiff, length, friction, g]);

  return <canvas ref={canvasRef} className="absolute inset-0" />;
}
