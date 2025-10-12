# 模块化与打包

> 本目录涵盖前端模块化规范（CommonJS、ES Modules）以及 Webpack 打包工具的核心概念与实践。

## 目录

### 模块系统

- **[模块规范与对比](./module-systems.md)** - CommonJS、ES Modules、循环引用、动态导入

### Webpack

- **[Webpack 基础](./webpack/README.md)** - 核心概念、打包流程
- **[Webpack 常见插件](./webpack/plugins.md)** - 常用插件配置与实践

### 延伸阅读

- **[包管理器](../package-managers.md)** - npm、yarn、pnpm 对比与原理
- **[构建工具对比](../README.md#构建工具build-tools)** - Webpack vs Vite vs Rollup
- **[工具链资源](../resources.md)** - 外部学习资源汇总

## 学习路径

### 基础入门

1. **理解模块化**
   - 为什么需要模块化
   - CommonJS 与 ES Modules 的区别
   - 模块加载机制
   - 循环依赖问题

2. **Webpack 基础**
   - 核心概念：module、chunk、bundle
   - 基本配置：entry、output、loader、plugin
   - 开发服务器与热更新

3. **常用插件**
   - HTML 处理：html-webpack-plugin
   - CSS 提取：mini-css-extract-plugin
   - 代码分割：splitChunks
   - 静态资源复制：copy-webpack-plugin

### 进阶提升

1. **深入理解打包流程**
   - 初始化阶段
   - 编译阶段
   - 输出阶段
   - Compiler 与 Compilation 钩子

2. **性能优化**
   - 构建速度优化
   - 产物体积优化
   - Tree Shaking 原理
   - 按需加载策略

3. **插件开发**
   - Webpack 插件机制
   - 编写自定义 Loader
   - 编写自定义 Plugin
   - Tapable 钩子系统

## 核心主题速查

### 模块系统

| 主题 | 文档 | 说明 |
|------|------|------|
| CommonJS 规范 | [module-systems.md](./module-systems.md#commonjs-规范) | module.exports、require |
| ES Modules | [module-systems.md](./module-systems.md#es6-module-与-commonjs-的区别) | import/export、差异对比 |
| 循环引用 | [module-systems.md](./module-systems.md#循环引用commonjs-vs-esm) | CommonJS vs ESM 处理方式 |
| 动态导入 | [module-systems.md](./module-systems.md#动态-import) | 动态 import 语法 |

### Webpack 核心

| 主题 | 文档 | 说明 |
|------|------|------|
| 基础概念 | [webpack/README.md](./webpack/README.md#module--chunk--bundle-的区别) | module、chunk、bundle |
| 打包流程 | [webpack/README.md](./webpack/README.md#打包流程概览) | 初始化、编译、输出 |
| 常用插件 | [webpack/plugins.md](./webpack/plugins.md) | 8 个常用插件配置 |

### 完整配置参考

更详细的 Webpack 配置与优化请参考：

- **[Webpack 详解](../webpack.md)** - 配置、构建流程、HMR、Code Splitting、Tree Shaking、性能优化
- **[Vite 核心概念](../vite.md)** - Vite vs Webpack、ES Modules、配置示例

## 面试高频问题

### 模块化

- [CommonJS 和 ES Module 的区别？](./module-systems.md#es6-module-与-commonjs-的区别)
- [循环依赖如何处理？](./module-systems.md#循环引用commonjs-vs-esm)
- [为什么 ES Module 可以做 Tree Shaking？](./module-systems.md#es6-module-与-commonjs-的区别)

### Webpack

- [module、chunk、bundle 的区别？](./webpack/README.md#module--chunk--bundle-的区别)
- [Webpack 的构建流程是什么？](./webpack/README.md#打包流程概览)
- [常见的 Webpack 插件有哪些？](./webpack/plugins.md)

更多面试题请查看 [Webpack 详解](../webpack.md) 中的完整问答。

## 主题范围

本目录涵盖以下主题：

1. ✅ CommonJS 规范与使用
2. ✅ ES6 Module 规范与对比
3. ✅ 循环依赖处理
4. ✅ 动态导入
5. ✅ Webpack 核心概念
6. ✅ Webpack 打包流程
7. ✅ Webpack 常用插件

延伸主题（其他文档）：

- 包管理器（npm、yarn、pnpm）→ [../package-managers.md](../package-managers.md)
- Webpack 完整指南 → [../webpack.md](../webpack.md)
- Vite 与其他构建工具 → [../vite.md](../vite.md)
- Monorepo 架构 → [../monorepo.md](../monorepo.md)

---

**维护说明：** 本目录专注于模块化与 Webpack 基础，更详细的构建工具内容请参考上级目录的专题文档。

**最后更新：** 2024-10

