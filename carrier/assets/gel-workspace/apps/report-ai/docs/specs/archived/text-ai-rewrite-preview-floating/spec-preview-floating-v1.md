# 悬浮预览组件方案 - 文本 AI 重写

> 📖 回链：[任务概览](./README.md) | 阶段：方案设计 & 实施

## 背景

- 文本改写需要在生成过程中向用户展示最新结果，但 TinyMCE 内部注水会破坏现有段落结构。
- 选区位置相对复杂，复用章节级预览会引入大量 DOM 操作和状态耦合。
- 因此抽离独立悬浮组件，专注定位、渲染与确认动作，主流程仅关心数据与决策。

## 设计目标

- 定位稳定：跟随选区附近展示，避免遮挡，视口不足时自动调整。
- 渲染解耦：使用既有 `AIAnswerMarkdownViewer` 作为渲染层，支持流式更新。
- 决策闭环：生成完成后提供“应用 / 取消”双按钮，并向主流程回调。
- 易于降级：定位失败或渲染异常时快速切换到对话窗方案。

## 约束与假设

- 调用方提供 `SelectionSnapshot`（包含 range、boundingClientRect、上下文摘要）。
- 主流程负责生成预览内容与完成信号，此组件只消费数据。
- 同一时间仅存在一个改写会话，对应一个预览实例。

## 方案概述

### 生命周期

1. `useTextRewrite` 触发改写后调用 `mountPreview(snapshot)`，创建容器并渲染占位骨架。
2. 流式消息通过 `updatePreview(contentChunk)` 推送给组件，组件进行节流合并。
3. 完成信号到达后显示最终内容与操作按钮，并停止骨架动画。
4. 用户点击“应用”或“取消”，组件通过回调告知主流程，并执行 `unmountPreview()`。

### 定位策略

- 初次渲染时根据选区矩形计算首选位置（下方优先，上方备选）。
- 监听窗口滚动与尺寸变化，超出可视范围时自动重新定位。
- 边界处理：若四周空间均不足，切换到固定居中布局并提示用户。
- 参考实现：`useAIGCButton` 与 `useExternalComponentRenderer` 提供的定位与容器管理模式。

### 内容渲染

- 使用 `AIAnswerMarkdownViewer` 渲染 Markdown 文本，并在加载阶段显示骨架屏。
- 对流式内容进行 100ms 节流合并，避免频繁 re-render。
- 支持空内容占位，首条消息到达时展示提示文案“正在生成…请稍候”。

### 交互设计

- 按钮配置：主按钮“应用”、次按钮“取消”，提供 `Enter` / `Escape` 快捷键。
- 组件内展示选区摘要（前后若干字符），帮助用户确认上下文。
- 超时策略：30 秒未决策时自动调用“取消”，并提示重新发起。

## 实施要点

- 封装 `useFloatingRewritePreview` Hook，对外暴露 `mount/update/complete/abort` 四个方法。
- 通过 `ReactDOM.createPortal` 将组件挂载在 `document.body`，避免编辑器样式干扰。
- 统一在 Hook 销毁时调用 `unmount`，防止内存泄漏。
- 与主流程约定返回结构 `{ decision: 'apply' | 'cancel', content }`，保持纯数据回调。

## 验证计划

- 单测：定位函数输入不同矩形，断言位置选择与边界处理。
- 集成：模拟改写流程，验证 `mount → update → complete → unmount` 顺序调用。
- 手动：在小屏、滚动、长文档等场景下检查定位与快捷键行为。

## 风险与降级

1. **定位抖动**：滚动时组件闪烁 → 增加 150ms debounce 并锁定动画。
2. **内容溢出**：长文本撑开容器 → 设置最大高度 + 滚动条。
3. **Hook 未释放**：异常中断导致残留 → 在主流程 finally 阶段统一调用 `unmount`。
4. **渲染失败**：Markdown 解析异常 → 捕获错误，降级输出纯文本。

## 相关文档

- [方案设计 - 文本 AI 重写](../text-ai-rewrite-implementation/spec-design-v1.md)
- [实施拆解 - 文本 AI 重写](../text-ai-rewrite-implementation/spec-implementation-v1.md)
- `apps/report-ai/src/components/ReportEditor/hooks/useAIGCButton.tsx` @see 定位逻辑
- `packages/ai-ui/src/md/index.tsx` @see Markdown 渲染组件

## 更新记录

| 日期       | 修改人 | 更新内容                   |
| ---------- | ------ | -------------------------- |
| 2025-11-04 | Codex  | 创建预览组件独立方案与计划 |
