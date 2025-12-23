## Pages 目录说明

本目录存放所有路由页面（Page 级别）。统一遵循以下项目基础约定：

- **技术栈**：React 18、Vite、TypeScript
- **组件库**：仅使用 `wind-ui`
- **状态管理**：Redux Toolkit（RTK）
- **样式**：CSS Modules 的 `.module.less`
- **副作用与请求**：优先使用 `ahooks`
- **主题与色彩**：仅使用 CSS 变量（禁止硬编码色值）
- **国际化**：按「STRINGS + t」规范管理文案

---

## 页面一览（按目录字母序）

- **CompanyDirectory**：企业名录 / 客户库页面。左侧快速列表与筛选，右侧提供表格、看板与地图 tab，用于客户洞察、线索筛选与导出等。
- **Dashboard**：概览监控类页面。聚合关键指标，图表/统计卡片展示整体运行状态。
- **Fallback**：兜底与占位页面集合，包含 `404` 与 `loading` 等状态页。
- **FullDemo**：完整交互演示页，展示复杂组件与联动场景。
- **Home**：站点首页 / 导航入口，承载到各模块的跳转引导。
- **Introductory**：产品/模块介绍与引导页，可用于新手引导。
- **NoFullDemo**：轻量演示页，相较 `FullDemo` 更精简，便于快速预览。
- **Prospect**：潜客拓展/线索搜集页面，侧重检索、筛选与沉淀线索。
- **SamplePage**：示例模板页面。新建页面时建议参考其结构与组织方式。

---

## 路由与导航

- 路由集中定义于 `src/router/routes.tsx`，页面组件通过该文件注册到应用路由。
- 新增页面步骤：
  1. 在 `src/pages/` 下新增 `PascalCase` 目录，并创建 `index.tsx` 与 `index.module.less`。
  2. 在 `src/router/routes.tsx` 中添加对应路由项。
  3. 使用 `wind-ui` 与已有通用组件，保持交互与视觉一致。

---

## 新建页面脚手架（可选）

- 模板路径：`scripts/CLI/create/pages/{PascalCase}/`
- 脚本：`scripts/CLI/new-page.mjs`
- 可通过脚本或直接复制模板生成基础页面骨架，再按需改造。

---

## 开发规范要点（摘录）

- 仅使用 `wind-ui` 组件；样式使用 `.module.less` 并以 CSS Modules 方式引入。
- 复杂副作用与请求优先使用 `ahooks`（如 `useRequest`、轮询、节流/防抖等）。
- 跨页面/全局状态使用 RTK；组件内局部 UI 状态使用原生 Hooks。
- 文案统一走国际化（STRINGS + `t`），禁止在 JSX 内硬编码文案。
- 所有颜色仅用 CSS 变量（`var(--*)`），禁止硬编码色值。

