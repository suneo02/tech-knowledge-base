# 企业经营风险配置

企业经营相关风险信息的展示配置模块，定义了企业在经营活动中可能面临的各类风险的展示结构。

## 目录结构

```
businessRisk/
├── BondDefault.json                  # 债券违约信息配置
├── CancellationRecord.json           # 注销记录信息配置
├── DoubleRandomInspection.json       # 双随机检查信息配置
├── EquityPledge.json                 # 股权质押信息配置
├── InspectionCheck.json              # 检查检查信息配置
├── IntegrityInformation.json         # 诚信信息配置
├── IntellectualPropertyPledge.json   # 知识产权质押信息配置
├── LiquidationInfo.json              # 清算信息配置
├── ManageAbnormal.json               # 经营异常信息配置
├── ProductRecall.json                # 产品召回信息配置
├── SeriousViolation.json             # 严重违规信息配置
├── StockPledge.json                  # 股票质押信息配置
├── TaxDebt.json                      # 税务债务信息配置
├── TaxViolation.json                 # 税务违法信息配置
├── WarrantyInformation.json          # 担保信息配置
└── index.ts                          # 模块导出文件
```

## 关键文件说明

- **`index.ts`**: 模块核心导出文件，定义了所有经营风险配置的导出接口，统一使用 `validateReportDetailNodeOrNodesJson` 进行配置验证。
- **`BondDefault.json`**: 债券违约信息配置，展示企业债券违约的历史记录和详情。
- **`EquityPledge.json`**: 股权质押信息配置，记录企业股权质押的情况，包括质押方、质押比例、质押期限等。
- **`ManageAbnormal.json`**: 经营异常信息配置，展示企业被列入经营异常名录的情况。
- **`TaxViolation.json`**: 税务违法信息配置，记录企业税务相关的违法行为和处罚情况。
- **`ProductRecall.json`**: 产品召回信息配置，展示企业产品召回的历史记录和原因。

## 依赖示意

```
businessRisk/
├── 依赖 gel-types (ReportDetailNodeOrNodesJson)
├── 依赖 @/validation (validateReportDetailNodeOrNodesJson)
└── 被企业详情页经营风险模块引用
    └── ../index.ts
```

## 风险分类

- **财务风险**: 债券违约、股权质押、股票质押、担保信息
- **合规风险**: 税务违法、严重违规、双随机检查、检查检查
- **经营风险**: 经营异常、清算信息、注销记录
- **产品风险**: 产品召回、知识产权质押
- **信用风险**: 诚信信息、担保信息

## 配置特点

- **风险全覆盖**: 涵盖企业经营的各类风险场景
- **监管合规**: 重点展示监管检查和合规相关信息
- **财务风险**: 突出股权、债权相关的财务风险
- **统一验证**: 所有配置都经过标准化验证
- **风险等级**: 通过不同配置区分风险的重要程度

## 应用场景

- **风险评估**: 为投资者提供企业风险分析依据
- **合规检查**: 帮助用户了解企业合规状况
- **信用评估**: 通过风险信息评估企业信用水平
- **投资决策**: 为投资决策提供风险参考信息

## 相关文档

- [企业风险评估规范](../../../../docs/rule/corp-risk-assessment.md)
- [经营风险展示标准](../../../../docs/rule/business-risk-display.md)
- [配置验证规范](../../../../docs/rule/config-validation.md)