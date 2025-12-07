# Report-AI 报告生成应用 | 2024.03 - 2024.10

**角色**：项目负责人 & 核心开发
**项目背景**：
面向金融与咨询行业的企业级 AI 报告生成平台，支持长文档（50+页）的智能编写与多人协作。系统需解决大模型流式响应与富文本编辑器（TinyMCE）的实时同步冲突，以及复杂长文档在弱网环境下的数据一致性问题。
**核心技术栈**：React 18, TypeScript, Redux Toolkit, TinyMCE 6, SSE (Server-Sent Events), Puppeteer

## 1. 全景架构 (The Big Picture)

### 1.1 业务背景

一句话解释：**让金融分析师像搭积木一样，通过 AI 辅助快速组装和生成专业的长篇研报。**

### 1.2 架构视图

```mermaid
graph TD
    subgraph Server [服务端: Canonical Layer]
        DB[(Database)]
        API[Node.js BFF]
        LLM[LLM Service]
    end

    subgraph Client [客户端: Frontend App]
        subgraph DataLayer [数据层 Data Layer]
            Store[Redux Store]
            Canonical[Canonical State (Truth)]
            Draft[Draft Tree (Metadata)]
            Queue[Single-Flight Queue]
        end

        subgraph ViewLayer [视图层 View Layer]
            Editor[TinyMCE Editor]
            Outline[LiveOutline]
            Hydration[Hydration Engine]
        end
    end

    LLM -- SSE Stream --> Canonical
    Canonical -- Buffering --> Hydration
    Hydration -- setContent --> Editor
    Editor -- onChange --> Outline
    Outline -- Normalize & Hash --> Draft
    Draft -- Dirty Check --> Queue
    Queue -- Save Payload --> API
    API -- Normalized Data --> Canonical
```

### 1.3 技术选型决策表 (ADR)

| 决策点           | 选择              | 对比          | 理由/证据                                                                                                    |
| :--------------- | :---------------- | :------------ | :----------------------------------------------------------------------------------------------------------- |
| **富文本编辑器** | **TinyMCE 6**     | Quill / Slate | 需支持复杂的 Word 格式粘贴、表格操作和分页预览；TinyMCE 的生态最成熟，虽重但稳。                             |
| **流式通信**     | **SSE**           | WebSocket     | 仅需服务端单向推送 AI 生成内容；SSE 协议简单，无握手开销，更易穿透企业防火墙。                               |
| **状态管理**     | **Redux Toolkit** | Context API   | 涉及三层状态（Canonical/Draft/UI）的复杂同步；Context 在高频更新（流式打字机）下会导致全量重渲染，性能堪忧。 |
| **保存策略**     | **Single-Flight** | Debounce      | 长文档哈希计算开销大；必须确保前一次保存完成（或失败）后才能发起下一次，防止版本覆盖。                       |

## 2. 核心功能实现 (Core Features & Implementation)

### Feature 1：三层状态一致性模型 (Three-Layer Consistency)

- **目标**：解决编辑器内容（UI）、内存状态（Draft）与服务端数据（Canonical）的同步问题。
- **实现逻辑**：
  - **Canonical 层**：服务端持久化数据，作为唯一可信源（Single Source of Truth）。
  - **Draft 层**：Redux 中的文档副本，仅记录 `chapterId`, `title`, `order`, `dirty`, `baselineHash` 等轻量元数据。
  - **UI 层**：TinyMCE 编辑器实例，通过 `LiveOutline` 双向绑定实现用户交互。
- **数据流向**：
  `Input` -> `TinyMCE onChange` -> `Normalize` -> `Calculate Hash` -> `Update Draft` -> `Check Dirty` -> `Auto Save`

### Feature 2：AI 流式注水引擎 (Streaming Hydration)

- **目标**：让 AI 生成的内容像“打字机”一样实时上屏，且不阻塞主线程。
- **流程图**：

  ```mermaid
  sequenceDiagram
      participant SSE as SSE Stream
      participant Buffer as Frame Buffer
      participant RAF as requestAnimationFrame
      participant Editor as TinyMCE

      SSE->>Buffer: Push Token "H"
      SSE->>Buffer: Push Token "e"
      SSE->>Buffer: Push Token "l"

      loop Every Frame (16ms)
          RAF->>Buffer: Check Queue
          Buffer->>Editor: Batch Insert "Hel"
          Editor-->>RAF: Render Complete
      end
  ```

- **复杂度**：需处理 SSE 网络抖动、Token 乱序以及 React 渲染周期与 TinyMCE DOM 更新周期的协调。

### Feature 3：复杂并发控制体系

- **目标**：防止 AI 生成、用户编辑、自动保存三者发生竞态冲突。
- **实现逻辑**：
  - **全局状态机**：设计 `GlobalOpHelper` 管理 `idle` ↔ `full_generation` / `saving` 的互斥流转。
  - **请求追踪**：引入 `Correlation ID` 为每个生成任务分配唯一标识，解决网络重试导致的请求竞态。
  - **中断恢复**：集成 `AbortController` 实现生成任务的毫秒级中断。

## 3. 核心难点攻坚 (Deep Dive Case Study)

### 案例 A：流式生成导致的编辑器卡顿 (The "Typewriter" Lag)

- **现象 (Symptoms)**：
  - AI 生成过程中，浏览器 FPS 降至 10 以下，用户无法滚动或操作。
  - CPU 占用率飙升至 100%。
- **排查 (Investigation)**：
  - Performance 面板显示 `TinyMCE.setContent` 和 React Render 触发频率极高（每秒 50+ 次）。
  - 每一个 Token（1-2 个字符）的到达都会触发一次完整的 DOM 重绘和光标重定位。
- **方案 (Solution)**：
  - **V1 (Fail)**：使用 `lodash.debounce`，导致生成过程“一卡一顿”，不流畅。
  - **V2 (Success)**：引入 **RAF 缓冲策略 (Frame Buffering)**。
    - 建立一个消息队列 buffer。
    - 使用 `requestAnimationFrame` 在每一帧的空闲时间消费 buffer。
    - 将 16ms 内收到的所有 Token 合并为一次 DOM 操作。
- **代码**：

  ```typescript
  // hooks/useStreamingPreview.ts
  const flushBuffer = () => {
    if (bufferRef.current.length === 0) return;

    // 合并当前帧的所有 token
    const chunk = bufferRef.current.join("");
    bufferRef.current = [];

    // 执行一次 DOM 更新
    editor.insertContent(chunk);

    // 继续下一帧循环
    animationFrameId = requestAnimationFrame(flushBuffer);
  };
  ```

### 案例 B：多人协作下的内容覆盖 (The Overwrite Issue)

- **现象**：用户 A 正在编辑，自动保存触发；此时 AI 生成完成并自动写入；导致用户 A 的部分输入丢失。
- **排查**：
  - 保存请求是异步的，AI 写入是同步的。
  - 缺乏“锁”机制，导致旧版本的 Draft 覆盖了新版本的 UI。
- **方案**：
  - **Single-Flight Queue**：确保同一时间只有一个保存请求在途（In-Flight）。
  - **文档级哈希 (DocHash)**：
    - 每次保存前计算 `currentHash`。
    - 保存成功后更新 `baselineHash`。
    - 只有当 `currentHash !== baselineHash` 时才标记为 `dirty`。
  - **生成前置检查**：AI 生成前强制触发一次保存，若保存失败或有未保存内容，阻止生成。

## 4. 事故与反思 (Post-Mortem)

- **Timeline**：
  - 10:00 用户反馈“写好的章节保存后变回了旧版本”。
  - 10:30 排查日志，发现 `normalizedChapters` 返回的时间戳晚于用户最后一次输入。
  - 11:00 确认由网络高延迟引发：Save 请求耗时 5s，期间用户继续输入，Save 成功后前端盲目使用后端返回的“旧”内容覆盖了编辑器。
- **Root Cause**：保存成功的回调逻辑过于简单粗暴，直接用后端返回的全量数据重置了编辑器，未考虑到“保存期间的新输入”。
- **Action Item**：
  - 优化保存回调逻辑：仅更新元数据（如 `lastSavedAt`, `version`）和 `baselineHash`，**不**重置编辑器内容，除非后端明确返回了“清洗”后的数据（如 HTML 格式化）。
  - 引入 `Optimistic UI`：保存期间假定成功，减少界面冻结感，但在失败时需有回滚机制。

## 5. 知识库 (Wiki / Snippets)

- **TinyMCE 性能优化配置**：
  ```javascript
  // 移除不必要的插件以提升加载速度
  const editorConfig = {
    plugins: "lists link image table code help wordcount", // 仅保留核心
    toolbar: "undo redo | formatselect | bold italic | alignleft aligncenter",
    menubar: false, // 禁用菜单栏
    entity_encoding: "raw", // 避免特殊字符转义导致长度不一致
  };
  ```
- **SSE 解析正则**：
  处理 SSE 消息时，需注意粘包和分包问题。
  ```typescript
  const parseSSE = (chunk: string) => {
    return chunk
      .split("\n\n")
      .filter(Boolean)
      .map((line) => line.replace(/^data: /, ""))
      .map((json) => JSON.parse(json));
  };
  ```
