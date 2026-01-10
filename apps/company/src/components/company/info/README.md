# 企业信息组件

提供企业基本信息展示和各类企业特殊信息的渲染组件。

## 目录结构
```
info/
├── index.ts                     # 组件入口文件
├── CompanyInfo.tsx              # 企业信息主组件
├── CompanyInfoDisplay.tsx       # 企业信息展示组件
├── CorpInfoTitle.tsx             # 企业信息标题组件
├── default.tsx                  # 默认配置
├── handle.tsx                   # 事件处理函数
├── CompanyInfo.less             # 主样式文件
├── comp/                        # 通用组件
│   ├── AddrComp.tsx             # 地址组件
│   ├── XXIndustryModal.tsx      # 行业选择模态框
│   ├── XXIndustryTree.tsx       # 行业树组件
│   ├── industry.tsx             # 行业组件
│   ├── misc.tsx                 # 杂项组件
│   └── style/                   # 组件样式
├── handle/                      # 处理函数
│   └── tree.ts                  # 树形数据处理
├── rowsByCorpTypeId/            # 按企业类型ID分类的行组件
│   ├── HK.tsx                   # 香港企业
│   ├── LS.tsx                   # 有限公司
│   ├── SH.tsx                   # 上海企业
│   └── TW.tsx                   # 台湾企业
├── rowsByNation/                # 按国家分类的行组件
│   ├── canada.tsx               # 加拿大企业
│   ├── england.tsx              # 英国企业
│   ├── france.tsx               # 法国企业
│   └── ... (其他国家)
├── rowsByOrgType/               # 按组织类型分类的行组件
│   ├── CO.tsx                   # 公司
│   ├── FCP.tsx                  # 外国公司合伙人
│   ├── FPC.tsx                  # 外国私人公司
│   └── ... (其他组织类型)
└── rowsCommon/                  # 通用行组件
    ├── Park/                    # 园区信息
    ├── WindIndustryRow.tsx      # 风险行业行
    ├── XXIndustryRow.tsx       # 行业行
    ├── base.tsx                 # 基础信息行
    └── ... (其他通用组件)
```

## 关键文件说明
- `CompanyInfo.tsx` - 企业信息主组件，根据企业类型渲染不同信息
- `rowsByCorpTypeId/` - 按企业类型ID分类的特殊信息展示组件
- `rowsByNation/` - 按国家分类的企业特殊信息展示组件
- `rowsByOrgType/` - 按组织类型分类的企业特殊信息展示组件
- `rowsCommon/` - 通用企业信息展示组件

## 依赖示意
- 依赖：`antd` - UI组件库、`react` - React框架
- 上游：企业数据API、企业类型配置
- 下游：企业详情页面、企业列表页面

## 相关文档
- [企业信息展示设计](../../../../../docs/company-info-display-design.md)
- [企业类型分类指南](../../../../../docs/corp-type-classification-guide.md)