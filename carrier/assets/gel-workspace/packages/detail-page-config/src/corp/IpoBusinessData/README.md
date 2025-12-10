# IPO企业业务数据配置

IPO企业业务相关数据展示的配置模块，定义了IPO企业财务报表、业务指标、主营业务等核心数据的展示结构。

## 目录结构

```
IpoBusinessData/
├── BalanceSheet.json                 # 资产负债表配置
├── BussDataBusinessCumulative.json   # 业务累计数据配置
├── BussDataBusinessCurrent.json      # 业务当期数据配置
├── BussDataInventoryCumulative.json  # 库存累计数据配置
├── BussDataInventoryCurrent.json     # 库存当期数据配置
├── BussDataOutputCumulative.json     # 产出累计数据配置
├── BussDataOutputCurrent.json        # 产出当期数据配置
├── BussDataSalesCumulative.json      # 销售累计数据配置
├── BussDataSalesCurrent.json         # 销售当期数据配置
├── CashFlowStatement.json            # 现金流量表配置
├── FinancialIndicator.json           # 财务指标配置
├── MainBusinessScope.json            # 主营业务范围配置
└── index.ts                          # 模块导出文件
```

## 关键文件说明

- **`index.ts`**: 模块核心导出文件，定义了所有IPO业务数据配置的导出接口，统一使用 `validateReportDetailTableJson` 进行表格配置验证。
- **`BalanceSheet.json`**: 资产负债表配置，展示企业资产、负债和所有者权益的财务状况。
- **`CashFlowStatement.json`**: 现金流量表配置，展示企业经营活动、投资活动和筹资活动的现金流情况。
- **`FinancialIndicator.json`**: 财务指标配置，展示企业的关键财务分析指标。
- **`MainBusinessScope.json`**: 主营业务范围配置，展示企业的主要业务领域和经营范围。

## 业务数据分类

### 财务报表类
- **资产负债表**: 企业财务状况快照
- **利润表**: 企业经营成果展示
- **现金流量表**: 企业现金流变动情况

### 业务数据类
- **销售数据**: 当期和累计销售情况
- **产出数据**: 当期和累计产出情况
- **业务数据**: 当期和累计业务情况
- **库存数据**: 当期和累计库存情况

### 分析指标类
- **财务指标**: 关键财务分析指标
- **业务范围**: 主营业务领域

## 依赖示意

```
IpoBusinessData/
├── 依赖 gel-types (ReportDetailTableJson)
├── 依赖 @/validation (validateReportDetailTableJson)
└── 被企业详情页IPO信息模块引用
    └── ../index.ts
```

## 数据时间维度

### 当期数据 (Current)
- 展示最新一期或当前周期的数据
- 用于了解企业最新经营状况
- 反映企业当前发展水平

### 累计数据 (Cumulative)
- 展示累计到当前时点的数据
- 用于了解企业发展历程
- 反映企业长期发展趋势

## 配置特点

- **财务完整性**: 涵盖三大财务报表的完整数据
- **业务多维性**: 从销售、产出、库存等多维度展示业务数据
- **时间对比**: 提供当期和累计数据的对比分析
- **指标分析**: 通过财务指标提供深度分析
- **表格展示**: 所有配置都使用表格结构确保数据清晰展示

## 应用场景

- **IPO尽调**: 为IPO投资提供详细的企业财务和业务数据分析
- **投资决策**: 基于完整的财务数据做出投资决策
- **企业分析**: 深度分析企业经营状况和发展趋势
- **风险评估**: 通过财务数据评估企业经营风险

## 数据分析维度

- **盈利能力**: 通过利润表和财务指标分析企业盈利能力
- **偿债能力**: 通过资产负债表分析企业偿债能力
- **运营能力**: 通过业务数据分析企业运营效率
- **成长性**: 通过当期与累计数据对比分析成长性

## 相关文档

- [IPO信息披露规范](../../../../docs/rule/ipo-disclosure.md)
- [财务报表展示标准](../../../../docs/rule/financial-report-display.md)
- [企业详情页设计文档](../../../../docs/design/corp-detail-page.md)