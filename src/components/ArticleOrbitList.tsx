import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { folderCollections } from '../content';
import { feishuArchive } from '../feishuArchive';
import './ArticleOrbitList.css';

const articles = folderCollections.flatMap(collection => [...(collection.articles ?? []), ...(feishuArchive[collection.id] ?? [])].map(article => ({
  ...article, category: collection.id, categoryTitle: collection.title, theme: collection.theme,
})));

/** The archive and the interactive constellation share the folder collection data. */
export function ArticleOrbitList() {
  const [category, setCategory] = useState('all');
  const [highlight, setHighlight] = useState<string | null>(null);
  const visible = articles.filter(article => category === 'all' || article.category === category);
  const globe = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const nodes = useRef<(HTMLAnchorElement | null)[]>([]);
  const rotation = useRef({ x: -.16, y: .35 });
  const drag = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const active = useRef(highlight);
  active.current = highlight;

  useEffect(() => {
    const host = globe.current;
    const surface = canvas.current;
    if (!host || !surface) return;
    const ctx = surface.getContext('2d');
    if (!ctx) return;
    let width = 0, height = 0, frame = 0, last = 0;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const resize = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width; height = entry.contentRect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      surface.width = width * dpr; surface.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    });
    resize.observe(host);
    const project = (x: number, y: number, z: number) => {
      const a = rotation.current.x, b = rotation.current.y;
      const rx = x * Math.cos(b) + z * Math.sin(b);
      const rz = z * Math.cos(b) - x * Math.sin(b);
      const ry = y * Math.cos(a) - rz * Math.sin(a);
      const depth = y * Math.sin(a) + rz * Math.cos(a);
      const radius = Math.min(width * .37, height * .43);
      return { x: width / 2 + rx * radius, y: height / 2 + ry * radius, z: depth };
    };
    const render = (now: number) => {
      const dt = last ? Math.min(now - last, 40) : 0;
      last = now;
      if (!drag.current && !active.current && !reducedMotion.matches) rotation.current.y += dt * .000045;
      ctx.clearRect(0, 0, width, height);
      // Three elliptical orbital planes give the real article nodes spatial context.
      for (let ring = 0; ring < 3; ring++) {
        ctx.beginPath();
        for (let step = 0; step <= 100; step++) {
          const t = step / 100 * Math.PI * 2;
          const tilt = ring * Math.PI / 3 + .35;
          const p = project(Math.cos(t) * 1.17, Math.sin(t) * Math.cos(tilt) * 1.17, Math.sin(t) * Math.sin(tilt) * 1.17);
          if (!step) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = 'rgba(98,64,177,.18)'; ctx.lineWidth = 1; ctx.stroke();
      }
      const points = visible.map((article, index) => {
        const y = 1 - 2 * (index + .5) / visible.length;
        const angle = index * Math.PI * (3 - Math.sqrt(5));
        const r = Math.sqrt(1 - y * y);
        const p = project(Math.cos(angle) * r, y, Math.sin(angle) * r);
        const node = nodes.current[index];
        if (node) {
          const scale = .82 + (p.z + 1) * .16;
          node.style.transform = `translate(-50%,-50%) translate(${p.x}px,${p.y}px) scale(${scale})`;
          node.style.opacity = `${.78 + (p.z + 1) * .11}`;
          node.style.zIndex = `${Math.round((p.z + 1) * 10) + 1}`;
        }
        return { ...p, article };
      });
      for (let i = 0; i < points.length; i++) {
        const p = points[i], next = points[(i + 1) % points.length];
        if (!next || points.length < 2) continue;
        ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(next.x,next.y);
        ctx.strokeStyle = active.current === p.article.href || active.current === next.article.href ? 'rgba(98,64,177,.35)' : 'rgba(98,64,177,.09)';
        ctx.stroke();
      }
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(frame); resize.disconnect(); };
  }, [category]);

  return <div className="article-archive">
    <div className="article-archive-copy">
      <div className="article-archive-filters" role="group" aria-label="文章分类">
        {[{ id: 'all', title: '全部' }, ...folderCollections].map(group => <button key={group.id} type="button" aria-pressed={category === group.id} onClick={() => { setCategory(group.id); setHighlight(null); }}>
          {group.title}<span>{String(group.id === 'all' ? articles.length : articles.filter(a => a.category === group.id).length).padStart(2,'0')}</span>
        </button>)}
      </div>
      <div className="article-archive-rows" aria-label="文章列表" tabIndex={0}>
        {visible.map((article, index) => <a key={article.href} href={article.href} target="_blank" rel="noopener noreferrer" className={highlight === article.href ? 'is-highlighted' : ''} onMouseEnter={() => setHighlight(article.href)} onMouseLeave={() => setHighlight(null)} onFocus={() => setHighlight(article.href)} onBlur={() => setHighlight(null)}>
          <span className="archive-row-number">{String(index + 1).padStart(2,'0')}</span>
          <span className="archive-row-copy"><strong>{article.title}</strong><span>{article.categoryTitle}</span></span>
          <img src="/assets/pen/A3DCXM.png" alt="" aria-hidden="true" />
        </a>)}
      </div>
      <div className="article-archive-footer"><span>显示 {String(visible.length).padStart(2,'0')} / {String(articles.length).padStart(2,'0')} 篇文章</span><span>LEARN · MAKE · SHARE</span></div>
    </div>
    <div className="article-orbit-panel" data-dense={visible.length > 12 || undefined}>
      <div ref={globe} className="article-orbit" aria-label="文章星球，拖动旋转，点击文章打开飞书原文"
        onPointerDown={event => { if (event.button !== 0) return; drag.current = { x: event.clientX, y: event.clientY, moved: false }; suppressClick.current = false; }}
        onPointerMove={event => {
          const previous = drag.current; if (!previous) return;
          const dx = event.clientX - previous.x, dy = event.clientY - previous.y;
          if (!previous.moved && Math.abs(dx) + Math.abs(dy) < 4) return;
          previous.moved = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          rotation.current.y += dx * .007; rotation.current.x = Math.max(-1.2, Math.min(1.2, rotation.current.x + dy * .007));
          previous.x = event.clientX; previous.y = event.clientY;
        }}
        onPointerUp={event => { suppressClick.current = drag.current?.moved ?? false; drag.current = null; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
        onPointerCancel={() => { drag.current = null; suppressClick.current = false; }}
        onClickCapture={event => { if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false; } }}>
        <canvas ref={canvas} aria-hidden="true" />
        {visible.map((article, index) => <a ref={node => { nodes.current[index] = node; }} key={article.href} href={article.href} target="_blank" rel="noopener noreferrer" title={article.title} className={`article-orbit-node orbit-${article.theme}${highlight === article.href ? ' is-highlighted' : ''}`} style={{ '--orbit-index': index } as CSSProperties} aria-label={`${article.title}，在新标签页阅读飞书原文`} onMouseEnter={() => setHighlight(article.href)} onMouseLeave={() => setHighlight(null)} onFocus={() => setHighlight(article.href)} onBlur={() => setHighlight(null)} draggable={false}>
          <span>{article.topic}</span><strong>{article.displayTitle ?? article.title}</strong>
        </a>)}
      </div>
      <p className="article-orbit-hint">拖动探索星球 <span>·</span> 点击阅读文章</p>
      <span className="article-orbit-wordmark" aria-hidden="true">IDEAS IN ORBIT</span>
    </div>
  </div>;
}
