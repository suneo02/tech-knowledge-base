# Tag - 标签组件集

## 概述

Tag 是通用标签组件集，提供多种标签展示组件，支持企业行业标签、动态事件标签、通用标签等功能。

## 目录结构

```
tag/
├── CorpIndustryTag.module.less    # 企业行业标签样式
├── CorpIndustryTag.tsx           # 企业行业标签组件
├── DynamicEventTypeTag/          # 动态事件标签组件
│   ├── index.less                # 动态事件标签样式
│   └── index.tsx                 # 动态事件标签组件
├── index.ts                      # 导出入口文件
├── index.less                    # 通用标签样式
├── index.tsx                     # 通用标签组件
├── Tag.module.less               # 标签模块样式
├── Tag.tsx                       # 标签组件
├── TagGroup.module.less          # 标签组样式
├── TagGroup.tsx                  # 标签组组件
├── TagList.module.less           # 标签列表样式
├── TagList.tsx                   # 标签列表组件
├── TagPopover.tsx                # 标签弹出框组件
└── TagTooltip.tsx                # 标签提示框组件
```

## 核心组件

### 企业相关标签
- **CorpIndustryTag**: 企业行业标签组件，支持多种行业类型展示

### 动态标签
- **DynamicEventTypeTag**: 动态事件类型标签组件，支持不同事件类型的展示

### 通用标签
- **Tag**: 基础标签组件
- **TagGroup**: 标签组组件，用于组合多个标签
- **TagList**: 标签列表组件，用于展示标签列表
- **TagPopover**: 标签弹出框组件
- **TagTooltip**: 标签提示框组件

## 使用示例

```tsx
import { CorpIndustryTag } from './CorpIndustryTag';
import { Tag } from './Tag';

// 企业行业标签
<CorpIndustryTag industry="technology" size="small" />

// 基础标签
<Tag color="blue" closable onClose={handleClose}>
  标签内容
</Tag>
```