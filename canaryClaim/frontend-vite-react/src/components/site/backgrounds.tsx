import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Aurora — soft, slowly drifting color fields. Used behind the hero and
 * key sections. Purely decorative, pointer-events disabled.
 */
export function Aurora({ className }: { className?: string }) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden>
      <motion.div
        className="absolute -top-40 left-1/4 h-[38rem] w-[38rem] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, var(--brand-soft), transparent 70%)' }}
        animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-20 right-1/5 h-[30rem] w-[30rem] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, var(--canary-soft), transparent 70%)' }}
        animate={{ x: [0, -30, 20, 0], y: [0, 40, -20, 0], scale: [1, 0.9, 1.05, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 h-[28rem] w-[28rem] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, var(--verify-soft), transparent 70%)' }}
        animate={{ x: [0, 30, -30, 0], y: [0, -20, 10, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

/** Fine grid with a radial mask so edges fade out. */
export function GridBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 bg-grid', className)}
      style={{
        maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent 100%)',
      }}
    />
  );
}

type Node = { x: number; y: number; r: number; delay: number };

/**
 * NetworkMotif — a lightweight connected-nodes graph that gently pulses,
 * evoking a privacy/consensus network. Deterministic layout, animated with
 * SVG + framer-motion. Sits inside the hero visual.
 */
export function NetworkMotif({ className }: { className?: string }) {
  const { nodes, edges } = useMemo(() => {
    const pts: Node[] = [
      { x: 90, y: 70, r: 3, delay: 0 },
      { x: 250, y: 40, r: 2.5, delay: 0.4 },
      { x: 410, y: 90, r: 3.5, delay: 0.8 },
      { x: 160, y: 190, r: 2.5, delay: 0.2 },
      { x: 330, y: 210, r: 3, delay: 0.6 },
      { x: 470, y: 220, r: 2.5, delay: 1.0 },
      { x: 70, y: 300, r: 3, delay: 0.3 },
      { x: 250, y: 330, r: 4, delay: 0.7 },
      { x: 420, y: 340, r: 2.5, delay: 1.1 },
      { x: 250, y: 185, r: 5, delay: 0.5 }, // hub
    ];
    const links: [number, number][] = [
      [0, 1], [1, 2], [0, 3], [1, 9], [2, 5], [3, 9], [4, 9], [5, 4],
      [3, 6], [6, 7], [7, 9], [7, 8], [8, 5], [4, 8], [9, 7], [2, 9],
    ];
    return { nodes: pts, edges: links };
  }, []);

  return (
    <svg
      viewBox="0 0 540 400"
      className={cn('h-full w-full', className)}
      fill="none"
      aria-hidden
    >
      <g stroke="var(--brand)" strokeOpacity="0.18" strokeWidth="1">
        {edges.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 + i * 0.06, ease: 'easeOut' }}
          />
        ))}
      </g>
      {nodes.map((n, i) => (
        <g key={i}>
          <motion.circle
            cx={n.x}
            cy={n.y}
            r={n.r + 6}
            fill="var(--brand)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.12, 0.02, 0.12] }}
            transition={{ duration: 3.5, repeat: Infinity, delay: n.delay, ease: 'easeInOut' }}
          />
          <motion.circle
            cx={n.x}
            cy={n.y}
            r={n.r}
            fill={i === 9 ? 'var(--canary)' : 'var(--brand)'}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 + i * 0.05, ease: 'backOut' }}
          />
        </g>
      ))}
    </svg>
  );
}
