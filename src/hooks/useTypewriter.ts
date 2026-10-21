import { useEffect, useState } from 'react';
export function useTypewriter(text: string, reducedMotion: boolean) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    if (reducedMotion) { setDisplayed(text); return; }
    setDisplayed('');
    const tokens = getComputedStyle(document.documentElement);
    const delay = parseFloat(tokens.getPropertyValue('--hero-typing-delay')) || 600;
    const speed = parseFloat(tokens.getPropertyValue('--hero-typing-speed')) || 38;
    const letters = Array.from(text);
    let interval: ReturnType<typeof setInterval> | undefined;
    const timeout = setTimeout(() => {
      let index = 0;
      interval = setInterval(() => {
        index += 1;
        setDisplayed(letters.slice(0, index).join(''));
        if (index === letters.length) clearInterval(interval);
      }, speed);
    }, delay);
    return () => { clearTimeout(timeout); clearInterval(interval); };
  }, [text, reducedMotion]);
  const value = reducedMotion ? text : displayed;
  return { displayed: value, done: value === text };
}
