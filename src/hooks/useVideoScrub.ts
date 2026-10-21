import { useEffect, type RefObject } from 'react';
export function useVideoScrub(sectionRef: RefObject<HTMLElement | null>, videoRef: RefObject<HTMLVideoElement | null>, enabled: boolean) {
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;
    let previousX: number | null = null;
    let targetTime = 0;
    let seeking = false;
    const sensitivity = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hero-scrub-sensitivity')) || 0.8;
    const seek = () => {
      if (!Number.isFinite(video.duration) || video.readyState < 1 || seeking || video.seeking || video.error) return;
      const next = Math.min(Math.max(targetTime, 0), Math.max(0, video.duration - 0.01));
      if (Math.abs(video.currentTime - next) < 0.015) return;
      seeking = true;
      try { video.currentTime = next; } catch { seeking = false; }
    };
    const resetPosition = () => { previousX = null; };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !enabled) return;
      const previous = previousX;
      previousX = event.clientX;
      if (previous === null || !Number.isFinite(video.duration)) return;
      targetTime = Math.min(Math.max(0, targetTime + ((event.clientX - previous) / window.innerWidth) * sensitivity * video.duration), Math.max(0, video.duration - 0.01));
      seek();
    };
    const seeked = () => { seeking = false; seek(); };
    const loaded = () => { video.pause(); targetTime = 0; seeking = false; seek(); };
    video.pause();
    if (!enabled) { targetTime = 0; seek(); }
    else targetTime = video.currentTime;
    video.addEventListener('loadedmetadata', loaded);
    video.addEventListener('seeked', seeked);
    if (enabled) {
      section.addEventListener('pointermove', move);
      section.addEventListener('pointerleave', resetPosition);
    }
    return () => {
      section.removeEventListener('pointermove', move);
      section.removeEventListener('pointerleave', resetPosition);
      video.removeEventListener('loadedmetadata', loaded);
      video.removeEventListener('seeked', seeked);
    };
  }, [sectionRef, videoRef, enabled]);
}
