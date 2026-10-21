import type { ArticleEntry } from '../content';
type Props = { entries: ArticleEntry[]; selectedId: string | null; activeId: string | null; onSelect: (id: string) => void; onHover: (id: string | null) => void; onFocus: (id: string | null) => void };
export function ArticleDirectory({ entries, selectedId, activeId, onSelect, onHover, onFocus }: Props) {
  return <ol className="article-directory" aria-label="文章目录">{entries.map((entry, index) => {
    const common = { className: `article-directory-item${activeId === entry.id ? ' is-active' : ''}${selectedId === entry.id ? ' is-selected' : ''}`, onMouseEnter: () => onHover(entry.id), onMouseLeave: () => onHover(null), onFocus: () => onFocus(entry.id), onBlur: () => onFocus(null), onClick: () => onSelect(entry.id) };
    const content = <><span className="article-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><span className="article-directory-copy"><span className="article-directory-title">{entry.title}</span><span className="article-directory-summary">{entry.summary}</span></span></>;
    return <li key={entry.id}>{entry.href ? <a {...common} href={entry.href} target="_blank" rel="noopener noreferrer">{content}</a> : <button {...common} type="button" aria-pressed={selectedId === entry.id}>{content}</button>}</li>;
  })}</ol>;
}
