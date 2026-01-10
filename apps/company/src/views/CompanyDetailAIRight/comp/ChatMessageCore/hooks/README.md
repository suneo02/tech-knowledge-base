# hooks - ChatMessageCore 自定义钩子目录

存放 ChatMessageCore 组件使用的自定义钩子，提供状态管理和业务逻辑封装。

## 目录树

```
hooks/
├── usePresetQuestionsVisible.ts  # 预设问句可见性控制钩子
├── useVirtualChat.ts             # 虚拟聊天控制钩子
├── useMessageHistory.ts          # 消息历史管理钩子
├── useScrollPosition.ts          # 滚动位置管理钩子
└── index.ts                      # 钩子导出文件
```

## 关键文件说明

| 文件 | 作用 |
|------|------|
| **usePresetQuestionsVisible.ts** | 预设问句可见性控制钩子，管理预设问句的显示逻辑 |
| **useVirtualChat.ts** | 虚拟聊天控制钩子，管理消息状态和虚拟滚动 |
| **useMessageHistory.ts** | 消息历史管理钩子，处理历史消息的加载和恢复 |
| **useScrollPosition.ts** | 滚动位置管理钩子，处理滚动位置和自动滚动 |
| **index.ts** | 钩子导出文件，统一导出所有钩子 |

## 依赖示意

```
hooks/
├── usePresetQuestionsVisible
│   └─> @/utils/questionHelper (问句工具)
├── useVirtualChat
│   └─> @tanstack/react-virtual (虚拟滚动库)
├── useMessageHistory
│   └─> @/api/chat (聊天 API)
└── useScrollPosition
    └─> @/utils/scrollHelper (滚动工具)
```

- **上游依赖**：@/utils/questionHelper、@tanstack/react-virtual、@/api/chat、@/utils/scrollHelper
- **下游使用**：ChatMessageCore 组件及其子组件

## 相关文档

- [React 钩子开发规范](../../../../../../docs/rule/code-react-component-rule.md#自定义钩子)
- [状态管理规范](../../../../../../docs/rule/state-management.md)
- [性能优化指南](../../../../../../docs/rule/performance-optimization.md)

