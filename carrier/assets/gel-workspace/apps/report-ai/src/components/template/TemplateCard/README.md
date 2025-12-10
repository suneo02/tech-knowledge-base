# TemplateCard 组件

## 概述

模版卡片组件，用于展示单个报告模版的信息和操作按钮。

## 功能特性

- 展示模版名称和类型标签（标准模板/自定义模板）
- 显示上次使用时间
- 提供操作按钮：
  - 标准模板：查看样例 + 开始使用
  - 自定义模板：删除 + 开始使用

## Props

| 属性      | 类型                                   | 必填 | 说明         |
| --------- | -------------------------------------- | ---- | ------------ |
| template  | ReportTemplateItem                     | 是   | 模版数据     |
| onDelete  | (template: ReportTemplateItem) => void | 否   | 删除模版回调 |
| onUse     | (template: ReportTemplateItem) => void | 否   | 使用模版回调 |
| onPreview | (template: ReportTemplateItem) => void | 否   | 预览模版回调 |

## 使用示例

```tsx
import { TemplateCard } from '@/components/template/TemplateList/TemplateCard';

<TemplateCard template={templateData} onDelete={handleDelete} onUse={handleUse} onPreview={handlePreview} />;
```

## 相关文档

- [TemplateList 组件](../README.md)
- [React 规范](../../../../../docs/rule/react-rule.md)
- [样式规范](../../../../../docs/rule/style-rule.md)
