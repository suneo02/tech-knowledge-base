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

# 启动开发环境 (推荐使用 turbo)
pnpm turbo dev
```

## 应用访问

| 应用           | 端口 | 访问地址              |
| -------------- | ---- | --------------------- |
| ai-chat        | 3000 | http://localhost:3000 |
| company        | 3001 | http://localhost:3001 |
| report-config  | 3002 | http://localhost:3002 |
| report-preview | 3003 | http://localhost:3003 |
| report-print   | 3004 | http://localhost:3004 |
| super-agent    | 3005 | http://localhost:3005 |

## 开发命令 (Turbo)

我们推荐直接使用 `turbo` 进行开发，以获得最佳性能和缓存体验。

### 启动开发服务器

```bash
# 启动特定应用
pnpm turbo dev --filter=report-ai
pnpm turbo dev --filter=company
pnpm turbo dev --filter=ai-chat

# 调试模式 (packages 源码调试)
pnpm turbo dev:debug --filter=report-ai
```

### 构建应用

```bash
# 构建特定应用
pnpm turbo build --filter=company...

# 注意: 使用 ... 后缀可以同时构建所有依赖项
```

### 代码质量

```bash
# 类型检查
pnpm turbo tsc --filter=ai-chat...

# 循环依赖检查
pnpm turbo check:circular --filter=report-ai...
```

### Storybook

```bash
pnpm turbo storybook --filter=report-ai
```

## 部署流程

我们提供了一系列独立脚本来处理部署任务。

### 1. `scripts/deploy.js` - 仅部署

用于将已构建的产物部署到指定分支。

```bash
# 部署单个应用
node scripts/deploy.js company

# 部署多个应用 !!NEW!!
node scripts/deploy.js company ai-chat

# 部署所有应用 !!NEW!!
node scripts/deploy.js --all

# 配合自定义分支
node scripts/deploy.js company --branch feat/user-login
node scripts/deploy.js --all --branch staging
```

### 2. `scripts/build-and-deploy.js` - 构建并部署

自动执行安装依赖、构建应用、然后调用 `deploy.js` 进行部署。

```bash
# 构建并部署单个应用
node scripts/build-and-deploy.js company

# 构建并部署多个应用 !!NEW!!
node scripts/build-and-deploy.js company ai-chat

# 构建并部署所有应用 !!NEW!!
node scripts/build-and-deploy.js --all

# 配合自定义分支
node scripts/build-and-deploy.js --all --branch staging
```

### 3. `scripts/staging/deploy-staging.js` - 预发布环境

专门用于部署到预发布环境（远程服务器）。

```bash
# 部署单个应用
node scripts/staging/deploy-staging.js company

# 部署所有应用
node scripts/staging/deploy-staging.js --all
```

## 快捷查询

你可以随时运行以下命令查看此帮助指南：

```bash
pnpm guide
# 或者
npm run guide
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

## 常见问题

| 问题     | 解决方案                |
| -------- | ----------------------- | -------------- |
| 构建失败 | `pnpm tsc` 检查错误     |
| 类型错误 | 检查 TypeScript 配置    |
| 依赖问题 | `pnpm install` 重新安装 |
| 端口占用 | `lsof -ti:3000          | xargs kill -9` |

## 项目结构

```
apps/          # 应用程序
packages/      # 共享包
docs/          # 项目文档
scripts/       # 工具脚本
```

## 相关文档

- [部署文档](./deployment.md) - 本地部署流程
- [预发布部署](./staging-deployment.md) - 预发布环境部署
- [项目架构](./architecture.md) - 架构设计
- [脚本工具集](../scripts/README.md) - 脚本整体架构

## 相关脚本

- [应用管理工具](../scripts/guide.js) - 统一应用管理入口 (指南)
- [本地部署器](../scripts/deployers/LocalDeployer.js) - 本地部署实现
- [预发布部署器](../scripts/deployers/StagingDeployer.js) - 预发布部署实现
- [统一部署脚本](../scripts/deploy.js) - 完整部署流程
- [预发布脚本](../scripts/staging/deploy-staging.js) - 预发布部署
- [Nginx配置](../scripts/staging/deploy-nginx-config.js) - Nginx 配置管理
