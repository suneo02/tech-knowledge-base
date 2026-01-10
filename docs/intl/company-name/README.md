# 企业名称展示与取值规则

## 概述

规范企业名称在不同语言环境下的取值优先级、翻译来源与展示样式。

## 重要变更（2025-12）

- 中文环境（`zh-CN`）：前端不再调用 AI 翻译作为回退，仅展示后端提供的翻译；无翻译时仅展示原始名称。
- 英文环境（`en-US`）：逻辑不变。
- 相关实现：`apps/company/src/views/GlobalSearch/components/result/MultiResultList/handleName.ts`

## 字段规范

### 三字段模式

| 字段                 | 类型     | 说明    |
| -------------------- | -------- | ------- |
| `{field}`            | string   | 原始值  |
| `{field}Trans`       | string?  | 翻译值  |
| `{field}AITransFlag` | boolean? | AI 标识 |

### 企业名称字段

| 字段                  | 类型     | 说明         |
| --------------------- | -------- | ------------ |
| `corpName`            | string   | 原始企业名称 |
| `corpNameTrans`       | string?  | 翻译名称     |
| `corpNameAITransFlag` | boolean? | AI 标识      |

**命名规范**：统一使用驼峰命名

## 文档导航

### 按职责

- [后端数据取值规则](./backend.md) - 数据来源与字段输出
- [API 定义](./api.md) - 接口契约与字段规范
- [前端展示逻辑](./frontend.md) - 展示规则与使用示例

### 按角色

- **后端开发**：backend.md → api.md
- **前端开发**：api.md → frontend.md
- **产品经理**：本文档 → frontend.md

## 核心概念

### 展示模式

| 模式        | 主要位置  | 其余位置 |
| ----------- | --------- | -------- |
| `origin`    | 仅原始    | 仅原始   |
| `only-data` | 原始+翻译 | 仅原始   |

### 取值优先级

官方翻译 → TRANS 表 → AI 翻译 → 原始名称

> 中文环境前端不触发 AI：若后端未提供翻译，直接使用原始名称。

### 主要位置

搜索结果卡片、企业详情页顶部卡片、图谱中心节点

## 接口示例

```json
{
  "corpId": "123456",
  "corpName": "Apple Inc.",
  "corpNameTrans": "苹果公司",
  "corpNameAITransFlag": false
}
```

## 相关文档

- [全局显示模式](../i18n-display-modes.md)
