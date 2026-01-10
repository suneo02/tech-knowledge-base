## 目标
- 补全高质量注释（JSDoc + 关键逻辑解释），符合项目文档规范
- 复用已有 DOM 工具与统一调度，减少自实现与重复代码
- 拆分滚动策略与位置计算为纯函数，提升可测试性与可维护性

## 现状与改进点
- 现状：`useAutoScrollOnStreaming` 自建 MutationObserver 与 RAF 调度，部分 DOM 计算未复用 `editorDomUtils`
- 改进：统一接入外部组件渲染调度器（RAF 批量回合），复用 `editorDomUtils`/`positionCalculator`/`rafThrottle`

## 具体改动
1. 注释完善
- 为 `useAutoScrollOnStreaming` 增加 JSDoc、参数/返回说明、策略判定与边界处理说明
- 为关键纯函数补充注释：计算目标元素、滚动判定、滚动执行

2. 复用项目 DOM 逻辑
- 用 `hooks/utils/editorDomUtils` 的 `getEditorFrameOffset`/`getElementViewportPosition` 替代手写计算
- 用 `hooks/utils/rafThrottle` 替代自写 RAF 防抖/合并

3. 抽象拆分
- 新增内部纯函数：
  - `computeStreamingTargetElement(editor, activeChapters)`：返回最后一条处于生成中的章节的最后内容节点
  - `shouldAutoScroll(win, targetBottom, { policy, threshold })`：策略判定（smart/always/off）
  - `performSmoothScroll(element)`：执行平滑滚动（带 try/catch 兜底）
- 将 MutationObserver 仅负责“通知变化”，滚动逻辑由上述纯函数计算+执行

4. 统一调度接入
- 轻改 `useExternalComponentRenderer`：暴露 `registerRenderer` 与 `requestRender`（已有内部函数），供外部特性注册
- 在 `ReportEditor` 中将自动滚动注册为一个外部渲染器：
  - `useAutoScrollOnStreaming(editorRef, { activeChapters, registerRenderer, requestRender, policy, threshold })`
  - 由外部渲染器统一在一个 RAF 回合中：先更新浮层位置 → 再执行滚动，避免顺序竞态

## 测试与验证
- 单测：smart 策略阈值判定、always/off 行为、目标元素选择正确性
- 集成：与 `useChapterLoadingOverlay` 同时工作时，滚动在同一帧执行且无抖动

## 受影响文件
- `apps/report-ai/src/components/ReportEditor/hooks/useAutoScrollOnStreaming.ts`
- `apps/report-ai/src/components/ReportEditor/hooks/useExternalComponentRenderer.tsx`
- `apps/report-ai/src/components/ReportEditor/index.tsx`

## 交付结果
- 注释齐全、逻辑清晰、复用统一 DOM 工具与调度
- 自动滚动行为稳定且可配置；同一帧内与 Loading 浮层协同更新