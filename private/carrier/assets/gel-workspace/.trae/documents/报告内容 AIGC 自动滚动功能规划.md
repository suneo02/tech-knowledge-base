## 背景与目标
- 在章节 AIGC 流式生成时，页面自动滚动，使最新生成内容始终可见
- 默认开启智能滚动，不打扰用户主动上滑查看旧内容
- 面向 `ReportEditor` 与 `ReportDetail/ReportContent` 场景，复用现有外部浮层与位置工具

## 范围与非目标
- 范围：章节级流式生成的滚动联动、完结后的位置稳定、平滑体验
- 非目标：聊天消息区滚动、PDF 预览滚动、移动端特殊适配

## 用户体验
- 智能滚动：当章节处于 `pending/receiving`，且用户未上滑远离，自动跟随至章节底部
- 平滑过渡：编辑器 iframe 使用平滑滚动 `scroll-behavior: smooth`，减少跳动
- 打断策略：用户手动滚动超过阈值或选择文本时，暂停跟随；点击“停止生成”后不再滚动

## 关键交互流程
1. 章节进入 `pending/receiving`，显示章节底部 Loading 浮层（已有）
2. 监听编辑器 DOM 变更，计算章节底部位置
3. 检查用户滚动与选择状态，满足条件则滚动至最新生成位置
4. 章节 `finish` 后，停止滚动，清理浮层

## 现状梳理（代码参考）
- 编辑器挂载与事件绑定：`apps/report-ai/src/components/ReportEditor/index.tsx:112-141`
- 外部浮层调度器：`apps/report-ai/src/components/ReportEditor/hooks/useExternalComponentRenderer.tsx:289-316`
- 章节 Loading 浮层与 DOM 监听：`apps/report-ai/src/components/ReportEditor/hooks/useChapterLoadingOverlay.tsx:47-79, 94-137`
- 章节底部位置计算：`apps/report-ai/src/components/ReportEditor/hooks/chapterPositionUtils.ts:47-87`
- 平滑滚动样式：`apps/report-ai/src/components/ReportEditor/styles/index.module.less:33-36`
- 流式更新入口（供数据编排器调用）：`apps/report-ai/src/components/ReportEditor/hooks/useReportEditorRef.ts:196-209`
- 页面向编辑器传入章节 Loading 状态：`apps/report-ai/src/pages/ReportDetail/ReportContent/index.tsx:49-51, 241-242`

## 技术方案
- 策略接口：在 `ReportEditor` 增加 `autoScrollPolicy` 与阈值配置
  - `autoScrollPolicy`: `smart | always | off`，默认 `smart`
  - `autoScrollThresholdPx`: 用户上滑距离阈值，默认 `120`
- 新增 Hook：`useAutoScrollOnStreaming(editorRef, { activeChapters, policy, threshold })`
  - 监听 `activeChapters` 与编辑器 `MutationObserver`（与 Loading 复用同一调度），在下一帧执行滚动
  - 使用 `getChapterBottomPosition` + `getEditorFrameOffset` 计算目标位置
  - 根据策略判断是否滚动：
    - `smart`：当最后一屏接近底部且用户未上滑到超过阈值时滚动
    - `always`：只要处于 `pending/receiving` 就滚动
    - `off`：不滚动
  - 滚动实现：优先选择章节最后元素 `scrollIntoView({ behavior: 'smooth', block: 'end' })`，否则滚动主窗口到 `bottom` 位置
- 复用调度：在 `useExternalComponentRenderer` 内注册渲染器，利用统一 `RAF` 批量调度，避免竞态

## 组件改动点
- `ReportEditor`
  - 新增 props：`autoScrollPolicy?`, `autoScrollThresholdPx?`
  - 在 `useExternalComponentRenderer` 调用后，挂载 `useAutoScrollOnStreaming` 并传入 `aigcLoadingChapters`
- `ReportDetail/ReportContent`
  - 暂保留现状，仅在需要时传入配置（默认不需改动）

## 滚动判定细则
- 用户上滑检测：记录编辑器 iframe 的滚动位置与最大高度，当 `viewportBottom < contentBottom - threshold` 判定为上滑
- 文本选择检测：若编辑器有选区且选区锚点不在当前生成章节，暂停滚动
- 连续滚动防抖：统一通过外部渲染器的 `microtask + RAF`，每帧仅一次滚动计算

## 性能与稳定性
- 单一 RAF 调度，避免多源滚动竞争
- 在 `receiving` 高频 DOM 变更时，MutationObserver 只触发一次合并渲染
- 异常兜底：章节未找到、编辑器未就绪时跳过滚动

## 测试计划
- 单元测试
  - `receiving` 时触发滚动：模拟 DOM 变更，断言 `scrollIntoView` 被调用
  - `smart` 策略下上滑超过阈值不滚动
  - 完结状态停止滚动
- 集成测试
  - 结合 `useRehydrationOrchestrator`，流式注水 → 自动滚动 → 完结
- 位置计算测试
  - `getChapterBottomPosition` 在章节含多种节点时返回正确 bottom

## 可观测性
- 控制台日志：在调试模式打印滚动判定与实际动作
- 指标采集（可选）：滚动次数、被打断原因（上滑/选区）

## 交付验收标准
- 在章节 AIGC 流式生成过程中，最新内容始终自动进入视口
- 用户手动上滑或选择文本后，滚动不再打扰
- 完结后页面保持稳定，不发生“回弹”
- 平滑滚动，无明显抖动或跳动

## 风险与回滚
- 风险：与外部浮层位置调度存在顺序依赖
- 缓解：统一在 `RAF` 中先更新浮层位置，再进行滚动
- 回滚：`autoScrollPolicy="off"` 即可临时关闭

## 实施步骤
1. 增加 `autoScrollPolicy`/`autoScrollThresholdPx` props（`ReportEditor`）
2. 实现 `useAutoScrollOnStreaming`，注册到外部渲染器调度
3. 将 `aigcLoadingChapters` 传入该 Hook，联动 `MutationObserver`
4. 编写测试与最小日志，验证三种策略
5. 验收后默认启用 `smart` 策略