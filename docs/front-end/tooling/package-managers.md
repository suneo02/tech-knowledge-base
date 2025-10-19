# 包管理器对比与原理

## 概述

包管理器是前端工程化的基础工具，负责管理项目依赖、安装、更新和删除包。主流的包管理器包括 npm、yarn 和 pnpm。

## Pnpm vs Npm

### 为什么 Pnpm 比 Npm 快 {#为什么-pnpm-比-npm-快}

**Pnpm 比 npm 快的原因在于其优化的文件存储方式、依赖管理方式以及并行下载能力。**

#### 1. 内容寻址存储（Content-addressable Storage）

Pnpm 使用基于内容寻址的文件系统来存储磁盘上的所有文件，这意味着它不会在磁盘中重复存储相同的依赖包，即使这些依赖包被不同的项目所依赖。

**传统 npm/yarn 的方式：**

```
project-a/
  node_modules/
    lodash/           # 10MB
    axios/            # 5MB

project-b/
  node_modules/
    lodash/           # 10MB (重复)
    axios/            # 5MB (重复)
```

**Pnpm 的方式：**

```
~/.pnpm-store/
  lodash@4.17.21/    # 10MB (全局唯一存储)
  axios@1.0.0/       # 5MB (全局唯一存储)

project-a/
  node_modules/
    .pnpm/           # 硬链接到全局 store
    lodash -> .pnpm/lodash@4.17.21/node_modules/lodash
    axios -> .pnpm/axios@1.0.0/node_modules/axios

project-b/
  node_modules/
    .pnpm/           # 硬链接到全局 store
    lodash -> .pnpm/lodash@4.17.21/node_modules/lodash
    axios -> .pnpm/axios@1.0.0/node_modules/axios
```

**优势：**
- 节省磁盘空间（相同版本的包只存储一次）
- 加速安装（已存在的包无需重新下载）
- 跨项目共享依赖

#### 2. 并行下载能力

Pnpm 在下载和安装依赖时采用了并行下载的能力，这进一步提高了安装速度。

**性能对比：**

```bash
# npm
npm install  # 串行下载 + 重复安装

# pnpm
pnpm install # 并行下载 + 硬链接复用
```

#### 3. 严格的依赖管理

Pnpm 使用符号链接创建项目依赖项的嵌套结构，这种结构使得：

- 只有在 package.json 中声明的依赖才能被访问
- 防止幽灵依赖（Phantom Dependencies）问题
- 更清晰的依赖关系

**npm/yarn 的扁平化问题：**

```
node_modules/
  package-a/
  package-b/
  package-c/  # package-a 的依赖，但项目代码也能直接引用
```

**pnpm 的嵌套结构：**

```
node_modules/
  .pnpm/
    package-a@1.0.0/
      node_modules/
        package-a/
        package-c/  # 只有 package-a 能访问
  package-a -> .pnpm/package-a@1.0.0/node_modules/package-a
  package-b -> .pnpm/package-b@1.0.0/node_modules/package-b
```

### Pnpm 核心特性

#### 1. Workspace 支持

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'apps/*'
  - '!**/test/**'
```

#### 2. 过滤器（Filter）

```bash
# 只在特定包中运行命令
pnpm --filter @myapp/web dev

# 在所有包中运行
pnpm -r build

# 运行受影响的包
pnpm --filter "...[origin/main]" test
```

#### 3. 依赖管理命令

```bash
# 安装所有依赖
pnpm install

# 添加依赖
pnpm add lodash

# 添加开发依赖
pnpm add -D typescript

# 添加到指定 workspace
pnpm --filter @myapp/web add vue

# 更新依赖
pnpm update

# 删除依赖
pnpm remove lodash
```

#### 4. 配置文件（.npmrc）

```ini
# .npmrc
shamefully-hoist=false
strict-peer-dependencies=true
auto-install-peers=true
public-hoist-pattern[]=*eslint*
public-hoist-pattern[]=*prettier*
```

## Npm、Yarn、Pnpm 对比

| 特性 | Npm | Yarn | Pnpm |
|------|-----|------|------|
| **安装速度** | 慢 | 快 | 最快 |
| **磁盘空间** | 大量重复 | 有缓存 | 最省空间 |
| **依赖结构** | 扁平化 | 扁平化 | 嵌套 + 符号链接 |
| **幽灵依赖** | 存在 | 存在 | 不存在 |
| **Monorepo** | 需要 Lerna | Workspace | Workspace |
| **安全性** | 中 | 高（yarn.lock） | 最高（严格模式） |
| **生态成熟度** | 最成熟 | 成熟 | 快速成长 |

## Npm 工作原理

### npm install 的执行过程 {#npm-install-的执行过程}

1. **读取 package.json 文件**
   - 该文件列出了项目所需要的依赖

2. **解析依赖关系**
   - 根据 package.json 中的依赖信息以及 node_modules 目录状态
   - npm 会决定哪些模块需要下载和安装

3. **版本选择**
   - npm 会查看每个模块的可用版本
   - 选择符合 package.json 中指定版本范围的最新版本进行安装

4. **下载模块**
   - 下载所需模块到本地的 node_modules 目录

5. **递归安装子依赖**
   - 如果模块包含子模块（package.json 中 dependencies 或 devDependencies 中的模块）
   - 则递归执行上述步骤安装这些子模块

### npm run start 的整个过程 {#npm-run-start-的整个过程}

`npm run start` 是一个常见的命令，用于启动基于 Node.js 的应用程序。这个命令实际上是一个快捷方式，它告诉 npm 运行在 package.json 文件中定义的 "start" 脚本。

**执行流程：**

1. **查找 package.json**
   - 查找当前目录下的 package.json 文件

2. **定位 scripts**
   - 在 package.json 文件中，找到 "scripts" 对象

3. **查找 start 脚本**
   - 在 "scripts" 对象中，找到 "start" 键

4. **执行命令**
   - 执行与 "start" 键关联的命令字符串

**示例：**

```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "build": "webpack --mode production"
  }
}
```

当运行 `npm run start` 时，npm 将执行 `node app.js`。

**注意：** `npm start` 和 `npm run start` 效果相同，因为 start 是 npm 的内置脚本之一。

### npm 脚本的生命周期钩子

```json
{
  "scripts": {
    "prestart": "echo 'Before start'",
    "start": "node app.js",
    "poststart": "echo 'After start'",
    
    "prebuild": "rm -rf dist",
    "build": "webpack",
    "postbuild": "echo 'Build complete'"
  }
}
```

执行 `npm start` 时的顺序：
1. prestart
2. start
3. poststart

## 版本管理 {#版本管理}

### 语义化版本（Semver）

版本号格式：`主版本号.次版本号.修订号`（MAJOR.MINOR.PATCH）

- **主版本号（MAJOR）**：不兼容的 API 修改
- **次版本号（MINOR）**：向下兼容的功能性新增
- **修订号（PATCH）**：向下兼容的问题修正

### 版本范围符号

```json
{
  "dependencies": {
    "package-a": "1.0.0",      // 精确版本
    "package-b": "^1.0.0",     // 兼容 1.x.x（不含 2.0.0）
    "package-c": "~1.2.3",     // 兼容 1.2.x（不含 1.3.0）
    "package-d": ">=1.0.0",    // 大于等于 1.0.0
    "package-e": "1.x",        // 任意 1.x.x 版本
    "package-f": "*",          // 任意版本（不推荐）
    "package-g": "latest"      // 最新版本（不推荐）
  }
}
```

### lock 文件

**package-lock.json（npm）：**
- 锁定依赖的确切版本
- 确保团队成员安装相同版本的依赖
- 加速安装过程（记录了下载地址）

**yarn.lock（yarn）：**
- 功能类似 package-lock.json
- 格式更易读

**pnpm-lock.yaml（pnpm）：**
- 格式简洁
- 支持 workspace
- 记录内容寻址信息

## 最佳实践

### 1. 选择合适的包管理器

**选择 npm 如果：**
- 追求稳定性和兼容性
- 团队对 npm 熟悉
- 不在意安装速度和磁盘空间

**选择 yarn 如果：**
- 需要更快的安装速度
- 需要离线安装能力
- 项目已使用 yarn

**选择 pnpm 如果：**
- Monorepo 项目
- 追求最佳性能
- 重视磁盘空间
- 需要严格的依赖管理

### 2. 锁定依赖版本

```bash
# 提交 lock 文件到版本控制
git add package-lock.json
git add yarn.lock
git add pnpm-lock.yaml
```

### 3. 定期更新依赖

```bash
# 检查过时的包
npm outdated
pnpm outdated

# 交互式更新
npx npm-check-updates -i

# 更新所有依赖
npm update
pnpm update
```

### 4. 安全审计

```bash
# npm 审计
npm audit
npm audit fix

# pnpm 审计
pnpm audit
pnpm audit --fix
```

### 5. 使用 .npmrc 配置

```ini
# .npmrc
registry=https://registry.npmmirror.com
save-exact=true
engine-strict=true
```

### 6. 清理缓存

```bash
# npm
npm cache clean --force

# yarn
yarn cache clean

# pnpm
pnpm store prune
```

## 常见问题

### 1. 依赖冲突

**问题：** 不同包依赖同一个包的不同版本

**解决方案：**

```bash
# 查看依赖树
npm ls package-name
pnpm why package-name

# 使用 resolutions 强制版本
# package.json
{
  "resolutions": {
    "package-name": "1.0.0"
  }
}
```

### 2. 幽灵依赖

**问题：** 代码中使用了未在 package.json 中声明的依赖

**解决方案：**
- 使用 pnpm（默认阻止幽灵依赖）
- 或在 .npmrc 中配置 `legacy-peer-deps=false`

### 3. 安装失败

**问题：** 安装过程中网络错误或其他问题

**解决方案：**

```bash
# 清理缓存
npm cache clean --force

# 删除 node_modules 和 lock 文件重新安装
rm -rf node_modules package-lock.json
npm install

# 使用国内镜像
npm config set registry https://registry.npmmirror.com
```

## 延伸阅读

- [Monorepo 架构](./monorepo.md)
- [Pnpm 官方文档](https://pnpm.io/)
- [Npm 官方文档](https://docs.npmjs.com/)
- [Yarn 官方文档](https://yarnpkg.com/)
