# 当前主题：Pen 静态画板还原

视觉依据为「浪味设计所 · 视觉与交互优化版」1440 × 4047。新规则覆盖旧 Slush 规则的冲突部分。

- `pen-theme.css`：--pen-blue、--pen-pink、--pen-pool、--pen-course-bg 等表面与强调色；--pen-font 与 --pen-font-latin 字体；--pen-text-* 字号；--pen-weight-* 字重；--pen-space-* 间距；--pen-radius-* 圆角；--pen-outline 与 --pen-hairline 描边；--pen-content-width、--pen-gutter、--pen-section-height 页面尺度。
- `pen-home.css`：五个区域和重复组件的布局，优先引用上述语义 Token。
- `index.css`：加载主题与全局基础样式。

Inter 已本地提供，中文按用户确认使用系统字体回退。旧 tokens.css 与 tailwind-theme.css 为历史兼容基础，当前页面不再使用旧 home.css，不挂载旧动效。
