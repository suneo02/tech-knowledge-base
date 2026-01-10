# 筛选条件项组件

提供企业筛选功能中的各种条件项组件，支持不同类型的筛选条件输入和选择。

## 目录结构

```
conditionItems/
├── CheckBoxOfCustom.tsx      # 自定义复选框条件组件
├── CityOrIndustry.tsx         # 城市/行业选择条件组件
├── HasOrNotItem.jsx           # 有无选项条件组件
├── InputKeys.jsx              # 关键词输入条件组件
├── InputKeysOfLogic.jsx       # 带逻辑的关键词输入组件
├── InputWithSearch.jsx        # 带搜索功能的输入组件
├── NumberRange.jsx            # 数值范围选择组件
├── SingleOfCustom.jsx        # 自定义单选条件组件
├── index.tsx                  # 统一导出入口和组件配置
└── styles/                    # 样式文件
    ├── cityOrIndustry.less
    └── cityOrIndustry.module.less
```

## 关键文件说明

| 文件 | 作用 |
|------|------|
| `index.tsx` | 统一导出所有条件项组件，提供动态组件配置和样式定义 |
| `CheckBoxOfCustom.tsx` | 自定义复选框条件组件，支持多选筛选条件 |
| `CityOrIndustry.tsx` | 城市/行业选择条件组件，支持地区和行业筛选 |
| `NumberRange.jsx` | 数值范围选择组件，支持最小值和最大值范围筛选 |

## 依赖关系

- **上游**: 筛选条件状态管理(`../../../../store/cde/useConditionFilterStore`)、筛选选项组件(`../filterOptions`)
- **下游**: 企业筛选页面
- **协作**: 样式组件库(`styled-components`)、React框架

## 相关文档

- [筛选选项组件](../filterOptions/README.md)
- [企业筛选组件总览](../README.md)
- [筛选状态管理](../../../store/cde/README.md)