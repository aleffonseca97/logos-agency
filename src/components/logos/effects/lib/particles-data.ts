export type ParticleData = {
  id: number;
  x: string;
  y: string;
  size: number;
  duration: number;
  delay: number;
};

/** Posições determinísticas — evita hydration mismatch e recálculos. */
export function createParticles(count: number): ParticleData[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    x: `${((id * 37 + 13) % 95) + 2}%`,
    y: `${((id * 53 + 7) % 95) + 2}%`,
    size: 1 + (id % 2),
    duration: 18 + (id % 8) * 2,
    delay: (id % 6) * 1.5,
  }));
}
