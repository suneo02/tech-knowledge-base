# report-preview 架构说明

## 目录职责
本项目是一个报告预览应用，用于展示、渲染报告内容，并支持将报告导出为 PDF 文件。

## 目录结构
```
├── src/                      # 应用主要源代码
│   ├── components/           # 应用特有的 React 组件
│   ├── pages/                # 报告预览页面
│   ├── store/                # Redux 状态管理
│   └── main.tsx              # 应用入口文件
├── public/                   # 公共静态资源
├── script/                   # 自动化脚本 (如 PDF 导出)
├── index.html                # 应用 HTML 入口文件
├── vite.config.ts            # Vite 构建配置文件
└── package.json              # 项目依赖和脚本配置
```

## 文件职责说明
- **src/**: 包含了应用的核心逻辑，负责报告数据的获取、渲染和交互。
- **script/**: 存放自动化任务脚本，例如使用 Puppeteer 进行 PDF 导出的功能。
- **public/**: 存放无需构建处理的静态文件。
- **vite.config.ts**: 定义了应用的开发服务器和构建配置。
- **package.json**: 管理应用的所有依赖项和可执行脚本。

## 模块依赖
- **report-preview-ui**: 提供报告预览相关的 UI 组件。
- **report-util**: 提供报告相关的工具函数。
- **detail-page-config**: 提供详情页的配置信息。
- **gel-ui**: 提供通用的业务和基础 UI 组件。
- **gel-api**: 封装了与后端 API 的通信。
- **gel-util**: 提供共享的工具函数。
- **gel-types**: 定义了项目共享的 TypeScript 类型。
