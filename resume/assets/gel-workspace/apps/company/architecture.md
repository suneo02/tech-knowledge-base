# company 架构说明

## 目录职责
本项目是一个企业信息查询和数据可视化应用，基于 React 和自定义的 Webpack 构建流程。

## 目录结构
```
├── src/                      # 应用主要源代码
│   ├── components/           # 应用特有的 React 组件
│   ├── pages/                # 页面级组件
│   ├── services/             # API 请求服务
│   └── index.tsx             # 应用入口文件
├── public/                   # 公共静态资源
├── scripts/                  # 自定义构建和开发脚本 (Webpack)
├── config/                   # Webpack 及其他构建工具的配置文件
├── jest.config.mjs           # Jest 测试配置文件
└── package.json              # 项目依赖和脚本配置
```

## 文件职责说明
- **src/**: 包含了应用的核心业务逻辑、页面和组件。
- **scripts/**: 存放用于启动开发服务器和打包应用的 Node.js 脚本，是自定义构建流程的核心。
- **config/**: 存放 Webpack、Babel 等工具的详细配置文件。
- **public/**: 存放无需构建处理的静态文件，如 index.html。
- **package.json**: 管理应用的所有依赖项和可执行脚本。

## 模块依赖
- **gel-ui**: 提供通用的业务和基础 UI 组件。
- **gel-api**: 封装了与后端 API 的通信。
- **gel-util**: 提供共享的工具函数。
- **gel-types**: 定义了项目共享的 TypeScript 类型。
- **ai-ui**: 提供 AI 相关的基础 UI 组件。
- **cde**: (职责待定)
