# 企业财务信息配置

企业财务相关信息展示的配置模块，定义了企业银行信贷、债券发行、投资融资、债务评级等财务数据的展示结构。

## 目录结构

```
finance/
├── BankCredit.json                   # 银行信贷信息配置
├── BondIssue.json                    # 债券发行信息配置
├── DebtRating.json                   # 债务评级信息配置
├── EquityPenetration.json            # 股权穿透信息配置
├── Guarantee.json                    # 担保信息配置
├── InvestEvent.json                  # 投资事件信息配置
├── Lawsuit.json                      # 诉讼信息配置
├── PEVCFinance.json                  # PE/VC融资信息配置
├── StockInfo.json                    # 股票信息配置
├── StockPledge.json                  # 股票质押信息配置
├── TaxInfo.json                      # 税务信息配置
├── Trust.json                        # 信托信息配置
├── UnclearPledge.json                # 未明确质押信息配置
├── UnclearStockPledge.json           # 未明确股票质押信息配置
├── UnderlyingAsset.json              # 底层资产信息配置
└── index.ts                          # 模块导出文件
```

## 关键文件说明

- **`index.ts`**: 模块核心导出文件，定义了所有财务信息配置的导出接口，统一使用 `validateReportDetailNodeOrNodesJson` 进行配置验证。
- **`BankCredit.json`**: 银行信贷信息配置，展示企业的银行贷款、授信额度等信贷数据。
- **`BondIssue.json`**: 债券发行信息配置，记录企业发行的债券信息，包括债券类型、发行规模、利率等。
- **`PEVCFinance.json`**: PE/VC融资信息配置，展示企业的私募股权和风险投资融资历史。
- **`DebtRating.json`**: 债务评级信息配置，展示企业获得的债务评级和评级变化情况。
- **`InvestEvent.json`**: 投资事件信息配置，记录企业的对外投资和被投资事件。

## 依赖示意

```
finance/
├── 依赖 gel-types (ReportDetailNodeOrNodesJson)
├── 依赖 @/validation (validateReportDetailNodeOrNodesJson)
└── 被企业详情页财务信息模块引用
    └── ../index.ts
```

## 财务信息分类

- **融资信息**: 银行信贷、债券发行、PE/VC融资、信托融资
- **投资信息**: 投资事件、股权穿透、底层资产
- **债务信息**: 债务评级、担保信息、股票质押
- **风险信息**: 诉讼信息、未明确质押
- **税务信息**: 税务信息、股票信息

## 配置特点

- **财务全覆盖**: 涵盖企业财务活动的各个维度
- **融资历史**: 重点展示企业的融资历程和融资能力
- **风险评估**: 通过评级和质押信息反映财务风险
- **投资追踪**: 展示企业的投资布局和投资回报
- **标准化验证**: 所有配置都经过统一验证确保数据正确性

## 应用场景

- **投资分析**: 为投资者提供企业财务状况分析
- **风险评估**: 通过财务数据评估企业经营风险
- **信贷决策**: 为银行等金融机构提供信贷决策依据
- **并购分析**: 为企业并购提供财务尽职调查支持

## 数据维度

- **时间维度**: 展示历史财务数据和发展趋势
- **规模维度**: 展示财务数据的规模体量
- **结构维度**: 展示财务数据的构成比例
- **质量维度**: 通过评级等信息展示财务质量

## 相关文档

- [企业财务信息披露规范](../../../../docs/rule/finance-disclosure.md)
- [财务风险评级标准](../../../../docs/rule/finance-risk-rating.md)
- [企业详情页设计文档](../../../../docs/design/corp-detail-page.md)