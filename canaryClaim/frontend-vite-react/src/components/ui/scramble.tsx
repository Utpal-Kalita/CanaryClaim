import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><';
const rand = () => CHARS[Math.floor(Math.random() * CHARS.length)];

/* ------------------------------------------------------------------ */
/* ScrambleIn — entrance reveal (left-to-right decode)                 */
/* ------------------------------------------------------------------ */
export function ScrambleIn({
  text,
  delay = 0,
  triggered,
  className,
}: {
  text: string;
  delay?: number;
  triggered: boolean;
  className?: string;
}) {
  const [output, setOutput] = useState<string>('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!triggered) return;
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [triggered, delay]);

  useEffect(() => {
    if (!started) return;
    let revealed = 0; // fractional reveal cursor
    const interval = setInterval(() => {
      revealed += 0.5; // 0.5 chars per frame
      const cursor = Math.floor(revealed);
      let next = '';
      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') {
          next += ' ';
        } else if (i < cursor) {
          next += text[i];
        } else if (i < cursor + 3) {
          next += rand(); // up to 3 chars ahead show random
        } else {
          next += '';
        }
      }
      setOutput(next);
      if (cursor >= text.length) {
        setOutput(text);
        clearInterval(interval);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [started, text]);

  if (!triggered) {
    return <span className={className} dangerouslySetInnerHTML={{ __html: '&nbsp;' }} />;
  }
  return <span className={className}>{output}</span>;
}

/**
 * ScrambleInView — convenience wrapper that fires ScrambleIn the first time
 * the element scrolls into view. Keeps the same decode animation for headings.
 */
export function ScrambleInView({
  text,
  delay = 0,
  className,
  amount = 0.5,
}: {
  text: string;
  delay?: number;
  className?: string;
  amount?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount });
  return (
    <span ref={ref}>
      <ScrambleIn text={text} delay={delay} triggered={inView} className={className} />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* ScrambleText — hover-driven scramble + decode                       */
/* ------------------------------------------------------------------ */
export function ScrambleText({
  text,
  isHovered,
  className,
}: {
  text: string;
  isHovered: boolean;
  className?: string;
}) {
  const [output, setOutput] = useState(text);
  const frame = useRef(0);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (interval.current) clearInterval(interval.current);

    if (!isHovered) {
      setOutput(text);
      return;
    }

    frame.current = 0;
    interval.current = setInterval(() => {
      frame.current += 1;
      const revealed = Math.floor(frame.current / 4); // 4 frames per char
      let next = '';
      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') next += ' ';
        else if (i < revealed) next += text[i];
        else next += rand();
      }
      setOutput(next);
      if (revealed >= text.length) {
        setOutput(text);
        if (interval.current) clearInterval(interval.current);
      }
    }, 25);

    return () => {
      if (interval.current) clearInterval(interval.current);
    };
  }, [isHovered, text]);

  return <span className={className}>{output}</span>;
}
