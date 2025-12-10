# report

报告相关的类型定义

## 目录结构

```
report/
├── index.ts              # 统一导出
├── chapter.ts            # 前端专用章节类型（包含衍生数据）
├── localDraft.ts         # 本地草稿相关类型
├── generation.ts         # AI生成相关类型
├── operations.ts         # 操作状态相关类型
├── outlineView.ts        # 大纲视图模型
└── chapter.example.md    # 章节类型使用示例
```

## 关键类型

### RPChapterEnriched

前端专用的章节数据类型，基于 `RPDetailChapter` 扩展，包含以下衍生数据：

- `level`: 章节层级（1, 2, 3...）
- `path`: 章节路径（[0, 1, 2]）
- `order`: 章节在树中的顺序索引
- `hierarchicalNumber`: 层级编号（"1.2.3"）

**使用场景**：

- 导出功能（需要层级编号）
- 打印功能（需要完整章节信息）
- 章节排序和筛选
- 章节统计和分析

**相关 Selector**：

- `selectCanonicalChaptersEnriched`: 获取扩展章节树
- `selectCanonicalChaptersEnrichedMap`: 获取扩展章节映射（快速查找）

详见 [chapter.example.md](./chapter.example.md)

## 依赖关系

被报告相关模块依赖
