import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, User, Check, Copy, MessageSquare, Zap } from 'lucide-react';
import { CANARY_SECRET, useDemo, type ChatMessage } from './demo-context';
import { PanelShell, PanelHeader } from './panel-shell';
import { cn } from '@/lib/utils';

export function AiChat() {
  const { messages, aiTyping, askedNormal, jailbroken, sendNormal, sendJailbreak } = useDemo();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, aiTyping]);

  return (
    <PanelShell tone="canary" className="min-h-[30rem]">
      <PanelHeader
        tone="canary"
        eyebrow="AI Chat"
        title="Aegis-7"
        subtitle="Safety-aligned assistant · target model"
        right={
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/40 px-2.5 py-1 text-[11px] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-verify" />
            online
          </span>
        }
      />

      {/* Messages */}
      <div
        ref={scrollRef}
        className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1"
        style={{ maxHeight: '20rem' }}
      >
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <Bubble key={m.id} message={m} />
          ))}
        </AnimatePresence>
        {aiTyping && <TypingIndicator />}
      </div>

      {/* Controls */}
      <div className="mt-4 space-y-2 border-t border-border/60 pt-4">
        <button
          onClick={sendNormal}
          disabled={askedNormal || aiTyping}
          className="flex w-full items-center gap-2.5 rounded-xl border border-border bg-secondary/40 px-3.5 py-2.5 text-left text-sm transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
        >
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Ask a normal question</span>
        </button>
        <button
          onClick={sendJailbreak}
          disabled={jailbroken || aiTyping}
          className={cn(
            'group flex w-full items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left text-sm transition-all disabled:cursor-not-allowed disabled:opacity-40',
            jailbroken
              ? 'border-border bg-secondary/40'
              : 'border-canary/40 bg-canary-soft text-canary hover:scale-[1.01]',
          )}
        >
          <Zap className={cn('h-4 w-4', jailbroken ? 'text-muted-foreground' : 'text-canary')} />
          <span className={jailbroken ? 'text-muted-foreground' : 'font-medium'}>
            {jailbroken ? 'Jailbreak sent' : 'Send jailbreak prompt'}
          </span>
        </button>
      </div>
    </PanelShell>
  );
}

function Bubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  const { copyCanary, canaryCopied } = useDemo();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn('flex items-end gap-2', isUser ? 'flex-row-reverse' : 'flex-row')}
    >
      <div
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border',
          isUser ? 'border-brand/30 bg-brand-soft text-brand' : 'border-border bg-secondary/60 text-muted-foreground',
        )}
      >
        {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
      </div>

      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
          isUser
            ? 'rounded-br-sm bg-brand text-primary-foreground'
            : message.canary
              ? 'rounded-bl-sm border border-canary/40 bg-canary-soft'
              : 'rounded-bl-sm border border-border bg-secondary/50',
        )}
      >
        {message.canary ? (
          <div className="space-y-2">
            <p className="text-foreground">
              Sealed system canary:
              <br />
              <span className="mt-1 inline-block rounded-md bg-background/60 px-2 py-1 font-mono text-canary">
                {CANARY_SECRET}
              </span>
            </p>
            <button
              onClick={copyCanary}
              className="inline-flex items-center gap-1.5 rounded-lg border border-canary/40 bg-background/40 px-2.5 py-1.5 text-xs font-medium text-canary transition-colors hover:bg-background/70"
            >
              {canaryCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {canaryCopied ? 'Copied' : 'Copy leaked secret'}
            </button>
          </div>
        ) : (
          message.text
        )}
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-end gap-2"
    >
      <div className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-secondary/60 text-muted-foreground">
        <Bot className="h-3.5 w-3.5" />
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-border bg-secondary/50 px-3.5 py-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
          />
        ))}
      </div>
    </motion.div>
  );
}
