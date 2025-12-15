# 企业风险信息配置

企业各类风险信息展示的配置模块，定义了司法风险、信用风险、经营风险等风险信息的展示结构。

## 目录结构

```
risk/
├── Appraisal.json                    # 评估信息配置
├── BankruptcyReorganization.json     # 破产重组信息配置
├── CourtNotice.json                  # 法院通知信息配置
├── CreditDishonest.json              # 失信信息配置
├── Dishonesty.json                   # 不诚信信息配置
├── EquityFreeze.json                 # 股权冻结信息配置
├── Lawsuit.json                      # 诉讼信息配置
├── LimitHighConsumption.json         # 限制高消费信息配置
├── TaxArrears.json                   # 税款欠缴信息配置
├── TaxException.json                 # 税务异常信息配置
├── TaxViolation.json                 # 税务违法信息配置
└── index.ts                          # 模块导出文件
```

## 关键文件说明

- **`index.ts`**: 模块核心导出文件，定义了所有风险信息配置的导出接口，统一使用 `validateReportDetailNodeOrNodesJson` 进行配置验证。
- **`CourtNotice.json`**: 法院通知信息配置，展示企业收到的各类法院通知和公告。
- **`CreditDishonest.json`**: 失信信息配置，展示企业被列入失信被执行人名单的情况。
- **`Lawsuit.json`**: 诉讼信息配置，展示企业涉及的诉讼案件信息。
- **`BankruptcyReorganization.json`**: 破产重组信息配置，展示企业破产重整相关记录。
- **`LimitHighConsumption.json`**: 限制高消费信息配置，展示企业及相关人员被限制高消费的情况。

## 依赖示意

```
risk/
├── 依赖 gel-types (ReportDetailNodeOrNodesJson)
├── 依赖 @/validation (validateReportDetailNodeOrNodesJson)
└── 被企业详情页风险信息模块引用
    └── ../index.ts
```

## 风险分类

### 司法风险类
- **诉讼风险**: 民事、刑事、行政诉讼案件
- **执行风险**: 法院执行案件和执行通知
- **破产风险**: 破产清算和重整案件
- **限制措施**: 限制高消费、股权冻结等

### 信用风险类
- **失信风险**: 失信被执行人记录
- **不诚信**: 不诚信行为记录
- **评估风险**: 各类负面评估信息

### 税务风险类
- **欠缴风险**: 税款欠缴记录
- **违法风险**: 税务违法行为记录
- **异常风险**: 税务异常状态记录

## 配置特点

- **风险全覆盖**: 涵盖企业面临的各类风险场景
- **司法重点**: 重点关注司法相关风险信息
- **信用核心**: 突出信用风险对企业的影响
- **税务合规**: 关注税务相关风险和合规问题
- **标准化验证**: 所有配置都经过统一验证确保数据正确性

## 风险等级划分

- **高风险**: 破产重组、失信被执行人、重大诉讼
- **中风险**: 一般诉讼、税务违法、股权冻结
- **低风险**: 税务异常、法院通知、评估信息

## 应用场景

- **投资决策**: 为投资决策提供风险评估依据
- **信贷审批**: 为银行信贷审批提供风险参考
- **供应商管理**: 评估供应商合作风险
- **合规监控**: 监控企业合规状况和风险变化
- **保险承保**: 为保险公司提供风险评估数据

## 风险预警机制

- **实时监控**: 实时监控风险信息变化
- **等级预警**: 根据风险等级进行预警
- **趋势分析**: 分析风险变化趋势
- **关联分析**: 分析风险之间的关联性

## 相关文档

- [企业风险评估规范](../../../../docs/rule/corp-risk-assessment.md)
- [司法信息披露标准](../../../../docs/rule/judicial-disclosure.md)
- [信用风险展示规范](../../../../docs/rule/credit-risk-display.md)
- [企业详情页设计文档](../../../../docs/design/corp-detail-page.md)