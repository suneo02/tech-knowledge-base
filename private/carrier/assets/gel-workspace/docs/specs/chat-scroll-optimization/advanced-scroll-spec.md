# 聊天窗口滚动优化 Spec (进阶版)

## 1. 背景与问题 (Context & Problem)

- **当前局限性 (State-driven)**:
  - 现有的 `useScrollToBottom` 依赖 `messages` 状态更新触发滚动。
  - **滞后性问题**: 在 Markdown 渲染场景下（如图片加载、LaTeX 公式渲染、代码块高亮），DOM 高度变化往往滞后于 React State 更新。此时 `messages` 未变，Hook 不触发，导致用户需要手动补滚才能看到新撑开的内容。
  - **抖动问题**: 即使使用了 `behavior: 'auto'`，若依赖 React Render Cycle，仍可能与浏览器的布局计算产生时序冲突。

- **进阶思路**:
  - 从 **“数据驱动 (State-driven)”** 转向 **“维度驱动 (Dimension-driven)”**。
  - 监听 DOM 的物理几何尺寸变化（ResizeObserver），而非数据变化。

## 2. 目标 (Goals)

- **核心目标**: 实现一个“感知物理高度”的滚动机制，完美支持富文本（图片/公式）的异步高度变化。
- **具体要求**:
  - **全内容支持**: 无论是文本流式输出，还是图片懒加载撑开高度，均能自动吸附底部。
  - **零抖动**: 彻底消除流式过程中的视觉抖动。
  - **智能吸附**: 只有当用户原本就在底部（或极接近底部）时，才自动跟随高度变化；若用户手动上滑查看历史，则保持位置不动。

## 3. 解决方案 (Solution)

### 3.1 架构设计：双层模型 + ResizeObserver

我们需要明确两个 DOM 层的角色：

1.  **Viewport (滚动容器)**:
    - 具有 `overflow-y: auto`。
    - 负责产生滚动条，监听 `scroll` 事件以判断用户意图。
    - **防御性 CSS**: 使用 `overflow-anchor: none` 禁用浏览器原生锚定，完全由代码接管。

2.  **Content (内容容器)**:
    - `Viewport` 的直接子元素，包裹所有消息列表。
    - **被观察对象**: 使用 `ResizeObserver` 监听其高度变化。

### 3.2 逻辑流程

1.  **意图判断 (User Intent)**:
    - 监听 `Viewport` 的 `scroll` 事件。
    - 计算 `distanceFromBottom`。
    - 更新 `isStickToBottom` Ref 标记（若距离 < 阈值，视为吸附态）。

2.  **高度响应 (Dimension Response)**:
    - `ResizeObserver` 监听到 `Content` 高度变化。
    - **检查标记**: 若 `isStickToBottom` 为 `true`。
    - **执行动作**: 强制设置 `viewport.scrollTop = viewport.scrollHeight` (Instant Scroll)。

### 3.3 API 设计 (useScrollToBottom Hook)

保持原有 Hook 签名基本兼容，但内部实现完全重构。

```typescript
interface UseScrollToBottomProps {
  // 不再强依赖 parsedMessages，但在某些 edge case 下可作为辅助触发源
  parsedMessages?: any
  // 阈值配置
  anchorThreshold?: number
}

// 返回值
interface UseScrollToBottomReturn {
  // 绑定到外层滚动容器
  scrollRef: RefObject<HTMLDivElement>
  // 绑定到内层内容容器
  contentRef: RefObject<HTMLDivElement>
  // 手动滚动方法
  scrollToBottom: (behavior?: ScrollBehavior) => void
  // 是否显示“回到底部”按钮
  showScrollBottom: boolean
}
```

## 4. 详细实现要点

### 4.1 ResizeObserver 集成

```typescript
const ro = new ResizeObserver(() => {
  if (isStickToBottom.current && viewportRef.current) {
    // 关键：流式/加载过程中使用无动画的直接跳转
    viewportRef.current.scrollTop = viewportRef.current.scrollHeight
  }
})
ro.observe(contentRef.current)
```

### 4.2 防御性 CSS (Defensive CSS)

在样式文件中必须添加：

```css
.chat-viewport {
  /* 强制接管滚动锚定 */
  overflow-anchor: none;
  /* 防止滚动条出现导致的布局挤压 */
  scrollbar-gutter: stable;
}
```

## 5. 迁移计划

1.  创建新 Spec 文档。
2.  重构 `useScrollToBottom.ts`。
    - 引入 `ResizeObserver`。
    - 增加 `contentRef`。
    - 移除对 `parsedMessages` 的强依赖（仅作为 fallback）。
3.  验证图片加载场景与流式输出场景。
