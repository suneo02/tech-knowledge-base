# 脚本工具集

## 更新说明

以下脚本已被迁移到 Turborepo 构建系统，不再推荐使用：

- ~~build.js~~ - 替换为 `turbo build`
- ~~dev.js~~ - 替换为 `turbo dev`
- ~~build-with-deps.js~~ - 替换为 `turbo build --filter=package...`

有关使用 Turborepo 的详细信息，请参考项目根目录的 [TURBOREPO.md](../TURBOREPO.md)。

## TypeScript 类型检查脚本 (tsc-all.js)

可运行 `pnpm tsc:all` 执行此脚本，它会对每个包进行 TypeScript 类型检查，并提供详细的错误报告。

## 发布脚本 (publish.js)

这个脚本会自动处理指定包及其依赖的构建和发布流程。它会按照依赖关系顺序先构建并发布依赖包，然后构建并发布指定的目标包。

### 功能特点

- 自动收集并解析目标包的依赖关系
- 按正确的依赖顺序构建和发布包
- 如果任何包构建或发布失败，会立即停止并报告错误
- 详细的日志输出，清晰展示每个步骤的执行情况

### 使用方法

```bash
node scripts/publish.js <包名称>
```

例如，发布 report-config 包:

```bash
node scripts/publish.js report-config
```

或使用 npm 脚本:

```bash
npm run publish report-config
```

### 配置

发布脚本使用 `common.js` 中的项目配置。要为包启用发布功能，需要在项目配置中添加 `publishCommand`。例如:

```javascript
{
  name: 'report-config',
  devCommand: 'pnpm --filter report-config dev',
  buildCommand: 'pnpm --filter report-config build',
  publishCommand: 'pnpm --filter report-config publish',
  dependsOn: ['gel-types', 'detail-page-config'],
  // ...其他配置
}
```

## Git Auto-Sync Script

这个脚本会自动同步`superlist`分支与所有配置的Git远程仓库。它会持续运行，从所有远程仓库获取更新并推送变更，确保所有仓库保持同步。

### 功能特点

- 自动从所有配置的Git远程仓库获取更新
- 将所有远程仓库的变更拉取到本地`superlist`分支
- 将合并后的变更推送回所有远程仓库
- 使用时间戳记录每个步骤以便监控
- 优雅地处理错误而不会崩溃
- 保留你当前的工作分支

### 使用方法

#### 一次性运行:

```bash
node scripts/git-auto-sync.js
```

或使用npm脚本:

```bash
npm run git-sync
```

#### 后台进程运行:

要在关闭终端后仍然继续运行，可以使用:

```bash
nohup node scripts/git-auto-sync.js > git-sync.log 2>&1 &
```

这将创建一个日志文件并返回一个进程ID，您可以稍后用它来停止该进程。

### 配置

您可以修改脚本顶部的以下变量:

- `BRANCH`: 要同步的分支名称（默认: 'superlist'）
- `INTERVAL_MINUTES`: 同步频率，以分钟为单位（默认: 30）

脚本会自动检测和使用所有配置的Git远程仓库。

### 前提条件

- 必须安装并配置Git，且能够访问所有远程仓库
- 必须安装Node.js
- 必须至少配置一个Git远程仓库 