# GEL UI 组件库源码

提供企业级 AI 应用所需的基础组件、业务组件和工具函数，支持金融、ESG、企业服务等场景。

## 目录结构

```
src/
├── assets/                          # 静态资源文件
│   ├── alice/                      # AI 助手 Alice 形象资源
│   ├── gif/                        # 动图资源
│   ├── header/                     # 头部标识资源
│   ├── icon/                       # 图标资源库
│   ├── img/                        # 图片资源
│   └── esg/                        # ESG 评级图片
├── biz/                            # 业务组件模块
│   ├── ai-chat/                    # AI 对话相关组件
│   ├── common/                     # 通用业务组件
│   └── corp/                       # 企业相关组件
├── common/                         # 通用基础组件
│   ├── AIBox/                      # AI 消息框组件
│   ├── Button/                     # 按钮组件
│   ├── SmartTable/                 # 智能表格组件
│   ├── form/                       # 表单组件集
│   └── message/                    # 消息提示组件
├── config/                         # 配置文件
│   └── ai-chat/                    # AI 对话配置
├── constants/                      # 常量定义
├── hooks/                          # 自定义 Hooks
│   └── aiChat/                     # AI 对话相关 Hooks
├── layout/                         # 布局组件
│   └── WindHeader/                 # Wind 头部布局
├── service/                        # 服务层
│   ├── agentRequest/               # AI Agent 请求服务
│   └── ai-chat/                    # AI 对话服务
├── styles/                         # 样式文件
│   ├── mixin/                      # Less 混入
│   └── shared/                     # 共享样式
├── types/                          # 类型定义
│   ├── ai-chat/                    # AI 对话类型
│   ├── ai-chat-perf/               # AI 对话性能优化类型
│   └── spl/                        # SPL 语言相关类型
├── utils/                          # 工具函数
│   ├── ai-chat/                    # AI 对话工具
│   └── compatibility/              # 兼容性工具
├── __test__/                       # 测试文件
│   └── biz/                        # 业务组件测试
└── stories/                        # Storybook 故事
    ├── biz/                        # 业务组件故事
    └── common/                     # 通用组件故事
```

## 关键文件说明

- **index.ts**: 统一导出入口，整合所有模块的公共接口
- **assets/**: 静态资源管理，包含 Alice 助手形象、图标、ESG 评级等资源
- **biz/ai-chat/**: AI 对话核心业务组件，包含消息、角色、欢迎页等
- **common/**: 通用基础组件库，可复用的 UI 组件集合
- **service/agentRequest/**: AI Agent 请求处理服务，管理完整的对话流程
- **types/**: 完整的 TypeScript 类型系统，支撑强类型开发

## 依赖关系

```
gel-ui/src/
├── 外部依赖
│   ├── react: React 框架核心
│   ├── antd: UI 组件库基础
│   └── gel-api: API 类型和数据结构
├── 内部依赖
│   ├── types ← 所有模块: 类型定义基础
│   ├── utils ← biz, common: 工具函数支持
│   ├── assets ← biz, common: 静态资源
│   └── service ← biz: 服务层支持
└── 下游使用
    ├── gel-web: Web 应用主工程
    ├── gel-admin: 管理后台应用
    └── 其他业务项目: 组件库消费方
```

## 核心能力

### AI 对话体系
- **完整对话流程**: 意图分析 → 数据召回 → 问句拆解 → 流式响应
- **多角色支持**: AI 助手 Alice、用户角色、系统消息等
- **交互组件**: 聊天界面、输入框、消息展示、操作按钮等

### 企业服务组件
- **企业信息展示**: 公司标签、ESG 评级、动态事件等
- **数据表格**: 智能分页、排序、筛选功能
- **表单组件**: 支持复杂业务场景的表单组件集

### 基础组件库
- **通用 UI**: 按钮、输入框、选择器等基础组件
- **业务组件**: AI 消息框、智能表格、进度条等
- **布局组件**: 页面布局、头部导航等

## 技术栈

- **React 18**: 前端框架，支持 Hooks 和并发特性
- **TypeScript**: 强类型语言，提供完整的类型安全
- **Less**: CSS 预处理器，支持模块化和混入
- **Ant Design**: 企业级 UI 设计语言和组件库
- **Storybook**: 组件开发和文档化工具
- **Vitest**: 单元测试框架

## 相关文档

- [业务组件使用指南](./biz/ai-chat/README.md) - AI 对话组件详细说明
- [Agent 请求服务文档](./service/agentRequest/README.md) - AI Agent 请求处理
- [组件开发规范](../../../docs/rule/react-rule.md) - React 组件开发规范
- [样式规范](../../../docs/rule/style-rule.md) - Less Module 样式指南
- [测试规范](../../../docs/rule/testing-rule.md) - 组件测试指南

## 使用示例

```typescript
// 导入 AI 对话组件
import { ChatMessage, WelcomeSection } from '@/biz/ai-chat'

// 导入通用组件
import { SmartTable, AIBox } from '@/common'

// 导入工具函数
import { formatCurrency } from '@/utils'

// 导入类型定义
import type { ChatMessageProps } from '@/types/ai-chat'
```