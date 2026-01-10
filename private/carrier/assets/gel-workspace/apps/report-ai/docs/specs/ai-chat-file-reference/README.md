# AI 对话文件引用功能 Spec

## 任务概览

| 项目     | 内容                                                         |
| -------- | ------------------------------------------------------------ |
| 任务来源 | AI 对话功能增强需求                                          |
| 负责人   | [待分配]                                                     |
| 上线目标 | [待定]                                                       |
| 当前版本 | v1                                                           |
| 状态     | 🚧 设计中                                                    |
| 核心目标 | 支持用户通过 @ 引用文件,文件 ID 不展示但通过占位符传递给后端 |

## 文档索引

| 文档                                                               | 说明                           | 状态 |
| ------------------------------------------------------------------ | ------------------------------ | ---- |
| [spec-require-v1.md](./spec-require-v1.md)                         | 需求文档(背景、功能、约束)     | ✅   |
| [spec-design-v1.md](./spec-design-v1.md)                           | 设计文档(数据结构、流程、模块) | ✅   |
| [spec-implementation-plan-v1.md](./spec-implementation-plan-v1.md) | 实施计划(任务拆解、交付标准)   | ✅   |
| [spec-verification-v1.md](./spec-verification-v1.md)               | 验收文档(用例、约束、路径)     | ✅   |

## 快速导航

- 了解需求 → [spec-require-v1.md](./spec-require-v1.md)
- 查看设计 → [spec-design-v1.md](./spec-design-v1.md)
- 开始实施 → [spec-implementation-plan-v1.md](./spec-implementation-plan-v1.md)
- 验收标准 → [spec-verification-v1.md](./spec-verification-v1.md)

## 核心方案概要

用户在 AI 对话中输入 @ 可选择文件,前端将文件引用以占位符 `<file:fileId name='fileName'>` 形式嵌入消息内容,后端解析占位符获取 fileId 并查询文件信息构建上下文。

## 更新记录

| 日期       | 修改人 | 更新内容                                 |
| ---------- | ------ | ---------------------------------------- |
| 2025-11-18 | Kiro   | 初始化任务结构                           |
| 2025-11-18 | Kiro   | 拆分为需求、设计、实施、验收四个独立文档 |
