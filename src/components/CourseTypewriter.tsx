import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { coursePrintout } from '../content';
import { useMediaQuery } from '../hooks/useMediaQuery';
import './CourseTypewriter.css';

const MACHINE = '/assets/pen/typewriter.png';
const DESIGN_WIDTH = 680;
const IMAGE_WIDTH = 1536;
const IMAGE_HEIGHT = 1024;

// Sample the existing photograph at each key: no additional key assets are required.
const keyRows = [
  { letters: '1234567890-=↵', x: 272, y: 513, step: 83, width: 76, height: 66 },
  { letters: 'QWERTYUIOP[]', x: 308, y: 583, step: 83, width: 77, height: 66 },
  { letters: 'ASDFGHJKL;:', x: 309, y: 654, step: 83, width: 78, height: 67 },
  { letters: 'ZXCVBNM,./', x: 350, y: 725, step: 83, width: 79, height: 61 },
];
const keys = keyRows.flatMap(row => Array.from(row.letters, (letter, i) => ({
  letter, x: row.x + i * row.step, y: row.y, width: row.width, height: row.height,
}))).concat([{ letter: ' ', x: 299, y: 786, width: 970, height: 76 }]);

function PrintedText({ text }: { text: string }) {
  return <>{Array.from(text, (letter, i) => <span className="course-print-char" key={i}>{letter}</span>)}</>;
}

export function CourseTypewriter({ showFullRequest = 0 }: { showFullRequest?: number }) {
  const frame = useRef<HTMLDivElement>(null);
  const paper = useRef<HTMLElement>(null);
  const machine = useRef<HTMLDivElement>(null);
  const finishPrinting = useRef(() => {});
  const [loaded, setLoaded] = useState(false);
  const [scale, setScale] = useState(1);
  const [slot, setSlot] = useState(640);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const totalHeight = slot - 60 + DESIGN_WIDTH / IMAGE_WIDTH * IMAGE_HEIGHT + 12;

  useLayoutEffect(() => {
    const element = frame.current?.parentElement;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const widthScale = entry.contentRect.width / DESIGN_WIDTH;
      const heightScale = window.matchMedia('(min-width: 768px)').matches ? entry.contentRect.height / totalHeight : Infinity;
      setScale(Math.min(widthScale, heightScale));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [totalHeight]);

  useLayoutEffect(() => {
    const measure = () => { if (paper.current) setSlot(Math.max(520, paper.current.offsetHeight + 20)); };
    measure();
    let active = true;
    void document.fonts.ready.then(() => { if (active) measure(); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const sheetElement = paper.current;
    const viewport = frame.current;
    const keyboard = machine.current;
    if (!sheetElement || !viewport || !keyboard || !loaded) return;
    const sheet = sheetElement;
    const characters = Array.from(sheet.querySelectorAll<HTMLElement>('.course-print-char'));
    const keyElements = Array.from(keyboard.querySelectorAll<HTMLElement>('.course-key'));
    const striker = keyboard.querySelector<HTMLElement>('.course-striker');
    let timer: ReturnType<typeof setTimeout> | undefined;
    let disposed = false;
    let started = false;
    let finished = false;
    let inView = false;
    let index = 0;
    let lastRow = -1;
    let currentFeed = sheet.offsetHeight - 50;
    const animations = new Set<Animation>();
    const animate = (element: HTMLElement | null | undefined, frames: Keyframe[], options: KeyframeAnimationOptions) => {
      if (!element || reducedMotion) return;
      const animation = element.animate(frames, options);
      animations.add(animation);
      animation.onfinish = () => animations.delete(animation);
    };
    function tap(letter: string) {
      const matching = keyElements.find(key => key.dataset.key === letter.toUpperCase());
      const key = matching ?? keyElements[(index * 7) % (keyElements.length - 1)];
      animate(key, [{ transform: 'translateY(0)', filter: 'brightness(1)' }, { transform: 'translateY(3px) scaleY(.93)', filter: 'brightness(.8)', offset: .3 }, { transform: 'translateY(0)', filter: 'brightness(1)' }], { duration: 130, easing: 'ease-out' });
      animate(striker, [{ transform: 'rotateX(0deg)' }, { transform: 'translateY(-7px) rotateX(-38deg)', offset: .25 }, { transform: 'rotateX(0deg)' }], { duration: 105 });

    }
    function finish() {
      clearTimeout(timer);
      finished = true;
      characters.forEach(char => { char.style.opacity = '1'; });
      sheet.style.transform = 'translateY(0px)';
      viewport!.dataset.printState = 'done';
    }
    function schedule(delay: number) { timer = setTimeout(tick, delay); }
    function tick() {
      if (disposed || finished || !inView || document.hidden) return;
      if (index >= characters.length) { finish(); return; }
      const char = characters[index];
      // offsetTop measures actual wrapped text, independent of scene scaling.
      const row = char.offsetTop;
      if (row !== lastRow) {
        lastRow = row;
        currentFeed = Math.max(0, sheet.offsetHeight - row - char.offsetHeight - 32);
        sheet.style.transform = `translateY(${currentFeed}px)`;
        schedule(index === 0 ? 380 : 200);
        return;
      }
      char.style.opacity = '1';
      if (char.textContent?.trim()) tap(char.textContent);
      index++;
      schedule(/[。？！：]/.test(char.textContent ?? '') ? 240 : 45 + (index % 4) * 9);
    }
    function resume() {
      if (finished || disposed) return;
      clearTimeout(timer);
      started = true;
      viewport!.dataset.printState = 'printing';
      tick();
    }
    finishPrinting.current = finish;
    characters.forEach(char => { char.style.opacity = '0'; });
    sheet.style.transition = 'none';
    sheet.style.transform = `translateY(${currentFeed}px)`;
    // Flush the reset before enabling the paper-feed transition for replay.
    void sheet.offsetHeight;
    sheet.style.transition = '';
    viewport.dataset.printState = 'idle';
    if (reducedMotion) finish();
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView && !finished) resume();
      else if (!inView) {
        clearTimeout(timer);
        if (started && !finished) { viewport.dataset.printState = 'paused'; }
      }
    }, { threshold: .08 });
    observer.observe(viewport);
    const visibility = () => {
      if (document.hidden) clearTimeout(timer);
      else if (inView && !finished) resume();
    };
    document.addEventListener('visibilitychange', visibility);
    return () => {
      disposed = true;
      clearTimeout(timer);
      observer.disconnect();
      document.removeEventListener('visibilitychange', visibility);
      animations.forEach(animation => animation.cancel());
      finishPrinting.current = () => {};
    };
  }, [loaded, reducedMotion]);

  useEffect(() => {
    if (showFullRequest > 0) finishPrinting.current();
  }, [showFullRequest, loaded, reducedMotion]);

  const accessibleText = [coursePrintout.title,
    ...coursePrintout.sections.flatMap(section => [section.heading, ...section.lines, section.outcome].filter(Boolean)),
    ...coursePrintout.statistics].join('\n');

  return <div id="course-printout" tabIndex={-1} className="course-printer" style={{ '--printer-aspect': DESIGN_WIDTH / totalHeight } as CSSProperties}>
    <div ref={frame} className="course-printer-frame" style={{ height: totalHeight * scale }} data-print-state="idle">
      <div className="course-printer-scene" style={{ transform: `translateX(-50%) scale(${scale})`, '--paper-slot': `${slot}px` } as CSSProperties}>
        <div className="course-paper-window">
          <article ref={paper} className="course-paper" aria-hidden="true">
            <div className="course-paper-edition" data-print-line><PrintedText text="VIBEDESIGN / COURSE NO. 01" /></div>
            <h3 data-print-line><PrintedText text={coursePrintout.title} /></h3>
            {coursePrintout.sections.map(section => <section className="course-paper-section" key={section.heading}>
              <h4 data-print-line><PrintedText text={section.heading} /></h4>
              {section.lines.map(line => <p data-print-line key={line}><PrintedText text={line} /></p>)}
              {section.outcome && <p className="course-paper-outcome" data-print-line><PrintedText text={section.outcome} /></p>}
            </section>)}
            <div className="course-paper-stats">{coursePrintout.statistics.map(stat => <p data-print-line key={stat}><PrintedText text={stat} /></p>)}</div>
          </article>
        </div>
        <div className="course-machine" ref={machine}>
          <img src={MACHINE} alt="奶油白与浅紫色复古打字机，课程介绍从滚轴后逐行升起" onLoad={() => setLoaded(true)} onError={() => setLoaded(true)} />
          <div className="course-keys" aria-hidden="true">{keys.map((key, i) => <i className="course-key" data-key={key.letter} key={i} style={{
            left: `${key.x / IMAGE_WIDTH * 100}%`, top: `${key.y / IMAGE_HEIGHT * 100}%`, width: `${key.width / IMAGE_WIDTH * 100}%`, height: `${key.height / IMAGE_HEIGHT * 100}%`,
            backgroundImage: `url(${MACHINE})`, backgroundSize: `${IMAGE_WIDTH / key.width * 100}% ${IMAGE_HEIGHT / key.height * 100}%`,
            backgroundPosition: `${key.x / (IMAGE_WIDTH - key.width) * 100}% ${key.y / (IMAGE_HEIGHT - key.height) * 100}%`,
          }} />)}</div>
          <i className="course-striker" aria-hidden="true" />
        </div>
      </div>
    </div>
    <div className="sr-only">{accessibleText}</div>
  </div>;
}
