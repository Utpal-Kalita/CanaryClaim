import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from '@tanstack/react-router';
import { ArrowRight, Radar, Coins, LayoutGrid } from 'lucide-react';
import { ScrambleIn } from '@/components/ui/scramble';
import { SplineScene } from '@/components/ui/splite';
import { Spotlight } from '@/components/ui/spotlight';
import { useApp } from '@/app/store';
import { fadeUp, stagger } from '@/lib/motion';

/** Interactive 3D subject — its head tracks the cursor. */
const SPLINE_SCENE = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode';

/** Signature neon used across the hero frame. */
const NEON = '#FF2E9A';

export function Hero() {
  const [entered, setEntered] = useState(false);
  const navigate = useNavigate();
  const { bounties } = useApp();

  const stats = useMemo(() => {
    const open = bounties.filter((b) => b.status !== 'claimed');
    return {
      open: open.length,
      pool: open.reduce((n, b) => n + b.reward, 0),
      classes: new Set(bounties.map((b) => b.category)).size,
    };
  }, [bounties]);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <section id="top" className="relative flex min-h-screen h-[100dvh] flex-col overflow-hidden bg-[#0a0208]">
      {/* cursor-following glow */}
      <Spotlight className="from-[#FF2E9A]/50 via-[#FF2E9A]/10 to-transparent" size={360} />

      {/* ---------------- Background layer ---------------- */}
      <div className="absolute inset-0">
        {/* magenta field behind the robot */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `radial-gradient(46% 55% at 72% 46%, ${NEON}66, transparent 68%), radial-gradient(90% 80% at 78% 40%, ${NEON}1f, transparent 70%)`,
          }}
        />

        {/* giant CANARY watermark, magenta, behind the robot */}
        <div
          className="pointer-events-none absolute inset-0 hidden items-center justify-end overflow-hidden md:flex"
          aria-hidden
        >
          <span
            className="font-display translate-x-[6%] select-none uppercase"
            style={{
              fontSize: 'clamp(170px, 25vw, 460px)',
              letterSpacing: '-4px',
              lineHeight: 1,
              whiteSpace: 'nowrap',
              opacity: 0.22,
              background: `radial-gradient(circle at 50% 55%, ${NEON} 0%, ${NEON}66 55%, transparent 78%)`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            CANARY
          </span>
        </div>

        {/* 3D robot — head follows the cursor. md+ only. */}
        <div className="absolute inset-y-0 right-0 hidden w-full md:block md:w-[64%]">
          <SplineScene scene={SPLINE_SCENE} className="h-full w-full" />
        </div>
        {/* mobile fallback */}
        <div
          className="absolute inset-0 md:hidden"
          style={{ background: `radial-gradient(60% 55% at 72% 42%, ${NEON}3a, transparent 70%)` }}
        />

        {/* legibility scrims — transparent on the right so the robot stays lit */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, #06010400 0%, rgba(6,1,4,0.92) 24%, rgba(6,1,4,0.4) 54%, transparent 80%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(to top, #06010f 3%, transparent 40%)' }}
        />

        {/* cover the Spline badge */}
        <div className="pointer-events-none absolute bottom-0 right-0 h-14 w-40 bg-[#0a0208]" />
      </div>

      {/* ---------------- Foreground content ---------------- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: entered ? 1 : 0 }}
        transition={{ duration: 1 }}
        className="pointer-events-none relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-end px-6 pb-16 pt-28 lg:px-8"
      >
        <motion.div variants={stagger(0.1)} initial="hidden" animate="show" className="max-w-xl">
          {/* live status */}
          <motion.div variants={fadeUp}>
            <span
              className="mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm"
              style={{ borderColor: `${NEON}55`, color: NEON, background: `${NEON}14`, boxShadow: `0 0 24px -6px ${NEON}66` }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70" style={{ background: NEON }} />
                <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: NEON }} />
              </span>
              Live · Midnight Testnet
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-balance text-5xl font-bold leading-[0.98] tracking-tight text-white sm:text-6xl md:text-[4.25rem]"
            style={{ textShadow: '0 2px 30px rgba(0,0,0,0.7)' }}
          >
            <ScrambleIn text="Prove the exploit." delay={200} triggered={entered} />
            <br />
            <ScrambleIn text="Never reveal it." delay={500} triggered={entered} />
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-5 max-w-lg text-pretty text-base leading-relaxed text-white/70">
            The confidential bounty terminal for AI vulnerabilities. Pick a target, extract its
            sealed canary, prove it locally, get paid in DUST.
          </motion.p>

          {/* live stats */}
          <motion.div variants={fadeUp} className="mt-7 flex flex-wrap gap-2.5">
            <StatTile icon={<Radar className="h-4 w-4" style={{ color: NEON }} />} value={String(stats.open)} label="open bounties" />
            <StatTile icon={<Coins className="h-4 w-4" style={{ color: NEON }} />} value={`${stats.pool.toLocaleString()}`} label="DUST in escrow" />
            <StatTile icon={<LayoutGrid className="h-4 w-4" style={{ color: NEON }} />} value={String(stats.classes)} label="vuln. classes" />
          </motion.div>

          <motion.div variants={fadeUp} className="pointer-events-auto mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate({ to: '/bounties' })}
              className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-[1.03] active:scale-95"
            >
              Browse bounties
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={() => navigate({ to: '/submit' })}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              Submit a proof
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function StatTile({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 backdrop-blur-sm">
      {icon}
      <div className="leading-none">
        <span className="font-mono text-base font-semibold text-white">{value}</span>
        <span className="ml-1.5 text-[11px] text-white/50">{label}</span>
      </div>
    </div>
  );
}
