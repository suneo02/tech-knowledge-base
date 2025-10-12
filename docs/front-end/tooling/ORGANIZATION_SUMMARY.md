# 前端工程化面试题整理总结

> 本文档记录了从原始面试题文件到结构化文档的组织过程

## 原始文件

`docs/front-end/tooling/modules-and-bundling/2024前端高频面试题之-- 前端工程化篇.md`

该文件包含 19 个前端工程化相关的面试题，内容混杂，不便于学习和查阅。

## 重组后的文档结构

### 新增文档清单

1. **[webpack.md](./webpack.md)** - Webpack 核心概念与实践
   - 覆盖问题 1-10
   - 配置、Loader/Plugin、构建流程、HMR、Code Splitting、Source Map、Tree Shaking、性能优化

2. **[vite.md](./vite.md)** - Vite 核心概念与原理
   - 覆盖问题 11
   - Vite vs Webpack、ES Modules、预构建依赖、配置示例、迁移指南

3. **[monorepo.md](./monorepo.md)** - Monorepo 架构与实践
   - 覆盖问题 12-13
   - Monorepo 概念、优劣对比、工具对比、最佳实践

4. **[package-managers.md](./package-managers.md)** - 包管理器对比与原理
   - 覆盖问题 14, 17-18
   - Pnpm 原理、npm install 流程、npm run 过程、版本管理

5. **[linting.md](./linting.md)** - 代码检查与 ESLint
   - 覆盖问题 15
   - ESLint 原理、AST、工作流程、配置、自定义规则

6. **[babel.md](./babel.md)** - Babel 概念与原理
   - 覆盖问题 16
   - Babel 工作原理（解析、转换、生成）、配置、Polyfill 策略、最佳实践

7. **[css-engineering.md](./css-engineering.md)** - CSS 工程化
   - 覆盖问题 19
   - 预处理器、PostCSS、CSS Modules、CSS-in-JS、原子化 CSS

8. **[README.md](./README.md)** - 前端工程化与工具链索引页
   - 目录结构导航
   - 学习路径指引
   - 核心主题索引表
   - 面试高频问题速查

## 问题映射表

| 原始问题编号 | 问题标题 | 重组后文档 | 章节 |
|------------|---------|-----------|------|
| 1 | webpack配置有哪些？ | webpack.md | 核心配置项 |
| 2 | 有哪些常见的 Loader 和 Plugin？ | webpack.md | 常见的 Loader 和 Plugin |
| 3 | Loader和Plugin的区别 | webpack.md | Loader 和 Plugin 的区别 |
| 4 | webpack的构建流程 | webpack.md | Webpack 构建流程 |
| 5 | 什么是Webpack的热更新（Hot Module Replacement）？原理是什么？ | webpack.md | 热更新 |
| 6 | 什么是Code Splitting | webpack.md | Code Splitting |
| 7 | Webpack的Source Map是什么？如何配置生成Source Map？ | webpack.md | Source Map |
| 8 | Webpack的Tree Shaking原理 | webpack.md | Tree Shaking |
| 9 | 如何提高webpack的打包速度 | webpack.md | 性能优化 > 提高打包速度 |
| 10 | 如何减少打包后的代码体积 | webpack.md | 性能优化 > 减少打包体积 |
| 11 | vite比webpack快在哪里 | vite.md | Vite 比 Webpack 快的原因 |
| 12 | 说一下你对Monorepo的理解 | monorepo.md | 概述 & Monorepo vs MultiRepo |
| 13 | 你在项目是怎么做Monorepo？ | monorepo.md | Monorepo 工具对比 & 最佳实践 |
| 14 | 为什么pnpm比npm快 | package-managers.md | 为什么 Pnpm 比 Npm 快 |
| 15 | ESLint概念及原理 | linting.md | ESLint 工作原理 |
| 16 | Babel概念及原理 | babel.md | Babel 工作原理 |
| 17 | npm install 的执行过程 | package-managers.md | npm install 的执行过程 |
| 18 | npm run start 的整个过程？ | package-managers.md | npm run start 的整个过程 |
| 19 | 对 CSS 工程化的理解 | css-engineering.md | 概述 & CSS 工程化方案 |

## 内容增强

相比原始面试题，新文档增加了以下内容：

### 1. Webpack (webpack.md)
- ✨ 详细的配置示例代码
- ✨ Loader 和 Plugin 的使用示例
- ✨ 完整的构建流程图示
- ✨ HMR 配置示例
- ✨ splitChunks 详细配置
- ✨ devtool 选项对比
- ✨ 具体的性能优化代码示例

### 2. Vite (vite.md)
- ✨ Webpack vs Vite 对比表格
- ✨ ES Modules 示例代码
- ✨ Vite 配置完整示例
- ✨ 环境变量配置
- ✨ 迁移指南

### 3. Monorepo (monorepo.md)
- ✨ 详细的优劣对比表格
- ✨ 四种工具的使用示例
- ✨ 渐进式架构方案
- ✨ 目录结构建议
- ✨ CI/CD 配置示例
- ✨ 常见问题解决方案

### 4. 包管理器 (package-managers.md)
- ✨ Pnpm 存储结构图示
- ✨ npm/yarn/pnpm 对比表格
- ✨ 完整的工作流程说明
- ✨ 版本管理策略
- ✨ lock 文件对比
- ✨ 最佳实践建议

### 5. ESLint (linting.md)
- ✨ 详细的工作流程图
- ✨ AST 节点类型示例
- ✨ 完整的配置示例
- ✨ 常用规则集
- ✨ 与 Prettier 集成
- ✨ 自定义规则开发
- ✨ 编辑器集成
- ✨ Git Hooks 配置

### 6. Babel (babel.md)
- ✨ 三阶段工作流程详解
- ✨ 词法分析和语法分析示例
- ✨ 各种 preset 详细配置
- ✨ Plugin 使用示例
- ✨ Polyfill 策略对比表
- ✨ 在不同场景中的使用
- ✨ 最佳实践建议

### 7. CSS 工程化 (css-engineering.md)
- ✨ 三种预处理器对比示例
- ✨ PostCSS 插件介绍
- ✨ Webpack 处理 CSS 完整流程
- ✨ CSS Modules 使用示例
- ✨ CSS-in-JS 三种方案对比
- ✨ 原子化 CSS 示例
- ✨ BEM/OOCSS 命名规范
- ✨ 目录组织建议

## 文档特点

### 1. 结构化组织
- 每个主题独立成文
- 清晰的章节划分
- 完整的目录导航

### 2. 深度与广度兼顾
- 核心概念详细解释
- 工作原理深入剖析
- 实战示例丰富
- 最佳实践总结

### 3. 便于学习与查阅
- 代码示例丰富
- 配置示例完整
- 对比表格清晰
- 交叉引用便捷

### 4. 面向实践
- 常见问题解答
- 最佳实践建议
- 性能优化技巧
- 实战配置示例

## 使用建议

### 面试准备
直接查阅 [README.md](./README.md) 中的"面试高频问题速查"部分，可快速定位到相关内容。

### 系统学习
按照 [README.md](./README.md) 中的"学习路径"部分，从入门到进阶逐步学习。

### 问题查询
使用 [README.md](./README.md) 中的"核心主题索引"表格，可快速找到特定问题的答案。

### 深入研究
每个文档末尾都有"延伸阅读"部分，可以继续深入学习相关主题。

## 维护建议

1. **保持更新**：随着技术发展，及时更新文档内容
2. **补充示例**：持续增加实战示例和最佳实践
3. **交叉引用**：保持文档间的交叉引用准确有效
4. **索引同步**：主 README 的索引表要与文档内容保持同步

## 文件清理

已删除原始文件：`docs/front-end/tooling/modules-and-bundling/2024前端高频面试题之-- 前端工程化篇.md`

所有内容已被系统化地重组到新的文档结构中。

---

**整理完成时间：** 2025-10-12  
**文档数量：** 8 个（7 个主题文档 + 1 个索引页）  
**覆盖问题：** 19 个面试题全部覆盖  
**新增内容：** 大量代码示例、配置示例、对比表格、最佳实践

