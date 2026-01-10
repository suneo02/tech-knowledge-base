# 聊天窗口滚动优化 (Chat Scroll Optimization)

> 核心目标：消除 AI 流式输出过程中的页面抖动与自动上滑问题。

## 1. 问题与解决

| 问题现象                | 根因分析                                                                                                                    | 解决方案                                                                                                                                  |
| :---------------------- | :-------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| **页面抖动 / 自动上滑** | **DOM 不稳定 + Scroll Anchoring 冲突**。<br>特别是 `SplTableCard` 组件的快速挂载/卸载，导致浏览器错误地触发了视口锁定机制。 | 1. **移除**不稳定的 `SplTableCard` 逻辑。<br>2. **CSS**: 容器设置 `overflow-anchor: none`。<br>3. **JS**: 优化 `useScrollToBottom` 钩子。 |

## 2. 深度分析

关于“为什么只有特定高度复现”及“不同设备表现不一致”的详细原理解析，请参阅：
👉 [滚动异常深度分析 (scroll-issue-analysis.md)](scroll-issue-analysis.md)

## 3. 相关代码

- Hook: `packages/gel-ui/src/hooks/useScrollToBottom.ts`
- Component: `apps/ai-chat/src/components/SuperList/ChatMessage/index.tsx`
