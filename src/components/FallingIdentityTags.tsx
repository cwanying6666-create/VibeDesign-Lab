import { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { identityTags } from '../content';
import './FallingIdentityTags.css';

// DOM pills backed by Matter bodies, inspired by React Bits Falling Text.
// Keep the existing visual styles while measuring the actual pill dimensions.
export function FallingIdentityTags() {
  const poolRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const kickRef = useRef<(index: number) => void>(() => {});

  useEffect(() => {
    const pool = poolRef.current;
    const list = listRef.current;
    if (!pool || !list) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches) return;
    const { Engine, Bodies, Body, Composite, Constraint, Sleeping } = Matter;
    let disposeWorld = () => {};
    let visible = false;
    let loaded = false;
    let disposed = false;
    let rebuildTimer: ReturnType<typeof setTimeout>;
    let startTimer: ReturnType<typeof setTimeout> | undefined;
    let lastWidth = 0;
    let lastHeight = 0;
    const build = () => {
      disposeWorld();
      if (disposed || !visible || !loaded) return;
      const elements = Array.from(list.querySelectorAll<HTMLLIElement>('li'));
      list.classList.remove('is-falling');
      elements.forEach(element => { element.removeAttribute('style'); });
      const width = list.clientWidth;
      const height = list.clientHeight;
      if (!width || !height) return;
      lastWidth = width;
      lastHeight = height;
      const engine = Engine.create({ enableSleeping: true });
      engine.gravity.y = 1;
      engine.positionIterations = 8;
      const bodies = elements.map((element, index) => {
        const w = element.offsetWidth;
        const h = element.offsetHeight;
        const x = Math.max(w / 2 + 4, Math.min(width - w / 2 - 4, element.offsetLeft + w / 2));
        const y = element.offsetTop + h / 2;
        const body = Bodies.rectangle(x, y, w, h, {
          chamfer: { radius: Math.min(h / 2 - 1, 22) },
          restitution: 0.48,
          friction: 0.35,
          frictionAir: 0.018,
          sleepThreshold: 80,
        });
        Body.setAngle(body, identityTags[index].angle * Math.PI / 180 * 0.35);
        Body.setVelocity(body, { x: (index % 3 - 1) * 0.9, y: 0 });
        return body;
      });
      const wall = { isStatic: true, friction: 0.5 };
      Composite.add(engine.world, [
        ...bodies,
        Bodies.rectangle(width / 2, height + 30, width + 120, 60, wall),
        Bodies.rectangle(-30, height / 2, 60, height * 3, wall),
        Bodies.rectangle(width + 30, height / 2, 60, height * 3, wall),
        Bodies.rectangle(width / 2, -70, width + 120, 60, wall),
      ]);
      list.classList.add('is-falling');
      let frame = 0;
      let previous = 0;
      let accumulator = 0;
      let inView = true;
      const paint = () => bodies.forEach((body, index) => {
        elements[index].style.transform = `translate3d(${body.position.x - elements[index].offsetWidth / 2}px, ${body.position.y - elements[index].offsetHeight / 2}px, 0) rotate(${body.angle}rad)`;
      });
      paint();
      const tick = (now: number) => {
        if (inView && !document.hidden) {
          accumulator += Math.min(previous ? now - previous : 16.667, 50);
          while (accumulator >= 1000 / 60) {
            Engine.update(engine, 1000 / 60);
            accumulator -= 1000 / 60;
          }
          paint();
        }
        previous = now;
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
      const visibilityObserver = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; previous = 0; });
      visibilityObserver.observe(pool);
      let drag: Matter.Constraint | null = null;
      let pointerId: number | null = null;
      const point = (event: PointerEvent) => {
        const rect = list.getBoundingClientRect();
        return { x: (event.clientX - rect.left) * width / rect.width, y: (event.clientY - rect.top) * height / rect.height };
      };
      const release = () => {
        if (drag) Composite.remove(engine.world, drag);
        drag = null;
        if (pointerId !== null && list.hasPointerCapture(pointerId)) list.releasePointerCapture(pointerId);
        pointerId = null;
        list.classList.remove('is-dragging');
      };
      const down = (event: PointerEvent) => {
        if (pointerId !== null || (event.pointerType === 'mouse' && event.button !== 0)) return;
        const target = (event.target as HTMLElement).closest<HTMLLIElement>('[data-falling-tag]');
        if (!target) return;
        const body = bodies[Number(target.dataset.fallingTag)];
        const p = point(event);
        Sleeping.set(body, false);
        drag = Constraint.create({ bodyB: body, pointA: p, pointB: { x: p.x - body.position.x, y: p.y - body.position.y }, stiffness: 0.16, damping: 0.1, length: 0 });
        Composite.add(engine.world, drag);
        pointerId = event.pointerId;
        list.setPointerCapture(pointerId);
        list.classList.add('is-dragging');
        event.preventDefault();
      };
      const move = (event: PointerEvent) => {
        if (drag && event.pointerId === pointerId) {
          const p = point(event);
          drag.pointA = { x: Math.max(0, Math.min(width, p.x)), y: Math.max(0, Math.min(height, p.y)) };
        }
      };
      const up = (event: PointerEvent) => { if (event.pointerId === pointerId) release(); };
      list.addEventListener('pointerdown', down);
      list.addEventListener('pointermove', move);
      list.addEventListener('pointerup', up);
      list.addEventListener('pointercancel', up);
      list.addEventListener('lostpointercapture', up);
      kickRef.current = index => {
        const body = bodies[index];
        Sleeping.set(body, false);
        Body.setVelocity(body, { x: (index % 2 ? -1 : 1) * 2, y: -9 });
        Body.setAngularVelocity(body, 0.045);
      };
      disposeWorld = () => {
        release();
        cancelAnimationFrame(frame);
        visibilityObserver.disconnect();
        list.removeEventListener('pointerdown', down);
        list.removeEventListener('pointermove', move);
        list.removeEventListener('pointerup', up);
        list.removeEventListener('pointercancel', up);
        list.removeEventListener('lostpointercapture', up);
        Composite.clear(engine.world, false);
        Engine.clear(engine);
        kickRef.current = () => {};
      };
    };
    // Check the ratio explicitly: isIntersecting alone can be true as soon as
    // the pool barely touches the viewport, before the threshold is reached.
    const triggerRatio = Math.min(0.85, window.innerHeight * 0.7 / pool.offsetHeight);
    const observer = new IntersectionObserver(([entry]) => {
      clearTimeout(startTimer);
      if (!visible && entry.isIntersecting && entry.intersectionRatio >= triggerRatio) {
        startTimer = setTimeout(() => {
          visible = true;
          observer.disconnect();
          build();
        }, 180);
      }
    }, { threshold: triggerRatio, rootMargin: `0px 0px -${Math.round(window.innerHeight * 0.08)}px 0px` });
    observer.observe(pool);
    void document.fonts.ready.then(() => { if (!disposed) { loaded = true; build(); } });
    const resize = new ResizeObserver(() => {
      if (list.clientWidth === lastWidth && list.clientHeight === lastHeight) return;
      clearTimeout(rebuildTimer);
      rebuildTimer = setTimeout(build, 150);
    });
    resize.observe(list);
    return () => {
      disposed = true;
      clearTimeout(rebuildTimer);
      clearTimeout(startTimer);
      observer.disconnect();
      resize.disconnect();
      disposeWorld();
      list.classList.remove('is-falling');
      Array.from(list.children).forEach(element => { (element as HTMLElement).removeAttribute('style'); });
    };
  }, []);

  return <div className="pen-tag-pool pen-falling-pool" ref={poolRef}>
    <p className="pen-eyebrow">DESIGNER · BUILDER · EXPLORER</p>
    <p id="falling-tags-help" className="sr-only">标签会在进入视野时下落。可拖动、抛起标签，或聚焦标签后按空格或回车弹起。</p>
    <ul ref={listRef} className="pen-falling-tags" aria-label="经历与正在探索的身份" aria-describedby="falling-tags-help">
      {identityTags.map((tag, index) => <li className={`pen-identity-tag tag-${tag.kind}`} data-falling-tag={index} key={tag.label} tabIndex={0} onKeyDown={event => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); kickRef.current(index); }
      }}>{tag.label}</li>)}
    </ul>
  </div>;
}
