# ReportEditor

基于 TinyMCE 的报告编辑器组件，提供富文本编辑、AI 辅助写作、章节管理等功能。

## 📁 目录结构

```
ReportEditor/
├── index.tsx                    # 主组件入口
├── types/index.ts               # 组件类型定义
├── config/                      # 编辑器配置
│   ├── editorConfig.ts          # TinyMCE 初始化配置
│   ├── contentCss.ts            # 内容样式配置
│   ├── svgUtils.ts              # SVG 工具函数
│   └── menu/                    # 菜单配置
│       ├── aiMenuRegistry.ts    # AI 菜单注册
│       ├── quickToolbarRegistry.ts # 快捷工具栏
│       └── types.ts              # 菜单类型定义
├── hooks/                       # React Hooks
│   ├── useReportEditorRef.ts    # 编辑器引用管理
│   ├── useEditorFacade.ts       # 编辑器外观模式
│   ├── useEditorDomSync.ts      # DOM 同步管理
│   ├── useAIGCButton.tsx        # AIGC 按钮逻辑
│   ├── useChapterHoverWithInit.tsx # 章节悬停检测
│   ├── useChapterLoadingOverlay.tsx # 章节加载遮罩
│   ├── useExternalComponentRenderer.tsx # 外部组件渲染
│   └── useTextRewritePreview/   # 文本改写预览
│       ├── hook.tsx              # 主 Hook 实现
│       ├── types.ts              # 类型定义
│       └── utils/                # 工具函数
├── styles/                      # 样式文件
│   ├── index.module.less        # 主组件样式
│   └── streaming-content.less   # 流式内容样式
└── __tests__/                   # 单元测试
```

## 🔧 核心文件

- **index.tsx**: 主组件实现，整合 TinyMCE 编辑器和自定义功能
- **types/index.ts**: 定义组件 Props 和状态类型
- **config/editorConfig.ts**: TinyMCE 编辑器初始化配置
- **hooks/useReportEditorRef.ts**: 编辑器引用和外观模式管理
- **hooks/useTextRewritePreview/**: 文本改写预览功能模块

## 🔗 依赖关系

```
ReportEditor
├── @tinymce/tinymce-react        # TinyMCE React 封装
├── gel-util/link                 # 链接工具
├── @wind/wind-ui                 # UI 组件库
└── ReportEditor/hooks/*          # 内部 Hooks 模块
```

## 📖 相关文档

### 核心设计文档
- [ReportEditor 模块设计](../../../../docs/RPDetail/RPEditor/README.md) - 编辑器完整架构设计
- [样式方案设计](../../../../docs/RPDetail/RPEditor/Styles.md) - 内容样式组织与注入方案
- [内容管理模块](../../../../docs/RPDetail/ContentManagement/README.md) - AIGC 流程与状态管理
- [自动保存设计](../../../../docs/shared/auto-save-design.md) - 通用自动保存机制设计

### 功能模块文档
- [useTextRewritePreview README](./hooks/useTextRewritePreview/README.md) - 文本改写预览模块
- [hooks utils README](./hooks/utils/README.md) - Hooks 工具函数
- [渲染与展示指南](../../../../docs/RPDetail/RPEditor/rendering-and-presentation-guide.md) - 外部渲染节点设计

### 问题与优化
- [编辑器 DOM 同步优化](../../../../docs/specs/editor-dom-sync-timing-analysis/optimization-plan.md) - 性能优化方案
- [reportEditor 模块组织问题](../../../../docs/issues/report-editor-organization-issues.md) - 模块架构问题记录

## 🎯 功能特性

- **富文本编辑**: 基于 TinyMCE 的完整编辑功能
- **AI 辅助写作**: 集成 AI 内容生成和改写
- **章节管理**: 支持章节级别的内容操作
- **文本改写预览**: 悬浮预览 AI 改写内容
- **引用管理**: 支持引用标记和跳转
- **双模式支持**: 编辑模式和预览模式

## 💡 使用方式

```tsx
import { ReportEditor } from '@/components/ReportEditor';

<ReportEditor
  initialValue="初始内容"
  mode="edit"
  onContentChange={(html) => console.log(html)}
  onAIInvoke={(data) => handleAIInvoke(data)}
  textRewriteState={rewriteState}
  onTextRewriteDecision={handleRewriteDecision}
/>
```
