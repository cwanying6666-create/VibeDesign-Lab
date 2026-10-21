# 浪味设计所 · 静态画板还原

当前视觉依据：Pen「浪味设计所 · 视觉与交互优化版」，节点 p0Fo0，1440 × 4047。

## 本地运行

```sh
npm install
npm run dev -- --port 5187 --strictPort
npm run build
```

## 当前页面

五个区域：首屏、个人介绍与静态身份标签池、三个文章分类文件夹、单门课程与打字机、四个社交平台入口。导航与探索按钮使用原有锚点。文章分类已接入 React Bits Folder，支持点击展开、卡片放大和拖拽、Escape 与点击外部收起；每组两张卡片暂用明确标注的占位内容。课程与联系按钮仍使用原生 disabled，并关联待补充说明。

以上为最初静态画板基线；后续已按用户要求逐步加入互动，见本文各功能说明。

## 维护内容与视觉

联系区已按用户要求接入 React Bits Lanyard：拖拽摆动、点击翻面、蓝紫品牌挂绳和现有 IP 卡面。素材替换和验证记录见 [联系区创意挂卡](docs/contact-lanyard.md)。

- `src/content.ts`：品牌、文案、身份标签、文章分类、单门课程和社交平台。
- `src/components/PortfolioPage.tsx`：当前组件树与语义结构。
- `src/components/CollectionFolder.tsx`：文件夹配色、封皮标题与占位卡片；替换 `items` 即可补充正式内容。
- `src/components/react-bits/`：React Bits 官方 Folder 源码与许可，本地增加 `coverContent` 支持随封皮运动的标题，并汉化按钮说明。来源：https://github.com/DavidHDev/react-bits/tree/main/src/ts-default/Components/Folder 。
- `src/styles/pen-theme.css`：当前画板颜色、字体、字重、字号、间距、描边和圆角 Token。
- `src/styles/pen-home.css`：桌面画板布局与窄屏重排。
- `public/assets/pen/`：来自 Pen 画板的图片与矢量导出素材。
- `public/fonts/Inter.ttf`：官方 Inter 可变字体；同目录保留许可。

用户已确认暂用系统中文字体：PingFang SC / Microsoft YaHei / Noto Sans SC / sans-serif。Noto Sans SC 的本地下载未完成，不声明已经加载该字体。

如补充真实链接，需要显式将对应 disabled 组件改为链接；当前不自动启用、不创建详情页或弹窗。

### 课程打字机

课程区已接入逐字打印、逐行送纸和按键下压。按用户要求移除了机身下方的状态、播放控制和文字版入口；课程查看按钮直接显示纸张全文，不依赖外部课程地址。修改课程内容请编辑 `src/content.ts` 的 `coursePrintout`。实现与验证记录见 [课程打字机](docs/course-typewriter.md)。

## 视觉规则优先级

本轮 Pen 画板与上述 pen-theme/pen-home 文件优先于旧版 Slush DESIGN.md。旧主题文件仍作为历史参考存在。联系区静态柔光、文件夹图像内的渐变均来自新画板，不表示重新启用旧动态效果。

## 检查状态

参见 `design-qa.md`。浏览器审批服务故障时，不将构建通过等同于视觉验收通过。此前已通过的旧版报告保存在 `docs/preview/design-qa-before-pen.md`，不代表本轮状态。

### 身份标签下落动画

`src/components/FallingIdentityTags.tsx` 使用 Matter.js 实现重力下落、圆角胶囊碰撞、拖动和抛掷，交互参考 [React Bits Falling Text](https://reactbits.dev/text-animations/falling-text)。首次滚动进入视野触发；聚焦标签后按 Enter 或空格可弹起。保留原身份文字及配色，窄屏自动重新测量；系统启用减少动态效果时展示静态布局。
