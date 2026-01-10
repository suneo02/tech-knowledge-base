# AI 对话文件引用功能 - 实施计划

[← 返回任务概览](./README.md)

## 1. 任务拆解

| 子任务                 | 负责人 | 关联目录/文件                                 | 预计交付 | 依赖 |
| ---------------------- | ------ | --------------------------------------------- | -------- | ---- |
| 扩展占位符插入逻辑     | [待定] | `Sender/hooks/useFileSuggestion.ts`           | [待定]   | -    |
| 实现占位符解析工具函数 | [待定] | `Sender/utils/placeholder.ts`                 | [待定]   | -    |
| 更新消息发送数据结构   | [待定] | `Sender/type.ts`                              | [待定]   | -    |
| 后端占位符解析器       | [待定] | `packages/gel-api/src/chat/parsers`           | [待定]   | -    |
| 后端文件上下文构建     | [待定] | `packages/gel-api/src/chat/context`           | [待定]   | 4    |
| 编写前端单元测试       | [待定] | `Sender/utils/__tests__/placeholder.test.ts`  | [待定]   | 1,2  |
| 编写后端单元测试       | [待定] | `packages/gel-api/src/chat/parsers/__tests__` | [待定]   | 4,5  |

## 2. 实施细节

### 2.1 扩展占位符插入逻辑

模块: `useFileSuggestion`
方法: `handleSelectSuggestion`

实现要点:

- 在选择文件后,构造占位符字符串
- 将占位符插入到 content 的光标位置
- 替换原有的 @ 符号

@see apps/report-ai/src/components/ChatCommon/Sender/hooks/useFileSuggestion.ts

### 2.2 实现占位符解析工具函数

模块: `placeholder.ts`
方法: `insertPlaceholder`, `parsePlaceholders`, `removePlaceholder`

实现要点:

- 提供占位符的插入、解析、移除功能
- 使用正则表达式处理占位符
- 导出常量 `PLACEHOLDER_REGEX`

### 2.3 更新消息发送数据结构

模块: `type.ts`
类型: `SendMessageData`

实现要点:

- 移除 `refFiles` 字段
- 确保 `content` 字段包含占位符
- 更新相关类型注释

@see apps/report-ai/src/components/ChatCommon/Sender/type.ts

### 2.4 后端占位符解析器

模块: `parsers/placeholder.ts`
方法: `parsePlaceholders`, `extractFileIds`

实现要点:

- 使用正则表达式提取占位符
- 返回 fileId 列表和位置信息
- 处理异常情况(格式错误的占位符)

### 2.5 后端文件上下文构建

模块: `context/fileContext.ts`
方法: `buildContextWithFiles`

实现要点:

- 根据 fileId 查询文件信息
- 读取文件内容
- 构建 AI 上下文格式

### 2.6 编写前端单元测试

测试文件: `placeholder.test.ts`

测试用例:

- 插入占位符到指定位置
- 解析 content 中的所有占位符
- 移除指定的占位符
- 处理边界情况(空字符串、多个占位符)

### 2.7 编写后端单元测试

测试文件: `parsers/__tests__/placeholder.test.ts`

测试用例:

- 解析单个占位符
- 解析多个占位符
- 处理格式错误的占位符
- 提取 fileId 列表

## 3. 交付标准

每个子任务交付时需包含:

- 功能代码实现
- 单元测试(覆盖率 ≥80%)
- 代码注释和类型定义
- 自测通过的验收用例

## 更新记录

| 日期       | 修改人 | 更新内容       |
| ---------- | ------ | -------------- |
| 2025-11-18 | Kiro   | 初始化实施计划 |

## 相关

- [设计文档](./spec-design-v1.md)
- [验收文档](./spec-verification-v1.md)
