# ReportContent 页面组件（方案 A）

本页将 ReportContent 在“方案 A = 内容只走 ref 命令；props 仅承载结构/控制”下的职责与操作手册沉淀为文档，不包含代码。

## 组件定位

- 业务大脑：负责三层状态（Canonical/Ephemeral/UI Control）与闸门控制，统一决策“是否、何时覆盖正文”。
- 协调中心：编排初始化、编辑、保存、AI 生成/重生成、并发一致性与错误处理全流程。

## 设计原则

- 决策外置：是否/何时注水完全由页面层判断；编辑器只执行命令。
- 内容非受控：不通过 props 承载 html；仅在外部事件时通过 ref 注水。
- 行为受控：只读/锁定/Loading/高亮等通过 props 传入编辑器。

## 三层状态职责

- Canonical（已确认层）：后端“唯一真相”（ReportChapter：结构 + aigcContent/htmlContent）；仅外部事件或保存 ACK 更新；不随输入抖动。
- Ephemeral（进行层）：本地草稿 LocalDraft（每章一份），承载实时编辑与保存状态机（unsaved → saving → saved/error）。
- UI Control（控制层）：只读、锁定、Loading、保存指示、高亮等纯控制状态；频繁变更但不触碰正文。

单向数据流：Editor(LocalDraft) → 触发保存 → ACK 合入 Canonical → 仅外部事件时重注水到 Editor。

## 输入输出契约（与 ReportEditor 协作）

- 传入编辑器（props）：
  - 结构：章节顺序/层级/折叠等大纲映射。
  - 控制：只读、锁定、Loading、模式（编辑/预览）、高亮等。
  - 不包含：任何 html 正文或富文本快照。
- 接收编辑器（回调）：
  - 章节粒度内容变更（onChange）。
  - 内联大纲变更意图、滚动/选区变化等信号。
- 通过 ref 控制编辑器（命令）：
  - 注水类：全量设值、章节替换、Range 增量 patch。
  - 交互类：focus、scrollToChapter、选区读取/恢复、就绪查询等。

## 生命周期与操作手册

1. 初始化 / 切版（全量注水）

- 组装完整 HTML（渲染优先级：htmlContent > aigcContent > 空）。
- 通过编辑器 ref 做一次性全量注水；重置所有章节 LocalDraft。
- 同步设置只读/Loading 等控制状态。

2. 用户编辑（本地草稿）

- 每次编辑只更新 LocalDraft 与保存状态（unsaved）。
- 防抖/批处理触发保存（进入 saving）。
- 禁止在此阶段调用 setContent，避免回环与抖动。

3. 保存 ACK（合入真相，不重注水）

- 成功：合入 Canonical；LocalDraft: saving → saved；不 setContent。
- 失败：LocalDraft: error，允许重试；编辑器内容保持不变。

4. AI 生成（只读 → 流式 → 完成注水）

- 生成期间：目标范围只读；允许流式预览以小粒度增量写入（不走 setContent）。
- 生成完成：服务端落盘 aigcContent；按范围一次性注水：
  - 全文完成 → 全量注水；
  - 某章完成 → 仅该章注水（建议保留选区）。
- 注水后：解除只读，并重置对应 LocalDraft。

5. 章节重生成（清理旧稿 → 注水新稿）

- 触发时：清空该章 htmlContent 并设为只读（防止旧稿覆盖新 AIGC）。
- 完成时：落盘新的 aigcContent → 章节级注水 → 解锁 → 用户继续编辑/保存。

## 闸门与并发一致性

- 允许注水的外部事件：页面还原/切版、AI（重）生成完成、外部合并/回到快照。
- 禁止注水：保存 ACK、局部结构微调、保存状态变化等。
- Lease/Epoch（业务层持有）：
  - 用户开始编辑分配 leaseId/epoch。
  - 同 epoch 的 ACK 只更新状态不替换编辑器。
  - 不同 epoch 的外部事件才允许覆盖（结合只读门控）。
- 只读门控：生成/重生成期间把目标范围设为只读，避免与增量写入冲突。

## 性能与体验

- props 轻、命令重：props 不含 html；正文写入全走命令式 API，降低 React diff 压力。
- 流式期合批：增量写入主线程 50–100ms 节流合批，完成后一次性“干净版本”注水。
- 注水粒度优先章节级：减少重排并尽量保留光标；全文注水仅在初始化/切版/全文生成完成时使用。

## 错误与冲突处理

- 423/409（锁定/版本冲突）：保留本地草稿、标记冲突，不做注水覆盖；交给用户决策。
- 生成失败：解除只读、保留现状、允许重试；不做注水。

## 渲染优先级与清理规则

- 渲染优先级：htmlContent > aigcContent > 空。
- 章节重生成必须清理该章 htmlContent；生成期间不写 htmlContent；完成后落盘 aigcContent，再由编辑器读入（注水）。

## 验收清单（页面侧 DoD）

- 初始化：仅一次全量注水；其余变化不触碰正文。
- 编辑/保存：编辑只改 LocalDraft；ACK 只合入 Canonical，不 setContent。
- 生成/重生成：生成期只读 + 流式增量预览；完成后一次性注水 + 解锁 + 重置对应 LocalDraft。
- 并发：非外部事件绝不注水；外部事件触发注水前需通过业务层闸门检查（锁定/版本/epoch）。
- 性能：props 不含 html；命令式写入合批节流；章节级优先。

## 关联文档

- 数据模型与状态机：../../../docs/RPDetail/ContentManagement/data-layer-guide.md
- ReportEditor 组件：../../../components/Report/ReportEditor/COMPONENT_README.md
