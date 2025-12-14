# Reference

引用资料展示组件，用于报告详情页展示和管理引用的表格、文件和建议资料

## 目录结构

```
Reference/
├── ReferenceView/                    # 引用资料主视图（容器组件）
│   ├── index.tsx                    # 管理视图切换和预览状态
│   └── index.module.less            # 样式文件
├── RPReferenceListWithChapter/      # 带章节信息的引用列表
│   ├── index.tsx                    # 列表组件，从 Redux 获取数据
│   └── index.module.less            # 样式文件
├── ReferenceItemFile/               # 文件引用项组件
│   ├── index.tsx                    # 文件展示组件
│   └── index.module.less            # 样式文件
├── ReferenceItemTable/              # 表格引用项组件
│   ├── index.tsx                    # 表格展示组件
│   └── index.module.less            # 样式文件
├── ReferenceItemSuggest/            # 建议资料引用项组件
│   ├── index.tsx                    # 建议资料展示组件
│   └── index.module.less            # 样式文件
├── ReferencePreviewContent/         # 预览内容组件
│   ├── index.tsx                    # 根据类型渲染不同预览器
│   └── index.module.less            # 样式文件
├── FilePreviewRenderer/             # 文件预览渲染器
│   ├── FilePreviewRenderer.tsx      # 文件预览逻辑
│   ├── FilePreviewRenderer.module.less
│   └── components/                  # 子组件
├── DPUPreviewRenderer/              # 表格预览渲染器
│   ├── index.tsx                    # 表格预览逻辑
│   └── index.module.less            # 样式文件
├── TopFilesSection/                 # 置顶文件区块
│   ├── index.tsx                    # 未被引用的文件展示
│   └── index.module.less            # 样式文件
├── RefItemNumber/                   # 引用序号组件
│   ├── index.tsx                    # 序号展示
│   └── index.module.less            # 样式文件
├── FileStatusBadge/                 # 文件状态徽章
│   ├── index.tsx                    # 状态展示
│   └── index.module.less            # 样式文件
├── type.ts                          # 类型定义
└── index.ts                         # 统一导出
```

## 核心文件职责

### ReferenceView

容器组件，管理列表视图和预览视图的切换，处理预览状态。

### RPReferenceListWithChapter

展示资料列表，从 Redux 获取排序后的引用资料数据，渲染资料项。

### ReferenceItemFile / ReferenceItemTable / ReferenceItemSuggest

资料项组件，负责展示单个资料的信息（序号、图标、名称、引用次数）。

### ReferencePreviewContent

预览内容组件，根据资料类型渲染对应的预览器（表格预览、文件预览、建议资料详情）。

### FilePreviewRenderer

文件预览渲染器，支持 PDF、图片、Office 文档等多种文件类型的预览。

### TopFilesSection

置顶文件区块，展示未被章节引用的报告级文件。

## 模块依赖

```
ReferenceView
  ├─> RPReferenceListWithChapter (列表)
  │   ├─> ReferenceItemFile (文件项)
  │   ├─> ReferenceItemTable (表格项)
  │   └─> ReferenceItemSuggest (建议资料项)
  └─> ReferencePreviewContent (预览)
      ├─> FilePreviewRenderer (文件预览)
      │   └─> PDFViewer (PDF 查看器)
      └─> DPUPreviewRenderer (表格预览)

TopFilesSection
  └─> ReferenceItemFile (复用文件项)
```

## 外部依赖

- `src/components/File/PDFViewer/` - PDF 文档查看器
- `src/domain/reportEditor/reference/` - 引用资料数据处理
- `src/store/reportEditor/` - Redux 状态管理

## 相关文档

- [引用资料模块 - 需求文档](../../../../docs/RPDetail/Reference/01-requirement.md) - 功能需求与交互规则
- [引用资料模块 - 设计文档](../../../../docs/RPDetail/Reference/02-design.md) - 布局与交互设计
- [引用资料模块 - 文档导航](../../../../docs/RPDetail/Reference/README.md) - 文档索引
