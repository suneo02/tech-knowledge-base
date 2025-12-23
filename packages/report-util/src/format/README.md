# format - 数据格式化模块

## 🎯 一句话定位

提供**统一的数值、货币、日期格式化**能力，确保报告预览与打印的数据展示**一致性**。

## 📁 目录结构

```
src/format/
├── currency.ts              # 货币格式化
├── date.ts                  # 日期格式化
├── formatNumber.ts          # 核心数值格式化（基础函数）
├── number.ts                # 数值格式化
├── percentage.ts            # 百分比格式化
├── time.ts                  # 时间格式化
└── index.ts                 # 统一导出
```

## 🚀 核心功能

| 函数 | 用途 | 特点 |
| :--- | :--- | :--- |
| **`formatNumber`** | 核心数值格式化 | 支持千分位、小数位、单位、缩放 |
| **`formatCurrency`** | 货币格式化 | 专门处理金额显示 |
| **`formatDate`** | 日期格式化 | 多种日期格式支持 |
| **`formatTime`** | 时间格式化 | 时间戳转可读时间 |

## 💡 使用示例

```typescript
import { formatNumber, formatCurrency } from 'report-util/format';

// 基础数值格式化
formatNumber(12345.67, { decimalPlaces: 2 });
// → "12,345.67"

// 带单位的格式化
formatNumber(1000000, { scale: 10000, unit: '万元' });
// → "100万元"

// 货币格式化
formatCurrency(1234.56);
// → "¥1,234.56"
```

## ⚠️ 注意事项

- **ES5兼容**: 所有代码必须兼容 `wkhtmltopdf` 的 ES5 环境
- **无依赖**: 不依赖任何外部库，纯原生实现
- **容错处理**: 无效数值返回 `'--'`

## 📖 相关文档

- [report-util 主文档](../README.md)
- [测试用例](../__test__/format/)