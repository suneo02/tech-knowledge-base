# AI-Chat 对话应用 | 2023.08 - 2024.03

**角色**：核心开发者（开发约 2 万行代码）

**项目背景**：企业对话应用，支持 AI 问答。日均对话 5000+次，支持 100+并发用户。

## 技术挑战

- **代码组织**：2 万行代码的分层组织（UI/状态/逻辑/服务）
- **流式响应**：AI 流式数据的实时渲染、中断恢复、错误处理
- **类型扩展**：文本、表格、图表等多种消息类型的渲染

## 🏗️ 代码组织

[📄](resume/assets/gel-workspace/packages/gel-ui/docs/biz/ai-chat/design/architecture-design.md)

### 四层代码分层

- **UI 层**：开发 AIChatApp 容器组件和 20+子组件，支持插槽定制
- **状态层**：封装 useChatBase Hook 管理会话状态，支持 1000+消息/会话
- **逻辑层**：编写 ChatHandler 处理对话流程，通过 HookBus 解耦事件
- **服务层**：实现 Preprocessing/Streaming/Finalize 处理请求生命周期

### 扩展能力

- **流程扩展**：在 Preflight/Streaming/Finalize 阶段注入业务逻辑
- **UI 扩展**：通过 React 插槽配置消息渲染组件
- **数据扩展**：编写自定义解析器处理业务数据格式

## 🧠 AI 对话功能

[📄](resume/assets/gel-workspace/packages/gel-ui/docs/biz/ai-chat/requirements/functional-requirements.md)

### 流式响应处理

- **SSE 集成**：接入 Server-Sent Events，首字节响应<2 秒，流式延迟<500ms
- **上下文管理**：使用 Redux 存储会话历史，支持 1000+消息/会话
- **状态管理**：实现创建 → 流式 → 完成 → 失败的状态机，处理中断和恢复
- **中断处理**：通过 AbortController 取消请求，保存已接收内容

### 消息解析

[📄](resume/assets/gel-workspace/packages/gel-ui/docs/biz/ai-chat/design/message-model-design.md)

- **类型继承**：定义 BaseMessage 基类，派生 AIMessage/UserMessage 等子类
- **解析流程**：检测消息类型 → 验证数据格式 → 转换为前端模型
- **错误降级**：解析失败时回退到纯文本渲染，避免白屏
- **组件映射**：根据消息类型映射到文本、表格、图表等渲染组件

## 📊 量化成果

### 代码质量

- **分层组织**：2 万行代码按 UI/状态/逻辑/服务分层，新功能开发时间从 3 天降至 2 天
- **流式响应**：SSE 首字节响应<2 秒，流式延迟<500ms，支持 1000+消息/会话
- **渲染优化**：使用 React.memo 包裹 15 个组件，重渲染次数减少 70%

### 用户体验

- **加载速度**：首屏加载从 5 秒降至 2.8 秒，操作响应<200ms
- **稳定性**：添加 ErrorBoundary 捕获异常，崩溃率从 0.5%降至<0.1%
