# 开发指南

项目开发流程和规范说明。

## 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0

## 快速开始

```bash
git clone <repository-url>
cd gel-workspace-dev
pnpm install
pnpm dev
```

## 应用访问

| 应用 | 端口 | 访问地址 |
|------|------|---------|
| ai-chat | 3000 | http://localhost:3000 |
| company | 3001 | http://localhost:3001 |
| report-config | 3002 | http://localhost:3002 |
| report-preview | 3003 | http://localhost:3003 |
| report-print | 3004 | http://localhost:3004 |

## 开发命令

### 基础命令

```bash
# 启动开发环境
pnpm dev

# 应用特定开发
pnpm dev:ai-chat     # AI 聊天 (3000)
pnpm dev:company     # 企业管理 (3001)
pnpm dev:report-config  # 报表配置 (3002)

# 构建
pnpm build
pnpm build:company

# 代码质量
pnpm lint
pnpm tsc
pnpm test

# 清理缓存
pnpm clean
```

### run-app 工具

统一应用管理工具，支持开发、构建、部署。

```bash
# 开发模式
pnpm app dev <app>

# 构建
pnpm app build <app>
pnpm app build <app> --staging  # 预发布版本
pnpm app build --all           # 构建所有应用

# 类型检查
pnpm app tsc <app>

# 循环依赖检查
pnpm app check:circular <app>

# Storybook 开发
pnpm app storybook <app>

# 本地预览
pnpm app serve <app>

# 部署
pnpm app deploy-prod <app>
pnpm app deploy-prod --all     # 部署所有应用
pnpm app deploy-staging <app>
```

#### 常用参数

| 参数 | 作用 | 适用命令 |
|------|------|----------|
| `--all` | 操作所有应用 | build, deploy-prod, deploy-staging |
| `--staging` | 预发布版本 | build |
| `--verbose` | 详细输出 | deploy-prod, deploy-staging |
| `--dry-run` | 验证模式 | deploy-prod, deploy-staging |
| `--clear-cache` | 清除缓存 | deploy-prod, deploy-staging |

#### 支持应用

- `ai-chat` - AI 聊天应用
- `company` - 企业主应用
- `report-ai` - 报告 AI 应用
- `report-print` - 报告打印应用
- `report-preview` - 报告预览应用
- `wind-zx` - Wind ZX 应用
- `super-agent` - Super Agent 应用

#### 常用工作流

```bash
# 本地开发
pnpm app dev company

# 代码质量检查
pnpm app tsc company
pnpm app check:circular company

# 构建并本地预览
pnpm app build company
pnpm app serve company

# 部署到生产环境
pnpm app deploy-prod company

# 部署到预发布环境
pnpm app deploy-staging company --verbose
```

## 代码规范

### 提交规范

```bash
git commit -m "feat: 添加新功能"
git commit -m "fix: 修复bug"
git commit -m "docs: 更新文档"
```

### 代码风格

```bash
pnpm lint          # 检查代码风格
pnpm lint:fix      # 自动修复
pnpm format        # 格式化代码
```

## 开发流程

1. 创建功能分支
2. 开发和测试
3. 提交代码（遵循规范）
4. 创建 Pull Request

## 开发问题

| 问题 | 解决方案 |
|------|---------|
| 构建失败 | `pnpm tsc` 检查错误 |
| 类型错误 | 检查 TypeScript 配置 |
| 依赖问题 | `pnpm install` 重新安装 |
| 端口占用 | `lsof -ti:3000 | xargs kill -9` |

## 项目结构

```
apps/          # 应用程序
packages/      # 共享包
docs/         # 项目文档
```

## 相关文档

- [部署文档](./deployment.md) - 本地部署流程
- [预发布部署](./staging-deployment.md) - 预发布环境部署
- [项目架构](./architecture.md) - 架构设计
- [脚本工具集](../scripts/README.md) - 脚本整体架构

## 相关脚本

- [应用管理工具](../scripts/run-app.js) - 统一应用管理入口
- [本地部署器](../scripts/deployers/LocalDeployer.js) - 本地部署实现
- [预发布部署器](../scripts/deployers/StagingDeployer.js) - 预发布部署实现
- [统一部署脚本](../scripts/deploy.js) - 完整部署流程