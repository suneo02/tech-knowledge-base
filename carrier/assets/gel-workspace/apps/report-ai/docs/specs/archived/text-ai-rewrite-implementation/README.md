# 文本 AI 重写流程实现

> 📖 本任务遵循 [Spec 文档编写规范](../../../../../docs/rule/spec-doc-rule.md)

## 任务概览

| 项目         | 内容                               |
| ------------ | ---------------------------------- |
| **任务来源** | [文本 AI 重写场景文档][source-doc] |
| **负责人**   | Kiro                               |
| **优先级**   | P1                                 |
| **目标时间** | 2025-11-15                         |
| **当前状态** | 🛠️ 拆解中                          |
| **当前版本** | v1                                 |

[source-doc]: ../../RPDetail/ContentManagement/text-ai-rewrite-flow.md

## 一句话定位

实现选区级文本 AI 改写的精确管理、DOM 级操作和脏状态触发，提供最细粒度的智能编辑能力。

## 关联文档

### 需求与设计文档

- [文本 AI 重写场景文档](../../RPDetail/ContentManagement/text-ai-rewrite-flow.md) - 业务场景与流程设计
- [AIGC 核心流程](../../RPDetail/ContentManagement/aigc-core-flow.md) - 通用前置校验与流式处理
- [单章节 AIGC 流程](../../RPDetail/ContentManagement/single-chapter-aigc-flow.md) - 对比参考

### 相关代码

- `apps/report-ai/src/pages/RPDetail/ContentManagement/` - 内容管理模块
- `apps/report-ai/src/pages/RPDetail/RPEditor/` - 编辑器模块

## 文档索引

| 文档                        | 状态      | 说明                   |
| --------------------------- | --------- | ---------------------- |
| [需求与背景][require]       | ✅ 完成   | 业务目标与用户场景     |
| [方案设计][design]          | ✅ 完成   | 选区管理与改写流程设计 |
| [实施拆解][implementation]  | ✅ 完成   | 子任务拆解与交付计划   |
| [验证与风险][verification]  | ✅ 完成   | 测试策略与风险评估     |
| [悬浮预览组件方案][preview] | 🛠️ 拆解中 | 预览定位与交互独立拆解 |
| [实现说明][release]         | ⏳ 待补充 | 上线后补充实际实现差异 |

[require]: ./spec-require-v1.md
[design]: ./spec-design-v1.md
[implementation]: ./spec-implementation-v1.md
[verification]: ./spec-verification-v1.md
[preview]: ../text-ai-rewrite-preview-floating/README.md
[release]: ./spec-release-note-v1.md

## 核心目标

1. **选区精确管理**：验证选区有效性、保存快照、支持失败恢复
2. **悬浮预览体验**：使用独立悬浮组件承载预览，定位与交互细节见 [悬浮预览组件方案](../text-ai-rewrite-preview-floating/README.md)
3. **生成完成后替换**：预览过程不修改编辑器内容，生成结束后一次性替换
4. **会话清理闭环**：启动前重置消息与状态，中止/拒绝/确认均执行完整清理
5. **用户体验优化**：流畅的预览、快捷键支持、智能选区扩展

## 更新记录

| 日期       | 修改人 | 更新内容                                            |
| ---------- | ------ | --------------------------------------------------- |
| 2025-11-04 | Codex  | 拆分悬浮预览组件文档，补充清理与隔离目标            |
| 2025-10-30 | Kiro   | 修改预览方式为悬浮组件，使用 AIAnswerMarkdownViewer |
| 2025-10-29 | Kiro   | 创建任务概览，完成文档结构规划                      |
