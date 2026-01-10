# chapterId

章节 ID 管理模块（视图层），提供 TinyMCE 编辑器中的 Section ID 同步和批量映射

## 目录结构

```
chapterId/
├── index.ts      # 统一导出
├── ensureIds.ts  # 确保章节 ID 存在
└── applyIdMap.ts # 应用 ID 映射（临时 ID → 持久化 ID）
```

## 关键说明

- **ensureIds**: 确保编辑器中的章节标题有唯一 ID，支持自动分配临时 ID 和从父容器继承 ID
- **applyIdMap**: 应用 ID 映射，将临时 ID 替换为持久化 ID（视图层操作）

## 协作模块

本模块与 `chapter/idMapping` 协作，共同完成 ID 映射：

| 模块                           | 职责           | 操作对象         | 副作用         |
| ------------------------------ | -------------- | ---------------- | -------------- |
| **chapter/idMapping**          | 数据层 ID 映射 | 章节树数据结构   | 无（纯函数）   |
| **reportEditor/chapterId/ops** | 视图层 ID 映射 | TinyMCE DOM 元素 | 有（修改 DOM） |

### 典型使用流程

```typescript
// 保存成功后，后端返回 ID 映射
const idMap = { 'new-chapter-123': 'chapter-uuid-abc' };

// 1. 更新数据层（章节树）
const updatedChapters = applyIdMapToChapters(chapters, idMap);

// 2. 更新视图层（编辑器 DOM）
applySectionIdMap(editor, idMap);
```

## 依赖关系

```
ops → foundation
ops ⇄ chapter/idMapping (协作关系，使用相同的 idMap 格式)
```

---

> 📖 本文档遵循 [README 编写规范](../../../../../docs/rule/doc-readme-structure-rule.md)

