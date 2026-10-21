import { useCallback, useMemo, useState } from 'react';
import { articles, type ArticleEntry } from '../content';
import { categoriesFor, filterArticles } from '../lib/articleOrbit';
import { ArticleDirectory } from './ArticleDirectory';
import { ArticleOrbit } from './ArticleOrbit';
export function ArticlesSection({ entries = articles }: { entries?: ArticleEntry[] }) {
  const [category,setCategory]=useState<string|null>(null);
  const [selectedId,setSelectedId]=useState<string|null>(null);
  const [hoveredId,setHoveredId]=useState<string|null>(null);
  const [focusedId,setFocusedId]=useState<string|null>(null);
  const categories=useMemo(()=>categoriesFor(entries),[entries]);
  const visible=useMemo(()=>filterArticles(entries,categories.length>=2?category:null),[entries,categories,category]);
  const candidate=hoveredId??focusedId??selectedId;
  const activeId=visible.some(entry=>entry.id===candidate)?candidate:null;
  const select=useCallback((id:string)=>setSelectedId(id),[]);
  const hover=useCallback((id:string|null)=>setHoveredId(id),[]);
  return <section id="articles" className="articles-section page-section" aria-labelledby="articles-heading"><div className="container articles-layout">
    <div className="article-directory-panel"><h2 className="section-heading" id="articles-heading">边探索，<br className="articles-title-break" />边记录</h2>
      {categories.length>=2&&<div className="article-filters" role="group" aria-label="文章分类">{[null,...categories].map(value=><button key={value??'all'} type="button" className="pill-link" aria-pressed={category===value} onClick={()=>{setCategory(value);setHoveredId(null);setFocusedId(null);}}>{value??'全部'}</button>)}</div>}
      <ArticleDirectory entries={visible} selectedId={selectedId} activeId={activeId} onSelect={select} onHover={hover} onFocus={setFocusedId}/>
    </div>
    <ArticleOrbit entries={visible} activeId={activeId} onHover={hover} onSelect={select}/>
  </div></section>;
}
