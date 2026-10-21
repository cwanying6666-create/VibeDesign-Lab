import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { homepage } from '../content';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function AnnouncementStrip() {
  const stripRef = useRef<HTMLAnchorElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [copies, setCopies] = useState(6);

  useGSAP(() => {
    const strip = stripRef.current;
    const track = trackRef.current;
    const repeat = track?.querySelector<HTMLElement>('.pen-announcement-repeat');
    if (!strip || !track || !repeat) return;

    const period = () => repeat.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(track, { x: 0 }, {
        x: () => -period(),
        ease: 'none',
        scrollTrigger: {
          trigger: strip,
          start: 'clamp(top bottom)',
          end: 'bottom top',
          scrub: 0.25,
          invalidateOnRefresh: true,
        },
      });
    }, strip);

    // Keep enough identical groups to cover the viewport even at the end of a cycle.
    const resize = new ResizeObserver(() => {
      const width = period();
      if (width > 0) setCopies(Math.max(3, Math.ceil(strip.clientWidth / width) + 2));
      ScrollTrigger.refresh();
    });
    resize.observe(strip);
    resize.observe(repeat);
    return () => { resize.disconnect(); media.revert(); };
  }, { scope: stripRef, dependencies: [copies], revertOnUpdate: true });

  return <a ref={stripRef} className="pen-announcement" href="#courses" aria-label="课程上新公告，跳转到我在做">
    <div ref={trackRef} className="pen-announcement-track">
      {Array.from({ length: copies }, (_, repeat) => <span className="pen-announcement-repeat" key={repeat} aria-hidden={repeat > 0 ? true : undefined}>
        {homepage.announcement.map(text => <span className="pen-announcement-item" key={text}>{text}<img src="/assets/pen/xbSwH.png" alt="" aria-hidden="true" /></span>)}
      </span>)}
    </div>
  </a>;
}
