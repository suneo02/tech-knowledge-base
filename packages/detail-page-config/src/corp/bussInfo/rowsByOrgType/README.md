# rowsByOrgType - 按组织类型配置的企业信息

## 概述

rowsByOrgType 模块提供按组织类型分类的企业信息配置，支持 10 种不同组织类型的企业数据结构，用于企业详情页面的动态渲染。

## 目录结构

```
rowsByOrgType/
├── FCP.json          # 金融机构(支付)配置
├── FPC.json          # 金融机构(支付卡)配置
├── GOV.json          # 政府机构配置
├── IIP.json          # 投资机构配置
├── NGO.json          # 非政府组织配置
├── OE.json           # 其他企业配置
├── PE.json           # 私募股权配置
├── SOE.json          # 国有企业配置
├── SPE.json          # 特殊目的实体配置
└── index.ts          # 导出入口文件
```

## 配置列表

| 代码 | 组织类型 | 中文名称 | 配置文件 |
|------|----------|----------|----------|
| FCP | 金融机构(支付) | 金融机构(支付) | FCP.json |
| FPC | 金融机构(支付卡) | 金融机构(支付卡) | FPC.json |
| GOV | 政府机构 | 政府机构 | GOV.json |
| IIP | 投资机构 | 投资机构 | IIP.json |
| NGO | 非政府组织 | 非政府组织 | NGO.json |
| OE | 其他企业 | 其他企业 | OE.json |
| PE | 私募股权 | 私募股权 | PE.json |
| SOE | 国有企业 | 国有企业 | SOE.json |
| SPE | 特殊目的实体 | 特殊目的实体 | SPE.json |

## 使用方式

```typescript
// 直接导入特定组织类型配置
import { SOE } from './rowsByOrgType';

// 通过组织类型代码获取配置
import { corpConfigMapByConfigType } from './rowsByOrgType';
const soeConfig = corpConfigMapByConfigType['SOE'];
```