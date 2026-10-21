// Additional links verified against Wiki space 7623777736259013595.
// Folder covers keep their three selected articles; the archive includes these too.
export type ArchiveArticle = { title: string; displayTitle?: string; topic: string; href: string };

export const feishuArchive: Record<string, ArchiveArticle[]> = {
  foundations: [
    { title: 'AI 核心概念', topic: 'BASICS', href: 'https://pdqu8vr1mv.feishu.cn/wiki/BMISwb19BiLTx4kpFAGcT8kRnEh' },
    { title: 'FigmaMCP 配置教程', displayTitle: 'Figma MCP配置', topic: 'MCP', href: 'https://pdqu8vr1mv.feishu.cn/wiki/DGpRw6agYiHlwQktMAJcAINFnvc' },
    { title: 'Skill 配置教程', topic: 'SKILL', href: 'https://pdqu8vr1mv.feishu.cn/wiki/S5qRwcXGwiDSWCkWLD5c5Iitnqf' },
    { title: 'Agent 搭建教程', topic: 'AGENT', href: 'https://pdqu8vr1mv.feishu.cn/wiki/EgvYwdeJticAZtk55sOcYkdjnYb' },
    { title: 'AI工具便宜订阅教程', displayTitle: 'AI工具订阅教程', topic: 'SETUP', href: 'https://pdqu8vr1mv.feishu.cn/wiki/CCYYwnesuiPEodkvcuOcY7ulnxb' },
    { title: 'Design.md的撰写和应用', displayTitle: 'Design.md撰写与应用', topic: 'DESIGN.MD', href: 'https://pdqu8vr1mv.feishu.cn/wiki/T94SwsCgkiT8Lkk7GnZcP5TXn4e' },
  ],
  tools: [
    { title: 'Product design插件安装教程', displayTitle: 'Product Design插件安装', topic: 'PLUGIN', href: 'https://pdqu8vr1mv.feishu.cn/wiki/PEgUwGqTaiIEO6kNpSwccBdPnWb' },
    { title: 'edit和export的提示词', displayTitle: 'Edit与Export提示词', topic: 'PROMPT', href: 'https://pdqu8vr1mv.feishu.cn/wiki/AvqkwsHrFinTQRkVrf8cprNXnac' },
    { title: 'Cowart无限画布插件', displayTitle: 'Cowart无限画布', topic: 'COWART', href: 'https://pdqu8vr1mv.feishu.cn/wiki/TEIowy4eviPv6hkkirycQoDtntc' },
    { title: '创建自动获取资讯工作流提示词', displayTitle: '自动获取资讯工作流', topic: 'WORKFLOW', href: 'https://pdqu8vr1mv.feishu.cn/wiki/JFO9wPj7LiHFsTkhttCcKndGncg' },
    { title: 'Design.md文档的使用方法', displayTitle: 'Design.md使用方法', topic: 'DESIGN.MD', href: 'https://pdqu8vr1mv.feishu.cn/wiki/QyJKwmjIGiXtRPkt8QkcidAjnOf' },
    { title: 'GPT Work提示词', topic: 'PROMPT', href: 'https://pdqu8vr1mv.feishu.cn/wiki/FFgewKuFSiQCeHkrnbxczlUlnlh' },
    { title: 'codex+飞书搭建设计师的AI native工作流', displayTitle: 'Codex与飞书工作流', topic: 'CODEX × 飞书', href: 'https://pdqu8vr1mv.feishu.cn/wiki/XMoawTKyPipyEtkJlsEcrH4hnYe' },
    { title: '飞书cli官方文档', displayTitle: '飞书CLI官方文档', topic: 'FEISHU CLI', href: 'https://pdqu8vr1mv.feishu.cn/wiki/QwUEwlUzUikR2Vk018acxKIgn3f' },
  ],
  practice: [
    { title: 'Claude vibecoding教程', displayTitle: 'Claude Vibe Coding', topic: 'CLAUDE', href: 'https://pdqu8vr1mv.feishu.cn/wiki/YZFQwKMliibFEYkb0sfcJ9GUnWg' },
    { title: 'code将参考图还原成可编辑Figma', displayTitle: '参考图还原到Figma', topic: 'FIGMA', href: 'https://pdqu8vr1mv.feishu.cn/wiki/ALfWwOwVKipPuNkx4XAcGf17n4g' },
    { title: '只给PRD，Codex+Figma MCP能生成到什么程度？', displayTitle: '从PRD生成设计稿', topic: 'CODEX × MCP', href: 'https://pdqu8vr1mv.feishu.cn/wiki/ZaNLw3KxTidE0vkm8gkcYhffnid' },
    { title: '让Codex从页面里提取UI规范和组件再生成页面', displayTitle: '提取UI规范与组件', topic: 'CODEX', href: 'https://pdqu8vr1mv.feishu.cn/wiki/TUovwPpYxixxdUkaW8AcIv4bn6u' },
    { title: '从设计规范到完整UI页面', displayTitle: '从设计规范到UI页面', topic: 'UI DESIGN', href: 'https://pdqu8vr1mv.feishu.cn/wiki/JmlywJh50ih3ekkNvcycLndKnDh' },
    { title: '大厂UXUI设计师的AI工作流实操', displayTitle: 'UX/UI设计工作流实操', topic: 'WORKFLOW', href: 'https://pdqu8vr1mv.feishu.cn/wiki/KFhIwF7S5i5yUykJ4l4cFbeYnBf' },
    { title: '用image2从0-1生成UI界面图的工作流', displayTitle: 'Image2生成UI界面', topic: 'IMAGE2', href: 'https://pdqu8vr1mv.feishu.cn/wiki/Gx8xwqXM8iP6UhkMGlJc9Ustndb' },
    { title: '一键替换图片素材', topic: 'ASSETS', href: 'https://pdqu8vr1mv.feishu.cn/wiki/XWXewM2yti4DGUkochhcV14vn0d' },
  ],
};
