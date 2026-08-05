'use client';
import { useState } from 'react';
import PendulumCanvas from '@/components/PendulumCanvas';

export default function Home() {
  const [count, setCount] = useState(50);
  const [angleDiff, setAngleDiff] = useState(0.0012);
  const [length, setLength] = useState(120);
  const [friction  , setFriction] = useState(0.001);
  const [g  , setG] = useState(2500);

  return (
    <main className="text-white w-screen h-screen">
      <div className='flex justify-center items-center h-screen bg-amber-300'>
        <PendulumCanvas count={count} angleDiff={angleDiff} length={length} friction={friction} g={g} />
      </div>
      <div className="absolute top-5 right-5 bg-neutral-900/90 p-5 rounded-xl border border-purple-500 w-80">
        <h2 className="text-purple-400 text-center mb-4 font-bold">الإعدادات</h2>
        <label>عدد البندولات: {count}</label>
        <input type="range" min="10" max="210" value={count} onChange={e=>setCount(+e.target.value)} className="w-full"/>

        <label className="mt-4 block">الفرق بالدرجات: {angleDiff}</label>
        <input type="range" min="0.0001" max="0.01" step="0.0001" value={angleDiff} onChange={e=>setAngleDiff(+e.target.value)} className="w-full"/>

        <label className="mt-4 block">معامل الاحتكاك : {friction}</label>
        <input type="range" min="0" max="1" step="0.0001" value={friction} onChange={e=>setFriction(+e.target.value)} className="w-full"/>


        <label className="mt-4 block">طول القضيب : {length}</label>
        <input type="range" min="50" max="200" step="1" value={length} onChange={e=>setLength(+e.target.value)} className="w-full"/>

        <label className="mt-4 block">الجادبية : {g}</label>
        <input type="range" min="0" max="5000" step="1" value={g} onChange={e=>setG(+e.target.value)} className="w-full"/>

        <button onClick={()=>window.location.reload()} className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-lg font-bold">
          إعادة التشغيل
        </button>
      </div>
    </main>
  )
}