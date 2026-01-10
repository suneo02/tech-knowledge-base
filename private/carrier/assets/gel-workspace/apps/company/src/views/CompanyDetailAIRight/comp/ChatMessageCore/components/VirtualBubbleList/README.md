# VirtualBubbleList - 虚拟滚动消息列表组件

用于 AI 聊天场景的虚拟滚动消息列表组件，优化大量消息时的渲染性能。

## 目录树

```
VirtualBubbleList/
├── components/               # 子组件
│   ├── MessageBubble/        # 消息气泡组件
│   ├── PresetQuestions/      # 预设问句组件
│   └── ScrollIndicator/      # 滚动指示器
├── hooks/                    # 自定义钩子
│   ├── useVirtualScroll.ts   # 虚拟滚动钩子
│   └── useMessageGrouping.ts # 消息分组钩子
├── styles/                   # 样式文件
│   └── index.less            # 组件样式
├── VirtualBubbleList.tsx      # 主组件
├── index.ts                  # 导出文件
└── README.md                 # 文档说明
```

## 关键文件说明

| 文件/目录 | 作用 |
|-----------|------|
| **VirtualBubbleList.tsx** | 主组件，整合虚拟滚动功能和消息渲染 |
| **components/MessageBubble** | 消息气泡组件，渲染单个消息 |
| **components/PresetQuestions** | 预设问句组件，展示预设问句列表 |
| **hooks/useVirtualScroll** | 虚拟滚动钩子，管理虚拟滚动逻辑 |
| **hooks/useMessageGrouping** | 消息分组钩子，优化消息显示 |

## 依赖示意

```
VirtualBubbleList
├─> @/components/VirtualList (虚拟列表基础组件)
├─> @/hooks/useScrollPosition (滚动位置钩子)
├─> @/utils/messageHelper (消息处理工具)
└─> @/components/Loading (加载组件)
```

- **上游依赖**：@/components/VirtualList、@/hooks/useScrollPosition、@/utils/messageHelper、@/components/Loading
- **下游使用**：ChatMessageCore 组件

## 相关文档

- [React 组件开发规范](../../../../../../docs/rule/code-react-component-rule.md)
- [样式规范](../../../../../../docs/rule/code-style-less-bem-rule.md)
- [性能优化指南](../../../../../../docs/rule/performance-optimization.md)

