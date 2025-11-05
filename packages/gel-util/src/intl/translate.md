# 复杂数据结构批量翻译工具 - 设计文档

## 1. 背景与目标

在前端国际化（i18n）场景中，我们经常需要翻译从后端接收的、结构复杂的数据。这些数据可能包含深层嵌套的对象、数组以及富文本字符串。手动逐个字段翻译不仅效率低下，而且容易出错。

本工具 (`translateComplexHtmlData`) 旨在提供一个通用的解决方案，能够**自动地、批量地**翻译任何复杂 JavaScript 数据结构中的中文字符串，同时保持原有的数据结构不变。

## 2. 核心功能

核心导出函数 `translateComplexHtmlData` 接收两个参数：

1.  `data` (`any`): 需要进行翻译的原始数据。
2.  `apiTranslate` (`Function`): 一个用于调用外部翻译服务的异步函数。

该函数会自动完成以下任务：
- 检查当前环境是否需要翻译。
- 深度遍历 `data`，抽离出所有中文字符串。
- 对字符串进行去重和智能排序。
- 格式化数据并调用 `apiTranslate` 函数进行批量翻译。
- 将返回的英文翻译结果精确地替换回原始数据结构中的对应位置。

## 3. 实现步骤详解

整个翻译流程被划分为以下几个关键步骤：

### 步骤 1: 提取中文字符串 (`extractCNStrings`)

- **目的**: 从输入数据中找出所有需要翻译的中文片段。
- **实现**:
    - 通过递归方式深度遍历输入数据 `data` 的每一个"角落"。
    - 当遇到字符串类型的值时，使用正则表达式 `[\u4e00-\u9fff]+` 来匹配一个或多个连续的中文字符。
    - 所有匹配到的中文字符串被添加到一个临时列表 `matchedCNList` 中。

### 步骤 2: 去重与排序

- **目的**: 优化翻译请求并确保替换的准确性。
- **实现**:
    - 使用 `new Set()` 对 `matchedCNList` 进行去重，减少不必要的翻译API调用。
    - **核心逻辑**: 对去重后的数组按字符串长度进行**降序排序** (`b.length - a.length`)。
    - **排序原因**: 这是为了防止"子字符串问题"。例如，数据中同时存在 "中国" 和 "中国人"。如果不排序，"中国" 可能先被替换为 "China"，导致 "中国人" 变为 "China人"，此时 "人" 可能无法被正确翻译或匹配。优先翻译并替换更长的字符串 "中国人"，可以完美规避此问题。

### 步骤 3: 构建 API 请求体

- **目的**: 将待翻译的中文列表构造成适合 API 调用的格式，并保留其顺序。
- **实现**:
    - 将排序后的中文列表 `matchedCNList` 转换成一个对象。
    - 对象的键采用 `index$$word` 的格式，例如：`{ "0$$word": "中国人", "1$$word": "中国" }`。
    - 这种格式不仅方便后端处理，其数字前缀 `index` 也为后续步骤中恢复原始顺序提供了依据。

### 步骤 4: 调用外部翻译 API

- **目的**: 将处理好的中文字符串发送给翻译服务。
- **实现**:
    - 调用作为参数传入的 `apiTranslate` 函数，并将上一步生成的 `matchedCNObj` 作为参数。
    - 这种设计将核心翻译逻辑与具体的 API 实现解耦，使得本工具可以适配任何翻译服务。
    - 使用 `try...catch` 块来捕获 API 调用过程中可能发生的错误。

### 步骤 5: 处理并排序翻译结果

- **目的**: 将 API 返回的无序结果整理成与原始中文列表顺序一致的翻译后列表。
- **实现**:
    - API 通常返回一个类似 `{ "0$$word": "Chinese people", "1$$word": "China" }` 的对象。
    - 首先，获取该对象的所有键 (`Object.keys`)。
    - 然后，根据键名中的数字前缀 (`'0$$word' -> 0`) 对这些键进行升序排序。
    - 最后，通过 `map` 方法，根据排好序的键列表生成一个与 `matchedCNList` 一一对应的、有序的翻译结果数组 `translatedList`。

### 步骤 6: 递归替换中文 (`replaceChineseStrings`)

- **目的**: 将翻译好的英文文本放回数据结构中的正确位置。
- **实现**:
    - **重要**: 首先使用 `cloneDeep` 对原始数据 `data` 进行深拷贝。这确保了函数的纯粹性，避免了对原始数据的意外修改。
    - 再次递归遍历数据结构（这次是克隆后的副本）。
    - 当遇到字符串时，遍历 `matchedCNList`，使用 `String.prototype.replace` 和正则表达式（全局模式 `g`）将每个中文词组替换为 `translatedList` 中相应索引的英文翻译。
    - 返回被完整替换后的数据副本。

## 4. 函数签名

```typescript
/**
 * 递归遍历对象或数组，提取其中所有的中文字符串。
 */
const extractCNStrings: (value: any, matchedCNList: string[]) => void;

/**
 * 递归替换数据结构中的中文字符串为对应的翻译文本。
 */
function replaceChineseStrings(value: any, matchedCNList: string[], translatedList: string[]): any;

/**
 * 对包含复杂数据结构的数据进行智能翻译。
 */
export const translateComplexHtmlData: (
  data: any,
  apiTranslate: (params: Record<string, string>) => Promise<Record<string, string>>
) => Promise<any>;
```

## 5. 使用示例

```javascript
import { translateComplexHtmlData } from './translate';
import { yourApiTranslateFunction } from './api'; // 假设这是您封装的翻译API

const complexData = {
  reportTitle: "2024年第一季度财务报告",
  summary: "本季度表现优于预期，主要增长点在中国市场。",
  details: [
    { item: "总收入", value: "1,000,000元" },
    { item: "净利润", value: "200,000元" },
  ],
  author: {
    name: "分析师团队",
    members: ["张三", "李四"],
  }
};

async function runTranslation() {
  try {
    const translatedData = await translateComplexHtmlData(complexData, yourApiTranslateFunction);
    console.log(translatedData);
    /*
    可能会输出:
    {
      reportTitle: "Financial Report for the First Quarter of 2024",
      summary: "This quarter's performance was better than expected, with the main growth point in the China market.",
      details: [
        { item: "Total Revenue", value: "1,000,000 yuan" },
        { item: "Net Profit", value: "200,000 yuan" },
      ],
      author: {
        name: "Analyst Team",
        members: ["Zhang San", "Li Si"],
      }
    }
    */
  } catch (error) {
    console.error("翻译失败:", error);
  }
}

runTranslation();
``` 