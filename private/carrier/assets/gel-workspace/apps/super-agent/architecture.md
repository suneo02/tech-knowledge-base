# super-agent 架构说明

## 目录职责
本项目是一个基于 React 和 Vite 的通用前端应用模板。

## 目录结构
```
├── src/                      # 应用主要源代码
│   ├── components/           # 应用特有的 React 组件
│   ├── pages/                # 页面级组件
│   └── main.tsx              # 应用入口文件
├── public/                   # 公共静态资源
├── index.html                # 应用 HTML 入口文件
├── vite.config.ts            # Vite 构建配置文件
└── package.json              # 项目依赖和脚本配置
```

## 文件职责说明
- **src/**: 包含了应用的核心业务逻辑、页面和组件。
- **public/**: 存放无需构建处理的静态文件。
- **vite.config.ts**: 定义了应用的开发服务器和构建配置。
- **package.json**: 管理应用的所有依赖项和可执行脚本。

## 模块依赖
- **gel-ui**: 提供通用的业务和基础 UI 组件。
- **gel-util**: 提供共享的工具函数。
