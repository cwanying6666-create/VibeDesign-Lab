import { useEffect, useRef } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { createFluidTrail } from '../lib/fluidTrail';

// Transparent background layer, scoped to its containing hero surface.
export function PointerFluid() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const mouse = useMediaQuery('(hover: hover) and (pointer: fine)');

  useEffect(() => {
    const canvas = ref.current;
    const surface = canvas?.parentElement;
    if (!canvas || !surface || reduced || !mouse) return;

    const style = getComputedStyle(document.documentElement);
    const number = (name: string, fallback: number) => parseFloat(style.getPropertyValue(name)) || fallback;
    const palette = ['#2145ff', '#9b36ff', '#ff42cc', '#ff9855', '#e2ff45', '#66f5c0']
      .map(hex => [1, 3, 5].map(start => parseInt(hex.slice(start, start + 2), 16) / 255));
    let fluid: ReturnType<typeof createFluidTrail> = null;
    let frame = 0, last = 0, lastInput = 0, visible = true, lost = false;
    let previous: { x: number; y: number } | null = null;
    const life = number('--pointer-fluid-life', 6500);
    const reset = () => { previous = null; };
    const pause = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
      reset();
      if (!lost) fluid?.clear();
    };
    const resize = () => {
      pause();
      fluid?.dispose();
      fluid = null;
      if (lost) return;
      const { width, height } = surface.getBoundingClientRect();
      if (!width || !height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      fluid = createFluidTrail(canvas, palette, {
        opacity: number('--pointer-fluid-opacity', 0.88),
        radius: number('--pointer-fluid-radius', 0.00065),
        resolution: number('--pointer-fluid-resolution', 128),
      });
      canvas.dataset.fluidStatus = fluid ? 'ready' : 'unavailable';
    };
    const tick = (time: number) => {
      frame = 0;
      if (!fluid || lost || document.hidden || !visible) return;
      if (time - lastInput > life) { pause(); return; }
      fluid.step(Math.min(last ? (time - last) / 1000 : 1 / 60, 0.033));
      last = time;
      frame = requestAnimationFrame(tick);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || document.hidden || !visible || lost || !fluid) return;
      const bounds = surface.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = 1 - (event.clientY - bounds.top) / bounds.height;
      if (previous) {
        const dx = x - previous.x, dy = y - previous.y;
        const distance = Math.hypot(dx, dy);
        if (distance > 0.0001) {
          const segments = Math.min(12, Math.max(1, Math.ceil(distance / 0.008)));
          const time = performance.now();
          for (let i = 1; i <= segments; i++) {
            fluid.add(previous.x + dx * i / segments, previous.y + dy * i / segments,
              dx / segments, dy / segments, time);
          }
          lastInput = time;
          if (!frame) { last = 0; frame = requestAnimationFrame(tick); }
        }
      }
      previous = { x, y };
    };
    const visibility = () => { if (document.hidden) pause(); };
    const contextLost = (event: Event) => {
      event.preventDefault();
      lost = true;
      pause();
      canvas.dataset.fluidStatus = 'unavailable';
    };
    const contextRestored = () => { lost = false; resize(); };
    const observer = new ResizeObserver(resize);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) pause();
    });
    observer.observe(surface);
    intersection.observe(surface);
    surface.addEventListener('pointermove', move, { passive: true });
    surface.addEventListener('pointerleave', reset);
    window.addEventListener('scroll', reset, { passive: true });
    window.addEventListener('blur', pause);
    document.addEventListener('visibilitychange', visibility);
    canvas.addEventListener('webglcontextlost', contextLost);
    canvas.addEventListener('webglcontextrestored', contextRestored);
    return () => {
      pause();
      fluid?.dispose();
      observer.disconnect();
      intersection.disconnect();
      surface.removeEventListener('pointermove', move);
      surface.removeEventListener('pointerleave', reset);
      window.removeEventListener('scroll', reset);
      window.removeEventListener('blur', pause);
      document.removeEventListener('visibilitychange', visibility);
      canvas.removeEventListener('webglcontextlost', contextLost);
      canvas.removeEventListener('webglcontextrestored', contextRestored);
    };
  }, [reduced, mouse]);

  return <canvas ref={ref} className="pointer-fluid" aria-hidden="true" />;
}
