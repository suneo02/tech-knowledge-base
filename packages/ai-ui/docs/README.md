# AI-UI 文档中心

## 一句话定位
本目录负责存放 AI-UI 组件库的完整文档体系，包括组件使用指南、API 参考、设计规范和最佳实践。

## 目录树
```
packages/ai-ui/docs/
├── README.md                   # 文档中心首页（本文件）
├── chat-hooks.md               # Chat Hooks 设计文档
├── chat-messages.md            # Chat Messages 设计文档
├── chat-roles.md               # Chat Roles 设计文档
├── components/                 # 组件文档目录
│   ├── WindChart/             # 图表组件文档
│   └── misc/                  # 其他组件文档
├── guides/                    # 使用指南
│   ├── getting-started.md     # 快速开始指南
│   ├── migration.md           # 迁移指南
│   └── best-practices.md      # 最佳实践
├── api/                       # API 参考
│   ├── chat-api.md            # 聊天相关 API
│   └── chart-api.md           # 图表相关 API
└── assets/                    # 文档资源
    ├── images/                # 图片资源
    └── examples/              # 示例代码
```

## 关键文件说明

### README.md（本文件）
- **作用**：文档中心导航页，提供整体概览和文档索引
- **读者**：新接入 AI-UI 的开发者、产品经理、技术负责人
- **内容**：快速导航、使用场景指引、文档结构说明

### 核心设计文档（根目录）
- **chat-hooks.md**：Chat Hooks 设计文档
  - 详细阐述聊天系统的自定义 Hooks 架构
  - 包含 `useChatBase`、`useConversationSetupBase`、`useXChatParser`、`useChatRestore` 等
  - 提供完整的状态管理、错误处理、性能优化方案
- **chat-messages.md**：Chat Messages 设计文档
  - 完整的聊天消息组件系统设计
  - 包含虚拟化渲染、流式更新、消息类型识别等功能
  - 详细的组件架构和性能优化策略
- **chat-roles.md**：Chat Roles 设计文档
  - 完整的角色系统架构设计
  - 支持多种角色类型和权限控制
  - 灵活的角色渲染器扩展机制

### components/ 目录
- **作用**：存放其他 UI 组件的详细文档
- **特点**：每个组件独立目录，包含概览、API、示例等
- **重点**：**WindChart 组件**：数据可视化图表组件

### guides/ 目录
- **作用**：提供场景化的使用指导和开发流程
- **特点**：从业务场景出发，循序渐进
- **重点**：getting-started.md（新手入门）、best-practices.md（性能优化）

### api/ 目录
- **作用**：提供详细的 API 接口说明
- **特点**：包含请求格式、响应格式、错误码等
- **重点**：chat-api.md（聊天接口）、chart-api.md（图表接口）

## 依赖示意

### 上游依赖
- **ai-ui/src/**：文档同步的源码实现
- **docs/rule/**：文档编写规范和模板
- **gel-api/**：API 接口定义和规范

### 下游使用者
- **apps/ai-chat/**：AI 聊天应用
- **apps/report-ai/**：AI 报告应用
- **其他业务应用**：集成 AI 功能的应用

## 文档使用指引

### 新手入门路径
1. 阅读 [快速开始指南](guides/getting-started.md)
2. 了解 [Chat Hooks 设计](chat-hooks.md)
3. 学习 [Chat Messages 系统](chat-messages.md)
4. 掌握 [Chat Roles 角色系统](chat-roles.md)

### 进阶开发路径
1. 阅读 [最佳实践指南](guides/best-practices.md)
2. 查看 [API 参考](api/chat-api.md)
3. 深入学习 [图表组件](components/WindChart/README.md)
4. 掌握 [性能优化策略](chat-messages.md#性能优化策略)
5. 了解 [角色权限系统](chat-roles.md#角色权限控制)

### 问题排查路径
1. 查看 [常见问题](guides/getting-started.md#常见问题)
2. 检查 [API 接口文档](api/chat-api.md)
3. 参考 [错误处理机制](chat-hooks.md#错误处理机制)
4. 查看角色权限问题](chat-roles.md#角色权限控制)
5. 检查消息渲染问题](chat-messages.md#错误处理机制)

## 文档维护规范

### 更新原则
- 代码变更时同步更新文档
- 新增功能必须包含对应文档
- 定期检查文档的准确性和完整性

### 贡献指南
- 遵循 [文档编写规范](../../../docs/rule/documentation-rule.md)
- 使用相对路径引用内部文档
- 保持简洁明了的表达方式

## 相关文档
- [Chat Hooks 设计文档](chat-hooks.md)
- [Chat Messages 设计文档](chat-messages.md)
- [Chat Roles 设计文档](chat-roles.md)
- [AI-UI 架构说明](../architecture.md)
- [AI 对话组件设计文档](../ai-ui.md)
- [前端开发规范](../../../docs/rule/)
- [API 请求规范](../../../docs/rule/api-request-rule.md)