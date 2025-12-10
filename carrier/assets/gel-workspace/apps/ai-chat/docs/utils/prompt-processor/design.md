# 提示词处理器设计文档

## 概述
处理提示词中特殊标记的工具函数集合，将 `@标记` 转换为模板变量格式 `{{field}}`，支持多种匹配策略和复杂场景。

## 处理架构

```mermaid
graph TB
    A[Prompt Processor] --> B[标记识别]
    A --> C[匹配策略]
    A --> D[变量转换]

    B --> E[正则表达式]
    B --> F[@标记检测]

    C --> G[精确匹配]
    C --> H[模糊匹配]
    C --> I[同义词处理]

    D --> J[{{field}} 格式]
    D --> K[模板变量]

    L[processColumnTags] --> A
    M[processAdvancedTags] --> A
    N[processCompanyPrompt] --> A
```

## 核心功能

### 1. 基础标记处理
- **识别机制**: 正则表达式识别 `@标记`
- **匹配策略**: 精确匹配、忽略空格、部分匹配、反向匹配
- **输出格式**: 转换为 `{{field}}` 模板变量

### 2. 高级标记处理
- **配置选项**: 支持模糊匹配、大小写敏感
- **算法优化**: 编辑距离算法计算相似度
- **位置处理**: 处理文本偏移，避免替换冲突

### 3. 企业信息处理
- **预定义映射**: 常见企业关键词映射
- **同义词处理**: 自动处理同义词转换
- **专用优化**: 针对企业信息提取场景优化

## 接口定义

### processColumnTags
```typescript
function processColumnTags(
  prompt: string,
  columns: ExtendedColumnDefine[]
): string
```

### processAdvancedTags
```typescript
function processAdvancedTags(
  prompt: string,
  columns: ExtendedColumnDefine[],
  options: {
    fuzzyMatch?: boolean
    caseSensitive?: boolean
    keywordMapping?: Record<string, string>
  }
): string
```

### processCompanyPrompt
```typescript
function processCompanyPrompt(
  prompt: string,
  columns: ExtendedColumnDefine[]
): string
```

## 匹配策略

| 策略 | 描述 | 示例 |
|------|------|------|
| 精确匹配 | 完全匹配列标题 | `@企业名称` → `{{companyName}}` |
| 忽略空格 | 去除空格后匹配 | `@网站 地址` → `{{website}}` |
| 部分匹配 | 包含关系匹配 | `@企业` → `{{companyName}}` |
| 反向匹配 | 被包含关系匹配 | `@名称` → `{{companyName}}` |

## 使用示例

### 基础处理
```typescript
const columns = [
  { field: 'companyName', title: '企业名称' },
  { field: 'website', title: '网站' }
]

const processed = processColumnTags(
  '请分析@企业名称的@网站',
  columns
)
// 结果: '请分析{{companyName}}的{{website}}'
```

### 高级处理
```typescript
const processed = processAdvancedTags(
  '访问@公司的@官网',
  columns,
  {
    keywordMapping: {
      '公司': 'companyName',
      '官网': 'website'
    }
  }
)
```

### 企业信息处理
```typescript
const processed = processCompanyPrompt(
  '请访问@企业名称的网址（@网站），分析其@行业',
  columns
)
```

## 技术特点
- **智能匹配**: 多种匹配策略适应不同场景
- **性能优化**: 高效的正则表达式和算法
- **可扩展性**: 支持自定义关键词映射
- **完整测试**: 覆盖各种边界情况的测试

## 关联文件
- @see apps/ai-chat/src/utils/prompt-processor/index.ts
- @see apps/ai-chat/src/utils/__tests__/prompt-processor.test.ts
- @see [utils README](../README.md)

## 参数说明

### processColumnTags

| 参数名  | 类型                   | 描述             |
| ------- | ---------------------- | ---------------- |
| prompt  | string                 | 原始提示词       |
| columns | ExtendedColumnDefine[] | 可用的列定义数组 |
| 返回值  | string                 | 处理后的提示词   |

### processAdvancedTags

| 参数名                 | 类型                   | 描述                          |
| ---------------------- | ---------------------- | ----------------------------- |
| prompt                 | string                 | 原始提示词                    |
| columns                | ExtendedColumnDefine[] | 可用的列定义数组              |
| options                | object                 | 额外配置选项                  |
| options.fuzzyMatch     | boolean                | 是否启用模糊匹配，默认为 true |
| options.caseSensitive  | boolean                | 是否区分大小写，默认为 false  |
| options.keywordMapping | Record<string, string> | 特定关键词到字段的映射        |
| 返回值                 | string                 | 处理后的提示词                |

### processCompanyPrompt

| 参数名  | 类型                   | 描述             |
| ------- | ---------------------- | ---------------- |
| prompt  | string                 | 原始提示词       |
| columns | ExtendedColumnDefine[] | 可用的列定义数组 |
| 返回值  | string                 | 处理后的提示词   |

## 返回值说明

所有处理函数都返回处理后的提示词字符串，其中 `@标记` 被替换为 `{{field}}` 格式。如果无法找到匹配的标记，则保留原始文本不变。

## 使用示例

### 基础使用

```typescript
import { processColumnTags } from '@/utils/prompt-processor'

// 列定义
const columns = [
  { field: 'companyName', title: '企业名称', width: 120 },
  { field: 'website', title: '网站', width: 120 },
]

// 处理提示词
const prompt = '请分析@企业名称的基本情况'
const processed = processColumnTags(prompt, columns)
// 结果: '请分析{{companyName}}的基本情况'
```

### 高级使用

```typescript
import { processAdvancedTags } from '@/utils/prompt-processor'

// 列定义
const columns = [
  { field: 'companyName', title: '企业名称', width: 120 },
  { field: 'website', title: '网站', width: 120 },
]

// 关键词映射
const keywordMapping = {
  公司: 'companyName',
  官网: 'website',
}

// 处理提示词
const prompt = '请访问 @公司 的 @官网'
const processed = processAdvancedTags(prompt, columns, { keywordMapping })
// 结果: '请访问 {{companyName}} 的 {{website}}'
```

### 处理企业信息

```typescript
import { processCompanyPrompt } from '@/utils/prompt-processor'

// 列定义
const columns = [
  { field: 'companyName', title: '企业名称', width: 120 },
  { field: 'website', title: '网站', width: 120 },
  { field: 'industry', title: '行业', width: 100 },
]

// 处理提示词
const prompt = `请访问 @企业名称 的网址（ @网站 ），分析其所属 @行业`
const processed = processCompanyPrompt(prompt, columns)
// 结果: '请访问 {{companyName}} 的网址（ {{website}} ），分析其所属 {{industry}}'
```

### 处理企业上下游生态提取模板

```typescript
import { processCompanyPrompt } from '@/utils/prompt-processor'

// 列定义
const columns = [
  { field: 'companyName', title: '企业名称', width: 120 },
  { field: 'website', title: '网站', width: 120 },
]

// 复杂的企业上下游生态提取提示词
const prompt = `请访问 @企业名称 的网址（ @网站 ），提取以下与上下游生态相关的信息：
1. **客户名称**：列出网址中明确提及的企业客户名称。
2. **合作伙伴**：提取网址中提到的战略合作方、生态合作方等。
3. **渠道合作**：是否提及分销商、代理商、渠道合作模式或相关企业名称。
4. **服务商或供应商**：是否提到技术提供商、硬件/软件供应商、云服务平台等。
5. **合作内容简述**：对每类合作可附带一句简要描述合作内容。`

const processed = processCompanyPrompt(prompt, columns)
// 结果: 将 @企业名称 替换为 {{companyName}}，将 @网站 替换为 {{website}}
```

## 单元测试

提示词处理器包含全面的单元测试，覆盖了各种使用场景和边界情况。测试位于 `src/utils/__tests__/prompt-processor.test.ts`。

测试示例包括：

- 精确匹配测试
- 忽略空格匹配测试
- 多个标记处理测试
- 关键词映射测试
- 模糊匹配测试
- 企业信息提取测试
- 复杂的企业上下游生态提取模板测试
