# outline

大纲相关组件库，包含大纲编辑器和展示组件

## 目录结构

```
outline/
├── OutlineTreeEditor/         # 大纲树形编辑器
│   ├── components/            # UI 组件
│   ├── context/               # 状态管理
│   ├── core/                  # 领域逻辑
│   ├── hooks/                 # 业务 Hook
│   ├── styles/                # 样式文件
│   ├── types/                 # 类型定义
│   └── index.tsx              # 主组件
├── OutlineView/               # 大纲展示组件
│   ├── ChapterNode.tsx        # 章节节点
│   ├── ChapterNodeBase.tsx    # 章节基础组件
│   └── index.tsx              # 主组件
├── FreeOutlineEditor/         # 自由大纲编辑器
│   ├── config.ts              # 配置
│   ├── utils.ts               # 工具函数
│   └── index.tsx              # 主组件
├── pathUtils.ts               # 路径工具函数
└── index.ts                   # 统一导出
```

## 核心组件职责

### OutlineTreeEditor

大纲树形编辑器，支持多层级编辑、乐观更新和 AI 思路生成

### OutlineView

大纲展示组件，支持章节导航、进度指示和层级编号

### FreeOutlineEditor

自由大纲编辑器，提供简化的大纲编辑功能

## 模块依赖

```
大纲页面
  ├─> OutlineTreeEditor (编辑器)
  │   ├─> context (状态管理)
  │   ├─> core (领域逻辑)
  │   └─> hooks (业务 Hook)
  └─> OutlineView (展示)
      └─> pathUtils (路径工具)
```

## 相关文档

- [大纲编辑器设计](../../../../docs/RPOutline/OutlineEditor/design.md) - 大纲编辑器完整设计
- [大纲模块设计](../../../../docs/RPOutline/design.md) - 大纲模块整体设计
- [自动保存方案](../../../../docs/shared/auto-save-design.md) - 通用自动保存设计
