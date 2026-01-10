# PDF 预览 Trace 数据导航 - 设计文档 v1

> 回链：[任务概览](./README.md)

## 架构设计

### 组件层级

```
ReferencePreviewContent
  └── FilePreviewRenderer
        └── PDFPreviewWrapper
              ├── QuickJumper (新增)
              └── PDFViewer
```

## 核心设计

### 1. 模式判断（PDFPreviewWrapper）

| 条件                    | 行为                         |
| ----------------------- | ---------------------------- |
| `initialPage` 存在      | 直接跳转，不显示 Jumper      |
| `position.length >= 1`  | 显示 Jumper，从第 1 页开始   |
| `position` 不存在或为空 | 不显示 Jumper，从第 1 页开始 |

判断逻辑：

```typescript
const shouldShowJumper = !initialPage && chapterJumpData.length >= 1
```

### 2. QuickJumper 组件

**Props**：

```typescript
interface QuickJumperProps {
  chapters: ChapterJumpItem[]
  activeIndex?: number
  onChapterClick: (index: number, page: number) => void
}

interface ChapterJumpItem {
  chapterId: string
  chapterName: string
  startPage: number
}
```

**样式**：Tabs 风格，横向滚动，激活标签高亮

### 3. 数据传递链路

```
RPReferenceView (chapterMap)
  → ReferencePreviewContent (chapterMap)
    → FilePreviewRenderer (file: RPFileUnified, chapterMap)
      → PDFPreviewWrapper (file, chapterMap)
```

**关键修改**：

- `FilePreviewRenderer.file` 类型改为 `RPFileUnified`
- 新增 `chapterMap` prop 逐层传递

### 4. 章节数据计算

@see PDFPreviewWrapper 实现

过滤 `position[i]` 为 `undefined` 的章节，使用 `chapterMap` 获取章节名称，降级显示 `章节 ${id}`。

## 边界处理

| 场景                         | 处理                  |
| ---------------------------- | --------------------- |
| `position[i]` 为 `undefined` | 跳过该章节            |
| `chapterMap` 未提供          | 显示 `章节 ${id}`     |
| `startPage` 超出范围         | 跳转到最后一页        |
| `initialPage` 优先级         | 最高，忽略 trace 数据 |

## 技术约束

- TypeScript 严格模式
- Less Module + BEM
- 使用 ahooks、classnames

## 更新记录

| 日期       | 修改人   | 更新内容     |
| ---------- | -------- | ------------ |
| 2025-01-XX | 开发团队 | 创建设计文档 |
