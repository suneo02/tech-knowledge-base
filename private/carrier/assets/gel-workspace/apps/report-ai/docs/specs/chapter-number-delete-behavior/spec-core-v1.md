# 章节编号删除行为异常（Core Spec v1）

[返回 README](./README.md)

## 背景与上下文

- 现有设计：章节编号作为外部渲染节点插入标题首部，形如 `<span data-gel-external="chapter-number" contenteditable="false" style="user-select: none;">1 </span>`。
  - 属性定义：apps/report-ai/src/domain/reportEditor/chapterOrdinal/render.ts:7-14、44-47
  - 生成标题：apps/report-ai/src/domain/reportEditor/chapter/render.ts:48-51
  - 同步序号：apps/report-ai/src/domain/reportEditor/chapterOrdinal/ordinalSync.ts:71-131
- 保存/导出时，会移除所有 `data-gel-external` 节点：apps/report-ai/src/domain/reportEditor/editor/contentSanitizer.ts:47-57
- 历史约束：曾因使用 `data-mce-bogus="1"` 导致 `setContent` 过滤编号节点，后改为不使用该属性：apps/report-ai/docs/issues/archived/chapter-number-node-filtered-fix.md

## 问题陈述

- 现象
  - 删除时光标会跳过编号（无法选中/命中编号）
  - H1 级标题无法删除（Backspace 不生效）
  - H2 级标题按 Backspace 会先降级为普通段落或更低级标题，随后编号可被删除
- 影响范围
  - 所有带章节编号的标题编辑体验不一致，易造成误操作（误降级）
  - 用户无法直观地删除编号或标题本身

## 复现路径（TinyMCE 环境）

1. 在编辑器中渲染含编号的 H1/H2 标题
2. 将光标置于标题首部（编号之后、正文之前）
3. 按 Backspace
   - H1：无响应或无法删除
   - H2：标题层级被更改（降级），随后编号可删除

## 根因分析（假设与验证）

- 假设 A：编号节点 `contenteditable=false` + `user-select: none` 导致其作为“不可编辑内联原子”，阻止常规文本删除命中该节点
  - 证据：属性定义明确禁止编辑与文本选择（render.ts:7-14），编号位于标题首部（chapter/render.ts:48-51）
- 假设 B：TinyMCE 在块级元素起始位置的 Backspace 默认行为是“变更块级格式”（如 H2 → P），而非删除内联不可编辑节点
  - 认知：符合通用编辑器行为（块级起始处 Backspace 走 outdent/unwrap 流程）
- 假设 C：为避免历史问题，编号节点未使用 `data-mce-bogus`，因此被完整注入到编辑器内容，进一步参与光标/删除判定
  - 证据：archived issue 明确移除 bogus（避免 setContent 过滤），现逻辑依赖业务层清洗（contentSanitizer.ts:47-57）

## 方案设计（取舍）

方案 1：CSS 伪元素渲染（推荐）
- 思路：不再插入内联节点；改为在 Hx 上维护 `data-number` 属性，通过样式 `h1[data-number]::before { content: attr(data-number) ' '; }` 渲染编号
- 优点：编号不参与 DOM 选择与删除；块级 Backspace 行为自然且一致；完全避免“不可编辑内联原子”导致的光标/删除问题
- 风险：需调整现有序号同步逻辑，从“插入 span”改为“设置 heading 属性”；需校验导出清洗是否仍然纯净（不再有外部节点，可能不需要清洗）

方案 2：键盘事件拦截
- 思路：在编辑器运行期拦截 Backspace，当光标位于编号之后的 0/1 个字符位置时，优先删除编号节点，阻止块级降级行为
- 优点：保持现有节点模型与渲染逻辑最小改动
- 风险：需精确计算 TinyMCE 选区与偏移（含格式化/溯源标记等复杂场景）；与其他快捷键/撤销栈交互复杂；对首行多装饰节点堆叠不稳定

方案 3：调整外部节点属性
- 思路：尝试移除 `user-select: none` 或调整 `contenteditable`，使编号可被选中并作为可删除对象
- 优点：改动小
- 风险：用户可误编辑编号文本；需额外保护避免编号被修改；历史上使用 `data-mce-bogus` 会被过滤，不能复用该属性（archived issue）

方案 4：零宽字符占位
- 思路：在编号与正文之间插入零宽字符，调整光标行为
- 风险：脏内容与选择边界问题多；与导出/清洗/格式化的兼容性差

结论：选择方案 1（CSS 伪元素）
- 原因：最符合“外部渲染、非内容”的定位；彻底规避删除与光标问题；不引入 TinyMCE 特有属性的副作用；实现清晰、可测试

## 实施拆解（≤7 子任务）

1. API 变更：在 `updateChapterOrdinals` 由“插入 span”改为“设置 heading `data-number` 属性”（apps/report-ai/src/domain/reportEditor/chapterOrdinal/ordinalSync.ts:126-128）
2. 渲染层：删除 `createChapterOrdinalNode/HTML` 的实际 DOM 插入逻辑，保留格式化函数以生成数字字符串（render.ts）
3. 样式层：在编辑器内容 CSS 中新增选择器：`h1[data-number]::before` ... `h6[data-number]::before`，统一渲染编号与末尾空格
4. 清洗层：评估 `removeExternalRenderingNodes` 是否仍需对编号处理；如编号不再是外部节点，清洗应无操作（保持对其他外部节点的处理）
5. 解析层：`extractHeadingText` 当前通过移除 `data-gel-external="chapter-number"` 提取纯文本（chapterStructure.ts:83-90），需改为：优先读取 `data-number`，不影响正文提取
6. 验证与回归：针对 H1/H2/H3 的 Backspace 行为用例；含引用标记与粗体等混合内联的场景；导出内容不含编号
7. 风险管理：与历史 `data-mce-bogus` 冲突的回归检查；与 QuickToolbar/快捷键的交互测试

## 验收标准

- 标题首部 Backspace 行为一致：H1/H2/H3 不出现“先降级再删除编号”的现象；编号不阻挡删除
- 编号不可编辑：用户无法直接编辑编号文本；编号始终由同步逻辑维护
- 导出/保存内容不含编号文本：编号仅为呈现层内容
- 解析工具正常：`extractHeadingText` 提取纯标题文本正确

## 引用与证据

- 属性与节点模型：apps/report-ai/src/domain/reportEditor/chapterOrdinal/render.ts:7-14、44-47
- 生成标题 HTML：apps/report-ai/src/domain/reportEditor/chapter/render.ts:48-51
- 序号同步：apps/report-ai/src/domain/reportEditor/chapterOrdinal/ordinalSync.ts:71-131
- 纯文本提取：apps/report-ai/src/domain/reportEditor/foundation/chapterStructure.ts:83-90
- 内容清洗：apps/report-ai/src/domain/reportEditor/editor/contentSanitizer.ts:47-57
- 编辑器元素白名单：apps/report-ai/src/components/ReportEditor/config/editorConfig.ts:165-177
- 历史问题：apps/report-ai/docs/issues/archived/chapter-number-node-filtered-fix.md

## 更新记录

- 2025-11-13：v1 草拟，确定方案 1（CSS 伪元素）与实施拆解
