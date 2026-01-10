# 筛选选项组件

提供企业筛选功能中的各种选项组件，支持不同类型的筛选选项展示和交互。

## 目录结构

```
filterOptions/
├── CheckBoxMulti/              # 多级复选框组件
│   ├── CheckBoxLevel2.tsx      # 二级复选框组件
│   ├── CheckBoxNode.tsx        # 复选框节点组件
│   ├── comp.tsx                # 复选框通用组件
│   ├── ctx.tsx                 # 复选框上下文管理
│   ├── index.module.less       # 多级复选框样式
│   └── index.tsx               # 多级复选框导出
├── CheckBoxOption.tsx          # 复选框选项组件
├── ConditionTitle.tsx           # 筛选条件标题组件
├── ConfidenceSelector/          # 置信度选择器
│   ├── index.module.less       # 置信度选择器样式
│   └── index.tsx               # 置信度选择器导出
├── DatePickerOption.jsx         # 日期选择选项组件
├── HasOrNotOption.jsx           # 有无选项组件
├── InputKeyWords.jsx            # 关键词输入组件
├── LogicOption.jsx              # 逻辑选项组件
├── NumberRangeOption.jsx        # 数值范围选项组件
└── SingleOption.jsx             # 单选选项组件
```

## 关键文件说明

| 文件 | 作用 |
|------|------|
| `CheckBoxOption.tsx` | 复选框选项组件，支持多选筛选条件，包含自定义选项 |
| `ConditionTitle.tsx` | 筛选条件标题组件，显示条件名称和VIP标识 |
| `CheckBoxMulti/index.tsx` | 多级复选框组件，支持多级联动选择，主要用于筛选条件的展示和选择 |
| `DatePickerOption.jsx` | 日期选择选项组件，支持日期范围选择 |

## 依赖关系

- **上游**: 筛选条件项组件(`../conditionItems`)、筛选状态管理
- **下游**: 企业筛选页面
- **协作**: UI组件库(`@wind/wind-ui`)、样式组件库(`styled-components`)、React框架

## 组件特点

- **多级复选框**: 支持全选/取消全选、多级联动、银行特殊处理逻辑
- **自定义选项**: 支持用户自定义筛选条件值
- **VIP标识**: 对高级功能提供VIP标识显示
- **国际化支持**: 使用`intl`工具进行文本国际化

## 相关文档

- [筛选条件项组件](../conditionItems/README.md)
- [企业筛选组件总览](../README.md)
- [筛选状态管理](../../../store/cde/README.md)