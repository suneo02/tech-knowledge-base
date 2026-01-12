# Report-AI 报告生成应用 复盘档案 | 2024.03 - 2024.10

## 0. 受众与用途
- 受众：我自己的面试复盘与技术问答准备
- 用途：把项目拆成可追溯的事实与证据点，便于口头讲清取舍与结果
- 叙述人称：第一人称（我）

## 1. 全景（Situation & Task）
- 业务背景：我聚焦报告详情模块的生成与编辑场景，让用户在一个页面完成生成、编辑与引用管理
- 架构描述（文字，包含组件关系与数据流）：我采用三栏布局，左侧承载对话与大纲提示，中间是富文本编辑区，右侧承载引用资料与预览；生成侧通过流式输出驱动编辑区更新，并同步大纲状态；数据层按事实层、草稿层、展示层分工，保证任意场景可回到一致状态
- 技术选型对比（文字）：我选用富文本编辑器以覆盖复杂粘贴与分页需求，流式通道采用单向推送以降低企业网络阻断风险，同时以类型系统保障复杂状态与流程的可维护性
- 证据锚点（1-3 条）：
  - 《报告详情模块需求文档》private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/requirement.md 模块概述/三栏布局设计
  - 《AI 报告页面 - 技术设计总览》private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/design.md 1.1-3.3
  - 《数据与状态（横向·三层指南）》private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/content-management/data-layer-guide.md 1-3

## 2. 设计文档引用与要点（必须）
- 设计文档名称/版本：Report AI 项目文档（持续更新）
- 设计文档路径（关键条目即可）：
  - private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/requirement.md
  - private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/design.md
  - private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/rp-editor/design.md
  - private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/content-management/data-layer-guide.md
  - private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/content-management/edit-and-save-flow.md
- 关键章节引用（章节标题 + 关联要点）：
  - 《报告详情模块需求文档》模块概述/功能需求：三栏布局与生成/编辑/引用管理的边界
  - 《AI 报告页面 - 技术设计总览》技术架构概览/流式数据处理：生成流与编辑区更新关系
  - 《数据与状态（横向·三层指南）》1-3 章：事实层、草稿层、展示层的职责划分

## 3. 核心功能与实现（Action - Construction）
- 功能 1：我搭建三层数据与展示桥接，让事实层、草稿层、展示层分工清晰并能在任意场景回到一致状态
- 功能 2：我搭建编辑与保存的单飞链路，保证保存串行、失败可恢复、用户输入不丢失
- 功能 3：我搭建生成流程与并发追踪，保证生成与编辑/保存互斥，并支持批量生成的顺序推进与失败回滚
- 实现流程（文字步骤）：输入变化先归一化与判定脏状态；保存触发时生成全量快照并串行提交；生成时进入只读并按章节顺序处理流式输出，完成后刷新基线并解锁
- 数据结构（文字字段说明）：草稿层只保留章节标识、标题、顺序与脏标记等轻量信息；事实层保存完整章节树与元数据；展示层以解析结果驱动大纲与状态提示
- 复杂度说明：为了避免生成、保存、编辑互相覆盖，我引入明确的状态互斥与顺序执行规则，并将注水执行与状态决策拆分以便排查
- 证据锚点（1-3 条）：
  - 《数据与状态（横向·三层指南）》private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/content-management/data-layer-guide.md 1-3
  - 《用户编辑与保存场景（纵向手册）》private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/content-management/edit-and-save-flow.md 2-6
  - 《内容生命周期与交互控制》与《全文生成场景》private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/content-management/lifecycle-flow.md 2-4；private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/content-management/full-generation-flow.md 任务流程

## 4. 个人执行与成果（Action & Result）
- 执行范围与边界：我围绕报告详情的数据层与编辑器集成落地三层模型、保存互斥与生成互斥
- 关键决策与执行：我按文档规范拆分数据层职责与保存流程，保证生成与编辑互斥，并将问题排查与优化方案沉淀为可复用文档
- 量化结果与证据锚点（1-3 条）：TODO（提交记录/任务归档/性能报表）

## 5. 深挖案例（Action - Optimization & Result）
- 现象：我确认标题编号维护在每次输入时触发全量扫描，大文档场景存在卡顿风险
- 排查过程：我沿着输入触发链路定位到“内容变化即触发同步”的策略，确认缺少变更类型判断
- 方案 V1（失败）：仅延迟执行会带来章节编号更新滞后，且无法避免全量扫描
- 方案 V2（最终）：我选择在输入链路判断是否涉及标题类变更，只有命中时才触发同步，并在必要时加入短延迟以压缩触发频率
- 关键机制说明（不贴代码，1-3 条）：我将标题相关变更与正文变更区分处理，避免正文输入触发全量扫描，同时保留必要的即时更新能力
- 量化结果：结果待补充；目标为同步频率 10 次/100 字、帧率 55-60 FPS、CPU 10-20%
- 证据锚点（1-3 条）：
  - 《编辑器 DOM 同步性能优化 - 问题分析》private/carrier/assets/gel-workspace/apps/report-ai/docs/specs/editor-dom-sync-timing-analysis/issue-analysis.md 现象/根因
  - 《编辑器 DOM 同步性能优化 - 优化方案》private/carrier/assets/gel-workspace/apps/report-ai/docs/specs/editor-dom-sync-timing-analysis/optimization-plan.md 推荐方案
  - 《编辑器 DOM 同步性能优化 - 验证计划》private/carrier/assets/gel-workspace/apps/report-ai/docs/specs/editor-dom-sync-timing-analysis/verification-plan.md 性能指标

## 6. 过程记录（可选）
- 关键里程碑：TODO（版本记录/任务归档路径）
- 重要权衡与取舍：TODO（评审记录或 ADR 路径）
- 交付节奏或流程改进：TODO

## 7. 事故复盘（可选）
- 时间线：保存成功后编辑器内容闪回，影响光标位置与撤销栈
- 根因：编辑器首帧内容被重复注入，引发内部历史被重置
- 行动项：我引入首帧内容缓存，非首次注水不再重置编辑器，并把该策略固化到内容管理文档
- 证据锚点（1-3 条）：
  - 《Report Content Initial Value 问题修复》private/carrier/assets/gel-workspace/apps/report-ai/docs/specs/2025-02/2025-02-09-report-content-initial-value-issues/README.md 背景/方案
  - 《内容管理模块（布局与功能设计）》private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/content-management/README.md 初始注水策略

## 8. 知识库（Legacy）
- 三层数据模型与互斥原则：事实层作为唯一真相，草稿层只保存轻量变更，展示层承担解析与状态提示
- 保存与生成的互斥边界：保存串行化，生成期间只读，失败路径保留草稿并允许重试
- 首帧注水策略：首帧内容缓存结合注水执行，避免保存后内容闪回
- 证据锚点（1-3 条）：
  - 《数据与状态（横向·三层指南）》private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/content-management/data-layer-guide.md 1-3
  - 《用户编辑与保存场景（纵向手册）》private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/content-management/edit-and-save-flow.md 2-6
  - 《内容管理模块（布局与功能设计）》private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/content-management/README.md 初始注水策略

## 9. 质量协议清单
- [ ] 证据锚点检查（每节 1-3 条，避免长列表）
- [ ] 文字化检查（无代码块/图表/表格）
- [ ] 逻辑检查（技术选择与业务关联）
- [ ] 设计文档引用检查（名称/路径/章节明确）
- [ ] 受众检查（面试者个人复盘与备考用途）
- [ ] 第一人称叙述检查（我...）
- [ ] 深挖复盘版检查（权衡、失败路径、回滚条件）

## TODO 与问题清单（待补全证据）
- 请提供关键提交或任务归档，用于证明三层模型、保存互斥与生成互斥的实际落地
- 请提供深挖案例的实际结果：同步频率、帧率、CPU 变化的对比基线与采样窗口
- 请提供保存闪回问题的实施记录与验证材料
- 请确认是否需要补充第二个深挖案例（例如流式生成卡顿或多人协作覆盖问题）
