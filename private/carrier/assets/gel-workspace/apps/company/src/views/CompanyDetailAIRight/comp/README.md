# comp - 企业详情 AI 右侧栏组件目录

存放企业详情 AI 右侧栏页面的子组件。

## 目录结构

```
comp/
├── AIConversationIframe/    # AI 对话 iframe 组件（已废弃，保留用于回退）
├── ChatMessageCore/         # AI 聊天核心组件
├── OperatorHeader/          # 顶部操作栏组件
└── ScrollContent/           # 滚动容器组件
```

## 组件说明

### ChatMessageCore

AI 聊天核心组件，负责消息展示、发送、历史记录恢复等功能。

**职责**:

- 消息列表渲染（虚拟滚动优化）
- 用户输入处理
- 历史消息恢复
- 流式响应处理

**依赖**: `ai-ui` 聊天基础能力

### OperatorHeader

顶部操作栏，提供收藏、导出报告、AI 助手切换等功能。

**职责**:

- 企业名称展示
- 收藏状态管理
- 导出报告触发
- AI 侧边栏显隐控制

### ScrollContent

滚动容器组件，提供统一的滚动区域。

**职责**:

- 滚动事件监听
- 滚动位置管理

### AIConversationIframe（已废弃）

使用 iframe 嵌入 AI 对话页面的方案，已被 ChatMessageCore 替代。

**保留原因**: 作为降级方案备用

## 相关文档

- [ChatMessageCore 详细说明](./ChatMessageCore/README.md)
- [组件开发规范](../../../../../../docs/rule/react-rule.md)
