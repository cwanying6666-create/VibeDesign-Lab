import { useRef, useState } from 'react';
import { profile } from '../content';
import { SiteHeader } from './SiteHeader';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useTypewriter } from '../hooks/useTypewriter';
import { useVideoScrub } from '../hooks/useVideoScrub';
export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const desktopPointer = useMediaQuery('(min-width: 768px) and (hover: hover) and (pointer: fine)');
  const { displayed, done } = useTypewriter(profile.positioning, reducedMotion);
  useVideoScrub(sectionRef, videoRef, desktopPointer && !reducedMotion && !failed);
  return <section ref={sectionRef} id="about" className={`intro-section${failed ? ' video-failed' : ''}`} aria-labelledby="intro-heading">
    <video ref={videoRef} className="hero-video" src="/mainframe-hero.mp4" muted playsInline preload="auto" aria-hidden="true" tabIndex={-1} onError={() => setFailed(true)} />
    <div className="hero-wash" aria-hidden="true" />
    <SiteHeader overlay />
    <div className="container intro-content"><div className="intro-copy">
      <h1 id="intro-heading">你好，我是浪味仙女</h1>
      <p className="intro-role">{profile.role}</p>
      <p className="intro-positioning" aria-label={profile.positioning}>
        <span className="typing-reserve" aria-hidden="true">{profile.positioning}</span>
        <span className="typing-visible" aria-hidden="true">{displayed}{!done && <span className="typing-cursor" />}</span>
      </p>
      <p className="display-transition" lang="en">Designer → VibeDesigner</p>
    </div></div>
  </section>;
}
