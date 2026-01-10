# 章节标题 Loading 指示 - 核心方案 v1

> 回链：[README.md](./README.md)  
> 状态：🟡 方案评审

## 1. 背景与问题

- 全文、顺序多章、单章重生入口分别由 `useFullDocGeneration`、`useMultiChapterGeneration`、`useChapterRegeneration` 触发，都会调用 `startChapterOperation` 清空章节内容，但没有任何视觉反馈。@see apps/report-ai/src/store/reportContentStore/hooks/useFullDocGeneration.ts:45 @see apps/report-ai/src/store/reportContentStore/hooks/useMultiChapterGeneration.ts:62 @see apps/report-ai/src/store/reportContentStore/hooks/useChapterRegeneration.ts:43
- 队列调度和流式注水由 `useFullDocGenerationController`、`useRehydrationOrchestrator` 与 `useChapterStreamPreview` 执行，所有状态刷新仅依赖 `updateStreamingSection` 写正文，没有插入 Loading 容器。@see apps/report-ai/src/store/reportContentStore/hooks/useFullDocGenerationController.ts:35 @see apps/report-ai/src/pages/ReportDetail/ReportContent/index.tsx:71 @see apps/report-ai/src/store/reportContentStore/hooks/rehydration/useChapterStreamPreview.ts:28
- `useLoadingPlaceholders` 只会在匹配到 `[data-loading="true"]` 容器时渲染 `<AliceGenerating/>`，但当前 DOM 从未写入该属性，导致加载组件从未出现。@see apps/report-ai/src/components/ReportEditor/hooks/useLoadingPlaceholders.tsx:25 @see apps/report-ai/src/components/common/Generating/index.tsx:7
- `applyStreamingUpdate` 在 `pending/receiving` 分支仅清空或写入正文，并调用 `setChapterLoading` 切换标题 class，既未创建挂载点也未唤起外部渲染；`renderComponents` 只在 `ContentSet` 与章节 hover 时触发，无法感知新的 Loading 节点。@see apps/report-ai/src/domain/reportEditor/chapter/ops.ts:145 @see apps/report-ai/src/components/ReportEditor/hooks/useExternalComponentRenderer.tsx:63

## 2. 目标与非目标

### 2.1 目标

1. 任一章节进入 AIGC（`pending` 或 `receiving`）时，立即在标题正下方渲染 `AliceGenerating`，并提供 `停止` 按钮回调到 `ReportContent`。
2. Loading 指示由全文、顺序多章、单章重生成共享，切换章节时自动迁移，无需额外业务分支。
3. Loading 作为 iframe 外部的浮层渲染（定位到标题下方），不改动编辑器正文 DOM，也无需写入任何 `data-gel-external` 属性。
4. 生成完成、取消或失败后 1 帧内移除挂载点，`cleanupOrphanLoadingPlaceholders` 可以幂等清理。

### 2.2 非目标

- 不改动 Outline/章节列表中的 Loading 展示；只关注编辑器正文。
- 不重构队列/幂等逻辑；沿用 `ChapterOperationHelper` 与 `GenerationOrchestrator`。
- 不扩展新的 AIGC 状态机，仅在现有 `idle/pending/receiving/finish` 上工作。

## 3. 场景与触发

| 场景         | 触发链路                                                                                                                         | Loading 生命周期                                                                         | 关联状态                                               |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| 单章重生成   | Outline / AIGC 按钮 → `useChapterRegeneration.startRegeneration` → `globalOp.kind = chapter_regeneration`                        | `startRegeneration` 后立即创建 slot；`processSingleChapterCompletion` 成功或失败后移除。 | `hydration.latestRequestedOperations`、`chapterStates` |
| 顺序多章生成 | 勾选章节 → `useMultiChapterGeneration.startGeneration` → `globalOp.kind = multi_chapter_generation`                              | 当前 `queue[currentIndex]` 挂载 Loading；推进索引时旧章节移除、新章节创建。              | `globalOp.data.queue/currentIndex`                     |
| 全文生成     | Header 按钮 → `useFullDocGeneration.startGeneration` → `useFullDocGenerationController` 调度 → `globalOp.kind = full_generation` | 遍历所有叶子章节按顺序复用；完成后全部卸载。                                             | `selectFullDocGenProgress`                             |

## 4. 现状差距

1. **缺少挂载点**：`generateLoadingHTML` 虽已定义，但从未在客户端注入，`loadingPlaceholderDomUtils` 获取不到任何容器。@see apps/report-ai/src/domain/reportEditor/chapter/render.ts:255 @see apps/report-ai/src/components/ReportEditor/hooks/utils/loadingPlaceholderDomUtils.ts:97
2. **渲染触发缺席**：就算未来插入 DOM，占位 Hook 也不会在流式写入后自动运行，因为 `renderComponents` 与 AIGC 状态无关。@see apps/report-ai/src/components/ReportEditor/index.tsx:60
3. **清理链路不可见**：`cleanupOrphanLoadingPlaceholders` 只有在再次调用 `renderLoading` 时才会运行，若无统一刷新则可能残留空 root。@see apps/report-ai/src/components/ReportEditor/hooks/utils/loadingPlaceholderDomUtils.ts:119

## 5. 方案设计

### 5.1 外部组件渲染拆分

- 放弃向正文写入任何占位 DOM，Loading 作为全局浮层渲染，类似 AIGC 按钮与文本改写预览。
- 新增 `useChapterLoadingOverlay.tsx`（命名沿用现有 hooks 目录规范），职责：
  1. 订阅 `selectChapterAIMessageStatusMap` 或 `selectIsChapterAIGCOp`，计算「需要展示 Loading」的章节集合。
  2. 通过 `useChapterHoverWithInit` 暴露的 `getChapterRects`（或直接读取 `element.getBoundingClientRect()`）计算标题位置。
  3. 在 `document.body` 创建/复用容器，渲染 `<AliceGenerating/>`，样式与 `useAIGCButton` 一致走 absolute 定位，无需撑开正文。
- 该 hook 注册到 `useExternalComponentRenderer` 的 scheduler，下沉到统一 raf 调度，与 `useAIGCButton` / `useTextRewritePreview` 共享节流策略。@see apps/report-ai/src/components/ReportEditor/hooks/useExternalComponentRenderer.tsx

### 5.2 状态订阅与通信

- 以 `useRPDetailSelector(selectChapterAIMessageStatusMap)` 为核心数据源。Map 中状态为 `pending/receiving` 时即认为章节需要 Loading。@see apps/report-ai/src/store/reportContentStore/selectors/composition.ts:74
- `useExternalComponentRenderer` 扩展注册接口：
  - `registerExternalComponent({ id: 'chapter-loading', render: (ctx) => void })`。
  - Scheduler 在 `renderComponents` 时依次调用注册的渲染器，传入当前章节状态及编辑器 facade。
- Loading hook不需要 await 流式写入成功，只要 redux 状态进入 pending 即开始渲染，finish/idle 时卸载 React root。Stop 行为仍通过 props `onStop` 传出。

### 5.3 定位策略

- 复用 `useChapterHoverWithInit` 中封装的 DOM 查询工具：`findChapterHeading` + `getBoundingClientRect`，并结合 `useAIGCButton` 的 `getEditorFrameOffset` 计算 iframe 偏移，保证 Loading 面板与标题底边对齐。@see apps/report-ai/src/components/ReportEditor/hooks/useChapterHoverWithInit.tsx
- Overlay 样式：`position: absolute`，宽度撑满标题，或根据需求固定 320px 并水平居中；不改动正文布局，没有 margin/placeholder。
- 当章节标题离开视口或生成完成，Hook 调用 `root.unmount()` 并回收容器。

### 5.4 Scheduler 适配

- `useExternalComponentRenderer` 增加 `registerRenderer` 和 `renderRegisteredComponents()` 两个 API：
  - 默认注册 AIGC 按钮与 Loading Overlay，后续扩展适配文本改写或 Citation 组件。
  - Scheduler 仍在 `Promise.resolve().then(requestAnimationFrame)` 中执行，避免 TinyMCE 流式更新冲突。
- `ReportEditorRef` 暴露 `renderExternalComponents(scope?: 'all' | 'loading')`，供流式注水（`useChapterStreamPreview`）和其他业务在状态更新后主动触发重渲染。

### 5.5 生命周期与资源回收

- Loading Hook 需要维护 `Map<string, Root>`（章节 -> React root），与 `useAIGCButton` 一致在组件卸载或章节状态回落时清理。
- `cleanup` 只影响 `document.body` 中的浮层容器，不改动编辑器内部 DOM，自动避免 `removeExternalRenderingNodes` 干扰。
- `onStop` 点击后仍调用 `options.onStop(sectionId)` 交回 `useChapterRegeneration`/`useMultiChapterGeneration` 处理。

## 6. 实施拆解

| 步骤 | 任务                                                                                                | Owner | 输出/交付物                                                             | 依赖                               |
| ---- | --------------------------------------------------------------------------------------------------- | ----- | ----------------------------------------------------------------------- | ---------------------------------- |
| P1   | 创建 `ensure/removeChapterLoadingSlot`，改造 `applyStreamingUpdate`，补充单元测试（dom-utils 层面） | 前端  | 新 helper + 回归 `chapter/ops` 测试样例                                 | `loadingPlaceholderDomUtils`       |
| P1   | 提供 `registerRenderer` 能力并在 `useExternalComponentRenderer` 中调度                              | 前端  | API 设计、单测、对现有按钮/预览 hook 的兼容性验证                       | `useExternalComponentRenderer.tsx` |
| P2   | 新增 `useChapterLoadingOverlay` hook，实现章节状态订阅、容器管理、定位与 Stop 回调                  | 前端  | Hook/样式文件、React root map 管理、单元测试/Story                      | P1                                 |
| P3   | 扩展 `ReportEditorRef` & `useChapterStreamPreview`，在流式写入后通知 scheduler 重渲染               | 前端  | 类型定义、Ref 暴露、调用链联调                                          | P1                                 |
| P4   | 多模式联调&回归：单章、顺序多章、全文生成；验证 Stop、保存、撤销互不影响                            | 前端  | 手册 + 截图/录屏；QA checklist；必要的 Playwright/Vitest 覆盖（如可行） | P1/P2/P3                           |

## 7. 验收要点

- 触发任一生成操作后，编辑器章节标题下立即出现 `AliceGenerating`，且 Stop 按钮调用 `onStopGenerating`。
- 顺序多章/全文生成切换到下一章节时，旧章节 Loading 在下一帧消失，新章节出现。
- 生成完成或取消后，DOM 中不存在 `[data-loading="true"]` 元素，`cleanupOrphanLoadingPlaceholders` 不会残留 root。
- 调用 `ReportEditorRef.getContent()` 或自动保存时，返回的 HTML 不含 Loading 节点（验证 `data-gel-external="loading"` 被过滤）。
- 手动停止或失败后可立即重新触发生成，Loading slot 能够重复创建并销毁。

## 8. 风险与关注

- **大量章节写入**：全文生成会高频创建/销毁容器，需确认 `ensure/remove` 操作在 TinyMCE 事务内执行，避免触发额外 `change` 事件。
- **外部渲染刷新频率**：`renderExternalComponents` 触发过于频繁可能与 hover 按钮抢占 RAF，需要限制仅在 Loading 作用域刷新。
- **内容清洗**：必须确保新容器带上 `data-gel-external="loading"`（或 `data-mce-bogus="1"`）以便 `removeExternalRenderingNodes` 排除，避免导出混入 Loading DOM。@see apps/report-ai/src/domain/reportEditor/editor/contentSanitizer.ts:38
- **Stop 行为一致性**：Stop 回调需与队列控制（`cancelMultiChapterGeneration`、`interruptFullDocumentGeneration`）联动，否则 Loading 可能停留在 `pending` 状态，需要在实现阶段补充。
