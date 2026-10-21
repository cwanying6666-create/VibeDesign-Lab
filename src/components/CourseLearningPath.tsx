import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import './CourseLearningPath.css';

gsap.registerPlugin(useGSAP, ScrollTrigger, DrawSVGPlugin);
const steps = [
  { title: '基础课', detail: '建立工作流认知' },
  { title: '进阶课', detail: '完成一个项目' },
  { title: '拓展课', detail: '完善并正式上线' },
];

export function CourseLearningPath() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const host = ref.current;
    if (!host) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const nodes = host.querySelectorAll('.course-path-number');
      const line = host.querySelector('.course-path-progress');
      const timeline = gsap.timeline({ scrollTrigger: {
        trigger: host, start: 'top 85%', end: 'top 38%', scrub: 0.35, invalidateOnRefresh: true,
      } });
      timeline.fromTo(line, { drawSVG: '0%' }, { drawSVG: '100%', duration: 1, ease: 'none' }, 0);
      nodes.forEach((node, index) => {
        timeline.fromTo(node, { backgroundColor: '#f5efff', color: '#6240b1', borderColor: '#d3c5fa' },
          { backgroundColor: '#6240b1', color: '#ffffff', borderColor: '#6240b1', duration: 0.1, ease: 'none' }, index * 0.45);
      });
    }, host);
    return () => media.revert();
  }, { scope: ref });

  return <div ref={ref} className="course-learning-path" aria-label="课程学习路径">
    <svg className="course-path-connector" viewBox="0 0 100 2" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 1H100" stroke="var(--pen-pool)" />
      <path className="course-path-progress" d="M0 1H100" stroke="var(--pen-purple)" />
    </svg>
    <ol className="course-path-steps">{steps.map((step, index) => <li key={step.title}>
      <span className="course-path-number" aria-hidden="true">{index + 1}</span>
      <strong>{step.title}</strong><span className="course-path-detail">{step.detail}</span>
    </li>)}</ol>
    <p className="course-path-outcome">最终获得一个真实可访问的网站 ↗</p>
  </div>;
}
