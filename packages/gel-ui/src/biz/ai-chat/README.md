# AI 对话业务组件

提供完整的 AI 对话交互界面和功能组件，支撑智能对话、多角色交互、流式响应等核心功能。

## 目录结构

```
ai-chat/
├── ChatMessage/                    # 聊天消息组件集合
│   ├── ChatInputSendBtn/           # 发送按钮组件
│   │   ├── index.tsx               # 发送按钮主组件
│   │   └── index.module.less       # 按钮样式
│   ├── ChatSenderFooter/           # 发送框底部组件
│   │   ├── index.tsx               # 底部工具栏
│   │   └── index.module.less       # 底部样式
│   ├── DeepThinkBtn.tsx            # 深度思考按钮
│   ├── chatAction.tsx              # 聊天操作菜单
│   └── index.ts                    # 消息组件导出
├── ChatRoles/                      # 聊天角色组件
│   ├── AI/                         # AI 角色相关组件
│   │   ├── avatar.tsx              # AI 头像组件
│   │   ├── header.tsx              # AI 头部信息组件
│   │   └── index.ts                # AI 角色导出
│   ├── components/                 # 角色通用组件
│   │   └── misc.tsx                # 角色杂项组件
│   └── index.ts                    # 角色系统导出
├── Welcome/                        # 欢迎页面组件
│   ├── WelcomeSuper.tsx            # 超级用户欢迎页
│   ├── index.tsx                   # 标准欢迎页
│   ├── style.module.less           # 欢迎页样式
│   └── index.ts                    # 欢迎组件导出
├── Suggestion/                     # 建议提示组件
│   └── RefModal/                   # 引用建议弹窗
├── conversation/                   # 对话管理组件
│   ├── edit/                       # 对话编辑功能
│   │   ├── index.tsx               # 编辑主组件
│   │   └── index.module.less       # 编辑样式
│   ├── group/                      # 对话分组功能
│   │   ├── groupableConfig.tsx     # 分组配置
│   │   └── index.ts                # 分组导出
│   ├── menu/                       # 对话菜单
│   │   └── index.tsx               # 菜单组件
│   └── index.ts                    # 对话管理导出
├── LogoSection/                    # Logo 区域组件
│   └── index.tsx                   # Logo 展示组件
└── index.ts                        # AI 对话模块统一导出
```

## 关键文件说明

- **ChatMessage/**: 聊天消息的核心交互组件，包含发送按钮、操作菜单等
- **ChatRoles/AI/**: AI 助手 Alice 的展示组件，包含头像、头部信息等
- **Welcome/**: 欢迎页面组件，提供新用户引导和快速入门功能
- **conversation/**: 对话管理功能，支持编辑、分组、菜单等高级功能

## 依赖关系

```
ai-chat/
├── 内部依赖
│   ├── assets/alice: 使用 Alice 形象资源
│   ├── common: 使用基础组件库
│   ├── utils/ai-chat: 使用 AI 对话工具
│   └── types/ai-chat: 使用 AI 对话类型
├── 上游依赖
│   ├── react: React 框架
│   ├── antd: UI 组件库
│   └── gel-api: API 数据类型
├── 协作依赖
│   └── ../service/agentRequest: AI Agent 请求服务
└── 被依赖关系
    ├── gel-web: Web 应用主要使用方
    └── 其他业务页面: 嵌入式聊天功能
```

## 核心功能

### 聊天交互
- **消息展示**: 支持 AI 消息、用户消息、系统消息的多样化展示
- **输入交互**: 富文本输入框、发送按钮、快捷操作等完整交互体验
- **操作菜单**: 消息复制、重生成、点赞/踩等交互功能
- **深度思考**: 支持深度思考模式的触发和展示

### AI 助手展示
- **Alice 形象**: 个性化的 AI 助手头像和形象展示
- **角色信息**: AI 助手的身份、能力、状态等信息展示
- **欢迎引导**: 新用户欢迎页面和使用引导

### 对话管理
- **对话编辑**: 支持对话标题修改、内容编辑等管理功能
- **对话分组**: 按主题、时间等维度对对话进行分组管理
- **对话菜单**: 右键菜单、更多操作等高级功能

## 特色功能

### 流式响应支持
- 实时展示 AI 生成的流式内容
- 支持打字机效果和实时更新
- 提供停止生成和重新生成功能

### 个性化体验
- Alice 助手的个性化形象和表情
- 智能建议和快速回复
- 上下文相关的对话引导

## 相关文档

- [Agent 请求服务](../../service/agentRequest/README.md) - AI Agent 请求处理详情
- [AI 对话类型定义](../../types/ai-chat/README.md) - AI 对话类型系统
- [React 组件开发规范](../../../docs/rule/code-react-component-rule.md) - 组件开发指南

## 使用示例

```typescript
import { ChatMessage, WelcomeSection, ChatRoles } from '@/biz/ai-chat'
import type { ChatMessageProps } from '@/types/ai-chat'

// 聊天消息组件
<ChatMessage
  messages={messages}
  onSend={handleSend}
  onRegenerate={handleRegenerate}
  showDeepThink={true}
/>

// 欢迎页面
<WelcomeSection
  userName="用户名"
  suggestions={suggestions}
  onStartChat={handleStartChat}
/>

// AI 角色展示
<ChatRoles.AI.Avatar
  status="thinking"
  mood="happy"
  size="large"
/>
```
