import { useEffect, useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Bot, User, Zap, MessageSquare, Copy, Check,
  Lock, Coins, Clock, Fingerprint, ShieldCheck, Terminal, ChevronRight,
} from 'lucide-react';
import { AppLayout } from '../app-layout';
import { useApp } from '../store';
import { CATEGORIES } from '../categories';
import type { ChatMessage } from '../types';
import { cn } from '@/lib/utils';

export function AttackPage() {
  const app = useApp();
  const navigate = useNavigate();
  const { selectedBounty, messages, aiTyping, capturedSecret } = app;
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedBounty) navigate({ to: '/bounties' });
  }, [selectedBounty, navigate]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, aiTyping]);

  if (!selectedBounty) return null;
  const b = selectedBounty;
  const meta = CATEGORIES[b.category];
  const Icon = meta.icon;
  const isConsole = meta.surface !== 'chat';

  return (
    <AppLayout>
      <div className="px-4 py-8 sm:px-8">
        <button
          onClick={() => navigate({ to: '/bounties' })}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> All bounties
        </button>

        <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
          {/* Campaign brief */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-border bg-card/60 p-5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-brand/30 bg-brand/10 px-2 py-0.5 text-[11px] font-medium text-brand">
                  <Icon className="h-3.5 w-3.5" /> {meta.label}
                </span>
              </div>
              <h2 className="mt-3 text-lg font-semibold leading-tight">{b.name}</h2>
              <p className="text-xs text-muted-foreground">{b.lab} · {b.target}</p>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <Brief icon={<Coins className="h-3.5 w-3.5 text-brand" />} label="Reward" value={`${b.reward} DUST`} />
                <Brief icon={<Clock className="h-3.5 w-3.5" />} label="Ends in" value={`${b.endsInHours}h`} />
              </div>

              <div className="mt-3 rounded-xl border border-border bg-secondary/30 p-3">
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Fingerprint className="h-3.5 w-3.5" /> Canary commitment
                </div>
                <p className="mt-1 font-mono text-sm">{b.fingerprint}</p>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{b.description}</p>
            </div>

            <div className="rounded-2xl border border-brand/20 bg-brand/5 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-brand">
                <ShieldCheck className="h-4 w-4" /> Objective
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {meta.blurb} Capture the sealed canary, then submit a proof to claim — the exploit
                never leaves this device.
              </p>
            </div>
          </div>

          {/* Interaction surface */}
          <div className="flex min-h-[32rem] flex-col rounded-2xl border border-border bg-card/60">
            <div className="flex items-center justify-between border-b border-border/60 px-5 py-3.5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-secondary/60">
                  {isConsole ? <Terminal className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </span>
                <div>
                  <p className="text-sm font-semibold leading-tight">{b.target}</p>
                  <p className="text-[11px] capitalize text-muted-foreground">
                    {meta.surface} surface · {isConsole ? 'live console' : 'target model'}
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/40 px-2.5 py-1 text-[11px] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" /> live
              </span>
            </div>

            <div
              ref={scrollRef}
              className={cn('flex-1 space-y-2.5 overflow-y-auto p-5', isConsole && 'bg-black/20 font-mono')}
              style={{ maxHeight: '26rem' }}
            >
              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <Line key={m.id} message={m} />
                ))}
              </AnimatePresence>
              {aiTyping && <Working console={isConsole} />}
            </div>

            {/* Controls */}
            <div className="space-y-2 border-t border-border/60 p-4">
              {capturedSecret ? (
                <motion.button
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => navigate({ to: '/submit' })}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-black transition-transform hover:scale-[1.01] active:scale-95"
                >
                  Continue to submit proof
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              ) : (
                <>
                  <button
                    onClick={app.sendNormal}
                    disabled={app.askedNormal || aiTyping}
                    className="flex w-full items-center gap-2.5 rounded-xl border border-border bg-secondary/40 px-3.5 py-2.5 text-left text-sm transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{meta.probeLabel}</span>
                  </button>
                  <button
                    onClick={app.sendJailbreak}
                    disabled={app.jailbroken || aiTyping}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left text-sm transition-all disabled:cursor-not-allowed disabled:opacity-40',
                      app.jailbroken ? 'border-border bg-secondary/40' : 'border-brand/40 bg-brand/10 text-brand hover:scale-[1.01]',
                    )}
                  >
                    <Zap className={cn('h-4 w-4', app.jailbroken ? 'text-muted-foreground' : 'text-brand')} />
                    <span className={app.jailbroken ? 'text-muted-foreground' : 'font-medium'}>
                      {app.jailbroken ? 'Exploit sent' : meta.exploitLabel}
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function Brief({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-3">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
        {icon} {label}
      </div>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}

/** Renders a message by kind: system note, console action line, or chat bubble. */
function Line({ message }: { message: ChatMessage }) {
  if (message.canary) return <CanaryReveal message={message} />;
  if (message.kind === 'system') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-1 text-center text-[11px] text-muted-foreground/70">
        {message.text}
      </motion.div>
    );
  }
  if (message.kind === 'action') return <ActionLine message={message} />;
  return <Bubble message={message} />;
}

function ActionLine({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  const statusColor =
    message.status === 'warn' ? 'text-amber-400' : message.status === 'ok' ? 'text-emerald-400' : 'text-muted-foreground';
  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-start gap-2 text-xs leading-relaxed"
    >
      {isUser ? (
        <>
          <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
          <span className="text-foreground">{message.text}</span>
        </>
      ) : (
        <span className={cn('pl-5', statusColor)}>{message.text}</span>
      )}
    </motion.div>
  );
}

function Bubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn('flex items-end gap-2', isUser ? 'flex-row-reverse' : 'flex-row')}
    >
      <div className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full border', isUser ? 'border-brand/30 bg-brand/10 text-brand' : 'border-border bg-secondary/60 text-muted-foreground')}>
        {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
      </div>
      <div className={cn('max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed', isUser ? 'rounded-br-sm bg-brand text-white' : 'rounded-bl-sm border border-border bg-secondary/50')}>
        {message.text}
      </div>
    </motion.div>
  );
}

function CanaryReveal({ message }: { message: ChatMessage }) {
  const { copyCanary } = useApp();
  const [copied, setCopied] = useState(false);
  const secret = message.secret ?? message.text.replace(/^.*?:\s*/, '').replace(/^→\s*/, '');
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-brand/40 bg-brand/10 p-3.5">
      <p className="flex items-center gap-1.5 text-xs font-medium text-brand">
        <Lock className="h-3.5 w-3.5" /> Sealed canary leaked
      </p>
      <p className="mt-2 font-mono text-sm text-brand">{secret}</p>
      <button
        onClick={() => {
          copyCanary();
          setCopied(true);
          setTimeout(() => setCopied(false), 1400);
        }}
        className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg border border-brand/40 bg-background/40 px-2.5 py-1.5 text-xs font-medium text-brand transition-colors hover:bg-background/70"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? 'Copied' : 'Copy leaked secret'}
      </button>
    </motion.div>
  );
}

function Working({ console: isConsole }: { console: boolean }) {
  if (isConsole) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 pl-5 text-xs text-muted-foreground">
        <span className="inline-block h-3 w-1.5 animate-pulse bg-brand" /> executing…
      </motion.div>
    );
  }
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-2">
      <div className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-secondary/60 text-muted-foreground">
        <Bot className="h-3.5 w-3.5" />
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-border bg-secondary/50 px-3.5 py-3">
        {[0, 1, 2].map((i) => (
          <motion.span key={i} className="h-1.5 w-1.5 rounded-full bg-muted-foreground" animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }} />
        ))}
      </div>
    </motion.div>
  );
}
