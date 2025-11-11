# wind-zx 架构说明

## 目录职责
本项目是一个使用 Vite 构建的多页面静态网站，主要技术栈为 HTML、CSS 和 jQuery。

## 目录结构
```
├── src/                      # 主要资源文件 (CSS, JavaScript)
│   ├── css/                  # 样式文件
│   └── js/                   # 脚本文件
├── public/                   # 公共静态资源
├── index.html                # 网站首页
├── contact.html              # 联系页面
├── other.html                # 其他页面
├── risk.html                 # 风险页面
├── vite.config.ts            # Vite 构建配置文件
└── package.json              # 项目依赖和脚本配置
```

## 文件职责说明
- **src/**: 包含了网站的样式和交互脚本。
- **.html files**: 定义了网站的各个独立页面。
- **public/**: 存放无需构建处理的静态文件。
- **vite.config.ts**: 定义了多页面应用的构建入口和服务器配置。
- **package.json**: 管理项目的所有依赖项和可执行脚本。

## 模块依赖
- 本项目不依赖 `packages/` 中的共享模块。
