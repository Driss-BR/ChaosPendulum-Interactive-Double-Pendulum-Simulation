# Chaotic Double Pendulum

An interactive, real-time simulation of the **chaotic double pendulum** — a classic nonlinear dynamical system — rendered on HTML5 Canvas. Each pendulum starts from a slightly different initial phase, and the exponential divergence of nearby trajectories produces a beautiful "bundle" of colorful chaotic paths.

> **Chaos in action:** identical pendulums separated by a tiny phase offset (Δθ ≈ 0.0012°) evolve into wildly different motions within seconds.

## Features

- 🎨 **Visual feedback**
  - Individual hue-per-pendulum coloring with fading, gradient trails
  - Crisp rendering on Retina / high-DPI displays (via `devicePixelRatio`)
- 🎛️ **Live control panel** — adjust parameters in real time without reloading:
  - Number of pendulums (`N`)
  - Initial phase offset (`Δθ`)
  - Rod length (`L`)
  - Damping coefficient (`μ`)
  - Gravitational acceleration (`g`)
- 📱 **Fully responsive** — bottom-sheet settings on mobile, pinned side panel on desktop
- ⚛️ **Scientific integration** — 4th-order Runge-Kutta (RK4) solver for numerical accuracy

## Tech Stack

| Layer      | Technology |
| ---------- | ---------- |
| Framework  | Next.js 16 (App Router) |
| UI         | React 19 + Tailwind CSS 4 |
| Rendering  | HTML5 Canvas 2D |
| Math       | Custom RK4 integrator |

## Getting Started

```bash
# install dependencies
npm install

# start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Usage

| Parameter | Symbol | Range | Default | Description |
| --------- | ------ | ----- | ------- | ----------- |
| Pendulums | `N` | 10 – 210 | 50 | Number of parallel pendulums |
| Phase offset | `Δθ` | 0.0001° – 0.01° | 0.0012° | Initial angle separation between pendulums |
| Rod length | `L` | 50 – 200 px | 120 | Length of the first rod (`L₂ = 0.95·L₁`) |
| Damping | `μ` | 0 – 1 | 0.001 | Velocity-proportional friction per frame |
| Gravity | `g` | 0 – 5000 px/s² | 2500 | Gravitational acceleration |

Use the **Restart Simulation** button to re-initialize all pendulums after changing parameters.

## The Physics

The equations of motion for a double pendulum are derived from the Euler–Lagrange equations and form a coupled, nonlinear ODE system:

$$
\ddot{\theta}_1 = \frac{m_2\,l_1\,\dot{\theta}_1^2\sin(\Delta)\cos(\Delta) + m_2\,g\sin(\theta_2)\cos(\Delta) + m_2\,l_2\,\dot{\theta}_2^2\sin(\Delta) - (m_1+m_2)g\sin(\theta_1)}{(m_1+m_2)l_1 - m_2 l_1 \cos^2(\Delta)}
$$

$$
\ddot{\theta}_2 = \frac{-l_2\,\dot{\theta}_2^2\sin(\Delta)\cos(\Delta) + (m_1+m_2)g\sin(\theta_1)\cos(\Delta) - (m_1+m_2)l_1\dot{\theta}_1^2\sin(\Delta) - (m_1+m_2)g\sin(\theta_2)}{\frac{l_2}{l_1}\left((m_1+m_2)l_1 - m_2 l_1\cos^2(\Delta)\right)}
$$

where $\Delta = \theta_2 - \theta_1$.

These are integrated numerically with a **4th-order Runge-Kutta (RK4)** method at a fixed timestep, keeping the simulation stable and frame-rate independent. A fixed timestep (rather than per-frame `dt`) is used deliberately so the physics stay deterministic across devices.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout & fonts
│   ├── page.tsx            # Main page + control panel
│   └── globals.css         # Tailwind + custom slider/panel styles
├── components/
│   └── PendulumCanvas.tsx  # Canvas rendering + animation loop
└── lib/
    └── physics.ts          # Derivatives + RK4 integrator
```

## Scripts

| Script            | Description |
| ----------------- | ----------- |
| `npm run dev`     | Start development server |
| `npm run build`   | Production build |
| `npm run start`   | Serve production build |
| `npm run lint`    | Run ESLint |

## License

This project is open source and available under the MIT License.
