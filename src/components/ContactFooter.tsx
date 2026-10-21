import { socialLinks } from '../content';
import { SectionHeading } from './SectionHeading';
export function ContactFooter() {
  return <footer id="contact" className="contact-section"><div className="container"><SectionHeading>来这里找我聊聊</SectionHeading><ul className="social-links">{socialLinks.map(item => <li key={item.label}>{item.href ? <a className="pill-link" href={item.href}>{item.label}</a> : <button className="pill-link" disabled title={`${item.label}入口待补充`} aria-label={`${item.label}，入口待补充`}>{item.label}</button>}</li>)}</ul></div></footer>;
}
