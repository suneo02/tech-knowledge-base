# TextRewritePreview 组件

文本改写预览组件，用于在悬浮窗中展示 AIGC 生成的文本改写结果。

## 目录结构

```
TextRewritePreview/
├── index.tsx              # 组件主入口，包含预览展示和操作按钮
├── index.module.less      # 样式文件，遵循 BEM 命名规范
└── README.md             # 组件说明文档
```

## 关键文件说明

- **index.tsx** - 主组件文件，集成 `AIAnswerMarkdownViewer` 渲染 Markdown 内容，提供应用/取消操作
- **index.module.less** - 样式文件，使用设计 token 和 BEM 规范，响应式布局

## Props 接口

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| content | string | ✅ | 预览内容（Markdown 格式） |
| isCompleted | boolean | ✅ | AIGC 生成完成状态，控制按钮禁用 |
| onApply | () => void | ✅ | 应用按钮点击回调 |
| onCancel | () => void | ✅ | 取消按钮点击回调 |

## 依赖关系

- **上游依赖**: `AIAnswerMarkdownViewer` (gel-ui)、`Button` (Wind UI)
- **下游使用**: `useTextRewritePreview` Hook、`previewRenderer` 工具

## 相关文档

- [文本改写预览浮窗方案](../../docs/specs/text-ai-rewrite-preview-floating/spec-preview-floating-v1.md)
- [文本改写实现方案](../../docs/specs/text-ai-rewrite-implementation/spec-implementation-v1.md)
- [前端开发规范](../../../docs/rule/)
