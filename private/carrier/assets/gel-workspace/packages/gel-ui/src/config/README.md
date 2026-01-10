# 配置文件模块

提供应用的各种配置文件，包括 AI 对话配置、环境配置、功能开关等。

## 目录结构

```
config/
├── ai-chat/                        # AI 对话配置
│   ├── defaultConfig.ts            # 默认配置
│   ├── modelConfig.ts              # 模型配置
│   ├── promptConfig.ts             # 提示词配置
│   ├── themeConfig.ts              # 主题配置
│   └── index.ts                    # AI 对话配置导出
├── index.ts                        # 配置统一导出
├── app.ts                          # 应用基础配置
├── api.ts                          # API 配置
├── storage.ts                      # 存储配置
└── theme.ts                        # 主题配置
```

## 关键文件说明

- **ai-chat/defaultConfig.ts**: AI 对话的默认配置，包含基础设置和行为定义
- **ai-chat/modelConfig.ts**: AI 模型相关配置，支持多模型切换和参数设置
- **ai-chat/promptConfig.ts**: 系统提示词和场景化提示配置
- **app.ts**: 应用级的基础配置，包含版本、环境等信息
- **api.ts**: API 接口配置，包含地址、超时、重试等设置

## 依赖关系

```
config/
├── 上游依赖
│   ├── 环境变量: process.env
│   └── 构建配置: webpack/vite
├── 内部依赖
│   ├── constants: 使用常量定义
│   └── types: 使用类型定义
└── 被依赖关系
    ├── 所有模块: 配置消费方
    ├── service: 服务层配置
    ├── hooks: Hooks 配置
    └── biz: 业务组件配置
```

## 核心配置

### AI 对话配置
- **基础配置**: 对话界面、交互行为、默认设置
- **模型配置**: AI 模型选择、参数调整、性能设置
- **提示词配置**: 系统提示、场景化提示、个性化设置
- **主题配置**: 界面主题、样式配置、个性化选项

### 应用配置
- **API 配置**: 接口地址、超时设置、重试策略
- **存储配置**: 缓存策略、存储方式、数据管理
- **环境配置**: 开发、测试、生产环境差异化配置

## 配置设计原则

### 分层配置
```
┌─────────────────┐
│   用户配置       │ ← 用户自定义配置
├─────────────────┤
│   默认配置       │ ← 系统默认配置
├─────────────────┤
│   环境配置       │ ← 环境特定配置
└─────────────────┘
```

### 配置优先级
1. 用户配置（最高优先级）
2. 环境配置
3. 默认配置（最低优先级）

### 类型安全
- 完整的 TypeScript 类型定义
- 配置验证和默认值处理
- 编译时配置检查

## 配置管理

### 动态配置
```typescript
// 支持运行时配置更新
const updateConfig = (newConfig: Partial<ChatConfig>) => {
  config = { ...config, ...newConfig }
  // 触发配置更新事件
  emitConfigChange(config)
}
```

### 配置验证
```typescript
// 配置完整性验证
const validateConfig = (config: ChatConfig): boolean => {
  return (
    config.apiEndpoint &&
    config.modelConfig.modelId &&
    config.maxTokens > 0
  )
}
```

### 环境差异化
```typescript
// 环境特定配置
const envConfig = {
  development: {
    apiEndpoint: 'http://localhost:3000/api',
    debugMode: true
  },
  production: {
    apiEndpoint: 'https://api.example.com',
    debugMode: false
  }
}
```

## 相关文档

- [需求规范](../../../docs/rule/doc-requirements-rule.md) - 需求文档编写规范
- [设计文档](../../../docs/rule/doc-design-rule.md) - 设计文档编写规范

## 使用示例

```typescript
import { aiChatConfig, appConfig } from '@/config'
import { mergeConfig } from '@/config/utils'

// 使用默认配置
const defaultConfig = aiChatConfig.default

// 合并用户配置
const userConfig = {
  theme: 'dark',
  modelConfig: {
    temperature: 0.8
  }
}

const finalConfig = mergeConfig(defaultConfig, userConfig)

// 使用应用配置
const apiEndpoint = appConfig.api.baseURL
const isDevelopment = appConfig.env === 'development'
```
