# OutlineView

报告大纲展示组件，支持章节导航、进度指示和层级编号

## 目录结构

```
OutlineView/
├── index.tsx                    # 主组件
├── ChapterNode.tsx              # 章节节点组件
├── ChapterNodeBase.tsx          # 章节基础组件
└── *.module.less                # 样式文件
```

## 关键说明

- **index.tsx**: 大纲主容器，管理章节展开状态和选择逻辑
- **ChapterNode.tsx**: 章节节点，递归渲染子章节
- **ChapterNodeBase.tsx**: 章节基础组件，展示层级编号、标题、写作思路等
- 使用 `@/utils/common/tree` 的 TreePath 表示章节路径
- 使用 `@/domain/outline` 的 `generateHierarchicalNumber` 生成层级编号

## 依赖关系

OutlineView → ChapterNode → ChapterNodeBase
ChapterNodeBase → 通用树形工具 → 大纲工具函数
