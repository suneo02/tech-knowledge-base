---
title: 开发环境依赖包构建优化 - 方案设计
version: v1
status: 🚧 进行中
---

[← 返回任务概览](/docs/specs/dev-build-optimization/README.md)

# 开发环境依赖包构建优化 - 方案设计 v1

## 1. 核心策略

**分离开发和生产构建配置**，通过 Vite 的 `mode` 参数控制构建行为：

```
开发模式（mode=development）：
  ✓ minify: false          # 不压缩
  ✓ sourcemap: true        # 生成 sourcemap
  ✓ preserveModules: true  # 保留模块结构
  ✓ target: esnext         # 不降级语法

生产模式（mode=production）：
  ✓ minify: 'esbuild'      # 压缩
  ✓ sourcemap: false       # 不生成 sourcemap
  ✓ preserveModules: true  # 保留模块结构（可选）
  ✓ target: es2015         # 降级语法
```

## 2. 构建配置调整

### 2.1 Vite 配置优化

修改 `packages/*/vite.config.ts`：

| 配置项                      | 开发环境值 | 生产环境值  | 说明           |
| --------------------------- | ---------- | ----------- | -------------- |
| `build.minify`              | `false`    | `'esbuild'` | 控制代码压缩   |
| `build.sourcemap`           | `true`     | `false`     | 生成调试映射   |
| `build.target`              | `'esnext'` | `'es2015'`  | 语法降级程度   |
| `esbuild.minifyIdentifiers` | `false`    | `true`      | 控制变量名混淆 |
| `esbuild.keepNames`         | `true`     | `false`     | 保留函数/类名  |

### 2.2 package.json 脚本调整

```json
{
  "scripts": {
    "dev": "vite build --watch --mode development",
    "build": "npm run clean && vite build --mode production",
    "build:dev": "vite build --mode development"
  }
}
```

## 3. Turbo 配置调整

新增 `build:dev` 任务，用于 dev:debug 模式：

```json
{
  "tasks": {
    "build:dev": {
      "dependsOn": ["^build:dev"],
      "outputs": ["dist/**"]
    }
  }
}
```

## 4. 开发模式选择

| 模式             | 命令                       | packages 构建      | 适用场景                  |
| ---------------- | -------------------------- | ------------------ | ------------------------- |
| **dev**          | `pnpm dev:report-ai`       | production 一次性  | 只开发 app，不改 packages |
| **dev:debug**    | `pnpm dev:debug:report-ai` | development 一次性 | 调试 packages 代码        |
| **完整开发模式** | `pnpm dev:packages` + app  | development watch  | 同时修改 packages         |

## 5. 技术细节

### 5.1 Vite 配置示例

@see packages/cde/vite.config.ts

关键调整：

- 根据 `mode` 参数动态配置 `minify`、`sourcemap`
- CSS Modules 命名规则根据环境区分
- 保持 `preserveModules: true` 便于调试

### 5.2 根 package.json 新增脚本

```json
{
  "scripts": {
    "dev:debug:report-ai": "pnpm app dev:debug report-ai",
    "dev:debug:ai-chat": "pnpm app dev:debug ai-chat",
    "dev:debug:company": "pnpm app dev:debug company"
  }
}
```

## 6. 风险与备选方案

### 6.1 潜在风险

| 风险                   | 影响 | 缓解措施                     |
| ---------------------- | ---- | ---------------------------- |
| 开发构建产物体积增大   | 低   | 仅影响本地开发，不影响生产   |
| 构建时间可能略微增加   | 低   | 通过减少转换步骤可能反而更快 |
| sourcemap 文件占用空间 | 低   | 添加到 .gitignore            |

## 7. 更新记录

| 日期       | 修改人 | 更新内容                |
| ---------- | ------ | ----------------------- |
| 2025-11-20 | -      | 从核心方案拆分设计文档  |
| 2025-11-20 | -      | 新增 dev:debug 模式设计 |

## 相关文档

- [需求分析 v1](/docs/specs/dev-build-optimization/spec-requirements-v1.md)
- [实施计划 v1](/docs/specs/dev-build-optimization/spec-implementation-v1.md)
