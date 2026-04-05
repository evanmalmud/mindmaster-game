import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const CONFETTI_COLORS = [
  '#ed8696', // guess-red
  '#8aadf4', // guess-blue
  '#f5a97f', // guess-peach
  '#eed49f', // guess-yellow
  '#a6da95', // guess-green
  '#6aaa64', // code-green
  '#c9b458', // code-yellow
];

type Particle = {
  id: number;
  x: number;
  color: string;
  size: number;
  rotation: number;
  delay: number;
};

function createParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: Math.random() * 8 + 4,
    rotation: Math.random() * 360,
    delay: Math.random() * 0.8,
  }));
}

export function Confetti() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(createParticles(60));
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            opacity: 1,
            x: `${p.x}vw`,
            y: -20,
            rotate: 0,
            scale: 0,
          }}
          animate={{
            opacity: [1, 1, 0],
            y: '110vh',
            rotate: p.rotation + 720,
            scale: [0, 1, 1, 0.5],
          }}
          transition={{
            duration: 2.5 + Math.random(),
            delay: p.delay,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size * 1.4,
            backgroundColor: p.color,
            borderRadius: p.size > 8 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
}
