# 数据与状态（横向·三层指南）

> 目标：用“Canonical 事实层 → 前端数据层 → 展示层桥接”三段结构描述文档编辑器的核心数据流，让横向技术概念清晰可循，再由纵向场景文档补充操作细节。

## 文档定位

- 范围：整理报告正文在 TinyMCE 场景下的数据分层、哈希判定、注水与 Single-Flight 保存机制。
- 假设：单人单端编辑；保存为全量上传；无实时协同；失败需可恢复。
- 关联：互斥流程详见 [lifecycle-flow.md](./lifecycle-flow.md)，生成专篇见 [full-generation-flow.md](./full-generation-flow.md)。

## 快速索引

| 需求                                   | 跳转                                                                                   |
| -------------------------------------- | -------------------------------------------------------------------------------------- |
| 初次打开或重注水涉及哪些层？           | §1.2 + §2.2                                                                            |
| Canonical 与 Draft 如何分工？          | §1.1 + §2.1                                                                            |
| 文档级哈希与保存状态从哪里来？         | §2.3–§2.5                                                                              |
| 提交保存时的数据快照包含什么？         | §2.4                                                                                   |
| 展示层如何得知最新结构与状态？         | §3                                                                                    |
| 关键场景触发哪些校验？                 | §4（并进一步查阅纵向文档）                                                             |
| 需要监控哪些指标？                     | §5                                                                                    |

---

## 1. Canonical 事实层

### 1.1 数据模型

| 字段/概念                    | 说明                                                                                              |
| --------------------------- | ------------------------------------------------------------------------------------------------- |
| `chapters: RPDetailChapter[]` | 章节树（`chapterId`, `parentId`, `order`, `title`, `content`, `aigcContent`），是唯一可持久化正文 |
| `reportMeta`                | `reportId`, `reportName`, `owner`, `reviewStatus` 等元数据，供 UI 与权限判断使用                  |
| `parsedRPContentMessages`   | AIGC 生成会话展示数据（当前实现为数组，未来计划升级为 `generationSession`）                      |
| `idMap`                     | 保存成功后返回的新旧章节 ID 映射，用于替换临时节点                                                |
| `baselineDocHash`           | 文档级基线哈希，保存成功或生成完成后刷新                                                          |

特性：

- Canonical 由后端返回或保存成功后刷新，前端不直接编辑。
- 任何派生层（Draft、LiveOutline、展示）都以 Canonical 为最终真相。

### 1.2 生命周期

| 时机               | 行为                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------ |
| 初始化/还原        | 拉取 Canonical，组合完整 HTML，触发全量注水，重置 `baselineDocHash`                                    |
| 用户保存成功       | 后端返回规范化结果 → Canonical 与 `baselineDocHash` 同步 → Draft 清空                                   |
| 全文/章节生成完成  | 生成结果直接落入 Canonical，并立即刷新基线（不额外触发保存）                                            |
| 历史版本还原       | 先提示保存当前 Draft，随后以历史 Canonical 替换并重新注水                                               |

> 纵向流程的互斥与校验见《内容生命周期与交互控制》第 3–4 节。

### 1.3 AIGC 会话缓存

- `parsedRPContentMessages` 保存流式消息，用于流式预览和日志展示。
- 生成完成后，HTML/结构合并进 Canonical，该数组清空（待后续升级为 `generationSession`）。
- 生成失败时保留消息，以便定位问题或重试。

---

## 2. 前端数据层

前端数据层由 Redux store 维护，负责 Draft 缓冲、注水排程、哈希与单飞保存。

### 2.1 Draft Tree（DocumentDraft）

- 结构：`draftTree?: ReportDetailChapterDraft[]`，节点与 Canonical 对齐，只记录 `chapterId`, `title`, `order`, `dirty`, `baselineHash` 等轻量信息。
- 触发：TinyMCE `onChange` → 规范化 HTML → diff/哈希 → 若与基线不同则生成/更新节点。
- 清理：保存成功、重注水或生成完成后清空 Draft，`hasDirty` 重置为 `false`。
- 职责：告知 UI 何处存在脏数据，供 LiveOutline/状态指示使用。

### 2.2 Hydration 状态

- `pendingHydrateChapters (correlationId → chapterId)`：章节级注水队列。
- `currentTask`：`full-init` / `full-rehydrate` / `chapter-rehydrate` / `streaming-preview` 等任务。决策在 store，执行由 `useHydrationExecutor` 完成。
- `lastHydratedEpoch`、`needsRehydration`：保证“谁决策 / 谁执行”分离，便于排查注水卡顿。
- 详情参阅 [HYDRATION.md](../../../src/store/reportContentStore/HYDRATION.md)；本文只描述与 Draft/保存的关系。

### 2.3 规范化与文档级哈希

1. TinyMCE 内容经过 DOM 规范化（去除噪音属性、统一空段落、排序属性）。
2. 将规范化 HTML 计算为 `currentDocHash`。
3. 与 `baselineDocHash` 对比：
   - 相等 → `hasDirty = false`，Draft 清空。
   - 不等 → `hasDirty = true` 并记录 `lastDirtyAt`。
4. 防抖 300–500ms，避免频繁 DOM ↔ 字符串转换。

规范化规则需配套单元测试，确保升级 TinyMCE 时可验证。

### 2.4 保存流程（全量 + Single-Flight）

1. **触发条件**：`hasDirty = true` 且无进行中的保存请求；来源可以是自动保存、手动保存、离开页面前置校验或生成前置校验。
2. **构建快照**：
   - HTML → 章节树（解析新旧章节，包含临时 ID）。
   - 合并 Draft metadata（dirty 标志、baselineHash）。
   - 形成 `payload = { chapters, outline, docHash, draftMeta }`。
3. **单飞串行**：`inFlight = true`，阻止下一次保存；保存期间允许用户继续输入，但只记录新的 Draft。
4. **成功**：
   - 后端返回 `normalizedChapters`, `idMap`, `serverMeta`。
   - Canonical 刷新，`baselineDocHash = currentDocHash`。
   - Draft 清空，`hasDirty = false`。
5. **失败**：
   - `documentStatus = 'error'`，保持 Draft 和 editor 文本不变。
   - UI 提示可重试；下一次触发仍需等待前一次完成。

### 2.5 状态枚举

| 状态字段          | 含义                                    | 典型读者                      |
| ----------------- | --------------------------------------- | ----------------------------- |
| `hasDirty`        | 是否存在未保存修改                      | 顶部状态徽标、离开页面守卫    |
| `documentStatus`  | `idle` / `saving` / `error` / `readonly` | 保存按钮、自动保存调度        |
| `lastSyncAt`      | 最近一次保存成功时间                     | 自动保存节奏、监控            |
| `inFlight`        | 是否有保存请求在途                      | 生成前置校验、自动保存调度    |

### 2.6 与生成/重生成的配合

- 生成前若 `hasDirty = true`，会强制触发保存并等待 ACK；失败则阻断生成。
- 生成期间 `documentStatus = 'readonly'`，阻止新的保存和编辑，直到注水完成。
- 章节重生成遵循相同逻辑，但只清空目标章节并派发章节级注水任务。

### 2.7 保存触发来源

| 来源             | 触发条件                                         | 说明                                           |
| ---------------- | ------------------------------------------------ | ---------------------------------------------- |
| 自动保存         | `hasDirty = true` 且距离上次成功超过阈值         | 阈值默认 30–60 秒，可根据行为自适应            |
| 手动保存         | 用户点击按钮                                    | 立即进入单飞流程                               |
| 路由/离开页面守卫 | `hasDirty = true`                               | 询问“保存并离开 / 放弃 / 取消”，分别调用保存/清空 |
| AIGC 生成前置    | `hasDirty = true` 或 `inFlight = true`           | 等待保存完成后再执行生成                       |

---

## 3. 展示层桥接

展示层由 LiveOutline、OutlineVM、渲染/解析函数共同完成，确保 Canonical 与 TinyMCE DOM 双向同步。实现细节可结合 [../RPEditor/rendering-and-presentation-guide.md](../RPEditor/rendering-and-presentation-guide.md) 阅读。

### 3.1 LiveOutlineState

- 字段：`chapters`, `parsing`, `error`, `lastParsed`, `contentHash`, `enabled`。
- 数据源：
  - `hasDirty = false` → 直接使用 Canonical 章节树渲染。
  - `hasDirty = true` → 优先使用 Draft Tree 以反映暂存结构/标题。
- 作用：驱动左侧大纲、章节导航、状态提示。

### 3.2 OutlineVM

`OutlineVM = LiveOutline ⊕ 文档状态 ⊕ Canonical.meta`，UI 一次性获取：

- 章节结构与标题（来自 LiveOutline）。
- 文档级状态（dirty/saving/error）。
- 负责人、审核状态等元数据（来自 Canonical）。

保存成功后，`idMap` 应用于 OutlineVM，确保临时章节 ID 替换后导航仍正确。

### 3.3 Baseline-Lite（可选）

- 轻量指纹（`epoch`, `headingsHash`）用于调试不同来源的派生结果。
- 默认不开启，如需排查 diff 丢失可局部启用。

### 3.4 渲染/解析桥接

- **渲染**：`renderChapter`, `renderFullDocument` 生成 HTML，注水执行器通过 `setFullContent` 或 `updateChapterContent` 写入 TinyMCE。
- **解析**：`parseDocumentChapterTree` 读取 TinyMCE DOM，识别 `data-chapter-id`，为保存流程提供结构快照。
- **流式状态**：章节生成时使用 `setChapterLoading`、`applyStreamingUpdate` 控制 `pending/receiving/finish`，保持光标与滚动稳定。

---

## 4. 操作触发与防护（横向视角）

> 详细流程请参考纵向文档：生成场景见《全文生成流程》，编辑/保存场景将拆分为新文档。此处只列出与数据层直接相关的关口。

| 场景             | 关键校验                                                                                   | 数据层影响                                       |
| ---------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| 初始化 / 还原    | 确认 Canonical 与 Draft 同步；若注水失败保持只读                                           | `hasDirty = false`，重置 `draftTree`             |
| 自动 / 手动保存  | `hasDirty = true` 且 `inFlight = false`                                                     | 进入单飞，成功后刷新基线                         |
| 全文 / 章节生成  | `hasDirty = false` 且无保存 in-flight；生成期间 `documentStatus = 'readonly'`                | 生成完成直接写 Canonical，清空 Draft             |
| 历史版本 / 还原  | 提示保存或放弃；保存失败则保持原状                                                        | 成功后以新 Canonical 重注水                      |
| 离开页面 / 路由  | 若 `hasDirty = true` 弹窗；选择保存则等待 ACK，放弃则清空 Draft                            | 依据用户选择保留或丢弃 Draft                     |

---

## 5. 性能与监控

- **规范化与哈希**：O(n) 实现，防抖 300–500ms；监控哈希耗时和失败率。
- **自动保存节奏**：记录触发间隔、payload 大小、成功率，动态调整阈值（网络差时放宽）。
- **Single-Flight**：日志包含 `docHash`, `txId`, `duration`, `payloadBytes`；失败类型（规范化失败、网络异常、后端返回错误）需分级告警。
- **断网/离线**（可选）：若接入 IndexedDB，需在恢复时比对 `currentDocHash` 与离线快照再触发保存。

---

## 6. 相关代码实现

- [Hooks 架构说明](../../../src/store/reportContentStore/hooks/README.md)
- [useEditorDraftSync](../../../src/store/reportContentStore/hooks/useEditorDraftSync.ts)
- [useReportContentPersistence](../../../src/store/reportContentStore/hooks/useReportContentPersistence.ts)
- [Hydration 运行手册](../../../src/store/reportContentStore/hooks/rehydration/HYDRATION.md)
- [Selectors 文档](../../../src/store/reportContentStore/selectors/README.md)

> 一句话总结：仅持久化 Canonical 与极简 Draft，依靠规范化 + 文档级哈希判定脏数据，通过单飞保存维持基线，再由 LiveOutline 与渲染/解析桥接到展示层，确保任意场景都能回到唯一真相。
