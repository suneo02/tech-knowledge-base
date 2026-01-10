# 工具函数模块

提供通用的工具函数库，支撑业务逻辑处理、数据转换、兼容性处理等功能。

## 目录结构

```
utils/
├── ai-chat/                        # AI 对话相关工具
│   ├── messageUtils.ts             # 消息处理工具
│   ├── contextUtils.ts             # 上下文工具
│   ├── streamUtils.ts              # 流式处理工具
│   └── index.ts                    # AI 对话工具导出
├── compatibility/                  # 兼容性工具
│   ├── browser.ts                  # 浏览器兼容性
│   ├── polyfill.ts                 # Polyfill 补丁
│   └── index.ts                    # 兼容性工具导出
├── index.ts                        # 工具函数统一导出
├── date.ts                         # 日期处理工具
├── format.ts                       # 格式化工具
├── storage.ts                      # 存储工具
├── url.ts                          # URL 处理工具
└── validation.ts                   # 验证工具
```

## 关键文件说明

- **ai-chat/**: AI 对话相关的专用工具函数，支持消息处理、上下文管理等
- **compatibility/**: 浏览器兼容性处理工具，确保跨浏览器一致性
- **date.ts**: 日期格式化、计算、转换等处理工具
- **format.ts**: 数据格式化工具，支持数字、货币、百分比等
- **validation.ts**: 数据验证工具，支持表单验证、格式检查等

## 依赖关系

```
utils/
├── 上游依赖
│   ├── lodash: 工具函数库
│   ├── dayjs: 日期处理库
│   └── 浏览器 API: 原生接口
├── 内部依赖
│   ├── types: 使用类型定义
│   └── constants: 使用常量定义
└── 被依赖关系
    ├── 所有模块: 通用工具函数消费
    ├── biz: 业务逻辑工具
    ├── service: 服务层工具
    └── common: 组件工具函数
```

## 核心功能

### AI 对话工具
- **消息处理**: 消息格式化、内容提取、状态判断等
- **上下文管理**: 上下文创建、更新、合并等操作
- **流式处理**: 流式数据解析、缓冲、处理等工具

### 兼容性处理
- **浏览器兼容**: 处理不同浏览器的 API 差异
- **Polyfill**: 提供缺失功能的兼容实现
- **版本检测**: 浏览器版本和环境检测

### 数据处理工具
- **日期工具**: 格式化、计算、转换等日期操作
- **格式化工具**: 各种数据类型的格式化处理
- **验证工具**: 数据格式和业务规则验证
- **存储工具**: 本地存储的封装和管理

## 设计原则

### 纯函数优先
- 无副作用的纯函数设计
- 可预测的输入输出关系
- 易于测试和调试

### 类型安全
- 完整的 TypeScript 类型支持
- 严格的参数类型检查
- 泛型支持灵活扩展

### 性能优化
- 避免不必要的计算和内存分配
- 使用高效的算法和数据结构
- 提供缓存和记忆化机制

### 向后兼容
- 保持 API 的向后兼容性
- 渐进式的功能升级
- 完善的版本管理

## 相关文档

- [TypeScript 规范](../../../docs/rule/code-typescript-style-rule.md) - TypeScript 开发规范
- [错误处理规范](../../../docs/rule/code-error-boundary-rule.md) - 错误处理指南

## 使用示例

```typescript
import {
  formatDate,
  validateEmail,
  generateId
} from '@/utils'

import {
  formatMessage,
  parseStreamData,
  createChatContext
} from '@/utils/ai-chat'

// 日期格式化
const formattedDate = formatDate(new Date(), 'YYYY-MM-DD')

// 邮箱验证
const isValid = validateEmail('user@example.com')

// ID 生成
const id = generateId('msg')

// AI 对话工具
const message = formatMessage(rawMessage, 'markdown')
const context = createChatContext(config, initialState)
const streamData = parseStreamData(rawStream)
```
