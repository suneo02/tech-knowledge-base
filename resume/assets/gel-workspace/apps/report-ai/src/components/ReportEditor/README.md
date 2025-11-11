# ReportEditor

基于 TinyMCE 的富文本编辑器，集成 AI 功能和自动保存

## 目录结构

```
ReportEditor/
├── index.tsx                    # 主组件
├── config/
│   └── editorConfig.ts          # TinyMCE 配置
├── styles/
│   └── index.module.less        # 组件样式
├── hooks/
│   ├── useExternalComponentRenderer.ts  # 外部组件渲染
│   └── useReportEditorRef.ts            # ReportEditor 命令式 API 封装
├── utils/
│   └── sanitize.ts              # 内容清理工具
└── types/                       # 类型定义
```

## 核心文件职责

### index.tsx

富文本编辑器主组件，基于 TinyMCE 6（MIT 许可证）

### config/editorConfig.ts

TinyMCE 配置，包括工具栏、插件、AI 功能等

### hooks/useExternalComponentRenderer.ts

外部渲染方案，将 loading 组件渲染在编辑器外部并定位覆盖

### hooks/useReportEditorRef.ts

封装 TinyMCE 实例，内置 SectionIdMaintainer 与 ChapterNumberCoordinator，实现章节 ID/编号的自动同步

### utils/sanitize.ts

使用 sanitize-html 进行内容清理，确保安全性

## 模块依赖

```
index.tsx
  ├─> config/editorConfig (配置)
  ├─> hooks/useReportEditorRef (命令式 API)
  ├─> hooks/useExternalComponentRenderer (外部渲染)
  └─> utils/sanitize (内容清理)
```

## 外部依赖

- `@tinymce/tinymce-react` - TinyMCE React 组件
- `tinymce` - TinyMCE 核心库
- `sanitize-html` - HTML 清理库

## 相关文档

- [报告编辑器设计](../../../../docs/RPDetail/RPEditor/README.md) - 编辑器完整设计
- [自动保存方案](../../../../docs/shared/auto-save-design.md) - 通用自动保存设计
