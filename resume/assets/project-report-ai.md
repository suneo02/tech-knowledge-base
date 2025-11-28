# Report-AI 报告生成应用 | 2024.03 - 2024.10

**角色**：项目负责人 & 核心开发

**项目背景**：
面向金融与咨询行业的企业级 AI 报告生成平台，支持长文档（50+页）的智能编写与多人协作。系统需解决大模型流式响应与富文本编辑器（TinyMCE）的实时同步冲突，以及复杂长文档在弱网环境下的数据一致性问题。

**核心技术栈**：
- **框架**: React 18 + TypeScript + Redux Toolkit
- **编辑器**: TinyMCE 6 + Custom Plugins
- **AI 交互**: SSE (Server-Sent Events) + Stream Buffering
- **文档处理**: Markdown-it + React-PDF + Puppeteer

## 🏗️ 核心架构设计

### 1. 三层状态一致性模型
[📄](resume/assets/gel-workspace/apps/report-ai/docs/RPDetail/ContentManagement/三层状态设计.md)
针对富文本编辑器的数据同步痛点，设计了 Single Truth Source 架构：
- **Canonical 层**：服务端持久化数据，作为唯一可信源。
- **Draft 层**：Redux 中的文档副本，负责处理 Hydration 注水与差异计算（Diffing）。
- **UI 层**：TinyMCE 编辑器实例，通过 `LiveOutline` 双向绑定实现用户交互。
**数据流向**：采用单向数据流（Canonical → Hydration → Draft → UI），编辑操作产生的 Delta 通过文档级哈希（SHA-256）校验后，经由 Single-Flight 队列回写至服务端。

### 2. 领域驱动代码组织
[📄](resume/assets/gel-workspace/apps/report-ai/docs/RPDetail/ContentManagement/横纵文档体系.md)
- **横向分层**：Store (状态) / Service (API) / Component (视图) / Utils (工具)。
- **纵向切片**：将复杂业务拆分为 初始化/全文生成/编辑保存/守卫 四大领域模块。
- **状态隔离**：通过 `reportContentStore` 独立管理编辑器状态，与 `useFullDocGeneration` 及其相关 Redux Slice (`generationReducers`) 解耦，确保 AI 生成不阻塞用户编辑。

## ⚡️ 关键技术攻坚

### 3. AI 流式生成与 Hydration 注水
[📄](resume/assets/gel-workspace/apps/report-ai/docs/RPDetail/ContentManagement/Hydration注水机制.md)
- **流式预览 (Streaming Preview)**：开发 `useStreamingPreview` Hook，在 `multiChapterGenerationReducers` 控制的生成队列中，通过 SSE 实时接收 AI 增量数据。
- **增量渲染**：利用 `requestAnimationFrame` 实现字符级缓冲策略，将高频的 SSE 消息合并为 100ms/帧 的 UI 更新，避免 React 渲染线程阻塞。
- **双域挂载**：采用 iframe 叠加层技术，将 AIGC 悬浮按钮与改写预览组件挂载于 `document.body`，通过 `useLoadingPlaceholders` 动态计算 iframe 偏移量，实现与编辑器内容的精准定位，规避了 TinyMCE 内部 DOM 污染问题。

### 4. 复杂并发控制体系
[📄](resume/assets/gel-workspace/apps/report-ai/docs/RPDetail/ContentManagement/AIGC核心流程.md)
- **全局状态机**：设计 `GlobalOpHelper` 管理 `idle` ↔ `full_generation` / `text_rewrite` / `saving` 的状态流转，确保 AI 生成与用户保存操作互斥。
- **请求追踪**：引入 `Correlation ID` 与 `ChapterOperationRequestState` 机制，为每个生成任务分配唯一标识，解决网络重试导致的请求竞态（Race Condition）问题。
- **中断恢复**：集成 `AbortController` 实现生成任务的毫秒级中断，并利用 `useChapterRegeneration` 支持断点续传与上下文恢复。

## 📊 技术成果
- **编辑器性能**：通过文档级哈希算法与 DOM 更新节流（Throttling），长文档（50+页）编辑时的输入延迟控制在 16ms 以内。
- **数据可靠性**：基于 Single-Flight 的保存队列机制，配合 ETag 版本校验，彻底解决了多人协作场景下的内容覆盖问题。
- **生成体验**：流式预览机制使得 AI 生成的首字响应时间（TTFB）从等待完整响应的 5s+ 降低至 <500ms，显著提升了用户的交互感知。

