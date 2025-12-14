# 企业基础信息配置

企业基础信息展示的配置模块，定义了企业核心基础数据的展示结构和布局。

## 目录结构

```
baseInfo/
├── ActualController.json              # 实际控制人信息配置
├── AnnualReport.json                  # 年报信息配置
├── BelongIndustry.json                # 所属行业信息配置
├── BranchStructure.json               # 分支机构信息配置
├── ChangeInfo.json                    # 变更信息配置
├── Competitor.json                    # 竞争对手信息配置
├── CoreTeam.json                      # 核心团队信息配置
├── FinalBeneficiary.json              # 最终受益人信息配置
├── GroupSystem.json                   # 集团体系信息配置
├── HKCorpInfo.json                    # 香港企业信息配置
├── HoldCompany.json                   # 控股企业信息配置
├── MainPersonnel.json                 # 主要人员信息配置
├── OverseasInvestment.json            # 海外投资信息配置
├── ShareholderChange.json             # 股东变更信息配置
├── ShareholderPenetration.json        # 股东穿透信息配置
├── ShareholderPenetrationGraph.json   # 股东穿透图谱配置
├── TaxPayer.json                      # 纳税人信息配置
├── VietnamCorpIndustry.json           # 越南企业行业信息配置
├── shareholder/                       # 股东信息子目录
│   ├── EquityChangeInformation.json   # 股权变更信息配置
│   ├── ShareholderAndCapitalContribution.json  # 股东及出资信息配置
│   ├── ShareholderBig.json            # 大股东信息配置
│   ├── ShareholderInfomation.json     # 股东信息配置
│   ├── ShareholderReport.json         # 股东报告配置
│   └── ShareholderUnregular.json      # 非常规股东信息配置
└── index.ts                           # 模块导出文件
```

## 关键文件说明

- **`index.ts`**: 模块核心导出文件，定义了所有基础信息配置的导出接口，使用 `validateReportDetailNodeOrNodesJson` 和 `validateReportDetailTableJson` 进行配置验证。
- **`ActualController.json`**: 实际控制人信息配置，定义了企业实际控制人的展示结构，包括名称、持股比例等字段。
- **`shareholder/ShareholderBig.json`**: 大股东信息表格配置，使用 `validateReportDetailTableJson` 验证，定义了股东信息的表格展示结构。
- **`CoreTeam.json`**: 核心团队信息配置，定义了企业管理团队的展示结构。
- **`ChangeInfo.json`**: 企业变更信息配置，记录企业历史变更数据。

## 依赖示意

```
baseInfo/
├── 依赖 gel-types (ReportDetailTableJson, ReportDetailNodeOrNodesJson)
├── 依赖 @/validation (validateReportDetailNodeOrNodesJson)
└── 被企业详情页基础信息模块引用
    └── ../index.ts
```

## 配置特点

- **统一验证**: 所有配置文件都通过验证函数确保数据结构正确性
- **国际化支持**: 配置包含 `titleIntl` 字段支持多语言展示
- **分层管理**: 股东信息独立子目录管理，便于维护
- **全覆盖**: 涵盖企业基础信息的各个维度

## 相关文档

- [企业详情页设计文档](../../../../docs/design/corp-detail-page.md)
- [基础信息配置规范](../../../../docs/rule/base-info-config.md)
- [配置验证规范](../../../../docs/rule/config-validation.md)