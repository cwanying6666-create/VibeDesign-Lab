import { navigation, profile } from '../content';
export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  return <header className={`site-header${overlay ? ' site-header-overlay' : ''}`}><div className="container header-inner">
    <span className="brand">{profile.name}</span>
    <nav aria-label="首页导航"><ul className="navigation">{navigation.map(item => <li key={item.target}><a className="pill-link" href={`#${item.target}`}>{item.label}</a></li>)}</ul></nav>
  </div></header>;
}
