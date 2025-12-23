# 企业详情页配置

企业详情页面的配置文件模块，定义了不同类型企业的信息展示结构和业务数据布局。

## 目录结构

```
corp/
├── IpoBusinessData/          # IPO 企业业务数据配置
│   ├── BalanceSheet.json          # 资产负债表配置
│   ├── CashFlowStatement.json     # 现金流量表配置
│   ├── ProfitStatement.json       # 利润表配置
│   ├── BussData*Current.json      # 当期业务数据配置
│   ├── BussData*Cumulative.json   # 累计业务数据配置
│   ├── FinancialIndicator.json    # 财务指标配置
│   ├── MainBusinessScope.json     # 主营业务范围配置
│   └── index.ts                   # IPO 业务数据导出模块
├── baseInfo/                 # 企业基础信息配置
│   ├── ActualController.json        # 实际控制人信息
│   ├── AnnualReport.json            # 年报信息
│   ├── BelongIndustry.json          # 所属行业信息
│   ├── ChangeInfo.json              # 变更信息
│   ├── Competitor.json              # 竞争对手信息
│   ├── CoreTeam.json                # 核心团队信息
│   ├── Shareholder*.json           # 股东相关信息配置
│   ├── shareholder/                 # 股东专项配置目录
│   └── index.ts                     # 基础信息导出模块
├── business/                 # 企业经营信息配置
│   ├── AppProducts.json             # APP 产品信息
│   ├── BiddingAnnouncements.json    # 招标公告信息
│   ├── BusinessAssociates.json      # 业务关联方信息
│   ├── CompanyReports.json          # 公司报告信息
│   ├── CustomersAndSuppliers.json   # 客户供应商信息
│   ├── EnterpriseBusiness.json      # 企业经营信息
│   ├── Government*.json            # 政府相关项目配置
│   └── index.ts                     # 经营信息导出模块
├── businessRisk/             # 企业经营风险配置
│   ├── BondDefault.json             # 债券违约信息
│   ├── CancellationRecord.json      # 注销记录信息
│   ├── EquityPledge.json            # 股权质押信息
│   ├── InspectionCheck.json         # 检查检查信息
│   ├── LiquidationInfo.json         # 清算信息
│   ├── TaxViolation.json            # 税务违法信息
│   └── index.ts                     # 经营风险导出模块
├── bussInfo/                 # 企业工商信息配置
│   ├── defaultConfig.json           # 默认工商信息配置
│   ├── rowsByCorpTypeId/            # 按企业类型ID分类配置
│   │   ├── HK.json                  # 香港企业配置
│   │   ├── LS.json                  # LS 类型企业配置
│   │   └── SH.json                  # 上海企业配置
│   ├── rowsByNation/                # 按国家/地区分类配置
│   │   ├── canada.json              # 加拿大企业配置
│   │   ├── germany.json             # 德国企业配置
│   │   ├── japan.json               # 日本企业配置
│   │   └── ...                      # 其他国家配置
│   ├── rowsByOrgType/               # 按组织类型分类配置
│   │   ├── FCP.json                 # FCP 类型配置
│   │   ├── FPC.json                 # FPC 类型配置
│   │   └── GOV.json                 # 政府组织配置
│   └── index.ts                     # 工商信息导出模块
└── README.md                 # 本文档
```

## 关键文件说明

- **`bussInfo/index.ts`**: 工商信息配置的核心模块，提供 `getCorpInfoConfigByInfo` 函数，根据企业基础信息智能匹配对应的配置模板。
- **`IpoBusinessData/index.ts`**: IPO 企业财务报表数据配置模块，包含资产负债表、现金流量表、利润表等标准财务报表的展示结构。
- **`baseInfo/index.ts`**: 企业基础信息配置模块，定义了实际控制人、股东信息、核心团队等企业基本信息的展示结构。
- **`business/index.ts`**: 企业经营信息配置模块，包含产品信息、业务关联方、政府项目等经营相关数据的展示配置。
- **`businessRisk/index.ts`**: 企业经营风险配置模块，定义了各类风险信息的展示结构，包括违约记录、股权质押、税务违法等。

## 依赖示意

```
corp/
├── 依赖 gel-types (ReportDetailTableJson, CorpBasicInfo)
├── 依赖 @/validation (validateReportDetailNodeOrNodesJson)
└── 被企业详情页组件引用
    └── gel-pages/detail-page
```

## 配置匹配规则

工商信息配置支持三层匹配机制：
1. **Config Type 优先**: 根据 `configType` 匹配特定组织类型配置
2. **Area Code 次优**: 根据 `areaCode` 匹配国家/地区配置，海外企业默认使用加拿大配置
3. **Corp Type ID 兜底**: 根据 `corp_type_id` 匹配企业类型配置
4. **Default 配置**: 以上均未匹配时使用默认配置

## 相关文档

- [企业详情页设计文档](../../../docs/design/corp-detail-page.md)
- [详情页配置类型定义](../../../gel-types/src/report-detail.ts)
- [配置验证规范](../../../docs/rule/config-validation.md)