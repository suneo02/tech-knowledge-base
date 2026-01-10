# 业务组件模块

提供面向特定业务场景的高级组件，支撑 AI 对话、企业服务、ESG 分析等核心业务功能。

## 目录结构

```
biz/
├── ai-chat/                        # AI 对话业务组件
│   ├── ChatMessage/                # 聊天消息相关组件
│   │   ├── ChatInputSendBtn/       # 发送按钮组件
│   │   └── ChatSenderFooter/       # 发送框底部组件
│   ├── ChatRoles/                  # 聊天角色组件
│   │   ├── AI/                     # AI 角色组件
│   │   │   ├── avatar.tsx          # AI 头像
│   │   │   └── header.tsx          # AI 头部信息
│   │   └── components/             # 角色通用组件
│   ├── Welcome/                    # 欢迎页面组件
│   ├── Suggestion/                 # 建议提示组件
│   ├── conversation/               # 对话管理组件
│   │   ├── edit/                   # 对话编辑
│   │   ├── group/                  # 对话分组
│   │   └── menu/                   # 对话菜单
│   └── LogoSection/                # Logo 区域组件
├── common/                         # 通用业务组件
│   ├── CorpPresearch/              # 企业预搜索组件
│   ├── tag/                        # 业务标签组件
│   │   ├── CorpIndustryTag         # 企业行业标签
│   │   ├── CorpTag                 # 企业标签
│   │   └── DynamicEventTypeTag     # 动态事件类型标签
│   └── DebugPanel/                 # 调试面板组件
├── corp/                           # 企业相关业务组件
│   ├── Esg/                        # ESG 评级组件
│   ├── CorpAnotherName/            # 企业别名组件
│   └── dynamicEvent/               # 企业动态事件组件
│       ├── homeDynamic.tsx         # 首页动态
│       ├── introDynamic.tsx        # 介绍页动态
│       └── singleDynamic.tsx       # 单个动态展示
└── index.ts                        # 业务组件统一导出
```

## 关键文件说明

- **ai-chat/**: AI 对话核心业务组件，提供完整的聊天交互体验
- **common/CorpPresearch/**: 企业预搜索功能，支持企业搜索历史和建议
- **common/tag/**: 各类业务标签组件，支持企业、行业、事件等场景
- **corp/Esg/**: ESG 评级展示组件，支持多等级评级可视化
- **corp/dynamicEvent/**: 企业动态事件展示组件，用于新闻、公告等场景

## 依赖关系

```
biz/
├── 内部依赖
│   ├── assets: 使用静态资源（图标、图片）
│   ├── common: 依赖基础组件库
│   ├── utils: 使用工具函数
│   └── types: 使用类型定义
├── 上游依赖
│   ├── gel-api: API 数据类型
│   └── antd: 基础 UI 组件
└── 被依赖关系
    ├── gel-web: Web 应用主要消费方
    └── gel-admin: 管理后台消费方
```

## 核心功能

### AI 对话业务
- **聊天界面**: 完整的消息展示、输入框、操作按钮
- **角色系统**: AI 助手、用户等多角色展示和管理
- **对话管理**: 对话历史、编辑、分组、菜单等管理功能
- **欢迎页面**: 个性化欢迎信息和快速入门引导

### 企业信息服务
- **企业搜索**: 智能企业搜索和预搜索功能
- **企业标签**: 行业、类型、属性等多种标签展示
- **ESG 评级**: 企业环境、社会、治理评级可视化
- **动态事件**: 企业新闻、公告等动态信息展示

### 通用业务组件
- **调试面板**: 开发环境调试和配置工具
- **业务标签**: 可复用的标签组件集

## 相关文档

- [AI 对话组件详细文档](./ai-chat/README.md) - AI 对话功能详细说明
- [Agent 请求服务](../service/agentRequest/README.md) - AI Agent 请求处理
- [React 组件开发规范](../../../docs/rule/code-react-component-rule.md) - 组件开发指南

## 使用示例

```typescript
import { ChatMessage, CorpPresearch, ESGRating } from '@/biz'

// AI 对话组件
<ChatMessage
  message={message}
  onSend={handleSend}
  onRegenerate={handleRegenerate}
/>

// 企业预搜索
<CorpPresearch
  onSearch={handleCorpSearch}
  history={searchHistory}
/>

// ESG 评级展示
<ESGRating
  rating="AA"
  showDetails={true}
  size="large"
/>
```
