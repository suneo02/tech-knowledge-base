# foundation

报告编辑器基础层，提供常量、选择器、DOM 工具等纯函数，无 TinyMCE 依赖

## 目录结构

```
foundation/
├── index.ts              # 统一导出
├── constants.ts          # HTML 常量、CSS 类名、数据属性、选择器
├── domAttributes.ts      # DOM 属性操作（getAttribute、setAttribute、querySelector）
└── chapterStructure.ts   # 章节结构工具（标题层级、层级编号解析）
```

## 关键说明

- **constants**: 定义所有 HTML 相关常量，包括 CSS 类名、数据属性、选择器
- **domAttributes**: DOM 属性操作工具，提供类型安全的属性读写
- **chapterStructure**: 章节结构工具，处理标题层级和层级编号解析

## 依赖关系

```
chapterStructure → constants
domAttributes → constants
```

---

> 📖 本文档遵循 [README 编写规范](../../../../../docs/rule/doc-readme-structure-rule.md)

