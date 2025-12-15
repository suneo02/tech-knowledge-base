# ai-chat 架构说明

## 目录职责
本项目是一个 AI 对话应用，提供了智能问答和交互功能。

## 目录结构
```
├── src/                      # 应用主要源代码
│   ├── assets/               # 静态资源 (图片、样式等)
│   ├── components/           # 应用特有的 React 组件
│   ├── hooks/                # 自定义 React Hooks
│   ├── store/                # Redux 状态管理
│   └── main.tsx              # 应用入口文件
├── public/                   # 公共静态资源
├── .storybook/               # Storybook 组件文档配置
├── index.html                # 应用 HTML 入口文件
├── package.json              # 项目依赖和脚本配置
└── vite.config.ts            # Vite 构建配置文件
```

## 文件职责说明
- **src/**: 包含了应用的核心逻辑，包括组件、状态管理和自定义 Hooks。
- **public/**: 存放无需构建处理的静态文件。
- **.storybook/**: 用于隔离开发和展示 UI 组件。
- **vite.config.ts**: 定义了应用的开发服务器和构建配置。
- **package.json**: 管理应用的所有依赖项和可执行脚本。

## 模块依赖
- **ai-ui**: 提供 AI 相关的基础 UI 组件。
- **gel-ui**: 提供通用的业务和基础 UI 组件。
- **gel-api**: 封装了与后端 API 的通信。
- **gel-util**: 提供共享的工具函数。
- **gel-types**: 定义了项目共享的 TypeScript 类型。
- **indicator**: 提供指标相关的组件或功能。
- **cde**: (职责待定)
