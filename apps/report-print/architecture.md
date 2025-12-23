# report-print 架构说明

## 目录职责
本项目是一个使用 Webpack 和 wkhtmltopdf 将 HTML 报告导出为 PDF 的服务。

## 目录结构
```
├── src/                      # 报告模板和主要逻辑
│   └── index.js              # 脚本入口文件
├── public/                   # 静态资源
├── scripts/                  # 自动化导出脚本
├── server.js                 # 用于本地开发的 Express 服务器
├── webpack.config.js         # Webpack 构建配置文件
└── package.json              # 项目依赖和脚本配置
```

## 文件职责说明
- **src/**: 包含用于生成报告的模板和客户端逻辑。
- **scripts/**: 存放核心的 PDF 导出脚本，调用 wkhtmltopdf。
- **server.js**: 在开发模式下，提供一个本地服务器来预览报告。
- **webpack.config.js**: 定义了项目的构建流程，将 `src` 中的代码打包。
- **package.json**: 管理项目的所有依赖项和可执行脚本。

## 模块依赖
- **report-util**: 提供报告相关的工具函数。
- **detail-page-config**: 提供详情页的配置信息。
- **gel-types**: 定义了项目共享的 TypeScript 类型。
