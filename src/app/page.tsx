'use client';
import { useState } from 'react';
import PendulumCanvas from '@/components/PendulumCanvas';

type SliderConfig = {
  key: string;
  label: string;
  symbol: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  value: number;
  setter: (v: number) => void;
};

function formatValue(bare: number, decimals: number): string {
  if (Number.isInteger(bare)) return bare.toLocaleString('fr-FR');
  if (Math.abs(bare) >= 1) return bare.toFixed(decimals || 2);
  const exp = -Math.floor(Math.log10(bare) + 1);
  const len = Math.min(exp + 2, 5);
  return bare.toFixed(len);
}

export default function Home() {
  const [count, setCount] = useState(50);
  const [angleDiff, setAngleDiff] = useState(0.0012);
  const [length, setLength] = useState(120);
  const [friction, setFriction] = useState(0.001);
  const [g, setG] = useState(2500);
  const [open, setOpen] = useState(true);

  const sliders: SliderConfig[] = [
    {
      key: 'count', label: 'Pendulums', symbol: 'N', unit: '',
      min: 10, max: 210, step: 1, value: count, setter: setCount,
    },
    {
      key: 'angleDiff', label: 'Phase offset', symbol: 'Δθ', unit: '°',
      min: 0.0001, max: 0.01, step: 0.0001, value: angleDiff, setter: setAngleDiff,
    },
    {
      key: 'length', label: 'Rod length', symbol: 'L', unit: 'px',
      min: 50, max: 200, step: 1, value: length, setter: setLength,
    },
    {
      key: 'friction', label: 'Damping', symbol: 'μ', unit: '',
      min: 0, max: 1, step: 0.0001, value: friction, setter: setFriction,
    },
    {
      key: 'g', label: 'Gravity', symbol: 'g', unit: 'px/s²',
      min: 0, max: 5000, step: 1, value: g, setter: setG,
    },
  ];

  return (
    <main className="relative w-screen h-screen overflow-hidden text-white select-none">
      <PendulumCanvas count={count} angleDiff={angleDiff} length={length} friction={friction} g={g} />

      {/* Header */}
      <header className="absolute top-6 left-6 sm:left-8 pointer-events-none">
        <div className="flex items-center gap-2 text-purple-300/70 text-xs tracking-[0.3em] uppercase font-mono">
          <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
          Double Pendulum
        </div>
        <h1 className="mt-1 text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-amber-200 bg-clip-text text-transparent">
          Chaotic Double Pendulum
        </h1>
        <p className="mt-1 text-white/45 text-xs sm:text-sm max-w-xs">
          Nonlinear dynamics simulated via 4th-order Runge-Kutta integration
        </p>
      </header>

      {/* Mobile toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={[
          'lg:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-20 panel px-5 py-3 rounded-2xl',
          'flex items-center gap-2 font-semibold text-sm transition-colors',
          open ? 'text-white/70' : 'text-white animate-float-pulse',
        ].join(' ')}
      >
        {open ? (
          <>Close Settings <span className="text-pink-400">▲</span></>
        ) : (
          <>⚙️ Settings</>
        )}
      </button>

      {/* Control panel */}
      <aside
        className={[
          'fixed z-10 panel rounded-2xl',
          'w-[calc(100vw-2rem)] max-w-sm lg:max-w-md',
          // Mobile: full-width bottom sheet, shown only when open
          'bottom-4 left-1/2 -translate-x-1/2',
          // Large screens: pinned right, always visible
          'lg:top-6 lg:right-6 lg:bottom-auto lg:translate-x-0 lg:left-auto',
          open ? 'block animate-panel-in' : 'hidden lg:block',
        ].join(' ')}
      >
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-purple-300 text-lg">Parameters</h2>
              <p className="text-white/40 text-[11px] font-mono">Simulation / controls</p>
            </div>
            <div className="h-px flex-1 mx-3 bg-gradient-to-r from-purple-500/40 to-transparent" />
            <button
              onClick={() => setOpen((o) => !o)}
              className="lg:hidden text-white/50 hover:text-white/90 text-lg leading-none"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {sliders.map((s) => {
              const pct = ((s.value - s.min) / (s.max - s.min)) * 100;
              const display = s.key === 'angleDiff'
                ? formatValue(s.value, 5)
                : formatValue(s.value, 3);
              return (
                <div key={s.key}>
                  <div className="flex items-baseline justify-between mb-1.5">
                    <label className="text-sm text-white/85">
                      <span className="font-mono text-pink-400/90 ml-1.5">{s.symbol}</span>
                      {s.label}
                    </label>
                    <span className="font-mono text-purple-200 text-sm tabular-nums bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
                      {s.unit ? `${display} ${s.unit}` : display}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={s.min}
                    max={s.max}
                    step={s.step}
                    value={s.value}
                    onChange={(e) => s.setter(+e.target.value)}
                    style={{ ['--fill' as any]: `${pct}%` }}
                    className="w-full"
                  />
                </div>
              );
            })}
          </div>

          <button
            onClick={() => window.location.reload()}
            className="w-full mt-5 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-[length:200%_100%] hover:bg-[position:100%_0] p-2.5 font-semibold transition-[background-position] duration-500 shadow-lg shadow-purple-900/40"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
              <path d="M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Restart Simulation
          </button>
        </div>
      </aside>
    </main>
  );
}