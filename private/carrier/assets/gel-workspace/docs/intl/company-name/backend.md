# 企业名称后端数据取值规则

## 概述

定义后端如何准备企业名称数据，为前端提供标准化的三字段数据。

## 字段输出规范

### 三字段模式

| 字段名               | 类型     | 说明             |
| -------------------- | -------- | ---------------- |
| `{field}`            | string   | 原始名称（必填） |
| `{field}Trans`       | string?  | 翻译名称（可选） |
| `{field}AITransFlag` | boolean? | AI 标识（可选）  |

**命名规范**：所有字段统一使用驼峰命名

### 企业名称具体字段

| 字段名                | 类型     | 说明         |
| --------------------- | -------- | ------------ |
| `corpName`            | string   | 原始企业名称 |
| `corpNameTrans`       | string?  | 翻译名称     |
| `corpNameAITransFlag` | boolean? | AI 翻译标识  |

**命名规范**：统一使用驼峰命名（不使用下划线）

## 数据来源

### 原始名称（`{field}`）

- 来自业务字段，不做任何翻译处理
- 始终返回，不能为空

### 翻译名称（`{field}Trans`）

按优先级获取：

1. **官方翻译**：来自 6254 表的人工维护名称
2. **TRANS 表**：机器翻译存储表
3. **AI 翻译**：实时调用 AI 翻译接口

> 区域策略（2025-12）：鉴于前端在中文环境不再触发 AI 翻译，若无官方/TRANS 翻译建议由后端补充翻译；否则前端仅展示原始名称。

### AI 标识（`{field}AITransFlag`）

- `false`：翻译来自官方/6254 表
- `true`：翻译来自 TRANS 表或 AI
- `null`：无翻译

## 取值逻辑

### 基本规则

```mermaid
graph TD
  A[原始名称 → {field}] --> B{原始是目标语?}
  B -->|是| C[Trans=空, AITransFlag=null]
  B -->|否| D{有官方翻译?}
  D -->|有| E[Trans=官方, AITransFlag=false]
  D -->|无| F{有 TRANS?}
  F -->|有| G[Trans=TRANS, AITransFlag=true]
  F -->|无| H{调用 AI}
  H -->|成功| I[Trans=AI, AITransFlag=true]
  H -->|失败| J[Trans=空, AITransFlag=null]

> 中文环境前端不做 AI 回退：当 `Trans` 为空时，前端将仅展示 `{field}`，不会再进行前端翻译。
```

## 语言检测

后端可使用前端提供的语言检测工具：

- `detectChinese(text)` - 检测是否包含中文
- `detectEnglish(text)` - 检测是否为英文
- 代码位置：`packages/gel-util/src/misc/translate/languageDetector.ts`

## 异常处理

- 官方翻译查询失败：降级到 TRANS
- TRANS 查询失败：降级到 AI
- AI 翻译失败：返回空值（`Trans=null, AITransFlag=null`）

## 相关文档

- [企业名称 API 定义](./api.md)
- [企业名称前端展示逻辑](./frontend.md)

## 相关代码

- `packages/gel-util/src/misc/translate/languageDetector.ts` - 语言检测工具
- `apps/company/src/handle/corp/base/translate.ts` - 企业详情翻译处理
 - `apps/company/src/views/GlobalSearch/components/result/MultiResultList/handleName.ts`
   - `handleItemZh()` - 中文环境移除前端 AI 回退
   - `handleItemEn()` - 英文环境处理
