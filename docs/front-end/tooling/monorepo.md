# Monorepo 架构与实践

## 概述

Monorepo（单一仓库）是一种项目代码管理方式，指在单个仓库中管理多个项目，有助于简化代码共享、版本控制、构建和部署等方面的复杂性，并提供更好的可重用性和协作性。Monorepo 提倡了开放、透明、共享的组织文化，这种方法已经被很多大型公司广泛使用，如 Google、Facebook 和 Microsoft 等。

## Monorepo vs MultiRepo

### 优劣对比

| 场景 | MultiRepo | MonoRepo |
|------|-----------|----------|
| **代码可见性** | ✅ 代码隔离，研发者只需关注自己负责的仓库<br>❌ 包管理按照各自 owner 划分，当出现问题时，需要到依赖包中进行判断并解决 | ✅ 一个仓库中多个相关项目，很容易看到整个代码库的变化趋势，更好的团队协作<br>❌ 增加了非 owner 改动代码的风险 |
| **依赖管理** | ❌ 多个仓库都有自己的 node_modules，存在依赖重复安装情况，占用磁盘内存大 | ✅ 多项目代码都在一个仓库中，相同版本依赖提升到顶层只安装一次，节省磁盘内存 |
| **代码权限** | ✅ 各项目单独仓库，不会出现代码被误改的情况，单个项目出现问题不会影响其他项目 | ❌ 多个项目代码都在一个仓库中，没有项目粒度的权限管控，一个项目出问题，可能影响所有项目 |
| **开发迭代** | ✅ 仓库体积小，模块划分清晰，可维护性强<br>❌ 多仓库来回切换（编辑器及命令行），项目多的话效率很低<br>❌ 多仓库见存在依赖时，需要手动 `npm link`，操作繁琐<br>❌ 依赖管理不便，多个依赖可能在多个仓库中存在不同版本，重复安装，npm link 时不同项目的依赖会存在冲突 | ✅ 多个项目都在一个仓库中，可看到相关项目全貌，编码非常方便<br>✅ 代码复用高，方便进行代码重构<br>❌ 多项目在一个仓库中，代码体积多大几个 G，`git clone` 时间较长<br>✅ 依赖调试方便，依赖包迭代场景下，借助工具自动 npm link，直接使用最新版本依赖，简化了操作流程 |
| **工程配置** | ❌ 各项目构建、打包、代码校验都各自维护，不一致时会导致代码差异或构建差异 | ✅ 多项目在一个仓库，工程配置一致，代码质量标准及风格也很容易一致 |
| **构建部署** | ❌ 多个项目间存在依赖，部署时需要手动到不同的仓库根据先后顺序去修改版本及进行部署，操作繁琐效率低 | ✅ 构建性 Monorepo 工具可以配置依赖项目的构建优先级，可以实现一次命令完成所有的部署 |

## Monorepo 工具对比

### 主流工具特性对比

| 工具 | Turborepo | Rush | Nx | Lerna | Pnpm Workspace |
|------|-----------|------|-----|-------|----------------|
| **依赖管理** | ❌ | ✅ | ❌ | ❌ | ✅ |
| **版本管理** | ❌ | ✅ | ❌ | ✅ | ❌ |
| **增量构建** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **插件扩展** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **云端缓存** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Stars** | 20.4K | 4.9K | 17K | 34.3K | 22.7K |

### 工具详细介绍

#### Lerna

**特点：**
- 老牌 Monorepo 管理工具
- 专注于版本管理和发布
- 社区成熟，插件丰富

**使用示例：**

```bash
# 安装
npm install -g lerna

# 初始化
lerna init

# 创建包
lerna create package-a

# 安装依赖
lerna bootstrap

# 发布
lerna publish
```

**lerna.json 配置：**

```json
{
  "version": "independent",
  "npmClient": "pnpm",
  "useWorkspaces": true,
  "packages": [
    "packages/*"
  ],
  "command": {
    "publish": {
      "conventionalCommits": true,
      "message": "chore(release): publish"
    }
  }
}
```

#### Pnpm Workspace

**特点：**
- 快速、节省磁盘空间
- 原生支持 Monorepo
- 严格的依赖管理

**使用示例：**

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'apps/*'
  - '!**/test/**'
```

**package.json：**

```json
{
  "scripts": {
    "dev": "pnpm --filter @myapp/web dev",
    "build": "pnpm -r build",
    "test": "pnpm -r test"
  }
}
```

**常用命令：**

```bash
# 在根目录安装依赖
pnpm install

# 为特定包安装依赖
pnpm --filter @myapp/web add vue

# 在所有包中运行脚本
pnpm -r build

# 在特定包中运行脚本
pnpm --filter @myapp/web dev
```

#### Turborepo

**特点：**
- 专注于构建速度优化
- 智能增量构建
- 远程缓存支持

**使用示例：**

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    },
    "dev": {
      "cache": false
    }
  }
}
```

**常用命令：**

```bash
# 构建所有包
turbo run build

# 运行测试
turbo run test

# 开发模式
turbo run dev
```

#### Nx

**特点：**
- 强大的依赖图分析
- 智能任务编排
- 丰富的插件生态

**使用示例：**

```json
// nx.json
{
  "tasksRunnerOptions": {
    "default": {
      "runner": "@nrwl/workspace/tasks-runners/default",
      "options": {
        "cacheableOperations": ["build", "test", "lint"]
      }
    }
  }
}
```

**常用命令：**

```bash
# 生成新应用
nx generate @nrwl/react:app myapp

# 构建
nx build myapp

# 查看依赖图
nx dep-graph

# 运行受影响的测试
nx affected:test
```

## 选型建议

### 渐进式架构方案

建议采用渐进式架构方案：

1. **轻量级阶段**：初期可以选择 **Lerna + pnpm workspace + lerna-changelog**
   - 解决依赖管理问题
   - 解决版本发布问题
   - 为开发者带来便利

2. **扩展阶段**：随着项目迭代，代码变多或多个项目间依赖关系复杂时
   - 可以很平滑的接入 **Nx** 或 **Turborepo** 来提升构建打包效率
   - 利用增量构建和缓存机制
   - 优化 CI/CD 流程

### 具体选择建议

**选择 Lerna + Pnpm Workspace 如果：**
- 项目规模中小型
- 主要关注依赖管理和版本发布
- 团队对 npm 发布有较高要求

**选择 Turborepo 如果：**
- 需要极致的构建速度
- 项目构建任务较重
- 需要远程缓存能力

**选择 Nx 如果：**
- 项目规模大型
- 需要强大的代码生成和重构工具
- 需要完整的开发工具链

**选择 Rush 如果：**
- 企业级大型项目
- 需要严格的版本策略
- 需要完善的权限控制

## Monorepo 最佳实践

### 1. 目录结构

```
my-monorepo/
├── packages/           # 公共包
│   ├── shared/        # 共享工具
│   ├── ui/            # UI 组件库
│   └── utils/         # 工具函数
├── apps/              # 应用
│   ├── web/           # Web 应用
│   ├── mobile/        # 移动应用
│   └── admin/         # 管理后台
├── configs/           # 共享配置
│   ├── eslint/
│   ├── typescript/
│   └── jest/
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── tsconfig.base.json
```

### 2. 依赖管理

```json
{
  "dependencies": {
    "@myapp/shared": "workspace:*",
    "@myapp/ui": "workspace:*"
  }
}
```

### 3. 统一的工程配置

**根目录 tsconfig.base.json：**

```json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

**子包继承：**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist"
  }
}
```

### 4. CI/CD 优化

利用增量构建，只构建和测试受影响的包：

```yaml
# GitHub Actions 示例
name: CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build affected
        run: pnpm turbo run build --filter=[HEAD^1]
      
      - name: Test affected
        run: pnpm turbo run test --filter=[HEAD^1]
```

### 5. 版本管理策略

**独立版本（Independent）：**
- 每个包独立版本号
- 适合组件库、工具库

**固定版本（Fixed）：**
- 所有包使用统一版本号
- 适合紧密关联的应用

### 6. 代码共享

**创建共享包：**

```typescript
// packages/shared/src/index.ts
export const formatDate = (date: Date): string => {
  return date.toISOString()
}

export * from './utils'
export * from './types'
```

**在应用中使用：**

```typescript
// apps/web/src/App.tsx
import { formatDate } from '@myapp/shared'

const date = formatDate(new Date())
```

## 常见问题与解决方案

### 1. 依赖提升问题

**问题：** 某些包在子包中无法找到

**解决：**

```yaml
# .npmrc
public-hoist-pattern[]=*eslint*
public-hoist-pattern[]=*prettier*
shamefully-hoist=true
```

### 2. TypeScript 路径解析

**问题：** 跨包引用类型提示不正确

**解决：**

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@myapp/*": ["packages/*/src"]
    }
  }
}
```

### 3. 构建顺序问题

**问题：** 包之间有依赖关系，构建顺序混乱

**解决：** 使用 Turborepo 或 Nx 的依赖图自动排序

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"]
    }
  }
}
```

## 延伸阅读

- [Pnpm 包管理器](./package-managers.md)
- [Nx 和 Turborepo 对比](https://nx.dev/more-concepts/turbo-and-nx)
- [Lerna vs Turbopack vs Rush](https://byteofdev.com/posts/lerna-vs-turbopack-rush)
- [Monorepo 工具比较](https://monorepo.tools/)

