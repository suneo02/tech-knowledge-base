# common

通用 UI 组件库，提供可编辑内容、复制、生成状态等基础功能

## 目录结构

```
common/
├── ContentEditable/           # 可编辑内容组件
│   ├── index.tsx              # 可编辑内容
│   └── type.ts                # 类型定义
├── CopyOnSelect/              # 选中复制组件
│   └── index.tsx              # 选中复制
├── Generating/                # 生成中状态组件
│   ├── index.tsx              # 生成中状态
│   └── Generating.stories.tsx # Storybook 故事
├── PreviewArea/               # 预览区域组件
│   ├── PreviewArea.tsx        # 预览区域
│   └── types.ts               # 类型定义
└── index.ts                   # 统一导出
```

## 核心组件职责

### ContentEditable

可编辑内容组件，提供内联编辑功能

### CopyOnSelect

选中复制组件，选中文本时自动显示复制按钮

### Generating

生成中状态组件，展示 AI 生成内容时的加载状态

### PreviewArea

预览区域组件，提供内容预览功能

## 模块依赖

```
业务组件
  ├─> ContentEditable (内联编辑)
  ├─> CopyOnSelect (复制功能)
  ├─> Generating (加载状态)
  └─> PreviewArea (预览功能)
```
