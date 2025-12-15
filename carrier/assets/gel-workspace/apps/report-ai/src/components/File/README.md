# File

文件处理组件库，支持 PDF、图片等多种文件类型的预览和展示

## 目录结构

```
File/
├── PDFViewer/                 # PDF 查看器
│   ├── components/            # UI 子组件
│   ├── hooks/                 # 状态管理 Hooks
│   ├── index.tsx              # 主组件
│   ├── PDFDocument.tsx        # PDF 文档渲染
│   ├── pdfFallback.tsx        # 降级方案
│   ├── lazyToLoad.tsx         # 懒加载容器
│   ├── pdfNavigation.ts       # 导航工具
│   └── types.ts               # 类型定义
├── ImagePreview/              # 图片预览
│   ├── index.tsx              # 图片预览组件
│   └── types.ts               # 类型定义
├── FileDisplay/               # 文件展示
│   └── index.tsx              # 文件展示组件
├── FileItem/                  # 文件项
│   ├── index.tsx              # 文件项组件
│   └── utils.ts               # 工具函数
├── ProgressCircle/            # 进度圆环
│   └── index.tsx              # 进度圆环组件
├── UnsupportedFilePreview/    # 不支持的文件预览
│   ├── index.tsx              # 不支持文件预览组件
│   └── types.ts               # 类型定义
└── index.ts                   # 统一导出
```

## 核心组件职责

### PDFViewer

PDF 文档查看器，支持缩放、旋转、分页导航、文本高亮选区等功能

### ImagePreview

图片预览组件，支持图片缩放、旋转等功能

### FileDisplay

文件展示组件，根据文件类型展示不同的预览器

### FileItem

文件项组件，展示文件图标、名称、大小等信息

### ProgressCircle

进度圆环组件，展示文件上传或处理进度

### UnsupportedFilePreview

不支持的文件预览组件，展示不支持预览的文件信息

## 模块依赖

```
FileDisplay
  ├─> PDFViewer (PDF 预览)
  ├─> ImagePreview (图片预览)
  └─> UnsupportedFilePreview (不支持预览)

FileItem
  └─> ProgressCircle (进度展示)
```

## 相关文档

- [引用资料模块 - 需求文档](../../../../docs/RPDetail/Reference/01-requirement.md) - 文件预览功能需求
- [引用资料模块 - 设计文档](../../../../docs/RPDetail/Reference/02-design.md) - 文件预览交互设计
- [文件预览技术选型](../../../../docs/RPDetail/Reference/presearch.md) - PDF 预览技术方案
