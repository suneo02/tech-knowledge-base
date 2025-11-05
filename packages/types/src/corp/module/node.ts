type corpDetailBaseInfoKey =
  // 工商信息
  | 'BussInfo'
  // 香港代查 公司信息
  | 'HKCorpInfo'
  // 香港代查 公司信息-董事信息
  | 'HKCorpInfoDirector'
  // 香港代查 公司信息-秘书信息
  | 'HKCorpInfoSecretary'
  // 香港代查 公司信息-股东信息
  | 'HKCorpInfoShareholder'
  // 香港代查 公司信息-股权结构
  | 'HKCorpInfoEquityStructure'
  // 所属行业
  | 'BelongIndustry'

  // 实际控制人
  | 'ActualController'
  // 实际控制人-公告披露
  | 'ActualControllerReport'
  // 实际控制人-疑似实控人
  | 'ActualControllerSuspect'
  // 股东信息- 工商登记
  | 'ShareholderInfomation'
  // 股东信息- 大股东 公告披露
  | 'ShareholderBig'
  // 股东信息- 公告披露
  | 'ShareholderReport'
  // 股东信息- 非定期公告披露
  | 'ShareholderUnregular'
  // 股东穿透
  | 'ShareholderPenetration'
  // 股权穿透图
  | 'ShareholderPenetrationGraph'
  // 股东变更
  | 'ShareholderChange'
  // 分支结构
  | 'BranchStructure'
  // 控股企业
  | 'HoldCompany'
  // 对外投资
  | 'OverseasInvestment'
  // 最终受益人
  | 'FinalBeneficiary'
  // 最终受益人-受益所有人
  | 'FinalBeneficiaryBeneficiary'
  // 最终受益人-受益自然人
  | 'FinalBeneficiaryNatural'
  // 最终受益人-受益机构
  | 'FinalBeneficiaryInstitution'
  // 主要人员
  | 'MainPersonnel'
  // 主要人员-最新公示
  | 'MainPersonnelLatest'
  // 主要人员-工商登记
  | 'MainPersonnelHistory'
  // 核心团队
  | 'CoreTeam'
  // 集团系
  | 'GroupSystem'
  // 集团系-主要成员
  | 'GroupMainMember'
  // 集团系-成员
  | 'GroupMember'
  // 竞争对手
  | 'Competitor'
  // 工商变更
  | 'CorpChangeInfo'
  // 股东及出资信息
  | 'ShareholderAndCapitalContribution'
  // 股权变更信息
  | 'EquityChangeInformation'
  // 纳税人信息
  | 'TaxPayer'

// 业务数据
type corpDetailBusinessDataKey =
  // 利润表
  | 'ProfitStatement'
  // 资产负债表
  | 'BalanceSheet'
  // 现金流量表
  | 'CashFlowStatement'
  // 业务数据-产量-累计值
  | 'BussDataOutputCumulative'
  // 业务数据-产量-当期值
  | 'BussDataOutputCurrent'
  // 业务数据-销量-累计值
  | 'BussDataSalesCumulative'
  // 业务数据-销量-当期值
  | 'BussDataSalesCurrent'
  // 业务数据-业务量-累计值
  | 'BussDataBusinessCumulative'
  // 业务数据-业务量-当期值
  | 'BussDataBusinessCurrent'
  // 业务数据-库存-累计值
  | 'BussDataInventoryCumulative'
  // 业务数据-库存-当期值
  | 'BussDataInventoryCurrent'
  // 财务指标
  | 'FinancialIndicator'
  // 主营构成
  | 'MainBusinessScope'

// 金融行为
type corpDetailFinanceKey =
  // 发行股票
  | 'SharedStock'
  // 发行股票-第一个表格
  | 'SharedStockFirst'
  // 发行股票-第二个表格
  | 'SharedStockSecond'
  // 发行股票
  | 'SharedStock'
  // 待上市信息
  | 'InfoAwaitListing'
  // 发债主体评级
  | 'DebtRating'
  // 发行债券
  | 'BondIssue'
  // 投资机构
  | 'InvestAgency'
  // 投资事件
  | 'InvestEvent'
  // PEVC融资
  | 'PEVCFinance'
  // PEVC推出信息
  | 'PEVCQuit'
  // 并购信息
  | 'MergerInfo'
  // 银行授信
  | 'BankCredit'
  // ABS信息
  | 'ABSInfo'
  // 动产融资
  | 'ChattelFinancing'
  // 动产抵押
  | 'ChattelMortgage'
  // 动产抵押-抵押人
  | 'ChattelMortgageMortgager'
  // 动产抵押-抵押权人
  | 'ChattelMortgageMortgagee'

// 经营信息
type corpDetailBusinessInfoKey =
  // 企业业务
  | 'EnterpriseBusiness'
  // APP产品
  | 'AppProducts'
  // 旗下酒店
  | 'Hotels'
  // 公司报告
  | 'CompanyReports'
  // 政府重大项目
  | 'GovernmentMajorProjects'
  // 招投标公告
  | 'TenderingAnnouncements'
  // 招标公告
  | 'BiddingAnnouncements'
  // 招聘信息
  | 'Recruitment'
  // 土地信息
  | 'LandInformation'
  // 私募股权基金
  | 'PrivateEquityFunds'
  // 客户及供应商
  | 'CustomersAndSuppliers'
  // 业务关联企业
  | 'BusinessAssociates'
  // 政府补贴
  | 'GovernmentSubsidies'
  // 政府支持
  | 'GovernmentSupport'

// 知识产权
type corpDetailIntellectualKey =
  // 商标
  | 'Trademark'
  // 商标-本公司
  | 'TrademarkTheCompany'
  // 商标-分支机构
  | 'TrademarkBranch'
  // 商标-控股企业
  | 'TrademarkHoldCompany'
  // 商标-对外投资
  | 'TrademarkOverseasInvestment'
  // 专利
  | 'Patent'
  // 专利-本公司
  | 'PatentTheCompany'
  // 专利-分支机构
  | 'PatentBranch'
  // 专利-控股企业
  | 'PatentHoldCompany'
  // 专利-对外投资
  | 'PatentOutboundInvestment'
  // 软件著作权
  | 'SoftwareCopyright'

// 行政许可
type corpDetailQualificationKey =
  // 行政许可
  | 'AdministrativeLicense'
  // 行政许可-工商局
  | 'AdministrativeLicenseBureau'
  // 行政许可-信用中国
  | 'AdministrativeLicenseCreditChina'
  // 电信许可
  | 'TelecomLicense'
  // 建筑资质
  | 'BuildingQualification'
  // 房地产企业开发资质
  | 'RealEstateDevelopmentQualification'
  // 物流评级
  | 'LogisticsRating'
  // 进出口信用
  | 'ImportExportCredit'
  // A极纳税人
  | 'AExcellentTaxpayer'

type corpDetailRiskKey =
  // 裁判文书
  | 'JudicialDocument'
  // 失信被执行人
  | 'CreditDishonest'
  // 被执行人
  | 'Enforcement'
  // 限制高消费
  | 'LimitHighConsumption'
  // 终本案件
  | 'EndCase'
  // 立案信息
  | 'FilingInfo'
  // 开庭公告
  | 'TrialNotice'
  // 法院公告
  | 'CourtNotice'
  // 送达公告
  | 'DeliveryAnnouncement'
  // 违规处罚
  | 'ViolationPunishment'
  // 担保信息
  | 'WarrantyInformation'
  // 税收违法
  | 'TaxViolation'
  // 欠税信息
  | 'TaxDebt'

type corpDetailBusinessRiskKey =
  // 经营异常
  | 'ManageAbnormal'
  // 严重违法
  | 'SeriousViolation'
  // 司法拍卖
  | 'JudicialAuction'
  // 询价评估
  | 'Appraisal'
  // 询价评估-评估结果
  | 'AppraisalResult'
  // 询价评估-选定评估机构
  | 'AppraisalSelected'
  // 破产重整
  | 'BankruptcyReorganization'
  // 清算信息
  | 'LiquidationInfo'
  // 注销备案
  | 'CancellationRecord'
  // 抽查检查
  | 'InspectionCheck'
  // 股权出质
  | 'EquityPledge'
  // 股权出质-出质人
  | 'EquityPledgePledgor'
  // 股权出质-质权人
  | 'EquityPledgePledgee'
  // 股权出质-出质股权标的企业
  | 'EquityPledgePledgeeTarget'
  // 股票质押
  | 'StockPledge'
  // 股票质押-出质人
  | 'StockPledgePledgor'
  // 股票质押-质权人
  | 'StockPledgePledgee'
  // 股票质押-出质股权标的企业
  | 'StockPledgePledgeeTarget'
  // 知识产权出质
  | 'IntellectualPropertyPledge'
  // 知识产权出质-知识产权质押（国家知识产权局）
  | 'IntellectualPropertyPledgeNational'
  // 知识产权出质-知识产权质押（工商局）
  | 'IntellectualPropertyPledgeBusiness'
/**
 * 定义企业详情各节点的 key，有可能是 表格，有可能是图
 * 也有可能是多个表格的 父节点的 key ，父节点内部的多个表格一般是上下排列
 * node 与章节 key 不同的是，章节内部的节点都较为独立，而 node 内部的节点可能较为关联，例如发行股票内部的两个表格非常相似，所以看作一个节点
 */
export type TCorpDetailNodeKey =
  | corpDetailBaseInfoKey
  | corpDetailBusinessDataKey
  | corpDetailFinanceKey
  | corpDetailBusinessInfoKey
  | corpDetailIntellectualKey
  | corpDetailQualificationKey
  | corpDetailRiskKey
  | corpDetailBusinessRiskKey
