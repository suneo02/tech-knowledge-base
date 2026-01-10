# comp - 企业详情 AI 右侧栏组件目录

存放企业详情 AI 右侧栏页面的子组件。

## 目录树

```
comp/
├── AIConversationIframe/    # AI 对话 iframe 组件（已废弃，保留用于回退）
├── ChatMessageCore/         # AI 聊天核心组件
├── OperatorHeader/          # 顶部操作栏组件
└── ScrollContent/           # 滚动容器组件
```

## 关键文件说明

| 组件 | 作用 |
|------|------|
| **ChatMessageCore** | AI 聊天核心组件，负责消息展示、发送、历史记录恢复等功能 |
| **OperatorHeader** | 顶部操作栏，提供收藏、导出报告、AI 助手切换等功能 |
| **ScrollContent** | 滚动容器组件，提供统一的滚动区域 |
| **AIConversationIframe** | 已废弃，使用 iframe 嵌入 AI 对话页面的方案，已被 ChatMessageCore 替代 |

## 依赖示意

```
comp/
├── ChatMessageCore
│   └─> ai-ui (聊天基础能力)
├── OperatorHeader
│   └─> ToolsBar (@/components/toolsBar)
└── ScrollContent
```

- **上游依赖**：ai-ui、@/components/toolsBar
- **下游使用**：CompanyDetailAIRight 页面

## 相关文档

- [ChatMessageCore 详细说明](./ChatMessageCore/README.md)
- [组件开发规范](../../../../docs/rule/code-react-component-rule.md)

