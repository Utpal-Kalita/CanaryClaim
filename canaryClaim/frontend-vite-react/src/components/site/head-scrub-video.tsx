import { useEffect, useRef } from 'react';

/**
 * HeadScrubVideo — a paused video whose timeline is scrubbed by the horizontal
 * cursor position, so a subject filmed panning their head left→right appears to
 * turn toward the pointer. Seeks are eased and chained via the `seeked` event to
 * stay smooth without dropping frames.
 *
 * The asset should be a clip where the head sweeps across the full timeline.
 */
export function HeadScrubVideo({
  src,
  className,
  sensitivity = 1,
}: {
  src: string;
  className?: string;
  /** <1 damps the sweep (head turns less than the full range), >1 exaggerates it. */
  sensitivity?: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const target = useRef(0.5); // desired position 0..1
  const current = useRef(0.5); // eased position 0..1
  const duration = useRef(0);
  const seeking = useRef(false);
  const raf = useRef<number | undefined>(undefined);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoaded = () => {
      duration.current = video.duration || 0;
      video.pause();
      try {
        video.currentTime = duration.current * 0.5;
      } catch {
        /* seek not ready yet */
      }
    };
    const onSeeked = () => {
      seeking.current = false;
    };

    const onMove = (e: MouseEvent) => {
      const ratio = e.clientX / window.innerWidth; // 0..1
      const centered = (ratio - 0.5) * sensitivity + 0.5;
      target.current = Math.min(1, Math.max(0, centered));
    };

    video.addEventListener('loadedmetadata', onLoaded);
    video.addEventListener('seeked', onSeeked);
    window.addEventListener('mousemove', onMove);

    const tick = () => {
      // ease the eased cursor toward the target for buttery tracking
      current.current += (target.current - current.current) * 0.12;
      const dur = duration.current;
      if (dur && !seeking.current) {
        const t = current.current * dur;
        if (Math.abs(video.currentTime - t) > 0.008) {
          seeking.current = true;
          try {
            video.currentTime = t;
          } catch {
            seeking.current = false;
          }
        }
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      video.removeEventListener('loadedmetadata', onLoaded);
      video.removeEventListener('seeked', onSeeked);
      window.removeEventListener('mousemove', onMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [src, sensitivity]);

  return (
    <video
      ref={videoRef}
      className={className}
      src={src}
      muted
      playsInline
      preload="auto"
      // paused by default — the scrubber drives currentTime
    />
  );
}
