# reportEditor

报告编辑器领域模块，提供报告内容渲染、章节处理和编辑器操作的纯函数工具集

## 目录结构

```
reportEditor/
├── index.ts              # 统一导出
├── types.ts              # 类型定义（合成配置、结果、统计）
├── foundation/           # 基础层（常量、选择器、DOM 工具）
├── chapter/              # 章节处理（渲染、内容操作、分割）
├── chapterId/            # 章节 ID（ID 同步、映射）
├── chapterOrdinal/       # 章节序号（生成、同步、查找）
├── chapterRef/           # 章节引用（溯源标记生成）
├── document/             # 文档处理（渲染、解析、内容操作）
└── editor/               # 编辑器操作（DOM 查找、状态管理、内容清洗）
```

## 关键说明

- **foundation**: 基础层，提供常量、选择器、DOM 属性工具，无 TinyMCE 依赖
- **chapter**: 章节级别处理，包括渲染、内容操作、分割
- **chapterId**: 章节 ID 管理，确保 Section ID 唯一性和批量映射
- **chapterOrdinal**: 章节序号管理，生成层级序号（如 1.2.3）并同步到 DOM
- **chapterRef**: 章节引用管理，生成溯源标记 HTML
- **document**: 文档级别处理，完整文档渲染、解析和内容操作
- **editor**: 编辑器工具，提供统一访问接口（EditorFacade）、DOM 查找、内容清洗，支持调用链路追踪

## 依赖关系

```
editor → foundation
chapter → foundation
chapterId → foundation
chapterOrdinal → foundation
chapterRef → foundation
document → chapter → foundation
```

## 相关文档

- [报告编辑器设计](../../../../docs/RPDetail/RPEditor/README.md) - 编辑器整体设计
- [内容渲染设计](../../../../docs/RPDetail/ContentManagement/README.md) - 内容管理完整设计

---

> 📖 本文档遵循 [README 编写规范](../../../../docs/rule/doc-readme-structure-rule.md)

