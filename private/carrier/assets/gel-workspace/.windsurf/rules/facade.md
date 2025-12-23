---
trigger: always_on
---

<!------------------------------------------------------------------------------------
   Add Rules to this file or a short description and have Kiro refine them for you:
------------------------------------------------------------------------------------>

# 前端开发规范引用指南

## 🎯 核心原则

- **面向AI**: 清晰结构，标准格式
- **工具集成**: ahooks + lodash + classnames + pnpm
- **代码质量**: TypeScript + 统一规范 + 完整测试
- **文档关联**: 代码与文档互相引用，持续维护

## 📚 开发规范索引

### 🔧 代码开发规范

- [TypeScript 规范](../../docs/rule/typescript-rule.md) - 类型定义与代码风格
- [React 规范](../../docs/rule/react-rule.md) - 组件与状态管理
- [样式规范](../../docs/rule/style-rule.md) - Less Module + BEM
- [测试规范](../../docs/rule/testing-rule.md) - Vitest + Storybook
- [错误处理规范](../../docs/rule/error-handling-rule.md) - 错误边界与异常处理
- [项目结构规范](../../docs/rule/project-structure.md) - 目录组织与命名
- [API 请求规范](../../docs/rule/api-request-rule.md) - API 调用与数据请求

### 📖 文档编写规范

- [文档规范](../../docs/rule/documentation-rule.md) - 通用文档编写
- [README 规范](../../docs/rule/readme-rule.md) - 目录说明文档
- [需求规范](../../docs/rule/require-doc.md) - 需求文档编写
- [设计规范](../../docs/rule/design-doc.md) - 设计文档编写
- [Spec 规范](../../docs/rule/spec-doc-rule.md) - 任务方案与交付说明
- [Issue 规范](../../docs/rule/issue-doc-rule.md) - 问题文档编写

## 📋 使用场景指南

| 场景     | 使用规范                                           |
| -------- | -------------------------------------------------- |
| 需求分析 | require-doc.md                                     |
| 功能设计 | design-doc.md                                      |
| 代码开发 | typescript-rule.md + react-rule.md + style-rule.md |
| API 调用 | api-request-rule.md                                |
| 测试编写 | testing-rule.md                                    |
| 问题排查 | issue-doc-rule.md                                  |
| 任务拆解 | spec-doc-rule.md                                   |
| 文档整理 | readme-rule.md + documentation-rule.md             |
