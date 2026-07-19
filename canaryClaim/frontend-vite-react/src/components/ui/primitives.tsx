import { forwardRef, type ReactNode, type HTMLAttributes } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { fadeUp, stagger, viewportOnce } from '@/lib/motion';
import { ScrambleInView } from './scramble';

/* ------------------------------------------------------------------ */
/* Section — consistent vertical rhythm + id anchor                    */
/* ------------------------------------------------------------------ */
interface SectionProps extends HTMLAttributes<HTMLElement> {
  id?: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}

export function Section({ id, children, className, containerClassName, ...rest }: SectionProps) {
  return (
    <section id={id} className={cn('relative py-24 sm:py-32', className)} {...rest}>
      <div className={cn('mx-auto w-full max-w-6xl px-6 lg:px-8', containerClassName)}>
        {children}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Reveal — scroll-triggered entrance wrapper                          */
/* ------------------------------------------------------------------ */
interface RevealProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  delay?: number;
}

export function Reveal({ children, delay = 0, className, ...rest }: RevealProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      transition={{ delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Staggered container — children should use `variants={fadeUp}` or `<RevealItem>`. */
export function RevealGroup({
  children,
  className,
  staggerChildren = 0.09,
  delayChildren = 0,
  ...rest
}: RevealProps & { staggerChildren?: number; delayChildren?: number }) {
  return (
    <motion.div
      variants={stagger(staggerChildren, delayChildren)}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className, ...rest }: HTMLMotionProps<'div'>) {
  return (
    <motion.div variants={fadeUp} className={className} {...rest}>
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Eyebrow — small uppercase label above headings                      */
/* ------------------------------------------------------------------ */
export function Eyebrow({
  children,
  className,
  tone = 'brand',
}: {
  children: ReactNode;
  className?: string;
  tone?: 'brand' | 'canary' | 'verify' | 'muted' | 'danger';
}) {
  const toneCls = {
    brand: 'text-brand',
    canary: 'text-canary',
    verify: 'text-verify',
    muted: 'text-muted-foreground',
    danger: 'text-danger',
  }[tone];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em]',
        toneCls,
        className,
      )}
    >
      <span className="h-1 w-1 rounded-full bg-current" />
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Pill / Badge                                                        */
/* ------------------------------------------------------------------ */
export function Pill({
  children,
  className,
  tone = 'default',
}: {
  children: ReactNode;
  className?: string;
  tone?: 'default' | 'brand' | 'canary' | 'verify' | 'danger';
}) {
  const toneCls = {
    default: 'border-border bg-secondary/60 text-muted-foreground',
    brand: 'border-brand/25 bg-brand-soft text-brand',
    canary: 'border-canary/25 bg-canary-soft text-canary',
    verify: 'border-verify/25 bg-verify-soft text-verify',
    danger: 'border-danger/25 bg-danger/10 text-danger',
  }[tone];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium',
        toneCls,
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* SectionHeading                                                      */
/* ------------------------------------------------------------------ */
export const SectionHeading = forwardRef<
  HTMLHeadingElement,
  { children: ReactNode; className?: string }
>(({ children, className }, ref) => (
  <h2
    ref={ref}
    className={cn(
      'text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-[2.75rem] md:leading-[1.08]',
      className,
    )}
  >
    {typeof children === 'string' ? <ScrambleInView text={children} amount={0.6} /> : children}
  </h2>
));
SectionHeading.displayName = 'SectionHeading';

export function Lead({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('text-pretty text-lg leading-relaxed text-muted-foreground', className)}>
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* GlowCard — surface with soft border + optional hover lift           */
/* ------------------------------------------------------------------ */
interface GlowCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}

export function GlowCard({ children, className, interactive, ...rest }: GlowCardProps) {
  return (
    <motion.div
      whileHover={interactive ? { y: -4 } : undefined}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'relative overflow-hidden rounded-2xl border border-border bg-card/70 p-6 backdrop-blur-sm',
        interactive && 'transition-colors hover:border-brand/30',
        className,
      )}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
