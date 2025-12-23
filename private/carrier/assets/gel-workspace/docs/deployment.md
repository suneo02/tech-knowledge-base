# 部署文档

项目构建和部署流程说明。

## 🚀 本地构建

```bash
# 安装依赖
pnpm i

# 构建项目
pnpm build
```

后续流程在公司统一平台进行。

## 🏗️ 构建系统

基于 Turborepo 的 Monorepo 构建系统。

### 核心特性
- **依赖分析**: 自动分析包间依赖关系
- **并行构建**: 多包并行构建，提升效率
- **缓存机制**: 避免重复构建
- **增量构建**: 只构建变更的包

### 构建命令
```bash
# 构建所有包
pnpm build

# 构建特定包
pnpm build:company

# 清理缓存
pnpm clean
```

## 📦 本地 SVN 部署

### 部署命令

```bash
# 构建并部署单个应用
pnpm app deploy-prod company

# 部署所有应用
pnpm app deploy-prod --all

# 详细输出
pnpm app deploy-prod company --verbose
```

### 部署目标

| 应用 | 构建目录 | 部署目标 |
|------|----------|----------|
| company | `apps/company/build` | `browser`, `Company` |
| ai-chat | `apps/ai-chat/dist` | `ai` |
| report-ai | `apps/report-ai/dist` | `reportai` |

## 🌐 应用访问路径

- Company: `/web/Company`
- AI Chat: `/web/ai`
- Report Config: `/web/reportconfig`
- Report Preview: `/web/reportpreview`
- Report Print: `/web/reportprint`

## ❓ 常见问题

### 构建问题

#### 依赖安装失败
```bash
pnpm store prune
rm -rf node_modules
pnpm install
```

#### 构建命令失败
```bash
# 检查构建脚本
npm run build:company

# 重新构建
pnpm build
```

### 部署问题

#### 部署失败
- 检查 SVN 目录权限
- 确认构建产物存在
- 查看部署脚本日志

#### 文件缺失
```bash
# 强制重新构建
pnpm app build <app> --force
```

## 相关文档

- [开发指南](./development.md) - 开发流程
- [预发布部署](./staging-deployment.md) - 预发布环境部署
- [脚本工具集](../scripts/README.md) - 脚本整体架构

## 相关脚本

- [本地部署器](../scripts/deployers/LocalDeployer.js) - 本地 SVN 部署实现
- [应用管理工具](../scripts/run-app.js) - 统一应用管理入口
- [统一部署脚本](../scripts/deploy.js) - 完整部署流程 