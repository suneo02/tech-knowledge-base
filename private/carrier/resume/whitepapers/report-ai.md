# Report-AI 报告生成应用 复盘档案 | 2024.03 - 2024.10

## 0. 受众与用途
- 受众：我自己的面试复盘与技术问答准备
- 用途：把项目拆成可追溯的事实与证据点，便于口头讲清取舍与结果
- 叙述人称：第一人称（我）

## 1. 全景（Situation & Task）
- 业务背景：我聚焦 Report AI 报告详情模块的报告生成与编辑场景，目标是让用户在一个页面完成生成、编辑与引用管理（证据：private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/requirement.md 模块概述/功能需求）
- 目标与约束：我需要满足单人单端编辑、全量保存、无实时协同、失败可恢复等约束，并在生成、编辑、保存之间保证互斥与可恢复（证据：private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/content-management/data-layer-guide.md 文档定位；private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/content-management/edit-and-save-flow.md 文档定位；private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/content-management/lifecycle-flow.md 互斥蓝图）
- 架构描述（文字）：我采用三栏布局，将 AI 对话、编辑器与大纲/引用管理拆开，并以数据层驱动状态与展示（证据：private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/design.md 1.1/1.2；private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/README.md 页面布局）
  - 左侧：AI 对话与大纲/编写思路展示，右侧：引用资料管理，中间：TinyMCE 编辑器（证据：private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/requirement.md 模块概述/三栏布局设计）
  - 数据层结构：Canonical 事实层 + 前端数据层 + 展示层桥接，保持唯一真相（证据：private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/content-management/data-layer-guide.md 1-3）
  - 生成流：SSE 流式输出 -> 编辑器更新 -> 大纲状态同步（证据：private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/design.md 3.2-3.3）
- 技术栈与关键机制：
  - 前端技术栈为 React + TypeScript（证据：private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/design.md 1.1）
  - 编辑器为 TinyMCE，报告编辑场景包含章节化编辑与自动保存（证据：private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/design.md 1.2；private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/rp-editor/design.md 设计概览）
  - 生成侧采用 SSE 流式输出，并用 Correlation ID 串联生成链路（证据：private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/design.md 3.2；private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/content-management/correlation-id-design.md 设计动机/生命周期）
  - 保存侧采用文档级哈希与 Single-Flight 单飞保存（证据：private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/content-management/data-layer-guide.md 2.3-2.4；private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/content-management/edit-and-save-flow.md 生命周期速览）

## 2. 设计文档引用与要点（必须）
- 我引用的设计文档目录：private/carrier/assets/gel-workspace/apps/report-ai/docs
- 我引用的关键文档与章节：
  - rp-detail/requirement.md：模块概述、三栏布局设计、报告生成功能
  - rp-detail/design.md：技术架构概览、整体布局架构、AI 内容生成技术流程、流式数据处理设计
  - rp-detail/README.md：模块职责、页面布局、模块依赖
  - rp-detail/rp-editor/design.md：设计概览、页面蓝图、交互流程与状态
  - rp-detail/content-management/data-layer-guide.md：Canonical 事实层、前端数据层、展示层桥接、保存流程
  - rp-detail/content-management/edit-and-save-flow.md：输入监听、保存触发、单飞保存与回调
  - rp-detail/content-management/lifecycle-flow.md：互斥编排、只读控制、生成与保存关系
  - rp-detail/content-management/correlation-id-design.md：设计动机、生命周期、关键实现位置
  - rp-detail/content-management/full-generation-flow.md：全文生成的顺序调度与批量注水
  - rp-detail/content-management/README.md：核心概念与初始注水策略
  - specs/editor-dom-sync-timing-analysis/issue-analysis.md：问题陈述、根因与相关代码位置
  - specs/editor-dom-sync-timing-analysis/optimization-plan.md：方案对比与推荐方案
  - specs/editor-dom-sync-timing-analysis/verification-plan.md：性能指标目标
  - specs/2025-02/2025-02-09-report-content-initial-value-issues/README.md：背景、根因与解决方案

## 3. 核心功能与实现（Action - Construction）
- 功能 1：我搭建三层数据与展示桥接
  - 目标：我保证 Canonical、前端数据层与展示层之间保持唯一真相，并能在不同场景回到一致状态（证据：private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/content-management/data-layer-guide.md 1-3）
  - 实现流程：Canonical 作为事实层；前端数据层维护 Draft、Hydration 与保存调度；展示层通过 LiveOutline 与渲染/解析桥接编辑器（证据：private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/content-management/data-layer-guide.md 1-3）
  - 数据结构（文字字段）：我用 Draft Tree 仅记录 chapterId、title、order、dirty、baselineHash 等轻量元数据，LiveOutline 以 Draft 或 Canonical 为源（证据：private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/content-management/data-layer-guide.md 2.1/3.1）
  - 实现代价说明：我在前端引入注水队列与执行器，确保“谁决策/谁执行”分离，便于排查注水问题（证据：private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/content-management/data-layer-guide.md 2.2；private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/content-management/README.md Rehydration 机制）
- 功能 2：我搭建编辑与保存单飞链路
  - 目标：我保证编辑可持续输入，保存串行且失败可恢复（证据：private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/content-management/edit-and-save-flow.md 生命周期速览）
  - 实现流程：TinyMCE 输入 -> 规范化与文档级哈希 -> hasDirty 判定 -> 触发保存 -> 构建全量快照 -> Single-Flight -> 成功刷新 Canonical/基线，失败保留 Draft（证据：private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/content-management/edit-and-save-flow.md 3-6；private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/content-management/data-layer-guide.md 2.3-2.5）
  - 保存触发来源：自动保存、手动保存、离开守卫、生成前置校验（证据：private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/content-management/edit-and-save-flow.md 4）
  - 实现代价说明：我以 inFlight 与 documentStatus 控制保存互斥，避免并发覆盖（证据：private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/content-management/data-layer-guide.md 2.5）
- 功能 3：我搭建生成流程与并发追踪
  - 目标：我保证生成流程可追踪、可与保存互斥（证据：private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/content-management/lifecycle-flow.md 2-4；private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/content-management/correlation-id-design.md 设计动机）
  - 实现流程：生成前校验 hasDirty 与 inFlight，生成期间只读；流式消息聚合后写 Canonical 并触发注水（证据：private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/content-management/lifecycle-flow.md 4.2；private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/content-management/data-layer-guide.md 2.6）
  - 追踪机制：Correlation ID 贯穿请求发送、流式处理、完成合并与注水执行（证据：private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/content-management/correlation-id-design.md 3）
  - 实现代价说明：我在全文生成中维护叶子章节队列与顺序调度，并在批量注水后执行失败回滚与解锁（证据：private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/content-management/full-generation-flow.md 任务流程/批量特性）

## 4. 个人动作与成果（Action & Result）
- 范围与边界：我围绕报告详情的数据层与编辑器集成落地三层模型、单飞保存与生成互斥（证据：private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/content-management/data-layer-guide.md 1-3；private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/content-management/lifecycle-flow.md 2-4；代码路径/commit TODO）
- 关键决策与执行：
  - 我按 data-layer-guide 定义 Draft/Canonical/LiveOutline 的边界，实现 ReportContentStore 的核心模型（证据：private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/content-management/data-layer-guide.md 1-3；代码路径/commit TODO）
  - 我按 edit-and-save-flow 定义单飞保存与回调链路，避免保存覆盖（证据：private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/content-management/edit-and-save-flow.md 2-6；代码路径/commit TODO）
  - 我按 correlation-id-design 设计生成追踪链路，保证多章节生成可追踪（证据：private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/content-management/correlation-id-design.md 1-3；代码路径/commit TODO）
- 量化结果与证据（路径/commit/指标）：
  - 结果待补充：请提供性能与稳定性指标（证据：性能报表/trace TODO）

## 5. 深挖案例（Action - Optimization & Result）
- 现象：我在问题分析中确认编辑器每次输入都会触发 ensureSectionIds，全量扫描标题，容易在大文档场景产生卡顿风险（证据：private/carrier/assets/gel-workspace/apps/report-ai/docs/specs/editor-dom-sync-timing-analysis/issue-analysis.md 现象/影响范围）
- 排查过程：我追踪到 handleContentChange -> requestDomSync -> RAF -> ensureSectionIds 的路径，确认事件绑定过宽与缺少增量判断（证据：private/carrier/assets/gel-workspace/apps/report-ai/docs/specs/editor-dom-sync-timing-analysis/issue-analysis.md 触发路径/根因）
- 方案 V1（未采用）：我评估仅用 debounce 延迟执行，认为会带来章节编号更新滞后且无法解决全量扫描（证据：private/carrier/assets/gel-workspace/apps/report-ai/docs/specs/editor-dom-sync-timing-analysis/optimization-plan.md 方案 2）
- 方案 V2（最终）：我选择智能变更检测，并在必要时加入短 debounce 以压缩同步频率（证据：private/carrier/assets/gel-workspace/apps/report-ai/docs/specs/editor-dom-sync-timing-analysis/optimization-plan.md 推荐方案）
- 关键实现说明（附路径/commit，不贴代码）：我在输入链路中加入“是否涉及标题”的判定，只在标题相关变更时触发同步（证据：private/carrier/assets/gel-workspace/apps/report-ai/docs/specs/editor-dom-sync-timing-analysis/optimization-plan.md 实施要点；代码路径/commit TODO）
- 量化结果：结果待补充；验证目标为同步频率 10 次/100 字、帧率 55-60 FPS、CPU 10-20%（证据：private/carrier/assets/gel-workspace/apps/report-ai/docs/specs/editor-dom-sync-timing-analysis/verification-plan.md 性能指标）

## 6. 过程记录（可选）
- 关键里程碑：
  - TODO：补充与设计/开发里程碑对应的版本记录或任务归档路径
- 重要权衡与取舍：
  - TODO：补充关键取舍的评审记录或 ADR 路径

## 7. 事故复盘（可选）
- 现象：我确认保存后 initialValue 变化触发编辑器内容闪回，光标与撤销栈丢失（证据：private/carrier/assets/gel-workspace/apps/report-ai/docs/specs/2025-02/2025-02-09-report-content-initial-value-issues/README.md 背景与上下文）
- 根因：TinyMCE React 组件在 initialValue 变化时调用 setContent，并触发 ContentSet 清空历史（证据：private/carrier/assets/gel-workspace/apps/report-ai/docs/specs/2025-02/2025-02-09-report-content-initial-value-issues/README.md 问题根因）
- 行动项：
  - 我引入首帧 HTML 缓存，避免非首次注水时变更 initialValue（证据：private/carrier/assets/gel-workspace/apps/report-ai/docs/specs/2025-02/2025-02-09-report-content-initial-value-issues/README.md 解决方案设计）
  - 我在内容管理文档中固化“首帧缓存 + Hydration”策略（证据：private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/content-management/README.md 初始注水策略）

## 8. 知识库（Legacy）
- 三层数据模型：Canonical 作为唯一真相，Draft 只保存轻量元信息，展示层通过 LiveOutline 与渲染/解析桥接（证据：private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/content-management/data-layer-guide.md 1-3）
- 单飞保存：通过 hasDirty、inFlight 与 documentStatus 控制保存互斥，失败保留 Draft（证据：private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/content-management/edit-and-save-flow.md 2-6）
- 初始注水策略：首帧 HTML 缓存结合 Hydration，避免 initialValue 变化导致编辑器重置（证据：private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/content-management/README.md 初始注水策略）
- 生成追踪：Correlation ID 串联请求、流式处理与注水执行（证据：private/carrier/assets/gel-workspace/apps/report-ai/docs/rp-detail/content-management/correlation-id-design.md 1-3）

## 9. 质量协议清单
- [ ] 证据检查（前后对比指标或证据）
- [ ] 文字化检查（无代码块/图表/表格）
- [ ] 逻辑检查（技术选择与业务关联）
- [ ] 设计文档引用检查（名称/路径/章节明确）
- [ ] 受众检查（面试者个人复盘与备考用途）
- [ ] 第一人称叙述检查（我...）
- [ ] 深挖复盘版检查（权衡、失败路径、回滚条件）

## TODO 与问题清单（待补全证据）
- 请提供核心代码路径或 commit：ReportContentStore 三层模型、保存单飞链路、生成互斥与 Correlation ID 追踪
- 请提供深挖案例的实际结果：同步频率、帧率、CPU 变化的对比基线与采样窗口
- 请提供保存闪回问题的实施 PR/commit 与线上验证记录
- 请补充业务背景与目标用户的来源文档路径（如需保留行业描述）
- 请确认是否需要补充第二个深挖案例（例如流式生成卡顿或多人协作覆盖问题）
