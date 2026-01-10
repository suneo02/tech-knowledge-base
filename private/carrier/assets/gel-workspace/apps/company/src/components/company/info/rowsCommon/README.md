# 企业信息通用展示组件

提供企业基本信息展示的通用组件，包含企业名称、注册信息、法人信息等通用字段展示。

## 目录结构

```
rowsCommon/
├── Park/                    # 园区信息展示组件
│   ├── index.less           # 园区组件样式
│   └── index.tsx            # 园区信息展示逻辑
├── WindIndustryRow.tsx      # Wind行业信息展示组件
├── XXIndustryRow.tsx       # XX行业信息展示组件
├── base.tsx                 # 基础企业信息行组件定义
├── bussStateRow.tsx         # 企业经营状态行组件
├── corpScaleRow.tsx         # 企业规模行组件
├── index.ts                 # 统一导出入口
├── industryGBRow.tsx        # 国标行业信息行组件
├── names.tsx                # 企业名称相关行组件
└── styles/                  # 样式文件
    └── XXIndustryRow.module.less
```

## 关键文件说明

| 文件 | 作用 |
|------|------|
| `base.tsx` | 定义企业基本信息展示的基础行组件，如企业名称、信用代码、法人等 |
| `index.ts` | 统一导出所有通用行组件，提供模块化入口 |
| `names.tsx` | 企业名称相关组件，包括曾用名、英文名等展示逻辑 |
| `bussStateRow.tsx` | 企业经营状态展示组件，处理不同状态的展示样式 |

## 依赖关系

- **上游**: 企业基本信息类型(`../handle`)、链接组件(`@/components/common/links/Links.tsx`)
- **下游**: 按国家/地区分类的企业信息组件(`../rowsByNation`)、按组织类型分类的企业信息组件(`../rowsByOrgType`)
- **协作**: 国际化工具(`@/utils/intl`)、通用工具函数(`@/utils/utils`)

## 相关文档

- [企业信息组件总览](../README.md)
- [按国家/地区分类的企业信息组件](../rowsByNation/README.md)
- [按组织类型分类的企业信息组件](../rowsByOrgType/README.md)