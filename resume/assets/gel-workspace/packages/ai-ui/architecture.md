# ai-ui 架构说明

## 目录职责
本模块是一个完整的 AI 对话系统组件库，封装了包括会话管理、消息收发、流式响应和历史消息等核心功能。

## 目录结构
```
├── src/                      # 组件库源代码
│   ├── components/           # 核心 UI 组件 (如 ChatMessageCore)
│   ├── hooks/                # 核心逻辑 Hooks (如 useChatBase)
│   ├── utils/                # 工具函数
│   └── index.ts              # 模块主入口，统一导出所有组件和 Hooks
├── dist/                     # Vite 打包后的产物
├── vite.config.ts            # Vite 构建配置文件
└── package.json              # 项目依赖和脚本配置
```

## 文件职责说明
- **src/components/**: 存放对话系统的核心 UI 渲染组件，负责消息展示和用户交互。
- **src/hooks/**: 存放对话系统的核心业务逻辑，通过自定义 Hooks (如 `useChatBase`, `useConversationSetup`) 进行封装。
- **src/index.ts**: 统一导出该库的所有公共组件和 Hooks，供其他应用使用。
- **vite.config.ts**: 将组件库打包为标准 JS 模块的配置文件。

## 模块依赖
- **gel-ui**: 依赖通用 UI 组件。
- **gel-api**: 依赖 API 请求封装。
- **gel-util**: 依赖共享工具函数。
- 被 `apps/ai-chat`, `apps/report-ai` 等应用所依赖。
