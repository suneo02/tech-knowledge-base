# 前端工程化与工具链

> 本目录涵盖前端工程化的核心内容，包括构建工具、包管理器、代码检查、转译工具等。

## 目录结构

### 构建工具（Build Tools）

- **[Webpack 详解](./webpack.md)** - 配置、构建流程、性能优化
- **[Vite 核心概念](./vite.md)** - 为什么快、核心特性、配置示例

### 包管理器（Package Managers）

- **[包管理器对比](./package-managers.md)** - npm、yarn、pnpm 的原理与使用
- **[Monorepo 架构](./monorepo.md)** - Monorepo 概念、工具选型、最佳实践

### 代码质量（Code Quality）

- **[ESLint 代码检查](./linting.md)** - ESLint 原理、配置、自定义规则
- **[Babel 转译](./babel.md)** - Babel 工作原理、配置、Polyfill 策略

### 样式工程化（CSS Engineering）

- **[CSS 工程化](./css-engineering.md)** - 预处理器、PostCSS、CSS Modules、CSS-in-JS

### 模块化与打包（Modules & Bundling）

- **[模块化与打包概览](./modules-and-bundling/README.md)** - 模块规范与 Webpack 核心概念
  - [模块系统](./modules-and-bundling/module-systems.md) - CommonJS、ES Modules、循环引用
  - [Webpack 基础](./modules-and-bundling/webpack/README.md) - 核心概念、打包流程
  - [Webpack 插件](./modules-and-bundling/webpack/plugins.md) - 常用插件配置实践

### 测试工具（Testing）

- **[前端测试工具](./testing/README.md)** - 测试框架、工具链、最佳实践
  - Jest、Vitest、Mocha 等单元测试框架
  - React Testing Library、Vue Test Utils 组件测试
  - Cypress、Playwright、Puppeteer E2E 测试
  - 测试最佳实践与 CI/CD 集成

### 外部资源（Resources）

- **[工具链资源汇总](./resources.md)** - 官方文档、学习教程、工具插件

## 学习路径

### 入门路径

1. **基础概念**
   - 了解前端工程化的必要性
   - 学习模块化规范（CommonJS、ES Modules）
   - 理解包管理器的作用

2. **包管理器**
   - 掌握 npm 基本使用
   - 了解 package.json 配置
   - 学习依赖管理策略

3. **构建工具**
   - 学习 Webpack 基础配置
   - 掌握常用 Loader 和 Plugin
   - 了解 Vite 的优势

4. **代码质量**
   - 配置 ESLint 规则
   - 理解 Babel 转译流程
   - 集成代码检查到工作流

### 进阶路径

1. **性能优化**
   - Webpack 打包优化
   - 代码分割策略
   - Tree Shaking 原理
   - 构建速度优化

2. **架构设计**
   - Monorepo 架构设计
   - 微前端工程化
   - 组件库构建

3. **自定义工具**
   - 编写 Webpack 插件
   - 编写 Babel 插件
   - 编写 ESLint 规则

4. **工程化最佳实践**
   - CI/CD 集成
   - Git Hooks 配置
   - 自动化测试
   - 代码规范统一

## 核心主题索引

### Webpack 相关

| 主题 | 文档 | 说明 |
|------|------|------|
| Webpack 配置 | [webpack.md](./webpack.md#核心配置项) | entry、output、module、plugins 等 |
| Loader 与 Plugin | [webpack.md](./webpack.md#常见的-loader-和-plugin) | 常用 Loader 和 Plugin 介绍 |
| 构建流程 | [webpack.md](./webpack.md#webpack-构建流程) | 7 个阶段详解 |
| 热更新 HMR | [webpack.md](./webpack.md#热更新hot-module-replacement) | 热更新原理与配置 |
| Code Splitting | [webpack.md](./webpack.md#code-splitting代码分割) | 代码分割策略 |
| Tree Shaking | [webpack.md](./webpack.md#tree-shaking) | Tree Shaking 原理 |
| 性能优化 | [webpack.md](./webpack.md#性能优化) | 提高打包速度、减小体积 |

### Vite 相关

| 主题 | 文档 | 说明 |
|------|------|------|
| Vite vs Webpack | [vite.md](./vite.md#vite-比-webpack-快的原因) | 为什么 Vite 更快 |
| ES Modules | [vite.md](./vite.md#2-对-es-modules-的支持) | 浏览器原生 ESM 支持 |
| 预构建依赖 | [vite.md](./vite.md#3-底层语言的差异) | esbuild 预构建 |
| Vite 配置 | [vite.md](./vite.md#vite-配置示例) | 基本配置示例 |
| 迁移指南 | [vite.md](./vite.md#从-webpack-迁移到-vite) | 从 Webpack 迁移 |

### Monorepo 相关

| 主题 | 文档 | 说明 |
|------|------|------|
| Monorepo 概念 | [monorepo.md](./monorepo.md#概述) | 什么是 Monorepo |
| 优劣对比 | [monorepo.md](./monorepo.md#monorepo-vs-multirepo) | Monorepo vs MultiRepo |
| 工具选型 | [monorepo.md](./monorepo.md#monorepo-工具对比) | Lerna、Turborepo、Nx、Rush |
| 最佳实践 | [monorepo.md](./monorepo.md#monorepo-最佳实践) | 目录结构、依赖管理等 |

### 包管理器相关

| 主题 | 文档 | 说明 |
|------|------|------|
| Pnpm 原理 | [package-managers.md](./package-managers.md#为什么-pnpm-比-npm-快) | 为什么 Pnpm 快 |
| npm install | [package-managers.md](./package-managers.md#npm-install-的执行过程) | npm install 流程 |
| npm run | [package-managers.md](./package-managers.md#npm-run-start-的整个过程) | npm run 执行过程 |
| 版本管理 | [package-managers.md](./package-managers.md#版本管理) | 语义化版本、lock 文件 |

### ESLint 相关

| 主题 | 文档 | 说明 |
|------|------|------|
| ESLint 原理 | [linting.md](./linting.md#eslint-工作原理) | AST、规则检查、Fix |
| ESLint 配置 | [linting.md](./linting.md#eslint-配置) | 配置文件、规则说明 |
| 自定义规则 | [linting.md](./linting.md#自定义规则) | 编写自定义规则 |
| 与 Prettier 集成 | [linting.md](./linting.md#eslint-与-prettier-集成) | ESLint + Prettier |

### Babel 相关

| 主题 | 文档 | 说明 |
|------|------|------|
| Babel 原理 | [babel.md](./babel.md#babel-工作原理) | 解析、转换、生成 |
| Babel 配置 | [babel.md](./babel.md#babel-配置) | presets、plugins 配置 |
| Polyfill 策略 | [babel.md](./babel.md#polyfill-策略) | core-js、transform-runtime |
| 最佳实践 | [babel.md](./babel.md#最佳实践) | 性能优化、配置技巧 |

### CSS 工程化相关

| 主题 | 文档 | 说明 |
|------|------|------|
| 预处理器 | [css-engineering.md](./css-engineering.md#css-预处理器) | Sass、Less、Stylus |
| PostCSS | [css-engineering.md](./css-engineering.md#postcss) | PostCSS 原理与插件 |
| CSS Modules | [css-engineering.md](./css-engineering.md#css-modules) | CSS 模块化方案 |
| CSS-in-JS | [css-engineering.md](./css-engineering.md#css-in-js) | styled-components、Emotion |
| 原子化 CSS | [css-engineering.md](./css-engineering.md#原子化-css) | Tailwind CSS、UnoCSS |

## 面试高频问题速查

### Webpack

- [Webpack 配置有哪些？](./webpack.md#核心配置项)
- [常见的 Loader 和 Plugin？](./webpack.md#常见的-loader-和-plugin)
- [Loader 和 Plugin 的区别？](./webpack.md#loader-和-plugin-的区别)
- [Webpack 的构建流程？](./webpack.md#webpack-构建流程)
- [什么是 HMR？原理是什么？](./webpack.md#热更新hot-module-replacement)
- [什么是 Code Splitting？](./webpack.md#code-splitting代码分割)
- [什么是 Source Map？](./webpack.md#source-map)
- [Tree Shaking 原理？](./webpack.md#tree-shaking)
- [如何提高 Webpack 打包速度？](./webpack.md#提高打包速度)
- [如何减少打包后的代码体积？](./webpack.md#减少打包后的代码体积)

### Vite

- [Vite 比 Webpack 快在哪里？](./vite.md#vite-比-webpack-快的原因)

### Monorepo

- [什么是 Monorepo？](./monorepo.md#概述)
- [Monorepo 优劣？](./monorepo.md#monorepo-vs-multirepo)
- [如何在项目中实践 Monorepo？](./monorepo.md#monorepo-工具对比)

### 包管理器

- [为什么 Pnpm 比 Npm 快？](./package-managers.md#为什么-pnpm-比-npm-快)
- [npm install 的执行过程？](./package-managers.md#npm-install-的执行过程)
- [npm run start 的整个过程？](./package-managers.md#npm-run-start-的整个过程)

### ESLint

- [ESLint 概念及原理？](./linting.md#eslint-工作原理)

### Babel

- [Babel 概念及原理？](./babel.md#babel-工作原理)

### CSS 工程化

- [对 CSS 工程化的理解？](./css-engineering.md#概述)

## 延伸阅读

### 相关内部文档

- [前端架构总览](../architecture.md) - 前端技术架构设计
- [性能优化](../performance/README.md) - 前端性能优化策略
- [框架对比](../frameworks/comparisons.md) - React、Vue、Angular 对比
- [前端安全](../foundations/security/) - XSS、CSRF、CSP 等安全主题

### 外部资源

更多学习资源请查看 **[工具链资源汇总](./resources.md)**，包含：

- 官方文档（Webpack、Vite、Babel、ESLint 等）
- 学习教程与博客文章
- 工具与插件推荐
- 开源项目参考

---

**维护说明：** 本文档作为前端工程化的索引页，应随着内容的增减及时更新导航链接。

