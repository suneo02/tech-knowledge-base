# CheckBox - 复选框过滤器组件

## 概述

CheckBox 是 CDE (Corporate Data Explorer) 模块中的复选框过滤器组件集，提供多种复选框实现，支持单选、多选以及二级联动选择等功能。

## 目录结构

```
CheckBox/
├── CheckBoxMulti.tsx          # 多选复选框组件
├── CheckBoxOption.tsx         # 基础复选框选项组件
├── SecondLevelCheckbox.tsx    # 二级联动复选框组件
├── index.ts                   # 导出入口
├── renderCheckboxOptions.tsx  # 复选框选项渲染器
├── style/                     # 样式文件目录
│   ├── checkBoxMulti.module.less
│   ├── checkBoxOption.module.less
│   └── checkBoxSecond.module.less
├── types.ts                   # 类型定义
├── useCustomValueHandler.ts   # 自定义值处理 Hook
├── useOptionsTransformer.ts   # 选项转换 Hook
└── utils.ts                   # 工具函数
```

## 核心组件

- **CheckBoxOption**: 基础复选框选项组件，支持单选和多选模式
- **CheckBoxMulti**: 多选复选框组件，纯受控组件
- **SecondLevelCheckbox**: 二级联动复选框组件，支持父子级选项联动
- **renderCheckboxOptions**: 复选框选项渲染器，提供统一的渲染逻辑

## 主要类型

- `CheckBoxOptionProps`: 基础复选框选项组件属性
- `CheckBoxMultiProps`: 多选复选框组件属性
- `SecondLevelCheckboxProps`: 二级联动复选框组件属性

## 使用示例

```tsx
import { CheckBoxOption } from './CheckBoxOption';

<CheckBoxOption
  itemOption={options}
  value={selectedValues}
  onChange={setSelectedValues}
  info={filterInfo}
  multiCbx={false}
/>
```