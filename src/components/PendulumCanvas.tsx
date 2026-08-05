'use client';
import { useEffect, useRef } from 'react';
import { rk4Step } from '@/lib/physics'

type Props = {
  count: number;
  angleDiff: number;
  length: number;
}

export default function PendulumCanvas({ count, angleDiff, length , friction , g}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pendulumsRef = useRef<any[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    handleResize();
    window.addEventListener('resize', handleResize);

    // تهيئة البندولات
    const baseAngle = Math.PI / 1.1;
    const originY = 400;

    pendulumsRef.current = Array.from({ length: count }).map((_, i) => {
      const offset = i * angleDiff * Math.PI / 180;
      const hue = (i / count) * 360;
      return {
        state: [baseAngle + offset, baseAngle + offset, 0, 0], // a1, a2, w1, w2
        baseColor:`hsl(${hue}, 100%, 60%)`,
        trail: [],
        l1: length,
        l2: length * 0.95,
        m1: 10,
        m2: 5
      }
    });

    let raf: number;
    const animate = () => {
      // 1. مسح كامل للشاشة - لا تلاشي لا والو
      // ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.fillStyle = '#111';
    // ctx.fillRect(0,0,canvas.width,canvas.height);

      ctx.fillStyle = `rgba(0,0,0)`; // مثال: rgba(0,0,0,0.08)
      ctx.fillRect(0,0,canvas.width,canvas.height);

      const originX = canvas.width / 2;


      pendulumsRef.current.forEach(p => {
        // تحديث الفيزياء
        p.state = rk4Step(p.state, 0.008, p.m1, p.m2, p.l1, p.l2 , g);
        p.state[2] -= friction * p.state[2];
        p.state[3] -= friction * p.state[3];

        const [a1, a2] = p.state;
        const x1 = originX + p.l1 * Math.sin(a1);
        const y1 = originY + p.l1 * Math.cos(a1);
        const x2 = x1 + p.l2 * Math.sin(a2);
        const y2 = y1 + p.l2 * Math.cos(a2);

        // 2. اضافة نقطة جديدة للمسار
        p.trail.push({x: x2, y: y2});
        if(p.trail.length > 40) p.trail.shift(); // طول المسار = 80

        // 3. رسم المسار
        ctx.strokeStyle = p.baseColor + '50'; // شفافية 40
        ctx.lineWidth = 2;
        ctx.beginPath();
        p.trail.forEach((pt,i)=> i === 0? ctx.moveTo(pt.x,pt.y) : ctx.lineTo(pt.x,pt.y));
        ctx.stroke();

        // 2. رسم القضيب الاول: ابيض و سميك باش يبان
        ctx.strokeStyle = p.baseColor;
        console.log(p.baseColor)
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(originX,originY);
        ctx.lineTo(x1,y1);
        ctx.stroke();

        // 3. رسم القضيب الثاني: ملون
        ctx.strokeStyle = p.baseColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        ctx.stroke();

        // 4. رسم الكرات
        ctx.fillStyle = '#fff'; // الكرة 1 بيضاء
        ctx.beginPath(); ctx.arc(originX, originY, 5, 0, Math.PI*2);
        ctx.fill();

        // 4. رسم الكرات
        // ctx.fillStyle = p.baseColor; // الكرة 1 بيضاء
        // ctx.beginPath(); ctx.arc(x1, y1, 5, 0, Math.PI*2);
        // ctx.fill();

        // ctx.fillStyle = p.baseColor; // الكرة 2 ملونة
        // ctx.beginPath(); ctx.arc(x2, y2, 5, 0, Math.PI*2);
        // ctx.fill();

      });
      raf = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
    };
  }, [count, angleDiff, length , friction ,g]);

  return <canvas ref={canvasRef} className='bg-black' />;
}