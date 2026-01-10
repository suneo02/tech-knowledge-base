# 筛选条件项组件

CDE组件库中的筛选条件项组件集合，提供多种类型的筛选器组件，支持布尔值、关键词、数值范围、多选、单选等筛选功能。

## 目录结构

```
conditionItems/
├── BooleanFilter.tsx                    # 布尔值筛选器
├── KeywordFilter.tsx                     # 关键词筛选器
├── LogicalKeywordFilter.tsx              # 逻辑关键词筛选器
├── MultiSelectFilter.tsx                 # 多选筛选器
├── NumericRangeFilter.tsx                # 数值范围筛选器
├── RegionIndustryFilter.tsx              # 地区行业筛选器
├── SearchableSelectFilter/               # 可搜索选择筛选器
│   ├── SelectedItems.tsx                 # 已选择项组件
│   ├── index.tsx                         # 主组件
│   ├── style/                            # 样式文件
│   │   ├── inputWithSearch.module.less   # 搜索输入框样式
│   │   └── selectedItems.module.less     # 已选择项样式
│   ├── types.ts                          # 类型定义
│   ├── useSearch.ts                      # 搜索钩子
│   └── utils.ts                          # 工具函数
├── SingleSelectFilter.tsx                # 单选筛选器
├── index.tsx                             # 入口文件
├── style/                                # 样式目录
│   ├── conditionItem.module.less         # 条件项样式
│   └── logicalKeywordFilter.module.less  # 逻辑关键词筛选器样式
└── type.ts                               # 类型定义
```

## 关键文件说明

- `index.tsx` - 筛选条件项组件的入口文件
- `BooleanFilter.tsx` - 布尔值筛选器组件
- `KeywordFilter.tsx` - 关键词筛选器组件
- `LogicalKeywordFilter.tsx` - 支持逻辑运算的关键词筛选器
- `MultiSelectFilter.tsx` - 多选筛选器组件
- `NumericRangeFilter.tsx` - 数值范围筛选器组件
- `RegionIndustryFilter.tsx` - 地区和行业筛选器组件
- `SingleSelectFilter.tsx` - 单选筛选器组件
- `SearchableSelectFilter/` - 可搜索选择筛选器组件目录
- `type.ts` - 筛选条件项相关的类型定义

## 依赖示意

```
筛选条件项组件
├── 依赖: React
├── 依赖: CDE基础组件
├── 依赖: 样式系统
└── 依赖: 工具函数库
```

## 相关文档

- [CDE组件库文档](../../README.md)
- [筛选器选项文档](../filterOptions/)
- [筛选器主文档](../README.md)