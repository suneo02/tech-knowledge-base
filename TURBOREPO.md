# Turbo Monorepo 使用指南

本项目使用 [Turborepo](https://turbo.build/) 管理 monorepo 的构建流程，实现高效的并行执行、依赖分析和构建缓存。

## 基本命令

### 构建所有包

```bash
pnpm build
```

### 构建特定包及其依赖

```bash
# 构建 report-config 及其所有依赖
pnpm build:report-config

# 构建 ai-chat 及其所有依赖
pnpm build:ai-chat
```

### 开发模式

```bash
# 启动所有包的开发模式
pnpm dev

# 仅启动 ai-chat 的开发模式
pnpm dev:ai-chat

# 启动 report-config 及其依赖的开发模式
pnpm dev:report-config
```

### 类型检查

```bash
# 对所有包执行 TypeScript 类型检查
pnpm tsc

# 对 report-config 及其依赖执行类型检查
pnpm tsc:report-config

# 对 ai-chat 及其依赖执行类型检查
pnpm tsc:ai-chat
```

#### 排除 Storybook 文件

如果在类型检查时遇到 Storybook 文件的类型错误，可以运行以下命令来更新所有 tsconfig.json 文件，使其排除 stories 相关文件：

```bash
pnpm tsc:exclude-stories
```

这将在所有包的 tsconfig.json 中添加以下排除模式：
- `**/*.stories.*`
- `**/stories/**`
- `**/__tests__/**`
- `**/*.test.*`
- `**/storybook/**`

### 清理构建缓存

```bash
pnpm clean
```

## 过滤器语法

Turborepo 支持强大的过滤器语法，可以精确控制要构建的包：

```bash
# 构建 report-config 及其所有依赖
turbo build --filter=report-config...

# 构建 ai-chat 及其依赖，但不包括 gel-api
turbo build --filter=ai-chat... --filter=!gel-api

# 仅构建 gel-types 和 detail-page-config
turbo build --filter=gel-types --filter=detail-page-config

# 预览构建计划（不实际执行构建）
turbo build --filter=report-config... --dry-run
```

## 缓存机制

Turborepo 会自动缓存构建结果，避免重复构建相同的代码：

- 本地缓存位于 `.turbo` 目录
- 只有当源文件或依赖变化时，才会重新构建
- 通过 `--force` 参数可以强制重新构建，例如：`turbo build --force`

## 依赖关系处理

在 `turbo.json` 中配置了任务之间的依赖关系：

- `dependsOn: ["^build"]` 表示当前包的 build 任务依赖于所有上游依赖包的 build 任务
- `dependsOn: ["^tsc"]` 表示当前包的 tsc 任务依赖于所有上游依赖包的 tsc 任务
- Turborepo 会自动分析 package.json 中的依赖关系，生成构建拓扑图

配置示例（Turbo 2.0 格式）：

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "build/**"]
    },
    "tsc": {
      "dependsOn": ["^tsc"],
      "outputs": []
    }
  }
}
```

在这个例子中，`^` 符号表示依赖关系，意味着 `build` 任务会先构建所有依赖包，然后再构建当前包，同样 `tsc` 任务也会先对所有依赖包执行类型检查，然后再对当前包执行类型检查。

## CI/CD 集成

在 CI 环境中使用时，可以利用 Turborepo 的并行执行和缓存功能加速构建：

```bash
# 并行度为 4
turbo build --filter=report-config... --concurrency=4
```

## 高级功能

- **远程缓存**：可配置 Vercel 远程缓存，加速 CI 和团队协作
- **管道筛选**：通过 `--scope` 和 `--filter` 高级筛选要运行的任务
- **并行度控制**：通过 `--concurrency` 参数控制最大并行任务数

## 从旧版构建脚本迁移

我们已从之前的手动构建方式迁移至 Turborepo：

- **旧版**：使用 `scripts/build-with-deps.js` 手动处理依赖关系
- **新版**：利用 Turborepo 自动计算依赖图，并行构建，自动缓存

新方式的优势：
- 自动化依赖分析，无需手动维护
- 增量构建，只重新构建变更的内容
- 并行执行，加速整体构建过程
- 透明的缓存机制

更多详情请参考 [Turborepo 官方文档](https://turbo.build/docs)。 