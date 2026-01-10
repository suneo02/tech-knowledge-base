# 表格单元格自定义渲染器

提供报告打印模块中表格单元格的自定义渲染器，用于处理特殊类型的数据展示。

## 目录结构

```
custom/
├── NonStandardDefaultRelatedParty.ts  # 非标准默认关联方渲染器
├── bondIssueRating.ts                  # 债券发行评级渲染器
├── bussChangeInfo/                     # 经营变更信息渲染器
│   ├── index.less                      # 样式文件
│   └── index.ts                        # 渲染器实现
├── bussState/                          # 经营状态渲染器
│   ├── index.module.less               # 样式文件
│   └── index.ts                        # 渲染器实现
├── corpInfoAnnounceShareholderName.ts  # 公告股东名称渲染器
├── corpInfoBussInfoShareholderName.ts  # 经营信息股东名称渲染器
├── creditCodeRenderers.ts              # 信用代码渲染器
├── dateCustom.ts                       # 自定义日期渲染器
├── hkCorpName.ts                       # 香港公司名称渲染器
├── hkUsedNames/                        # 香港曾用名渲染器
│   ├── index.module.less               # 样式文件
│   ├── index.stories.ts                # Storybook故事
│   └── index.ts                        # 渲染器实现
├── index.ts                            # 统一导出和处理器
├── overseasAlias/                      # 海外别名渲染器
│   ├── index.module.less               # 样式文件
│   ├── index.stories.ts                # Storybook故事
│   └── index.ts                        # 渲染器实现
├── relativeType.ts                     # 关联类型渲染器
├── shareholderName.module.less         # 股东名称样式
├── stockChange.module.less             # 股票变化样式
└── stockChange.ts                      # 股票变化渲染器
```

## 关键文件说明

| 文件 | 作用 |
|------|------|
| `index.ts` | 统一导出所有自定义渲染器，提供`handleConfigTableColCustomRender`函数处理不同类型的自定义渲染 |
| `stockChange.ts` | 股票变化渲染器，根据数值正负显示不同颜色和样式 |
| `bussState/index.ts` | 经营状态渲染器，处理企业经营状态和撤销/取消日期的显示 |

## 主要功能

- **自定义渲染处理**: 通过`handleConfigTableColCustomRender`函数根据渲染名称选择对应的渲染器
- **股票变化渲染**: 根据数值正负显示不同颜色（上涨/下跌）
- **经营状态渲染**: 处理企业经营状态和撤销/取消日期的组合显示
- **股东名称渲染**: 处理公告和经营信息中的股东名称显示
- **香港公司信息**: 处理香港公司名称和曾用名的特殊显示
- **海外别名**: 处理海外公司别名的显示

## 渲染器类型

系统支持以下自定义渲染器类型：

- `announcementShareholderName`: 公告股东名称
- `bussInfoShareholderName`: 经营信息股东名称
- `stockChange`: 股票变化
- `bussChangeInfo`: 经营变更信息
- `integrityPenaltyStatus`: 诚信惩罚状态
- `bussStatus`: 经营状态
- `hkUsedNames`: 香港曾用名
- `overseasAlias`: 海外别名

## 依赖关系

- **上游**: 表格渲染器(`../renderers`)、表格类型定义(`@/types/table`)、工具函数(`@/utils/lang`)
- **下游**: 报告打印表格组件
- **协作**: 报告工具库(`report-util/table`)、类型定义(`gel-types`)

## 相关文档

- [表格渲染器](../renderers/README.md)
- [表格处理](../README.md)
- [报告打印模块](../../../README.md)