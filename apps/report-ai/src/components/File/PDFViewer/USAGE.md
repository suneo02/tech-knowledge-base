# PDFViewer 使用指南

## 设计原则

- **高亮功能**：使用 **Props**（声明式，响应式更新）
- **跳转功能**：支持 **Props**（初始状态）+ **Ref**（命令式控制）

## 文本高亮功能

### 数据结构

```typescript
interface PDFSelectionModel {
  startX: number; // 起始 X 坐标
  startY: number; // 起始 Y 坐标
  endX: number; // 结束 X 坐标
  endY: number; // 结束 Y 坐标
  dataId: string; // 数据 ID，用于定位和标识
}

// 页面选区映射，key 为页码，value 为选区数组
type SelectionTextMap = Record<number, PDFSelectionModel[]>;
```

### 使用示例

```tsx
import { PDFViewer } from '@/components/File/PDFViewer';

function MyComponent() {
  const selectionTextMap = {
    1: [
      { startX: 100, startY: 200, endX: 300, endY: 250, dataId: 'highlight-1' },
      { startX: 100, startY: 300, endX: 400, endY: 350, dataId: 'highlight-2' },
    ],
    2: [{ startX: 50, startY: 100, endX: 250, endY: 150, dataId: 'highlight-3' }],
  };

  return <PDFViewer source={{ url: '/document.pdf' }} selectionTextMap={selectionTextMap} />;
}
```

## 定位跳转功能

### 方式一：Props（初始状态）

**适用场景**：设置 PDF 打开时的初始页码

```tsx
<PDFViewer
  source={{ url: '/document.pdf' }}
  initialPage={5} // 打开时显示第 5 页
/>
```

### 方式二：Ref 方法（命令式控制）⭐ 推荐

**适用场景**：响应用户交互，动态控制 PDF 跳转

```tsx
import { useRef } from 'react';
import { PDFViewer, PDFViewerRef } from '@/components/File/PDFViewer';

function MyComponent() {
  const pdfRef = useRef<PDFViewerRef>(null);

  return (
    <>
      <button onClick={() => pdfRef.current?.scrollToPage(5)}>跳转到第 5 页</button>
      <button onClick={() => pdfRef.current?.scrollToElement(5, 'highlight-1')}>跳转到高亮区域</button>
      <button
        onClick={() => {
          const current = pdfRef.current?.getCurrentPage();
          const total = pdfRef.current?.getTotalPages();
          console.log(`${current} / ${total}`);
        }}
      >
        获取页码信息
      </button>

      <PDFViewer ref={pdfRef} source={{ url: '/document.pdf' }} />
    </>
  );
}
```

**Ref 方法列表**：

| 方法                               | 参数                              | 说明                     |
| ---------------------------------- | --------------------------------- | ------------------------ |
| `scrollToPage(page)`               | `page: number`                    | 跳转到指定页码           |
| `scrollToElement(page, elementId)` | `page: number, elementId: string` | 跳转到指定页面的指定元素 |
| `getCurrentPage()`                 | -                                 | 获取当前页码             |
| `getTotalPages()`                  | -                                 | 获取总页数               |

**注意**：如果 PDF 尚未加载完成，跳转请求会被暂存，加载完成后自动执行。

## 完整示例

```tsx
import { useRef, useState } from 'react';
import { PDFViewer, PDFViewerRef, PDFSelectionModel } from '@/components/File/PDFViewer';

function PDFViewerDemo() {
  const pdfRef = useRef<PDFViewerRef>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // 定义高亮区域
  const selectionTextMap: Record<number, PDFSelectionModel[]> = {
    1: [{ startX: 100, startY: 200, endX: 300, endY: 250, dataId: 'section-1' }],
    3: [{ startX: 50, startY: 100, endX: 250, endY: 150, dataId: 'section-2' }],
  };

  return (
    <div>
      <div style={{ padding: '10px', background: '#f0f0f0' }}>
        {/* 使用 Ref 方法跳转 */}
        <button onClick={() => pdfRef.current?.scrollToPage(1)}>第 1 页</button>
        <button onClick={() => pdfRef.current?.scrollToPage(3)}>第 3 页</button>
        <button onClick={() => pdfRef.current?.scrollToElement(1, 'section-1')}>跳转到第 1 页高亮</button>
        <button onClick={() => pdfRef.current?.scrollToElement(3, 'section-2')}>跳转到第 3 页高亮</button>
        <span>
          当前: {currentPage} / {totalPages}
        </span>
      </div>

      <PDFViewer
        ref={pdfRef}
        source={{ url: '/document.pdf' }}
        fileName="document.pdf"
        selectionTextMap={selectionTextMap}
        initialPage={1}
        onPageChange={setCurrentPage}
        onTotalChange={setTotalPages}
      />
    </div>
  );
}
```

## 最佳实践

### ✅ 推荐做法

1. **高亮功能**：始终使用 Props

   ```tsx
   <PDFViewer selectionTextMap={selectionTextMap} />
   ```

2. **初始页码**：使用 Props

   ```tsx
   <PDFViewer initialPage={5} />
   ```

3. **交互跳转**：使用 Ref 方法

   ```tsx
   pdfRef.current?.scrollToPage(5);
   pdfRef.current?.scrollToElement(5, 'highlight-1');
   ```

4. **跨组件通信**：通过 Props 和回调函数传递 ref

   ```tsx
   // 父组件
   function Parent() {
     const pdfRef = useRef<PDFViewerRef>(null);
     return <Child pdfRef={pdfRef} />;
   }

   // 子组件
   function Child({ pdfRef }) {
     return <button onClick={() => pdfRef.current?.scrollToPage(5)}>跳转</button>;
   }
   ```

### ❌ 避免做法

1. ❌ 不要用全局事件控制跳转（已移除）
2. ❌ 不要频繁改变 `initialPage`（只在初始化时使用）
3. ❌ 不要在 Ref 方法中使用可选链后不检查返回值

## 注意事项

1. **坐标系统**：坐标基于 PDF 原始尺寸，组件会自动根据缩放比例调整
2. **dataId 唯一性**：每个高亮区域的 `dataId` 必须唯一
3. **延迟加载**：如果 PDF 未加载完成，跳转请求会被暂存
4. **性能优化**：使用懒加载，只渲染可视区域的页面
5. **样式自定义**：通过 CSS 覆盖 `.pdf-selection` 类自定义高亮样式

## 相关文件

- `index.tsx` - 主组件
- `PDFDocument.tsx` - PDF 文档渲染
- `lazyToLoad.tsx` - 懒加载和高亮渲染
- `hooks/usePDFScroll.ts` - 滚动管理
- `types.ts` - 类型定义
