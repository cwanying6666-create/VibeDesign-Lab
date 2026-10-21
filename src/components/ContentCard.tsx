import type { ContentEntry } from '../content';
function Cover({ src, title }: { src?: string; title: string }) {
  return src ? <img className="card-cover" src={src} alt={title} loading="lazy" /> : <div className="cover-placeholder" role="img" aria-label={`${title}，封面待补充`} />;
}
export function ContentCard({ entry, kind }: { entry: ContentEntry; kind: 'article' | 'course' }) {
  const content = <><Cover src={entry.cover} title={entry.title} /><div className="card-body"><h3>{entry.title}</h3><p>{entry.summary}</p></div></>;
  return <article className={`content-card ${kind}-card`}>{entry.href ? <a className="card-link" href={entry.href}>{content}</a> : <div className="card-pending" aria-disabled="true">{content}</div>}</article>;
}
