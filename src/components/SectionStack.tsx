import { useEffect, useRef, useState, type ReactNode } from 'react';
import ScrollStack, { ScrollStackItem } from './react-bits/ScrollStack';
import './SectionStack.css';

/** One page scrollbar; each section keeps its natural reading height. */
export function SectionStack({ introduction, articles, course }: { introduction: ReactNode; articles: ReactNode; course: ReactNode }) {
  const host = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState(86);
  useEffect(() => {
    const header = document.querySelector('.pen-header-shell');
    if (!header) return;
    const observer = new ResizeObserver(() => {
      const offset = Math.ceil(header.getBoundingClientRect().height);
      setTop(offset);
      host.current?.style.setProperty('--section-stack-top', `${offset}px`);
    });
    observer.observe(header);
    return () => observer.disconnect();
  }, []);
  return <div ref={host} className="pen-section-stack">
    <ScrollStack
      useWindowScroll
      smoothScroll={false}
      snap={false}
      stackPosition={top}
      itemDistance={0}
      itemStackDistance={0}
      itemScale={0}
      baseScale={1}
      dimAmount={0}
      holdDistance={0}
    >
      <ScrollStackItem itemClassName="pen-stack-introduction">{introduction}</ScrollStackItem>
      <ScrollStackItem itemClassName="pen-stack-articles">{articles}</ScrollStackItem>
      <ScrollStackItem itemClassName="pen-stack-course">{course}</ScrollStackItem>
    </ScrollStack>
  </div>;
}
