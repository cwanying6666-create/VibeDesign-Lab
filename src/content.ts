export const profile = {
  name: '浪味仙女',
  role: '体验设计师',
  positioning: '探索设计师在 AI 时代的成长之路',
  growth: '我从小学画画，设计科班出身，也在大厂积累了丰富的设计经验。现在，我想看看设计师在 AI 时代能做些什么，提升自己的职业竞争力——这是我正在探索的 VibeDesign 之路。',
};
export const navigation = [
  { label: '我是谁', target: 'about' },
  { label: '我在想', target: 'articles' },
  { label: '我在做', target: 'courses' },
  { label: '找到我', target: 'contact' },
];
export const experiences = [
  { title: '学习经历', items: ['江南大学 · 环境设计学士', '湖南大学 · 交互设计硕士'] },
  { title: '工作经历', items: ['华为 · 交互设计师', '京东 · 交互设计师', '抖音 · 体验设计师'] },
];
export type ContentEntry = { id: string; title: string; summary: string; cover?: string; href?: string };
export type ArticleEntry = ContentEntry & { category?: string };
// Replace these entries with real material and links when available.
export const articles: ArticleEntry[] = Array.from({ length: 3 }, (_, i) => ({ id: `article-${i + 1}`, title: '文章标题待补充', summary: '文章摘要' }));
export const courses: ContentEntry[] = [{ id: 'ai-design-workflow', title: 'AI 设计工作流必修课', summary: '把零散的 AI 技巧，串成真正可用的设计工作流。' }];
export const coursePrintout = {
  title: 'AI 设计工作流必修课',
  tagline: 'Go VibeDesign ✨',
  introduction: '通过 AI 工具，拓展设计师的能力。',
  sections: [
    { heading: '01 / 这门课适合谁？', lines: ['想转型 AI 的设计师', '学生和初入行的设计师', 'Vibecoder'] },
    { heading: '02 / 这门课讲什么？', lines: ['基础课｜建立 AI 设计工作流认知', '进阶课｜用 AI 做一个完整项目', '拓展课｜完善产品设计并正式上线'], outcome: '最终，获得一个真实可访问的网站链接。' },
    { heading: '03 / 这门课怎么学？', lines: ['飞书知识库', '配套文档、视频与学习资料'] },
  ],
  statistics: ['14 节实战课程', '13 份配套资料', '1 个完整项目'],
  signature: '—— 浪味仙女',
};
export const socialLinks: { label: string; href?: string; icon: string }[] = [
  { label: '微信', icon: 'nOwV5' }, { label: '小红书', icon: 'u948N0', href: 'https://www.xiaohongshu.com/user/profile/596068fd50c4b466a9456f96' },
  { label: 'X / 推特', icon: 'z0DQUn', href: 'https://x.com/vibedesign_lab?s=11' }, { label: '抖音', icon: 'HMm4I', href: 'https://v.douyin.com/HVw3kW6FxCE/' },
];
export const homepage = {
  brand: '浪味设计所',
  introduction: '从小画画，设计科班出身，在大厂积累了丰富的设计经验。\n现在我想看看，在 AI 时代设计师的职业前景。',
  announcement: ['New', 'AI Native的设计师必修课', '上新啦'],
  contactTitle: '让灵感，从一次聊天开始。',
  pending: '内容待补充',
};
// Replace these local textures to change the artwork without altering the physics.
export const contactPass = {
  frontImage: '/assets/lanyard/creative-pass-front.svg',
  backImage: '/assets/lanyard/creative-pass-back.svg',
  strapImage: '/assets/lanyard/creative-strap.svg',
  description: '浪味仙女创意挂卡，正面是人物形象，背面是微信二维码',
  hint: '拖动试试 · 轻点翻面',
  staticHint: 'DESIGN × AI / CREATIVE PASS',
};
export const identityTags = [
  { label: '华为设计师', x: 480, y: 304, angle: -3, kind: 'solid' },
  { label: '体验设计师', x: 65, y: 195, angle: 6, kind: 'solid' },
  { label: '字节设计师', x: 315, y: 221, angle: -5, kind: 'solid' },
  { label: '京东设计师', x: 722, y: 300, angle: 5, kind: 'solid' },
  { label: 'Vibe Coder', x: 340, y: 141, angle: -7, kind: 'outline' },
  { label: 'OPC', x: 586, y: 140, angle: 9, kind: 'outline' },
  { label: 'Vibe Designer', x: 586, y: 218, angle: 4, kind: 'outline' },
  { label: 'AI设计师', x: 885, y: 229, angle: -8, kind: 'outline' },
  { label: '江南大学学士', x: 30, y: 314, angle: -4, kind: 'education' },
  { label: '湖南大学硕士', x: 245, y: 305, angle: 3, kind: 'education' },
  { label: 'FDE', x: 1090, y: 316, angle: -7, kind: 'outline' },
];
export type FolderCollection = {
  id: string; title: string; number: string; eyebrow: string; summary: string;
  theme: 'blue' | 'purple' | 'pink'; front: string; icon: string; angle: number;
  articles?: { title: string; displayTitle?: string; excerpt: string; href: string; topic: string }[];
};
export const folderCollections: FolderCollection[] = [
  { id: 'foundations', title: 'AI入门知识', number: '01', eyebrow: '01 / FOUNDATIONS', summary: '从核心概念开始，建立你的 AI 认知。', theme: 'blue', front: 'bRzwK', icon: 'l3saeT', angle: -3,
    articles: [
      { title: '从零开始搞懂MCP', topic: 'MCP', excerpt: '这一篇关于“MCP是什么”的文章，我建议设计师先从学习“MCP如何使用”开始，然后再来看这篇，这样有利于形成对MCP系统性的理解。', href: 'https://pdqu8vr1mv.feishu.cn/wiki/Xm1WwGyfliSWyFkiOm2cQCnInEb' },
      { title: 'Skill 撰写教程', topic: 'SKILL', excerpt: 'skill 是用自然语言撰写，所以对零代码基础的人来说不算难。', href: 'https://pdqu8vr1mv.feishu.cn/wiki/RBUowDNPaic4PIkJCqycnOxanSf' },
      { title: '提示词工程', topic: 'PROMPT', excerpt: '业务背景输入：产品所属行业、当前业务场景、页面存在原因、核心业务目标', href: 'https://pdqu8vr1mv.feishu.cn/wiki/QBGQwc3gOiWkaukBh0Sc18CwnFd' },
    ] },
  { id: 'tools', title: 'AI工具指南', number: '02', eyebrow: '02 / TOOLKIT', summary: '从安装到上手，把工具用进日常。', theme: 'purple', front: 's0loHO', icon: 'ZYu0y', angle: 2,
    articles: [
      { title: 'Codex+obsidian搭建设计师的知识库', displayTitle: '搭建设计师的知识库', topic: 'CODEX × OBSIDIAN', excerpt: '用 Codex + Obsidian，把收藏的案例、文章与截图，整理成可复用的设计知识。', href: 'https://pdqu8vr1mv.feishu.cn/wiki/J98fwtaFkiVaeAkcacBcf75Enib' },
      { title: '设计师AI第一课｜Codex安装到上手', displayTitle: 'Codex安装到上手', topic: 'CODEX', excerpt: '面向设计师的 Codex 上手教程，从安装注册、界面认识到功能使用，开始用 AI 做设计。', href: 'https://pdqu8vr1mv.feishu.cn/wiki/CLbZwR7owiBbAqkXQ7xcuGBnn1b' },
      { title: 'Figma六大功能更新', topic: 'FIGMA', excerpt: '汇集 Figma 六项新功能的介绍与申请入口：设计智能体、生成工具、Shader、Weave、Code Layer 和 Motion。', href: 'https://pdqu8vr1mv.feishu.cn/wiki/QeqFwMmpbi8mDdkv1eJcDKJ1nWb' },
    ] },
  { id: 'practice', title: 'AI设计实战', number: '03', eyebrow: '03 / DESIGN PRACTICE', summary: '从想法到交付，跑通设计每一步。', theme: 'pink', front: 'H7eDH7', icon: 'j1uTSh', angle: -4,
    articles: [
      { title: '从图片到可交付页面：我用 Codex 跑了一遍完整设计流程', displayTitle: '从图片到可交付页面', topic: 'CODEX', excerpt: '用 Product Design 串联页面分析、意向图生成、设计规范与 HTML 还原，最后交付 Figma 文件。', href: 'https://pdqu8vr1mv.feishu.cn/wiki/NyirwKevdi9kxekgFPncaO4hnkb' },
      { title: '用pencil做一个完整的游戏UI工作流', displayTitle: 'Pencil游戏UI工作流', topic: 'PENCIL', excerpt: '从项目与角色设定出发，生成游戏界面图，再用 Pencil 制作设计稿、用 Codex 完善前端交互。', href: 'https://pdqu8vr1mv.feishu.cn/wiki/OBlmwzzdRiphzTkCukQcQFkcnhh' },
      { title: 'Codex*image2｜图片直出figma', displayTitle: '从UI图片到Figma', topic: 'IMAGE2 × FIGMA', excerpt: '用 Codex、image2 与 Figma MCP，从界面图、交互原型到素材生成，完成可编辑设计稿的交付。', href: 'https://pdqu8vr1mv.feishu.cn/wiki/Yos1wT4ici70RgkDBInci9Sjnng' },
    ] },
];
