# chapterOrdinal

章节序号管理模块，提供章节序号生成、渲染、同步和查找

## 目录结构

```
chapterOrdinal/
├── index.ts          # 统一导出
├── render.ts         # 章节序号渲染（HTML 生成、节点创建、格式化）
├── ops.ts            # 章节序号操作（应用到标题元素）
├── find.ts           # 章节序号查找（查找序号节点）
└── ordinalSync.ts    # 章节序号同步（批量更新序号）
```

## 核心原则

**章节编号与 ID 无关**：

- 编号（1, 1.1, 1.2 等）只依赖标题层级（h1, h2, h3...）
- 与章节 ID（chapter-id）完全解耦
- 直接操作标题元素，不需要查找容器

## 关键说明

- **render**: 生成章节序号 HTML、创建序号节点、格式化序号
- **ops**: 将章节序号直接应用到标题元素（h1-h6）
- **find**: 查找章节序号节点
- **ordinalSync**: 批量更新章节序号，基于标题层级自动计算

## 依赖关系

```
ordinalSync → ops → render → foundation
find → render → foundation
```

---

> 📖 本文档遵循 [README 编写规范](../../../../../docs/rule/doc-readme-structure-rule.md)

