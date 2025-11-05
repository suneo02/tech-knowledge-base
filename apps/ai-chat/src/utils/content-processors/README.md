# Content Processors 内容处理器

## 简介

Content Processors 是一个用于处理 Markdown 文本中特殊内容的插件系统。它可以将特定格式的文本转换为 React 组件，例如将 Markdown 表格转换为 Antd Table 组件，将图表配置转换为 Antd Charts 图表等。

## 目录结构

```
content-processors/
├── README.md           # 使用说明文档
├── types.ts           # 核心类型定义
├── processor.tsx      # 通用处理器工厂
├── index.tsx          # 处理器注册和导出
└── [feature]/         # 具体功能模块目录
    ├── index.ts       # 功能模块导出
    ├── types.ts       # 功能相关类型
    ├── parser.ts      # 解析器实现
    ├── component.tsx  # 组件实现
    ├── processor.tsx  # 处理器实现
    └── styles.less    # 样式文件
```

## 核心概念

### 1. 处理器接口 (ContentProcessor)

```typescript
interface ContentProcessor {
  /** 处理器名称 */
  name: string
  /** 检查函数，判断文本是否可以被该处理器处理 */
  check: (text: string) => boolean
  /** 处理函数，将文本转换为对应的 React 组件 */
  process: (text: string) => ProcessResult | null
}
```

### 2. 处理结果 (ProcessResult)

```typescript
interface ProcessResult {
  /** 处理后的 React 组件内容 */
  content: ReactNode
  /** 处理后剩余的文本内容 */
  remainingText: string
}
```

## 添加新处理器

### 1. 创建目录结构

```bash
mkdir src/utils/content-processors/[feature]
touch src/utils/content-processors/[feature]/types.ts
touch src/utils/content-processors/[feature]/parser.ts
touch src/utils/content-processors/[feature]/component.tsx
touch src/utils/content-processors/[feature]/processor.tsx
touch src/utils/content-processors/[feature]/styles.less
touch src/utils/content-processors/[feature]/index.ts
```

### 2. 实现必要的文件

#### a. types.ts - 定义类型

```typescript
export interface YourFeatureData {
  // 定义你的数据结构
}
```

#### b. parser.ts - 实现解析器

```typescript
export const hasYourFeature = (text: string): boolean => {
  // 实现检测逻辑
}

export const parseYourFeature = (text: string): YourFeatureData | null => {
  // 实现解析逻辑
}
```

#### c. component.tsx - 实现组件

```typescript
export const YourFeatureComponent: React.FC<{
  data: YourFeatureData
}> = ({ data }) => {
  // 实现渲染逻辑
}
```

#### d. processor.tsx - 创建处理器

```typescript
export const yourFeatureProcessor = createProcessor<YourFeatureData>({
  name: 'your-feature',
  check: hasYourFeature,
  parse: (text) => {
    // 实现处理逻辑
    return {
      data: parsedData,
      position: { start, end },
    }
  },
  render: (data) => <YourFeatureComponent data={data} />,
})
```

#### e. index.ts - 导出模块

```typescript
export * from './types'
export * from './parser'
export * from './component'
export * from './processor'
```

### 3. 注册处理器

在 `src/utils/content-processors/index.tsx` 中注册你的处理器：

```typescript
import { yourFeatureProcessor } from './your-feature'

export const contentProcessors: ContentProcessor[] = [
  // ... 其他处理器
  yourFeatureProcessor,
]
```

## 使用规范

### 1. 文件命名

- 使用 kebab-case 命名目录
- 使用 camelCase 命名文件
- 使用 PascalCase 命名组件和类型

### 2. 类型定义

- 为所有接口添加详细的 JSDoc 注释
- 使用具体的类型，避免 any
- 导出所有可能被复用的类型

### 3. 解析器实现

- 处理所有可能的错误情况
- 提供有意义的错误信息
- 确保解析结果的类型安全

### 4. 组件实现

- 使用函数式组件
- 实现必要的错误边界
- 提供合适的加载状态
- 添加适当的样式隔离

### 5. 处理器实现

- 使用 createProcessor 工厂函数
- 保持处理逻辑的纯函数特性
- 正确处理文本位置信息

## 示例

### Markdown 表格处理器

```markdown
| Name  | Age |
| ----- | --- |
| Alice | 25  |
```

### 图表处理器

````markdown
```chart
{
  "type": "line",
  "data": {
    "labels": ["A", "B", "C"],
    "values": [1, 2, 3]
  }
}
```
````

```

## 注意事项

1. 文本处理顺序
   - 保持原文本的顺序
   - 正确处理嵌套内容
   - 避免处理器之间的冲突

2. 性能考虑
   - 优化正则表达式
   - 避免不必要的重渲染
   - 考虑大文本的处理效率

3. 样式隔离
   - 使用 CSS Modules 或特定前缀
   - 避免样式污染
   - 保持组件的独立性

4. 错误处理
   - 优雅降级
   - 提供用户友好的错误提示
   - 记录错误信息以便调试

## 调试技巧

1. 使用 console.log 输出解析过程
2. 使用 React DevTools 检查组件渲染
3. 使用浏览器开发工具调试样式

## 贡献指南

1. 创建新的处理器前先检查是否已存在
2. 遵循现有的代码风格和命名约定
3. 添加完整的测试和文档
4. 提交 PR 前进行代码审查
```
