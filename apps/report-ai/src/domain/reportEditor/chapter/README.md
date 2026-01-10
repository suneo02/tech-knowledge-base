# chapter

章节级别处理模块，负责渲染、操作、查询以及单章节内容解析。

## 目录结构

```
chapter/
├── index.ts       # 统一导出
├── parse.ts       # 单章节内容解析（title、content、fullHtml）
├── render.ts      # 章节渲染（消息转 HTML、标题内容生成）
├── ops.ts         # 章节操作（流式更新、内容设置、加载状态）
├── query.ts       # 章节查询（DOM 查找）
└── sectionDiff.ts # Section 差异检测（去重、变更检测）
```

## 核心能力

- **parse**：`parseChapterContent()` 接收标题节点及其容器，输出 `{ title, content, fullHtml }`，避免调用方重复解析 DOM。
- **render**：将消息数据转换为章节 HTML，生成标题及正文骨架。
- **ops**：章节级操作，包括流式注水、内容设置和加载状态切换。
- **query**：在编辑器 DOM 中定位章节容器、标题及内容节点。
- **sectionDiff**：对比 section 内容差异，辅助增量更新与去重。

> 📖 本文档遵循 [README 编写规范](../../../../../docs/rule/doc-readme-structure-rule.md)

