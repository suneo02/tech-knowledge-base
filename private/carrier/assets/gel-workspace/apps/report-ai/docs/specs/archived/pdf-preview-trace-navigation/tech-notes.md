# PDF 预览 Trace 数据导航 - 技术要点

> 回链：[任务概览](./README.md)

## 关键技术点

### 1. 数据结构

`position[i]` 对应 `refChapter[i]`，示例：

```typescript
{
  refChapter: [2, 5, 8],
  position: [
    { startPoint: { page: 10 } },  // 章节 2
    { startPoint: { page: 25 } },  // 章节 5
    { startPoint: { page: 40 } }   // 章节 8
  ]
}
```

### 2. 模式判断

```typescript
const shouldShowJumper = !initialPage && chapterJumpData.length >= 1
```

- `initialPage` 存在 → 直接跳转
- 有 trace 数据 → 显示 Jumper
- 从列表点击 → 始终从第 1 页开始

### 3. 章节名称降级

```typescript
chapter?.title || `章节 ${chapterId}`
```

### 4. PDF 跳转时序

PDF 加载完成前调用 `scrollToPage` 无效，需监听 `totalPages` 变化后再跳转。

## 常见问题

**Q: 为什么在 PDFPreviewWrapper 判断模式？**  
A: 更接近 PDFViewer，减少 props 传递，保持 FilePreviewRenderer 通用性。

**Q: 如何处理 position 中的 undefined？**  
A: 使用 `filter(Boolean)` 过滤。

**Q: 章节标签过多？**  
A: CSS `overflow-x: auto` 横向滚动。

## 性能优化

- `useMemo` 缓存章节数据计算
- `useCallback` 缓存点击回调
- QuickJumper 使用 `React.memo`

## 测试重点

- 不同章节数量（1、3、10+ 个）
- 边界情况（undefined、超出页码）
- 快速连续点击

## 相关文件

@see `apps/report-ai/src/types/file/index.ts`  
@see `apps/report-ai/src/components/File/PDFViewer/index.tsx`  
@see `apps/report-ai/src/components/Reference/FilePreviewRenderer/`

## 更新记录

| 日期       | 修改人   | 更新内容         |
| ---------- | -------- | ---------------- |
| 2025-01-XX | 开发团队 | 创建技术要点文档 |
