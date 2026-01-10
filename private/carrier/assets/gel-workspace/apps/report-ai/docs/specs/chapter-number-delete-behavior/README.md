# 章节编号删除行为异常（Spec 总览）

| 字段 | 内容 |
| --- | --- |
| 任务 | 章节编号在删除时出现异常：光标跳过编号；H1 无法删除；H2 先降级再能删除编号 |
| 状态 | 草拟中 |
| 负责人 | 待定 |
| 目标上线时间 | 待定 |
| 当前版本 | v1 |
| 关联文档 | [spec-core-v1.md](./spec-core-v1.md) |
| 参考规范 | [Spec 文档编写规范](../../../docs/rule/doc-spec-rule.md) |

## 文档索引

- 背景与问题分析、复现步骤、根因假设与修复方案：见 [spec-core-v1.md](./spec-core-v1.md)
- 更新记录：见子文档末尾章节

## 关联代码与文档

- 章节编号渲染：apps/report-ai/src/domain/reportEditor/chapterOrdinal/render.ts
- 序号同步：apps/report-ai/src/domain/reportEditor/chapterOrdinal/ordinalSync.ts
- 章节标题 HTML 组装：apps/report-ai/src/domain/reportEditor/chapter/render.ts
- 内容清洗：apps/report-ai/src/domain/reportEditor/editor/contentSanitizer.ts
- 编辑器配置（valid_elements 等）：apps/report-ai/src/components/ReportEditor/config/editorConfig.ts
- 历史问题（已归档）：apps/report-ai/docs/issues/archived/chapter-number-node-filtered-fix.md

