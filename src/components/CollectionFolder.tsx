import { useEffect, useMemo, useRef, useState } from 'react';
import type { FolderCollection } from '../content';
import Folder from './react-bits/Folder';
import './CollectionFolder.css';

const colors = { blue: '#2346ff', purple: '#8650d7', pink: '#e976b4' };

export function CollectionFolder({ collection }: { collection: FolderCollection }) {
  const host = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(1.25);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      // Keep the folder aligned with the other collection columns.
      setSize(Math.min(1.52, entry.contentRect.width / 268));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const items = useMemo(() => collection.articles?.length ? collection.articles.map((article, index) => ({
    title: article.title,
    href: article.href,
    content: <div className={`collection-article article-${index + 1}`}>
      <span className="collection-article-meta"><span>{String(index + 1).padStart(2, '0')}</span><span>{article.topic}</span></span>
      <strong title={article.title}>{article.displayTitle ?? article.title}</strong>
      <p className="collection-article-excerpt">{article.excerpt}</p>
      <span className="collection-article-cta">阅读原文 <span aria-hidden="true">↗</span></span>
    </div>
  })) : [1, 2].map(number => ({
    content: <div className={`collection-placeholder placeholder-${number}`}>
      <span className="collection-placeholder-index">{collection.number} / 0{number}</span>
      <strong>{number === 1 ? '内容标题占位' : '封面图片占位'}</strong>
      <span className="collection-placeholder-art" aria-hidden="true">
        {number === 1 ? <><i /><i /><i /><b /></> : <img src={`/assets/pen/${collection.icon}.png`} alt="" />}
      </span>
      <span className="collection-placeholder-note">内容待补充</span>
    </div>
  })), [collection.articles, collection.number, collection.icon]);

  return <div ref={host} className="collection-folder-host" data-expanded={open || undefined}>
    <Folder
      label={collection.title}
      color={colors[collection.theme]}
      theme="light"
      variant="solid"
      coverShape="notched"
      mode="flap"
      layout="spread"
      size={size}
      items={items}
      zoomOnClick={!collection.articles?.length}
      draggable={!collection.articles?.length}
      open={open}
      onOpenChange={setOpen}
      intro={false}
      coverContent={<div className="collection-cover-label">
        <span>COLLECTION / {collection.number}</span>
        <strong>{collection.title}</strong>
        <span className="collection-cover-arrow">↗</span>
      </div>}
    />
  </div>;
}
