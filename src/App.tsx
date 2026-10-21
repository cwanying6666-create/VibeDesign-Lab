import { useEffect } from 'react';
import { PortfolioPage } from './components/PortfolioPage';
export default function App() {
  useEffect(() => {
    const target = window.location.hash.slice(1);
    if (!target) return;
    const frame = requestAnimationFrame(() => document.getElementById(target)?.scrollIntoView());
    return () => cancelAnimationFrame(frame);
  }, []);
  return <PortfolioPage />;
}
