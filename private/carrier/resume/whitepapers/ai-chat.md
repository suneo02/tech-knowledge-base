# AI-Chat 智能对话助手 | 2023.08 - 2024.03

定位：企业级 AI 助手应用，支持多轮对话、流式响应与结构化数据渲染。

角色：核心开发者，搭建 AI 聊天页面全流程与对话流程。

## 1. 全景（Situation & Task）

- 业务背景：为金融分析师提供 Chat-to-Data 对话入口，用户通过自然语言触发分析报告、图表与结构化数据展示。
- 架构描述（文字，包含组件关系与数据流）：前端聊天 UI 分为 UI 层、状态层、逻辑层与服务层；请求经由服务层接入 SSE 流式通道，完成预处理、流式解析、收敛与追踪后交给渲染层输出；对外通过 BFF 接入后端服务，前端统一管理会话与消息队列。
- 技术选型对比（文字）：在对话场景需要流式渲染、对话组件与中断控制能力的前提下，选择 Ant Design X 而非自研，以缩短交付周期并集中实现对话流程与结构化输出渲染。

## 2. 设计文档引用与要点（必须）

- 设计文档名称/版本：AI Chat 智能对话组件 文档集 v2.0（2025-11-03）
- 设计文档路径：private/carrier/assets/gel-workspace/packages/gel-ui/docs/biz/ai-chat/
- 关键章节引用（章节标题 + 关联要点）：
  - README.md：核心能力、模块架构、实现映射，界定流式对话、多轮管理、角色系统、数据增强与渲染能力。
  - design/architecture-design.md：整体架构、层次职责、关键特性（插件化扩展、状态管理、性能优化、错误处理）。
  - design/process-flow.md：核心流程架构、处理阶段、事件系统、状态管理。
  - design/message-model-design.md：消息类型体系、解析流水线、渲染系统、交互系统与扩展机制。
  - design/rendering-system-design.md：渲染流水线、渲染场景与性能优化。

## 3. 核心功能与实现（Action - Construction）

- 功能 1：流式对话流程与会话管理。
- 功能 2：结构化输出的消息渲染与交互。
- 功能 3：消息模型与多态解析（可扩展类型与渲染映射）。
- 实现流程（文字步骤）：用户输入 -> 发起对话请求 -> 建立 SSE 流式连接 -> 解析流式增量 -> 进入消息队列 -> 触发渲染与状态更新 -> 支持中断/恢复与会话切换。
- 数据结构（文字字段说明）：基础消息与 AI 消息扩展分层，包含角色、内容、渲染配置、追溯信息与交互元数据，用于驱动多类型渲染与行为。
- 复杂度说明：流式输出与富文本渲染导致 DOM 高度变化与滚动联动；多类型消息与交互需要保证解析与渲染的一致性。

## 4. 个人贡献与成果（Action & Result）

- 覆盖范围与边界：搭建 AI 聊天页面全流程与对话流程，覆盖输入、请求、流式输出、结构化渲染与会话管理；不包含 VisTable 相关实现。
- 关键决策与执行：落地 Ant Design X 方案并完成对话流程集成；设计消息解析与渲染映射机制以支撑结构化输出。
- 量化结果与证据（路径/commit/指标）：TODO（请补充可量化指标或用户反馈证据）。
- 证据路径：private/carrier/assets/gel-workspace/packages/gel-ui/docs/biz/ai-chat/README.md；private/carrier/assets/gel-workspace/packages/gel-ui/docs/biz/ai-chat/design/process-flow.md；private/carrier/assets/gel-workspace/packages/gel-ui/docs/biz/ai-chat/design/message-model-design.md。

## 5. 深挖案例（Action - Optimization & Result）

- 现象：流式输出过程中出现页面抖动与自动上滑，影响阅读连续性。
- 排查过程：定位到 DOM 高度变化与浏览器滚动锚定冲突；在“内容高度刚超过视口”时更易复现，设备差异与渲染时序相关。
- 方案 V1（失败）：以状态驱动滚动，仅在消息状态变化时触发滚动，无法覆盖异步内容加载导致的高度变化。
- 方案 V2（最终）：改为维度驱动滚动，采用双层容器模型与 ResizeObserver 感知高度变化；结合禁用浏览器默认锚定策略，实现仅在用户处于底部时自动吸附。
- 关键实现说明（附路径/commit，不贴代码）：private/carrier/assets/gel-workspace/docs/specs/chat-scroll-optimization/advanced-scroll-spec.md 与 private/carrier/assets/gel-workspace/docs/specs/chat-scroll-optimization/README.md；对应 hook 与组件路径见 packages/gel-ui/src/hooks/useScrollToBottom.ts 与 apps/ai-chat/src/components/SuperList/ChatMessage/index.tsx。
- 量化结果：TODO（请提供复现率/抖动次数/用户反馈或监控指标）。

## 6. 过程记录（可选）

- 关键里程碑：TODO（如需求确认、设计评审、集成上线）。
- 重要权衡与取舍：选择 Ant Design X 替代自研，以满足流式交互与交付节奏。
- 交付节奏或流程改进：TODO。

## 7. 事故复盘（可选）

- 时间线：未提供。
- 根因：未提供。
- 行动项：未提供。

## 8. 知识库（Legacy）

- 要点 1：结构化消息渲染需要统一渲染入口与类型扩展机制，避免重复解析。
- 要点 2：流式输出场景需要以 DOM 维度驱动滚动控制，以覆盖图片/公式等异步高度变化。

## 9. 质量协议清单

- [ ] 证据检查（前后对比指标或证据）
- [ ] 文字化检查（无代码块/图表/表格）
- [ ] 逻辑检查（技术选择与业务关联）
- [ ] 设计文档引用检查（名称/路径/章节明确）
