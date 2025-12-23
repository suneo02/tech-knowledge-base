# 企业经营信息配置

企业经营相关信息展示的配置模块，定义了企业经营活动、产品服务、客户供应商等经营数据的展示结构。

## 目录结构

```
business/
├── AppProducts.json                   # APP 产品信息配置
├── BiddingAnnouncements.json          # 招标公告信息配置
├── BusinessAssociates.json            # 业务关联方信息配置
├── CompanyReports.json                # 公司报告信息配置
├── CustomersAndSuppliers.json         # 客户与供应商信息配置
├── EnterpriseBusiness.json            # 企业经营信息配置
├── GovernmentMajorProjects.json       # 政府重大项目配置
├── GovernmentSubsidies.json           # 政府补贴信息配置
├── GovernmentSupport.json             # 政府支持信息配置
├── Hotels.json                        # 酒店信息配置
├── LandInformation.json               # 土地信息配置
├── PrivateEquityFunds.json            # 私募股权基金配置
├── Recruitment.json                   # 招聘信息配置
├── TenderingAnnouncements.json        # 招标公告信息配置
└── index.ts                           # 模块导出文件
```

## 关键文件说明

- **`index.ts`**: 模块核心导出文件，定义了所有经营信息配置的导出接口，统一使用 `validateReportDetailNodeOrNodesJson` 进行配置验证。
- **`EnterpriseBusiness.json`**: 企业经营信息核心配置，定义了企业基本经营数据的展示结构。
- **`AppProducts.json`**: APP 产品信息配置，定义了企业移动应用的展示结构，包括应用名称、类型、下载量等字段。
- **`CustomersAndSuppliers.json`**: 客户与供应商信息配置，展示企业的商业合作生态。
- **`GovernmentMajorProjects.json`**: 政府重大项目配置，展示企业参与的政府投资项目信息。
- **`Recruitment.json`**: 招聘信息配置，展示企业的人才需求和组织扩张情况。

## 依赖示意

```
business/
├── 依赖 gel-types (ReportDetailNodeOrNodesJson)
├── 依赖 @/validation (validateReportDetailNodeOrNodesJson)
└── 被企业详情页经营信息模块引用
    └── ../index.ts
```

## 配置特点

- **经营维度全覆盖**: 从产品服务到客户供应商，全面展示企业经营生态
- **政府项目支持**: 专门配置政府相关项目，突出政企合作
- **人才需求展示**: 通过招聘信息反映企业发展态势
- **标准化验证**: 所有配置都经过统一验证确保数据结构正确性
- **国际化友好**: 支持 `titleIntl` 多语言字段

## 业务场景

- **企业画像**: 通过多维度经营数据构建完整企业画像
- **商业合作**: 展示企业的客户供应商关系网络
- **发展动态**: 通过招聘和项目信息了解企业发展动态
- **政企关系**: 突出企业与政府的合作项目

## 相关文档

- [企业经营信息展示规范](../../../../docs/rule/business-info-display.md)
- [企业详情页设计文档](../../../../docs/design/corp-detail-page.md)
- [配置验证规范](../../../../docs/rule/config-validation.md)