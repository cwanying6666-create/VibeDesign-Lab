import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

// Sticky cards have already moved when navigating back. Use their natural flow
// position, rather than the currently pinned screen position, for anchor targets.
function anchorTop(target: HTMLElement) {
  const slot = target.closest<HTMLElement>('[data-stack-slot]');
  if (!slot?.parentElement) return target.getBoundingClientRect().top + window.scrollY;
  let top = slot.parentElement.getBoundingClientRect().top + window.scrollY;
  for (const sibling of Array.from(slot.parentElement.children)) {
    if (sibling === slot) break;
    const style = getComputedStyle(sibling);
    top += (sibling as HTMLElement).offsetHeight + (parseFloat(style.marginTop) || 0) + (parseFloat(style.marginBottom) || 0);
  }
  return top + target.getBoundingClientRect().top - slot.getBoundingClientRect().top;
}

export function usePageMotion() {
  const scope = useRef<HTMLDivElement>(null);
  useGSAP((_context, contextSafe) => {
    const host = scope.current;
    if (!host) return;
    let disposed = false;
    let scrollTween: gsap.core.Tween | undefined;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      host.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach(group => {
        const items = group.querySelectorAll<HTMLElement>('[data-reveal-item]');
        if (!items.length) return;
        gsap.timeline({ scrollTrigger: { trigger: group, start: 'top 85%', once: true } })
          .from(items, { opacity: 0, y: 14, duration: 0.4, stagger: 0.1, ease: 'power2.out', clearProps: 'opacity,transform' });
      });
    }, host);
    document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh(); });

    const focusTarget = (target: HTMLElement) => {
      const hadTabIndex = target.hasAttribute('tabindex');
      if (!hadTabIndex) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      if (!hadTabIndex) target.removeAttribute('tabindex');
    };
    const interrupt = () => { scrollTween?.kill(); scrollTween = undefined; };
    const keyInterrupt = (event: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Escape'].includes(event.key)) interrupt();
    };
    const click = contextSafe!((event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link || !host.contains(link) || link.target || link.hasAttribute('download')) return;
      const hash = link.getAttribute('href')!;
      let id: string;
      try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      interrupt();
      const destination = () => {
        if (id === 'about') return 0;
        const headerHeight = host.querySelector('.pen-header-shell')?.getBoundingClientRect().height || 0;
        return Math.max(0, Math.min(anchorTop(target) - headerHeight - 12, document.documentElement.scrollHeight - innerHeight));
      };
      if (location.hash !== hash) {
        const oldURL = location.href;
        history.pushState(null, '', hash);
        window.dispatchEvent(new HashChangeEvent('hashchange', { oldURL, newURL: location.href }));
      }
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.scrollTo({ top: destination(), behavior: 'instant' });
        focusTarget(target);
        return;
      }
      scrollTween = gsap.to(window, {
        duration: gsap.utils.clamp(0.35, 0.85, Math.abs(destination() - scrollY) / 2200),
        ease: 'power2.inOut',
        scrollTo: { y: destination(), autoKill: true },
        onComplete: () => {
          // Fonts or the printer may have finished layout during the journey.
          if (Math.abs(scrollY - destination()) > 2) window.scrollTo({ top: destination(), behavior: 'instant' });
          focusTarget(target);
          scrollTween = undefined;
        },
      });
    });
    document.addEventListener('click', click);
    window.addEventListener('wheel', interrupt, { passive: true });
    window.addEventListener('touchstart', interrupt, { passive: true });
    window.addEventListener('keydown', keyInterrupt);
    return () => {
      disposed = true;
      interrupt();
      media.revert();
      document.removeEventListener('click', click);
      window.removeEventListener('wheel', interrupt);
      window.removeEventListener('touchstart', interrupt);
      window.removeEventListener('keydown', keyInterrupt);
    };
  }, { scope });
  return scope;
}
