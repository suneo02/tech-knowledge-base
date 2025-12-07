# 张文浩

**cms120@outlook.com** | 18812737732

---

## 概况

- 工作年限：1 年+ | 前端/工程化 | React 18 + TypeScript + Vite/Webpack + Redux Toolkit + Ant Design
- 优势：AI 报告/对话体验、长文档性能优化、Monorepo 工程化与 CI/CD
- 代表项目：Report-AI 报告生成、Report Print PDF 生成、GEL Workspace Monorepo、Company 企业信息平台

---

## 工作经历

### GEL Workspace（企业数据 & AI 报告）| 前端工程师

**2023.10 - 至今**

- **金融级 AI 报告与数据分析平台**，服务于专业投研分析师，日均生成报告 500+ 份。技术栈：React 18 + TypeScript + Turborepo + TinyMCE。
- 主导 **Report-AI** 核心编辑器与 **Monorepo** 基建架构，解决高并发协同与构建效率痛点，支撑 **8 个子应用** 稳定运行。
- 交付 **Report Print** 导出服务，突破浏览器渲染瓶颈，实现 **1000+ 份/天** 的像素级 PDF 自动化生产。

---

## 项目经验

### 智能研报生成编辑器 (Rich Text Editor) | 项目负责人 & 核心开发

**2024.03 - 2024.10 | React + TypeScript + TinyMCE + SSE**

- **设计**多层级状态管理机制 (Server/Draft/UI)，配合**请求串行化**策略解决多人协作下的高并发数据冲突，实现 **100+ 并发**下的零数据丢失。
- **优化**长文档渲染性能，采用**流式分片渲染**与 **requestAnimationFrame** 帧率控制，确保 50+ 页文档生成时编辑器响应流畅 (**60FPS**)。
- **实现**增量自动保存，基于**内容哈希比对**减少无效请求，结合**乐观更新 (Optimistic UI)** 策略，将自动保存成功率提升至 **99.5%**，交互延迟降低 70%。

### 研报 PDF 导出服务 (Node.js & Rendering) | 核心开发

**2024.05 - 2024.09 | React + Vite/Webpack + wkhtmltopdf**

- **搭建**开发/生产双构建环境，利用 **Vite** 提升本地开发效率，**Webpack** 兼容旧版渲染引擎，确保预览与打印结果的**像素级一致性**。
- **研发**动态 DOM 测量分页算法，自动化处理跨页表格表头重复与富文本布局，将 PDF 格式错误率从 **15% 降至 <1%**。
- **设计** Node.js 进程池与任务队列，通过**自动重试机制**与超时熔断解决渲染引擎内存泄漏问题，导出效率提升 **10 倍**，产物体积减少 **80%**。

### 企业级前端工程化基建 (Infrastructure) | 项目经理 & 架构师

**2024.01 - 至今 | Turborepo + pnpm + Vite/Webpack + GitHub Actions**

- **主导** Monorepo 架构迁移，基于 **Turborepo** 与 **pnpm Workspace** 管理 8 个应用与 11 个公共包，通过**严格依赖管理**消除幽灵依赖。
- **优化** CI/CD 流水线，实现**基于依赖拓扑的构建调度**与**远程构建缓存**，将全量构建时间从 **45 分钟压缩至 5 分钟** (热构建 2 分钟)。
- **统一**团队研发规范，建立标准化的 **ESLint/Prettier** 配置与 **CLI** 脚手架，将新人环境配置与上手时间从 2 周缩短至 **3-5 天**。

### 企业数据可视化平台 (Dashboard) | 核心开发

**2023.10 - 2024.06 | React + TypeScript + Redux + Ant Design + Cytoscape.js**

- **重构**页面架构，采用**配置驱动 (Config-Driven)** 与**策略模式**解耦业务逻辑，通过元数据定义差异化功能，新业务接入效率提升 **6 倍**。
- **优化** 50+ 模块的长页面渲染，实现**可视区动态加载**与**虚拟占位**策略，大幅减少 DOM 节点数量，将首屏 FCP 从 **4.5s 降至 1.8s**。
- **提升**高频交互性能，利用 **requestAnimationFrame** 与 **读写分离** 优化滚动监听，支撑 **10 万+** 日均查询下的 **60FPS** 丝滑体验。

---

## 教育背景

**天津大学**，智能与计算学部软件工程（本科）  
2020.09 - 2024.06

---

## 专业技能

- **核心栈**：精通 **React 18** (Hooks/Suspense)、**TypeScript 5** (类型体操)、**Redux Toolkit** (状态管理)、**Ant Design**。
- **工程化**：熟练掌握 **Turborepo**、**pnpm**、**Vite/Webpack** 配置、**GitHub Actions** CI/CD 流程搭建。
- **性能优化**：擅长 **Large DOM** 虚拟滚动、**Web Worker** 离线计算、**RAF** 帧率优化、**FCP/LCP** 指标调优。
- **AI 交互**：掌握 **SSE** 流式响应处理、**AbortController** 请求控制、**Markdown/HTML** 流式渲染策略。
