# 单企业动态视图模块

展示单个企业的动态信息，提供动态筛选、时间范围选择和动态展示功能。

## 目录结构

```
SingleCompanyDynamic/
├── CorpHeaderCard.jsx          # 企业头部卡片组件
├── CorpHeaderCard.less         # 企业头部卡片样式
├── DynamicFilter.less          # 动态筛选器样式
├── DynamicFilter.tsx           # 动态筛选器组件
├── HorizontalCheckBox.jsx      # 水平复选框组件
├── HorizontalCheckBox.less     # 水平复选框样式
├── RangePickerDialog.less      # 范围选择对话框样式
├── RangePickerDialog.tsx       # 范围选择对话框组件
├── dates.tsx                   # 日期处理组件
├── index.less                  # 主样式文件
├── index.tsx                   # 入口组件
└── menus.tsx                   # 菜单配置
```

## 关键文件说明

- `index.tsx` - 单企业动态视图的主入口组件
- `CorpHeaderCard.jsx` - 企业头部信息展示卡片
- `DynamicFilter.tsx` - 动态信息筛选器
- `RangePickerDialog.tsx` - 时间范围选择对话框
- `HorizontalCheckBox.jsx` - 水平布局的复选框组件
- `dates.tsx` - 日期处理相关组件
- `menus.tsx` - 菜单配置组件

## 依赖示意

```
单企业动态视图
├── 依赖: gel-ui组件库
├── 依赖: 日期选择组件
├── 依赖: 企业数据API
└── 依赖: 路由配置
```

## 相关文档

- [企业动态API文档](../../../api/)
- [企业组件文档](../company/info/)