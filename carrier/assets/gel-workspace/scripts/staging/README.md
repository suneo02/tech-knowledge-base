# 预发布环境部署脚本

预发布环境专用部署脚本集合，提供模块化、可配置的自动化部署解决方案。

## 目录结构

```
staging/
├── deployStaging.js          # 预发布部署主控制器
├── deploy-tasks.js           # 部署任务模块化定义
├── deploy-config.js          # 预发布部署配置管理
├── env-config.js             # 环境配置动态加载
├── cli-helper.js             # CLI参数解析与帮助信息
├── git-updater.js            # Git仓库更新管理
├── deployNginxConfig.js      # Nginx配置部署与重载
├── troubleshooting.md        # 故障排查文档
├── utils/                    # 预发布工具模块
│   ├── logger.js             # 结构化日志记录器
│   └── executor.js           # 命令执行器封装
└── README.md                 # 本文档
```

## 关键文件说明

| 文件 | 作用 |
|------|------|
| `deployStaging.js` | 预发布部署主控制器，协调整个部署流程 |
| `deploy-tasks.js` | 模块化部署任务定义，支持依赖检查、代码更新、构建等 |
| `deploy-config.js` | 预发布环境配置管理，包括服务器、路径等配置 |
| `cli-helper.js` | CLI参数解析、帮助信息生成和输入验证 |
| `utils/logger.js` | 结构化日志记录器，支持不同级别的日志输出 |

## 依赖关系

- **上游**: `../deploy.js` (统一部署脚本)、项目源码、构建产物
- **下游**: 预发布服务器、Nginx服务、SVN仓库
- **协作**: `../utils/` (通用工具)、Git仓库、CI/CD系统

## 相关文档

- [脚本工具集](../README.md) - 脚本整体架构和使用说明
- [通用工具说明](../utils/README.md) - 通用工具模块详细说明
- [故障排查指南](./troubleshooting.md) - 常见问题解决方案
- [文档编写规范](../../docs/rule/readme-rule.md) - README文档标准