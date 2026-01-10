# 筛选器选项组件

CDE组件库中的筛选器选项组件集合，提供多种类型的筛选器选项，支持布尔值、复选框、自定义输入、日期选择、关键词输入、逻辑选择、数值范围和单选等选项功能。

## 目录结构

```
filterOptions/
├── BooleanOption.tsx                    # 布尔值选项
├── CheckBox/                            # 复选框选项
│   ├── CheckBoxMulti.tsx                # 多选复选框
│   ├── CheckBoxOption.tsx               # 复选框选项
│   ├── README.md                         # 复选框文档
│   ├── SecondLevelCheckbox.tsx           # 二级复选框
│   ├── index.ts                          # 入口文件
│   ├── renderCheckboxOptions.tsx        # 渲染复选框选项
│   ├── style/                            # 样式文件
│   │   ├── checkBoxMulti.module.less    # 多选复选框样式
│   │   ├── checkBoxOption.module.less   # 复选框选项样式
│   │   └── checkBoxSecond.module.less   # 二级复选框样式
│   ├── types.ts                          # 类型定义
│   ├── useCustomValueHandler.ts          # 自定义值处理钩子
│   ├── useOptionsTransformer.ts          # 选项转换钩子
│   └── utils.ts                          # 工具函数
├── CustomInput.tsx                       # 自定义输入选项
├── DatePickerOption.tsx                  # 日期选择器选项
├── FilterLabel.tsx                       # 筛选器标签
├── InputKeyWords.tsx                     # 关键词输入选项
├── LogicOption.tsx                       # 逻辑选项
├── NumberRangeOption.tsx                 # 数值范围选项
├── SingleOption.tsx                      # 单选选项
├── hooks/                                # 钩子目录
│   ├── useCustomValue.ts                 # 自定义值钩子
│   └── useOptionItems.ts                 # 选项项钩子
├── index.ts                              # 入口文件
└── style/                                # 样式目录
    ├── datePickerOption.module.less      # 日期选择器样式
    ├── filterLabel.module.less           # 筛选器标签样式
    ├── hasOrNotOption.module.less        # 有无选项样式
    ├── inputKeyWords.module.less         # 关键词输入样式
    ├── logicOption.module.less           # 逻辑选项样式
    ├── numberRange.module.less           # 数值范围样式
    └── singleOption.module.less          # 单选选项样式
```

## 关键文件说明

- `index.ts` - 筛选器选项组件的入口文件
- `BooleanOption.tsx` - 布尔值选项组件
- `CheckBox/` - 复选框选项组件目录，包含多选、单选和二级复选框
- `CustomInput.tsx` - 自定义输入选项组件
- `DatePickerOption.tsx` - 日期选择器选项组件
- `FilterLabel.tsx` - 筛选器标签组件
- `InputKeyWords.tsx` - 关键词输入选项组件
- `LogicOption.tsx` - 逻辑选项组件
- `NumberRangeOption.tsx` - 数值范围选项组件
- `SingleOption.tsx` - 单选选项组件
- `hooks/` - 筛选器选项相关的钩子函数

## 依赖示意

```
筛选器选项组件
├── 依赖: React
├── 依赖: CDE基础组件
├── 依赖: 日期选择器
├── 依赖: 样式系统
└── 依赖: 工具函数库
```

## 相关文档

- [CDE组件库文档](../../README.md)
- [筛选条件项文档](../conditionItems/)
- [复选框文档](./CheckBox/README.md)
- [筛选器主文档](../README.md)