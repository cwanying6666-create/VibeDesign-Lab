import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { courses, folderCollections, homepage, navigation, socialLinks } from '../content';
import type { FolderCollection } from '../content';
import { ContactLanyard } from './ContactLanyard';
import { CollectionFolder } from './CollectionFolder';
import { PointerFluid } from './PointerFluid';
import { AnnouncementStrip } from './AnnouncementStrip';
import { CourseTypewriter } from './CourseTypewriter';
import { FallingIdentityTags } from './FallingIdentityTags';
import { SectionStack } from './SectionStack';
import './ArticleViewToggle.css';
import { ArticleOrbitList } from './ArticleOrbitList';
import { usePageMotion } from '../hooks/usePageMotion';

const asset = (name: string) => `/assets/pen/${name}.png`;
function Arrow({ className = '' }: { className?: string }) {
  return <img className={`pen-arrow ${className}`} src={asset('A3DCXM')} alt="" aria-hidden="true" />;
}
function PendingButton({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <button type="button" disabled className={`pen-button ${className}`} aria-describedby="content-pending" title={homepage.pending}>{children}<Arrow /></button>;
}
function Eyebrow({ children, className = '', reveal = false }: { children: ReactNode; className?: string; reveal?: boolean }) {
  return <p data-reveal-item={reveal ? '' : undefined} className={`pen-eyebrow ${className}`}>{children}</p>;
}
function SiteHeader() {
  const [activeSection, setActiveSection] = useState('');
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const header = document.querySelector('.pen-header-shell');
      const line = (header?.getBoundingClientRect().bottom ?? 0) + 32;
      let active = '';
      for (const { target } of navigation) {
        const section = document.getElementById(target);
        if (section && section.getBoundingClientRect().top <= line) active = target;
      }
      setActiveSection(active);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('hashchange', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('hashchange', schedule);
    };
  }, []);
  return <header className="pen-header">
    <a className="pen-brand" href="#about" aria-label={`${homepage.brand}，返回首页`}><img src={asset('brand')} alt="" /><span>{homepage.brand}</span></a>
    <nav aria-label="主导航">{navigation.map(item => <a key={item.target} href={`#${item.target}`} aria-current={activeSection === item.target ? 'location' : undefined}>{item.label}</a>)}</nav>
    <a className="pen-contact-link" href="#contact">Contact<Arrow /></a>
  </header>;
}
function HeroSection() {
  return <section id="about" className="pen-hero" data-reveal-group aria-labelledby="hero-title"><div className="pen-hero-surface"><PointerFluid /><div className="pen-stage pen-hero-stage">
    <Eyebrow reveal className="pen-hero-edition">DESIGN × AI / VOL. 01</Eyebrow>
    <p data-reveal-item className="pen-positioning">探索设计师在 <span>AI 时代</span> 的成长之路</p>
    <h1 data-reveal-item id="hero-title" className="pen-hero-title"><span className="pen-title-prefix">我是</span><span className="pen-title-name">浪味仙女</span></h1>
    <div className="pen-ai-sticker" aria-hidden="true"><span>AI</span>{[0, 1, 2, 3].map(i => <i key={i} />)}</div>
    <span className="pen-vibe-sticker">Vibe Designer</span>
    <a className="pen-button pen-explore" href="#articles">看看我在探索什么<Arrow /></a>
    <img className="pen-hero-person" src={asset('scientist')} alt="戴白色花朵帽、穿实验服的浪味仙女，手持画笔和试管" fetchPriority="high" />
  </div></div><AnnouncementStrip /></section>;
}
function GrowthSection() {
  return <section id="about-me" className="pen-growth" data-reveal-group aria-labelledby="growth-title"><div className="pen-stage pen-growth-stage">
    <Eyebrow reveal className="pen-growth-eyebrow">01 / ABOUT ME</Eyebrow>
    <div className="pen-growth-introduction"><h2 data-reveal-item id="growth-title">从画画到设计，<span className="pen-highlight pen-growth-highlight">再到 AI</span></h2><p data-reveal-item>{homepage.introduction}</p></div>
    <h3 className="pen-vibe-heading"><span>这是我正在探索的</span><span className="pen-vibe-outline">——VibeDesign 之路</span></h3>
    <FallingIdentityTags />
  </div></section>;
}
function FolderCard({ collection }: { collection: FolderCollection }) {
  return <article className={`pen-folder-card folder-${collection.theme}`}>
    <CollectionFolder collection={collection} />
    <div className="pen-folder-caption"><Eyebrow>{collection.eyebrow}</Eyebrow><p>{collection.summary}</p></div>
  </article>;
}
function ArticlesSection() {
  const [listView, setListView] = useState(false);
  return <section id="articles" className="pen-articles" data-reveal-group aria-labelledby="articles-title"><div className="pen-stage pen-articles-stage">
    <Eyebrow reveal className="pen-articles-eyebrow">02 / LEARN IN PUBLIC</Eyebrow>
    <h2 data-reveal-item id="articles-title" className="pen-articles-title">边探索，<span className="pen-highlight">边记录</span></h2>
    <button type="button" className="article-view-toggle" aria-pressed={listView} aria-controls="article-view-content" onClick={() => setListView(value => !value)}>
      <svg className="article-toggle-outline" viewBox="0 0 220 56" aria-hidden="true"><path d="M28 2 H128 C145 2 144 19 155 19 C166 19 165 2 192 2 C227 2 227 54 192 54 C165 54 166 37 155 37 C144 37 145 54 128 54 H28 C-7 54 -7 2 28 2 Z" /></svg>
      <span>{listView ? '查看文件' : '查看列表'}</span>
      <svg className="article-toggle-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16m-4-4 4 4-4 4M20 17H4m4-4-4 4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </button>
    <div id="article-view-content" className="article-view-content" data-view={listView ? 'list' : 'folders'}>
      <div className="pen-folder-grid" hidden={listView}>{folderCollections.map(collection => <FolderCard key={collection.id} collection={collection} />)}</div>
      {listView && <ArticleOrbitList />}
    </div>
  </div></section>;
}
function CourseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = section?.querySelector<HTMLElement>('.pen-course-stage');
    if (!section || !stage) return;
    const align = () => {
      const styles = getComputedStyle(section);
      const pageWidth = Math.min(section.clientWidth, parseFloat(styles.getPropertyValue('--pen-content-width')));
      const gutter = parseFloat(styles.getPropertyValue('--pen-gutter'));
      const inset = (section.clientWidth - pageWidth) / 2 + gutter - stage.offsetLeft;
      stage.style.setProperty('--course-copy-left', `${inset}px`);
    };
    const observer = new ResizeObserver(align);
    observer.observe(section);
    observer.observe(stage);
    align();
    return () => observer.disconnect();
  }, []);
  const [showFullRequest, setShowFullRequest] = useState(0);
  const course = courses[0];
  return <section ref={sectionRef} id="courses" className="pen-course" data-reveal-group aria-labelledby="course-title"><div className="pen-stage pen-course-stage">
    <Eyebrow reveal className="pen-course-eyebrow">03 / THE PLAYBOOK</Eyebrow>
    <span className="pen-workflow" aria-hidden="true">WORKFLOW</span>
    <div className="pen-course-copy"><h2 data-reveal-item id="course-title">AI 设计工作流<span className="pen-highlight">必修课</span></h2><p data-reveal-item>{course.summary}</p><a className="pen-button" href="#course-printout" onClick={() => setShowFullRequest(value => value + 1)}>查看课程<Arrow /></a></div>
    <CourseTypewriter showFullRequest={showFullRequest} />
  </div></section>;
}
function ContactSection() {
  const [showBackRequest, setShowBackRequest] = useState(0);
  return <footer id="contact" className="pen-contact" data-reveal-group aria-labelledby="contact-title"><div className="pen-stage pen-contact-stage">
    <div className="pen-contact-heading"><Eyebrow reveal>04 / LET’S CONNECT</Eyebrow><h2 data-reveal-item id="contact-title">{homepage.contactTitle}</h2></div>
    <div className="pen-contact-glow" aria-hidden="true"><i /><i /></div>
    <ContactLanyard showBackRequest={showBackRequest} />
    <div className="pen-socials" aria-label="社交平台"><svg className="sr-only" aria-hidden="true"><defs><filter id="social-theme-purple" colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values="0.676724 0 0 0 0.323276 0.823276 0 0 0 0.176724 0.336207 0 0 0 0.663793 0 0 0 1 0" /></filter></defs></svg>{socialLinks.map(social => social.href ? <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={`${social.label}主页（在新标签页打开）`}><span className="pen-social-circle"><img className={`pen-social-icon social-icon-${social.icon}`} src={asset(social.icon)} alt="" /></span><span>{social.label}</span></a> : social.label === '微信' ? <button key={social.label} type="button" onClick={() => setShowBackRequest(value => value + 1)} aria-label="微信，翻转名片查看二维码" title="翻转名片查看微信二维码"><span className="pen-social-circle"><img className={`pen-social-icon social-icon-${social.icon}`} src={asset(social.icon)} alt="" /></span><span>{social.label}</span></button> : <button key={social.label} type="button" disabled aria-label={`${social.label}，联系方式待补充`} aria-describedby="content-pending" title="联系方式待补充"><span className="pen-social-circle"><img className={`pen-social-icon social-icon-${social.icon}`} src={asset(social.icon)} alt="" /></span><span>{social.label}</span></button>)}</div>
    <span className="pen-contact-wordmark" aria-hidden="true">Contact me</span>
  </div></footer>;
}
export function PortfolioPage() {
  const motionRef = usePageMotion();
  return <div ref={motionRef} className="portfolio-page"><a className="pen-skip-link" href="#articles">跳到探索记录</a><p id="content-pending" className="sr-only">内容或联系方式待补充，此入口暂不可用。</p><div className="pen-header-shell"><SiteHeader /></div><main><HeroSection /><SectionStack introduction={<GrowthSection />} articles={<ArticlesSection />} course={<CourseSection />} /></main><ContactSection /></div>;
}
