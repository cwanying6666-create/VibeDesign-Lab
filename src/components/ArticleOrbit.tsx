import { useEffect, useRef } from 'react';
import type { ArticleEntry } from '../content';
import { hitArticle, orbitPosition, projectArticles, type OrbitPoint } from '../lib/articleOrbit';
type Props = { entries: ArticleEntry[]; activeId: string | null; onHover: (id: string | null) => void; onSelect: (id: string) => void };
export function ArticleOrbit({ entries, activeId, onHover, onSelect }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotation = useRef({ yaw: -0.45, pitch: 0.48 });
  const activeRef = useRef(activeId);
  const redraw = useRef<() => void>(() => {});
  activeRef.current = activeId;
  useEffect(() => { redraw.current(); }, [activeId]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let visible = false, frame = 0, disposed = false;
    let width = 0, height = 0, points: OrbitPoint[] = [];
    let drag: { pointerId: number; x: number; y: number; startX: number; startY: number; moved: boolean } | null = null;
    let hovered: string | null = null;
    const style = getComputedStyle(canvas);
    const token = (name: string) => style.getPropertyValue(name).trim();
    const numeric = (name: string, fallback: number) => parseFloat(token(name)) || fallback;
    const images = new Map<string, HTMLImageElement>();
    const draw = () => {
      frame = 0;
      if (!visible || disposed || !width || !height) return;
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = numeric('--orbit-line-width', 1);
      ctx.strokeStyle = token('--orbit-line-color');
      for (let plane = 0; plane < 4; plane++) {
        ctx.globalAlpha = numeric('--orbit-line-opacity', 0.4);
        ctx.beginPath();
        for (let step = 0; step <= 100; step++) {
          const point = orbitPosition(step / 100 * Math.PI * 2, plane * 0.65 + 0.35, rotation.current.yaw, rotation.current.pitch, width, height);
          if (step === 0) ctx.moveTo(point.x, point.y); else ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
      }
      const nodeRadius = Math.min(numeric('--orbit-node-radius', 46), width * 0.105);
      points = projectArticles(entries, rotation.current.yaw, rotation.current.pitch, width, height, nodeRadius);
      for (const point of points) {
        const entry = entries[point.index], active = entry.id === activeRef.current;
        ctx.globalAlpha = active ? 1 : 0.7 + (point.z + 1) * 0.15;
        ctx.save();
        ctx.beginPath(); ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2); ctx.clip();
        ctx.fillStyle = token('--orbit-node-surface'); ctx.fillRect(point.x - point.radius, point.y - point.radius, point.radius * 2, point.radius * 2);
        const image = images.get(entry.id);
        if (image?.complete && image.naturalWidth) {
          const side = Math.min(image.naturalWidth, image.naturalHeight);
          ctx.drawImage(image, (image.naturalWidth - side) / 2, (image.naturalHeight - side) / 2, side, side, point.x - point.radius, point.y - point.radius, point.radius * 2, point.radius * 2);
        } else {
          ctx.fillStyle = token('--color-carbon'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.font = `${numeric('--font-weight-bold',700)} ${numeric('--orbit-number-size',16)}px ${token('--font-cjk')}`;
          ctx.fillText(String(point.index + 1).padStart(2,'0'), point.x, point.y - 8);
          ctx.font = `${numeric('--font-weight-medium',500)} ${numeric('--orbit-placeholder-size',10)}px ${token('--font-cjk')}`;
          ctx.fillText('封面待补充',point.x,point.y+12,point.radius*1.65);
        }
        ctx.restore();
        ctx.beginPath(); ctx.arc(point.x,point.y,point.radius,0,Math.PI*2);
        ctx.strokeStyle = active ? token('--orbit-active-color') : token('--color-carbon');
        ctx.lineWidth = active ? numeric('--orbit-active-width',3) : numeric('--orbit-line-width',1); ctx.stroke();
        if(active) { ctx.beginPath(); ctx.arc(point.x,point.y,point.radius+numeric('--orbit-active-gap',5),0,Math.PI*2); ctx.lineWidth = numeric('--orbit-line-width',1); ctx.stroke(); }
      }
      ctx.globalAlpha = 1;
    };
    const schedule = () => { if (!disposed && visible && !frame) frame = requestAnimationFrame(draw); };
    redraw.current = schedule;
    for (const entry of entries) if (entry.cover) {
      const image = new Image();
      image.onload = schedule;
      image.onerror = schedule;
      images.set(entry.id,image);
      image.src = entry.cover;
    }
    const resize = () => {
      const rect = canvas.getBoundingClientRect(); width = rect.width; height = rect.height;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(width*dpr); canvas.height = Math.round(height*dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0); schedule();
    };
    const hover = (id: string | null) => {
      if(id !== hovered) { hovered = id; onHover(id); }
      canvas.style.cursor = drag?.moved ? 'grabbing' : id ? 'pointer' : 'grab';
    };
    const coordinates = (e: PointerEvent) => { const rect = canvas.getBoundingClientRect(); return { x:e.clientX-rect.left,y:e.clientY-rect.top }; };
    const down = (e: PointerEvent) => {
      if(e.button !== 0 || drag) return;
      drag={pointerId:e.pointerId,x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,moved:false};
      canvas.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if(drag && e.pointerId === drag.pointerId) {
        const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
        drag.moved ||= Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)>numeric('--orbit-drag-threshold',6);
        if(drag.moved) { rotation.current.yaw+=dx*numeric('--orbit-drag-sensitivity',0.008); rotation.current.pitch=Math.max(-1.2,Math.min(1.2,rotation.current.pitch+dy*numeric('--orbit-drag-sensitivity',0.008))); hover(null); schedule(); }
        drag.x=e.clientX; drag.y=e.clientY;
      } else { const p=coordinates(e); hover(hitArticle(points,p.x,p.y)?.id || null); }
    };
    const cancel = () => { drag=null; hover(null); };
    const up = (e: PointerEvent) => {
      if(!drag || drag.pointerId!==e.pointerId) return;
      const moved=drag.moved; drag=null;
      if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);
      const p=coordinates(e),node=hitArticle(points,p.x,p.y);hover(node?.id||null);
      if(!moved && node) { onSelect(node.id); const entry=entries[node.index]; if(entry.href)window.open(entry.href,'_blank','noopener,noreferrer'); }
    };
    const leave = () => { if(!drag)hover(null); };
    const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(canvas);
    const observer = new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)resize();else if(frame){cancelAnimationFrame(frame);frame=0;}}, {threshold:0});observer.observe(canvas);
    canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',cancel);canvas.addEventListener('lostpointercapture',cancel);canvas.addEventListener('pointerleave',leave);
    return () => {
      disposed=true; cancelAnimationFrame(frame); resizeObserver.disconnect();observer.disconnect();
      images.forEach(image=>{image.onload=null;image.onerror=null;});
      canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerup',up);canvas.removeEventListener('pointercancel',cancel);canvas.removeEventListener('lostpointercapture',cancel);canvas.removeEventListener('pointerleave',leave);
      redraw.current=()=>{};
    };
  }, [entries,onHover,onSelect]);
  return <div className="article-orbit"><canvas ref={canvasRef} className="orbit-canvas" aria-hidden="true" /><p className="orbit-instruction">拖动轨道探索文章，也可以从目录选择</p></div>;
}
