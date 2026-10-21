# Pen 静态还原交付记录

## 修改文件

- `src/App.tsx`：切换为静态 PortfolioPage，不挂载旧动效。
- `src/content.ts`：集中管理新画板文案、标签、三个分类、单课程与四个社交入口。
- `src/components/PortfolioPage.tsx`（新增）：语义化页面与重复组件。
- `src/index.css`：加载新主题和布局，更新字体与焦点样式。
- `src/styles/pen-theme.css`（新增）：本轮主题与布局 Token。
- `src/styles/pen-home.css`（新增）：五区布局、基础状态、窄屏重排。
- `index.html`：品牌标题与主题色。
- `README.md`、`docs/design-system/theme-usage.md`：当前维护方式与主题优先级。
- `design-qa.md`：本轮验收状态；历史报告保存在 `docs/preview/design-qa-before-pen.md`。

## 资源文件

- `public/assets/pen/brand.png`、`scientist.png`、`typewriter.png`：Pen 文档原始透明图片副本。
- `public/assets/pen/bRzwK.png`、`s0loHO.png`、`H7eDH7.png`：三个文件夹前盖导出。
- `public/assets/pen/l3saeT.png`、`ZYu0y.png`、`j1uTSh.png`：分类主题图标导出。
- `public/assets/pen/A3DCXM.png`、`xbSwH.png`：箭头与公告星形导出。
- `public/assets/pen/nOwV5.png`、`u948N0.png`、`z0DQUn.png`、`HMm4I.png`：社交平台图标导出。
- `public/fonts/Inter.ttf`、`Inter-OFL.txt`、`NotoSansSC-OFL.txt`：已下载字体与许可。Noto Sans SC 字体下载未完成，当前不引用该缺失文件。
- `docs/preview/pen-source/p0Fo0.png`：1440 × 4047 原画板参考图，不是网页截图。

## 组件结构

```text
App
└─ PortfolioPage
   ├─ HeroSection
   │  ├─ SiteHeader
   │  └─ AnnouncementStrip
   ├─ GrowthSection
   ├─ ArticlesSection
   │  └─ FolderCard × 3
   ├─ CourseSection
   └─ ContactSection

共用：Eyebrow、PendingButton、Arrow
```

## 已完成与待验收

TypeScript 与 Vite 构建通过。原始素材文件存在，且可由 Pillow 读取；本轮没有新增测试框架。

本地 Vite 已启动在 5187。沙箱阻止终端访问本地 HTTP，浏览器工具又因自动审批容量不足无法执行，因此不声明 HTTP、浏览器控制台、导航点击或视觉对照已经验证。1440px 与 926px 桌面截图待补充，手机版专项校验按用户要求未执行。

系统中文字体回退已得到用户确认。独立文件夹箭头导出受阻，暂时复用已有画板箭头。详见 `design-qa.md`。
