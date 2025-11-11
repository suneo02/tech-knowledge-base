# 企业资质配置

企业资质认证相关信息展示的配置模块，定义了企业各类资质证书、行政许可、认证评级等资质信息的展示结构。

## 目录结构

```
qualification/
├── AExcellentTaxpayer.json           # A级纳税人资质配置
├── AdministrativeLicenseBureau.json  # 行政许可局资质配置
├── AdministrativeLicenseMinistry.json # 行政许可部委资质配置
├── AdministrativeLicenseProvince.json # 行政许可省厅资质配置
├── BuildingQualification.json        # 建筑资质配置
├── ComprehensiveQualification.json   # 综合资质配置
├── CreditRating.json                 # 信用评级资质配置
├── CulturalRelic.json                # 文物资质配置
├── EnergyConservation.json           # 节能资质配置
├── EnvironmentalProtection.json      # 环保资质配置
├── FinancialLicense.json             # 金融牌照配置
├── FoodSafety.json                   # 食品安全资质配置
├── HighTech.json                     # 高新技术企业资质配置
├── ImportExport.json                 # 进出口资质配置
├── InformationSecurity.json          # 信息安全资质配置
├── InternetContentProvider.json      # ICP资质配置
├── MedicalDevice.json                # 医疗器械资质配置
├── ProductionLicense.json            # 生产许可证配置
└── index.ts                          # 模块导出文件
```

## 关键文件说明

- **`index.ts`**: 模块核心导出文件，定义了所有资质配置的导出接口，统一使用 `validateReportDetailNodeOrNodesJson` 进行配置验证。
- **`BuildingQualification.json`**: 建筑资质配置，展示企业的建筑行业相关资质证书。
- **`FinancialLicense.json`**: 金融牌照配置，展示企业获得的金融业务许可证和牌照。
- **`HighTech.json`**: 高新技术企业资质配置，展示企业的高新技术企业认证情况。
- **`AExcellentTaxpayer.json`**: A级纳税人资质配置，展示企业的纳税信用等级。
- **`FoodSafety.json`**: 食品安全资质配置，展示企业的食品安全相关资质认证。

## 依赖示意

```
qualification/
├── 依赖 gel-types (ReportDetailNodeOrNodesJson)
├── 依赖 @/validation (validateReportDetailNodeOrNodesJson)
└── 被企业详情页资质信息模块引用
    └── ../index.ts
```

## 资质分类

### 行业资质类
- **建筑资质**: 建筑行业专业资质证书
- **医疗器械**: 医疗器械经营和生产资质
- **食品安全**: 食品生产经营相关资质
- **文物保护**: 文物保护相关资质认证

### 行政许可类
- **部委许可**: 国家部委级行政许可
- **省厅许可**: 省级厅局级行政许可
- **地方许可**: 地方政府行政许可
- **生产许可**: 各类产品生产许可证

### 认证评级类
- **信用评级**: 企业信用等级评级
- **高新认证**: 高新技术企业认证
- **节能认证**: 节能产品认证
- **环保认证**: 环保相关认证

### 专业牌照类
- **金融牌照**: 银行、证券、保险等金融牌照
- **进出口权**: 对外贸易经营权
- **信息安全**: 信息安全相关资质
- **ICP许可**: 互联网内容提供商许可

## 配置特点

- **行业全覆盖**: 涵盖主要行业的资质认证
- **分级管理**: 区分不同层级和类型的资质
- **权威性**: 重点展示官方认可的资质认证
- **时效性**: 关注资质的有效期和状态
- **标准化验证**: 所有配置都经过统一验证确保数据正确性

## 应用场景

- **供应商筛选**: 通过资质信息筛选合格供应商
- **投资决策**: 评估企业资质实力和合规性
- **合作准入**: 判断企业是否具备合作资质
- **风险评估**: 通过资质缺失识别潜在风险
- **招投标**: 评估企业投标资格

## 资质价值评估

- **准入门槛**: 特定行业的必要资质要求
- **竞争优势**: 稀有或高级别资质的竞争优势
- **合规保障**: 资质完整性反映企业合规水平
- **发展潜力**: 高新技术等资质反映发展潜力

## 相关文档

- [企业资质信息披露规范](../../../../docs/rule/qualification-disclosure.md)
- [资质认证展示标准](../../../../docs/rule/qualification-display.md)
- [企业详情页设计文档](../../../../docs/design/corp-detail-page.md)