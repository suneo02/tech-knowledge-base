# 企业知识产权配置

企业知识产权相关信息展示的配置模块，定义了企业专利、商标、著作权、域名等知识产权信息的展示结构。

## 目录结构

```
intellectual/
├── DomainName.json                   # 域名信息配置
├── MicroblogAccount.json             # 微博账号信息配置
├── PatentAdminLicense.json           # 专利行政许可配置
├── PatentOther.json                  # 其他专利信息配置
├── PatentPledge.json                 # 专利质押信息配置
├── SoftwareCopyright.json            # 软件著作权配置
├── TrademarkAdminLicense.json        # 商标行政许可配置
├── WorkCopyright.json                # 作品著作权配置
├── patent/                           # 专利信息子目录
│   ├── PatentAppSelf.json            # 自有专利申请配置
│   ├── PatentSelf.json               # 自有专利配置
│   └── index.ts                      # 专利模块导出
├── trademark/                        # 商标信息子目录
│   ├── TrademarkAppSelf.json         # 自有商标申请配置
│   ├── TrademarkSelf.json            # 自有商标配置
│   └── index.ts                      # 商标模块导出
└── index.ts                          # 模块导出文件
```

## 关键文件说明

- **`index.ts`**: 模块核心导出文件，定义了所有知识产权配置的导出接口，部分使用 `validateReportDetailTableJson` 进行表格配置验证。
- **`patent/index.ts`**: 专利信息模块导出文件，包含自有专利和专利申请的配置。
- **`trademark/index.ts`**: 商标信息模块导出文件，包含自有商标和商标申请的配置。
- **`patent/PatentSelf.json`**: 自有专利信息表格配置，使用 `validateReportDetailTableJson` 验证，展示企业拥有的专利信息。
- **`SoftwareCopyright.json`**: 软件著作权信息配置，展示企业拥有的软件著作权。
- **`TrademarkSelf.json`**: 自有商标信息表格配置，展示企业拥有的商标信息。

## 依赖示意

```
intellectual/
├── 依赖 gel-types (ReportDetailTableJson, ReportDetailNodeOrNodesJson)
├── 依赖 @/validation (validateReportDetailTableJson, validateReportDetailNodeOrNodesJson)
├── 内部依赖 patent/
├── 内部依赖 trademark/
└── 被企业详情页知识产权模块引用
    └── ../index.ts
```

## 知识产权分类

### 专利类
- **自有专利**: 企业已获得的专利权
- **专利申请**: 企业正在申请的专利
- **专利质押**: 专利权质押情况
- **专利许可**: 专利行政许可情况

### 商标类
- **自有商标**: 企业已注册的商标
- **商标申请**: 企业正在申请的商标
- **商标许可**: 商标行政许可情况

### 著作权类
- **软件著作权**: 企业软件产品的著作权
- **作品著作权**: 企业其他作品的著作权

### 其他知识产权
- **域名**: 企业拥有的域名资产
- **社交媒体**: 企业社交媒体账号信息

## 配置特点

- **分类管理**: 专利、商标、著作权分类独立管理
- **表格展示**: 核心信息使用表格结构展示
- **状态区分**: 区分已获得和申请中的知识产权
- **价值评估**: 通过数量和质量评估企业创新能力
- **标准化验证**: 所有配置都经过统一验证确保数据正确性

## 应用场景

- **创新能力评估**: 通过知识产权数量评估企业创新能力
- **技术实力分析**: 分析企业的技术储备和研发实力
- **品牌价值评估**: 通过商标和域名评估品牌价值
- **投资尽调**: 为投资决策提供知识产权尽职调查
- **竞争分析**: 分析企业知识产权竞争优势

## 价值维度

- **数量维度**: 知识产权的总量和分类分布
- **质量维度**: 核心专利和高价值商标
- **时间维度**: 知识产权的申请和获得时间线
- **地域维度**: 知识产权的申请和保护地域范围

## 相关文档

- [知识产权信息披露规范](../../../../docs/rule/intellectual-property-disclosure.md)
- [专利信息展示标准](../../../../docs/rule/patent-display.md)
- [商标信息展示标准](../../../../docs/rule/trademark-display.md)
- [企业详情页设计文档](../../../../docs/design/corp-detail-page.md)