# chapter

章节树数据结构操作模块，提供章节的增删改查、状态管理和数据转换

## 📁 目录结构

```
chapter/
├── index.ts                    # 统一导出
├── types.ts                    # 类型定义
├── README.md                   # 模块文档
│
├── queries/                    # 查询操作（只读）
│   ├── find.ts                # 查找章节、路径、层级编号、唯一键
│   └── analysis.ts            # 构建映射表（ID→节点、层级、路径）
│
├── mutations/                  # 变更操作（写入）
│   ├── factory.ts             # 创建章节、生成临时ID
│   ├── basic.ts               # 基础变更（插入、移动、重排序）
│   └── operations.ts          # 高级操作（重命名、缩进等业务封装）
│
├── transforms/                 # 数据转换
│   ├── editor.ts              # 编辑流程（Document ↔ Draft ↔ ViewModel）
│   ├── save.ts                # 保存流程（Document ↔ SaveFormat ↔ Canonical）
│   └── idMapping.ts           # ID映射（临时ID → 持久ID）
│
└── states/                     # 状态管理
    ├── ui.ts                  # UI状态（展开/折叠、选中）
    └── business.ts            # 业务状态（生成状态判断）
```

## 🎯 核心功能

### queries/ - 查询操作

- **find.ts**: 查找章节、计算路径、生成层级编号（1.2.3）、获取唯一键
- **analysis.ts**: 构建映射表用于快速查找和统计

### mutations/ - 变更操作

- **factory.ts**: 创建新章节，自动生成临时ID
- **basic.ts**: 底层变更（插入、移动节点）
- **operations.ts**: 业务层封装（重命名、更新思路、缩进等）

### transforms/ - 数据转换

**编辑流程 (editor.ts)**

```
编辑器 → Document → Draft → ViewModel
```

- `convertDocumentChaptersToDraft`: Document → Draft（编辑时同步）
- `mergeDraftToOutlineView`: Draft + Canonical → ViewModel（大纲视图）

**保存流程 (save.ts)**

```
编辑器 → Document → SaveFormat → API → Saved → Canonical
```

- `convertDocumentChaptersToSaveFormat`: Document → SaveFormat（保存前）
- `mergeSavedChaptersWithCanonical`: Saved + Canonical → Canonical（保存后）

**ID 映射 (idMapping.ts)**

```
临时 ID → 持久 ID（保存成功后）
```

- `applyIdMapToChapters`: 批量替换章节树中的 ID（数据层）
- `getRealChapterId`: 获取真实的章节ID

### states/ - 状态管理

- **ui.ts**: 展开/折叠、选择状态管理（使用 Set 存储）
- **business.ts**: 生成状态判断（pending、receiving、finish）

## 🔗 依赖关系

```
数据流向：
  Editor
    ↓
  Document (reportEditor/document/parse)
    ↓
  ├─→ Draft (transforms/editor) → ViewModel (展示)
  └─→ SaveFormat (transforms/save) → API → Canonical (保存)

模块依赖：
  mutations/operations → mutations/basic → types
                      → queries/find → types

  transforms/* → types
  states/ui → queries/find → types
```

## 📋 常用场景

| 场景           | 模块                 | 函数                                      |
| -------------- | -------------------- | ----------------------------------------- |
| 创建章节       | mutations/factory    | `createChapter`                           |
| 查找章节       | queries/find         | `findChapterById`, `findChapterPathById`  |
| 构建映射表     | queries/analysis     | `buildChapterMap`, `buildChapterLevelMap` |
| 重命名章节     | mutations/operations | `chapterTreeOperations.rename`            |
| 编辑器→Draft   | transforms/editor    | `convertDocumentChaptersToDraft`          |
| Draft→大纲视图 | transforms/editor    | `mergeDraftToOutlineView`                 |
| 保存前转换     | transforms/save      | `convertDocumentChaptersToSaveFormat`     |
| 保存后合并     | transforms/save      | `mergeSavedChaptersWithCanonical`         |
| ID映射         | transforms/idMapping | `applyIdMapToChapters`                    |
| 展开/折叠      | states/ui            | `expandStateUtils`                        |
| AI 消息状态    | states/business      | `determineChapterAIMessageStatus`        |

## 相关模块

- [reportEditor/chapterId](../reportEditor/chapterId/README.md) - 视图层 ID 映射（TinyMCE DOM）
  - `transforms/idMapping.ts` 处理数据层（章节树）
  - `reportEditor/chapterId/ops.ts` 处理视图层（编辑器 DOM）
  - 两者使用相同的 idMap 格式，确保数据-视图一致性

## 相关文档

- [报告编辑器设计](../../../../docs/RPDetail/RPEditor/README.md)
- [章节数据结构设计](../../../../docs/RPDetail/RPEditor/chapter-structure.md)

---

> 📖 本文档遵循 [README 编写规范](../../../../docs/rule/doc-readme-structure-rule.md)

