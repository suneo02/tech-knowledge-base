# PDFViewer

PDF 文档查看器组件，支持缩放、旋转、分页导航、文本高亮选区等功能。

## 相关文档

- [使用指南](./USAGE.md) - 文本高亮和定位跳转功能详解
- [引用资料模块 - 需求文档](../../../../docs/RPDetail/Reference/01-requirement.md) - 文件预览功能需求
- [引用资料模块 - 设计文档](../../../../docs/RPDetail/Reference/02-design.md) - 文件预览交互设计
- [文件预览技术选型](../../../../docs/RPDetail/Reference/presearch.md) - PDF 预览技术方案

## 目录结构

```
PDFViewer/
├── index.tsx                 # 主组件入口，组合各功能模块
├── PDFDocument.tsx           # PDF 文档渲染，基于 react-pdf 实现
├── PDFViewer.module.less     # 组件样式
├── components/               # UI 子组件
│   ├── index.ts              # 子组件统一导出
│   ├── PDFPagination.tsx     # 分页器（上一页/下一页/跳转）
│   ├── PDFToolbar.tsx        # 工具栏（缩放/旋转按钮）
│   └── ScaleSelector.tsx     # 缩放选择器（放大/缩小）
├── hooks/                    # 状态管理 Hooks
│   ├── index.ts              # Hooks 统一导出
│   ├── usePage.ts            # 分页状态管理
│   ├── useScale.ts           # 缩放状态管理
│   ├── useRotate.ts          # 旋转状态管理
│   ├── usePDFScroll.ts       # 滚动监听与页码计算
│   ├── usePDFLocate.ts       # 定位事件处理（locatePDF 事件）
│   └── usePDFNavigation.ts   # 页面导航逻辑（跳转/上下页）
├── types.ts                  # 类型定义（选区模型、定位事件）
├── pdfFallback.tsx           # 降级方案（加载失败时使用原生查看器）
├── lazyToLoad.tsx            # 懒加载容器（优化大文件渲染性能）
├── pdfNavigation.ts          # 导航工具函数
└── README.md                 # 本文档
```

## 核心文件职责

### index.tsx

主组件，整合所有功能模块，对外暴露 `PDFViewer` 组件和 `PDFViewerRef` 接口。

### PDFDocument.tsx

PDF 文档渲染核心，使用 `react-pdf` 库渲染 PDF 页面，支持文本选区高亮。

### hooks/usePDFScroll.ts

滚动管理，监听滚动事件并计算当前页码，提供 `scrollToPage` 和 `scrollToDom` 方法。

### hooks/usePDFLocate.ts

定位事件管理，监听全局 `locatePDF` 事件，支持定位到指定页面或 DOM 元素。

### pdfFallback.tsx

降级方案，当 PDF 加载失败时切换到浏览器原生 PDF 查看器。

## 模块依赖

```
index.tsx
  ├─> PDFDocument.tsx (渲染)
  ├─> components/* (UI)
  ├─> hooks/usePage (分页)
  ├─> hooks/useScale (缩放)
  ├─> hooks/useRotate (旋转)
  ├─> hooks/usePDFScroll (滚动)
  ├─> hooks/usePDFLocate (定位)
  ├─> hooks/usePDFNavigation (导航)
  └─> pdfFallback.tsx (降级)

PDFDocument.tsx
  ├─> lazyToLoad.tsx (懒加载)
  └─> react-pdf (PDF 渲染库)

hooks/usePDFScroll
  └─> @/hooks/useDebouncedScroll (防抖滚动)

hooks/usePDFLocate
  └─> hooks/usePDFScroll (调用滚动方法)
```

## 外部依赖

- `react-pdf` - PDF 渲染库
- `pdfjs-dist` - PDF.js 核心库
- `@/hooks/usePdfLoader` - 项目级 PDF 加载 Hook
- `@/hooks/useDebouncedScroll` - 防抖滚动 Hook

## 自定义事件

### locatePDF

全局定位事件，用于外部触发 PDF 页面或元素定位。

### loadPdfError

PDF 加载失败事件，触发降级方案。
