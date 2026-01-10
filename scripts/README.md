# 脚本工具集

项目构建、部署和开发管理的统一脚本工具集，提供从开发到部署的完整自动化支持。

## 目录结构

```
scripts/
├── run-app.js                  # 应用管理统一入口 (dev/build/deploy)
├── deploy.js                   # 统一部署脚本主入口
├── build-and-deploy.js         # 构建部署一体化脚本
├── local-ci.js                 # 本地CI模拟脚本
├── find-directories.js         # 查找需要创建README的目录
├── process-area-json.js        # 地区JSON数据处理脚本
├── jsonSort.cjs                # JSON文件排序工具
├── jsonLikeFileIntl.cjs        # 类JSON国际化文件处理
├── staging/                    # 预发布环境专用脚本集合
│   ├── deployStaging.js        # 预发布部署主逻辑
│   ├── deploy-tasks.js         # 部署任务模块化定义
│   ├── deploy-config.js        # 预发布部署配置管理
│   ├── env-config.js           # 环境配置动态加载
│   ├── cli-helper.js           # CLI参数解析与帮助
│   ├── git-updater.js          # Git仓库更新管理
│   ├── deployNginxConfig.js    # Nginx配置部署脚本
│   ├── troubleshooting.md      # 故障排查文档
│   └── utils/                  # 预发布工具模块
│       ├── logger.js           # 结构化日志记录
│       └── executor.js         # 命令执行器封装
└── utils/                      # 通用工具模块
    └── fileProcessor.cjs       # 文件处理通用工具
```

## 关键文件说明

| 文件 | 作用 |
|------|------|
| `run-app.js` | 应用开发、构建、部署的统一入口，支持多应用管理 |
| `deploy.js` | 本地和预发布环境部署核心逻辑 |
| `build-and-deploy.js` | 构建部署一体化，支持自动化流程 |
| `staging/deployStaging.js` | 预发布环境部署主控制器 |
| `staging/deploy-tasks.js` | 模块化部署任务定义和执行 |
| `utils/fileProcessor.cjs` | 文件类型检测、过滤等通用处理工具 |

## 依赖关系

- **上游**: 项目源码、package.json、构建配置文件
- **下游**: 本地SVN目录、预发布服务器、生产环境
- **协作**: pnpm workspace、turbo monorepo、Node.js环境

## 相关文档

- [预发布部署说明](./staging/README.md) - 预发布环境专用文档
- [通用工具说明](./utils/README.md) - 工具模块详细说明
- [前端开发规范](../docs/rule/) - TypeScript、React、样式等规范
- [文档编写规范](../docs/rule/doc-readme-structure-rule.md) - README文档标准
- [项目根目录](../README.md) - 项目整体介绍
