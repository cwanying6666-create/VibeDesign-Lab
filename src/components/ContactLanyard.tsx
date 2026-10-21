import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { contactPass } from '../content';
import './ContactLanyard.css';

const Lanyard = lazy(() => import('./react-bits/Lanyard'));

export function ContactLanyard({ showBackRequest = 0 }: { showBackRequest?: number }) {
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [framing, setFraming] = useState({ size: 0.408, strapLength: 0.406 });

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const observer = new ResizeObserver(() => {
      const layoutHeight = parseFloat(getComputedStyle(element).getPropertyValue('--pass-layout-height'));
      const height = Math.max(1, element.clientHeight);
      setFraming({ size: layoutHeight * 0.71 / height, strapLength: (layoutHeight * 0.42 / height - 0.12) / 0.3 });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { rootMargin: '240px' });
    if (host.current) observer.observe(host.current);
    return () => observer.disconnect();
  }, []);

  return <div ref={host} className="pen-contact-lanyard">
    {!ready && <div className="contact-pass-fallback" role="img" aria-label={contactPass.description}>
      <span className="contact-pass-fallback-strap" />
      <img src={showBackRequest > 0 ? contactPass.backImage : contactPass.frontImage} alt="" />
    </div>}
    {visible && <Suspense fallback={null}><Lanyard
      showBackRequest={showBackRequest}
      frontImage={contactPass.frontImage}
      backImage={contactPass.backImage}
      strapImage={contactPass.strapImage}
      cardColor="#f5efff"
      strapColor="#EFEDFF"
      size={framing.size}
      strapLength={framing.strapLength}
      dragAnywhere
      strapWidth={0.48}
      finish="glossy"
      metal="silver"
      damping={0.65}
      breeze={0}
      intro={false}
      onReady={setReady}
    /></Suspense>}
  </div>;
}
