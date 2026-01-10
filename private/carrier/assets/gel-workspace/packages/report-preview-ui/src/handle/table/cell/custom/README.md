# 表格单元格自定义渲染器 (React)

提供报告预览UI模块中表格单元格的自定义渲染器，用于处理特殊类型的数据展示。这些渲染器使用React组件实现，与报告打印模块中的jQuery版本相对应。

## 目录结构

```
custom/
├── NonStandardDefaultRelatedParty.tsx  # 非标准默认关联方渲染器
├── bussChangeInfo/                     # 经营变更信息渲染器
│   ├── index.less                      # 样式文件
│   └── index.tsx                       # 渲染器实现
├── bussState/                          # 经营状态渲染器
│   ├── index.module.less               # 样式文件
│   └── index.tsx                       # 渲染器实现
├── corpInfoAnnounceShareholderName.tsx # 公告股东名称渲染器
├── corpInfoBussInfoShareholderName.tsx # 经营信息股东名称渲染器
├── hkUsedNames/                        # 香港曾用名渲染器
│   ├── index.module.less               # 样式文件
│   └── index.tsx                       # 渲染器实现
├── index.ts                            # 统一导出和处理器
├── overseasAlias.tsx                   # 海外别名渲染器
├── shareholderName.module.less         # 股东名称样式
├── stockChange.module.less             # 股票变化样式
└── stockChange.tsx                     # 股票变化渲染器
```

## 关键文件说明

| 文件 | 作用 |
|------|------|
| `index.ts` | 统一导出所有自定义渲染器，提供`handleConfigTableColCustomRender`函数处理不同类型的自定义渲染 |
| `stockChange.tsx` | 股票变化渲染器，根据数值正负显示不同颜色和样式 |
| `bussState/index.tsx` | 经营状态渲染器，处理企业经营状态和撤销/取消日期的显示 |
| `corpInfoAnnounceShareholderName.tsx` | 公告股东名称渲染器，显示股东名称及相关标签 |
| `hkUsedNames/index.tsx` | 香港曾用名渲染器，显示香港公司的曾用名和使用时间范围 |
| `overseasAlias.tsx` | 海外别名渲染器，使用CorpAnotherName组件显示海外别名 |

## 主要功能

- **自定义渲染处理**: 通过`handleConfigTableColCustomRender`函数根据渲染名称选择对应的渲染器
- **股票变化渲染**: 根据数值正负显示不同颜色（上涨/下跌）
- **经营状态渲染**: 处理企业经营状态和撤销/取消日期的组合显示
- **股东名称渲染**: 处理公告和经营信息中的股东名称显示，包括最终受益人、实际控制人等标签
- **香港公司信息**: 处理香港公司名称和曾用名的特殊显示
- **海外别名**: 使用CorpAnotherName组件处理海外公司别名的显示

## 渲染器类型

系统支持以下自定义渲染器类型：

- `announcementShareholderName`: 公告股东名称
- `bussInfoShareholderName`: 经营信息股东名称
- `stockChange`: 股票变化
- `bussChangeInfo`: 经营变更信息
- `bussStatus`: 经营状态
- `hkUsedNames`: 香港曾用名
- `overseasAlias`: 海外别名

## 技术特点

- **React组件**: 所有渲染器使用React组件实现，支持现代React特性
- **TypeScript**: 完整的TypeScript类型支持
- **国际化**: 支持多语言渲染
- **样式模块化**: 使用CSS模块化方案管理样式
- **组件复用**: 复用gel-ui和wind-ui中的通用组件

## 依赖关系

- **上游**: 表格渲染器(`../renderers`)、表格类型定义(`@/types/table`)、工具函数(`gel-util/intl`)
- **下游**: 报告预览UI表格组件
- **协作**: 报告工具库(`report-util/table`)、类型定义(`gel-types`)、UI组件库(`@wind/wind-ui`, `gel-ui`)

## 与打印模块的区别

与`apps/report-print/src/handle/table/cell/custom`目录相比：

1. **技术栈**: 此处使用React组件，打印模块使用jQuery
2. **实现方式**: 此处使用JSX语法，打印模块使用字符串拼接
3. **样式处理**: 此处使用CSS模块，打印模块使用Less
4. **国际化**: 此处使用gel-util/intl，打印模块使用自定义国际化方案

## 相关文档

- [表格渲染器](../renderers/README.md)
- [表格处理](../README.md)
- [报告预览UI模块](../../../README.md)