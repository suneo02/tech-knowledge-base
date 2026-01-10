# ChatMessageCore - AI 聊天核心组件

企业详情 AI 右侧栏的聊天核心组件，负责消息展示、发送、历史记录恢复等功能。

## 目录树

```
ChatMessageCore/
├── components/               # 子组件
│   ├── VirtualBubbleList/    # 虚拟滚动消息列表
│   └── MessageItem/          # 消息项组件
├── hooks/                    # 自定义钩子
│   ├── usePresetQuestionsVisible.ts  # 预设问句可见性控制
│   └── useVirtualChat.ts     # 虚拟聊天控制
├── styles/                   # 样式文件
│   └── index.less            # 组件样式
├── ChatMessageCore.tsx       # 主组件
├── index.ts                  # 导出文件
└── README.md                 # 文档说明
```

## 关键文件说明

| 文件/目录 | 作用 |
|-----------|------|
| **ChatMessageCore.tsx** | 主组件，整合聊天功能的核心逻辑 |
| **components/VirtualBubbleList** | 虚拟滚动消息列表，优化大量消息时的性能 |
| **hooks/usePresetQuestionsVisible** | 预设问句可见性控制钩子 |
| **hooks/useVirtualChat** | 虚拟聊天控制钩子，管理消息状态和滚动 |
| **styles/index.less** | 组件样式文件 |

## 依赖示意

```
ChatMessageCore
├─> ai-ui (聊天基础能力)
├─> @/components/MessageItem
├─> @/hooks/useScrollPosition
└─> @/utils/messageHelper
```

- **上游依赖**：ai-ui、@/components/MessageItem、@/hooks/useScrollPosition、@/utils/messageHelper
- **下游使用**：CompanyDetailAIRight 页面

## 相关文档

- [虚拟滚动消息列表详细说明](./components/VirtualBubbleList/README.md)
- [预设问句钩子说明](./hooks/README.md)
- [React 组件开发规范](../../../../../../docs/rule/code-react-component-rule.md)
- [样式规范](../../../../../../docs/rule/code-style-less-bem-rule.md)

