# 企业历史信息配置

企业历史相关信息展示的配置模块，定义了企业历史变更、历史股东、历史投资等历史数据的展示结构。

## 目录结构

```
history/
├ corpHistoryBusinessInfo.json        # 历史工商信息配置
├ corpHistoryCoreTeam.json            # 历史核心团队配置
├ corpHistoryInvestment.json          # 历史投资信息配置
├ corpHistoryLegalRepresentative.json # 历史法定代表人配置
├ corpHistoryLegalPerson.json         # 历史法人信息配置
├ corpHistoryOverseasInvestment.json  # 历史海外投资配置
├ corpHistoryShareholder.json         # 历史股东信息配置
├ corpHistoryShareholderBig.json      # 历史大股东配置
├ corpHistoryShareholderUnregular.json # 历史非常规股东配置
└── index.ts                          # 模块导出文件
```

## 关键文件说明

- **`index.ts`**: 模块核心导出文件，定义了所有历史信息配置的导出接口，使用 `validateReportDetailNodeOrNodesJson` 进行配置验证。
- **`corpHistoryBusinessInfo.json`**: 历史工商信息配置，展示企业工商信息的历史变更记录。
- **`corpHistoryShareholder.json`**: 历史股东信息配置，记录企业股东的历史变更情况。
- **`corpHistoryLegalRepresentative.json`**: 历史法定代表人配置，展示企业法定代表人的历史变更记录。
- **`corpHistoryInvestment.json`**: 历史投资信息配置，记录企业历史对外投资情况。
- **`corpHistoryCoreTeam.json`**: 历史核心团队配置，展示企业管理团队的历史变更情况。

## 依赖示意

```
history/
├── 依赖 gel-types (ReportDetailNodeOrNodesJson)
├── 依赖 @/validation (validateReportDetailNodeOrNodesJson)
└── 被企业详情页历史信息模块引用
    └── ../index.ts
```

## 历史信息分类

- **工商历史**: 历史工商信息、历史法人信息
- **股权历史**: 历史股东信息、历史大股东、历史非常规股东
- **人员历史**: 历史法定代表人、历史核心团队
- **投资历史**: 历史投资信息、历史海外投资

## 配置特点

- **时间维度**: 重点关注信息的时间变化和历史追溯
- **变更追踪**: 展示企业关键信息的历史变更轨迹
- **完整记录**: 保存企业发展的完整历史记录
- **对比分析**: 支持历史信息与当前信息的对比分析
- **标准化验证**: 所有配置都经过统一验证确保数据正确性

## 应用场景

- **尽职调查**: 为投资并购提供企业历史变迁分析
- **风险评估**: 通过历史变更识别潜在风险
- **合规审查**: 检查企业历史合规情况和变更记录
- **企业研究**: 分析企业发展历程和变迁轨迹

## 数据展示特点

- **时间排序**: 按时间倒序展示历史变更记录
- **变更对比**: 突出显示变更前后的差异
- **关键节点**: 标注重要的历史变更节点
- **关联信息**: 展示相关联的历史变更信息

## 历史追溯价值

- **发展轨迹**: 完整展现企业发展历程
- **风险预警**: 通过历史变更预测未来风险
- **投资参考**: 为投资决策提供历史依据
- **合规监控**: 监控企业合规状况的历史变化

## 相关文档

- [企业历史信息披露规范](../../../../docs/rule/corp-history-disclosure.md)
- [变更记录管理标准](../../../../docs/rule/change-record-management.md)
- [企业详情页设计文档](../../../../docs/design/corp-detail-page.md)