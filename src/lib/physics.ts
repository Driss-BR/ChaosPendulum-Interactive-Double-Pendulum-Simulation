export function derivatives(state: number[], m1: number, m2: number, l1: number, l2: number , g :number) {
  const [a1, a2, w1, w2] = state;
  const delta = a2 - a1;

  const den1 = (m1 + m2) * l1 - m2 * l1 * Math.cos(delta) * Math.cos(delta);
  const den2 = (l2 / l1) * den1;

  const a1_acc = (
    m2 * l1 * w1 * w1 * Math.sin(delta) * Math.cos(delta) +
    m2 * g * Math.sin(a2) * Math.cos(delta) +
    m2 * l2 * w2 * w2 * Math.sin(delta) -
    (m1 + m2) * g * Math.sin(a1)
  ) / den1;

  const a2_acc = (
    -l2 * w2 * w2 * Math.sin(delta) * Math.cos(delta) +
    (m1 + m2) * g * Math.sin(a1) * Math.cos(delta) -
    (m1 + m2) * l1 * w1 * w1 * Math.sin(delta) -
    (m1 + m2) * g * Math.sin(a2)
  ) / den2;

  return [w1, w2, a1_acc, a2_acc];
}

export function rk4Step(state: number[], dt: number, m1: number, m2: number, l1: number, l2: number , g:number) {
  const k1 = derivatives(state, m1, m2, l1, l2 , g );
  const s2 = state.map((s, i) => s + k1[i] * dt / 2);
  const k2 = derivatives(s2, m1, m2, l1, l2 , g);
  const s3 = state.map((s, i) => s + k2[i] * dt / 2);
  const k3 = derivatives(s3, m1, m2, l1, l2 , g);
  const s4 = state.map((s, i) => s + k3[i] * dt);
  const k4 = derivatives(s4, m1, m2, l1, l2 , g);

  return state.map((s, i) => s + dt / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
}