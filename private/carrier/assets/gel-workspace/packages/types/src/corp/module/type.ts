// 定义企业详情一级菜单及其对应的二级菜单

export enum ECorpDetailModule {
  Overview = 'overview',
  IpoBusinessData = 'IpoBusinessData',
  PublishFundData = 'PublishFundData',
  PrivateFundData = 'PrivateFundData',
  Financing = 'financing',
  Business = 'bussiness',
  Qualifications = 'qualifications',
  Intellectual = 'intellectual',
  Risk = 'risk',
  BusinessRisk = 'businessRisk',
  History = 'history',
}

// 一级菜单 type
export type TCorpDetailModuleValue = `${ECorpDetailModule}`

// 定义企业详情各一级菜单下的二级菜单
export enum ECorpDetailSubModule {
  // Overview 基础信息
  ShowCompanyInfo = 'showCompanyInfo', // 工商信息
  HKCorpInfo = 'HKCorpInfo', // 公司资料
  ShowIndustry = 'showIndustry', // 所属行业/产业
  ShowActualController = 'showActualController', // 实际控制人
  ShowShareholder = 'showShareholder', // 股东信息
  ShowVietnamIndustry = 'showVietnamIndustry', // 所属行业 只有越南国家才有
  ShowShareSearch = 'showShareSearch', // 股东穿透
  GetShareAndInvest = 'getShareAndInvest', // 股东穿透图
  ShowShareholderChange = 'showshareholderchange', // 股东变更
  ShowCompanyBranchInfo = 'showCompanyBranchInfo', // 分支机构
  ShowControllerCompany = 'showControllerCompany', // 控股企业
  ShowDirectInvestment = 'showDirectInvestment', // 对外投资
  StructuralEntities = 'structuralEntities', // 结构性主体
  ShowFinalBeneficiary = 'showFinalBeneficiary', // 最终受益人
  ShowMainMemberInfo = 'showMainMemberInfo', // 主要人员
  ShowCoreTeam = 'showCoreTeam', // 核心团队
  ShowGroupSystem = 'showGroupSystem', // 集团系
  ShowHeadOffice = 'showHeadOffice', // 总公司
  GetComparable = 'getcomparable', // 竞争对手
  ShowCompanyChange = 'showCompanyChange', // 公司变更
  GetTaxpayer = 'gettaxpayer', // 纳税人信息
  ShowCompanyNotice = 'showCompanyNotice', // 企业公示
  ShowYearReport = 'showYearReport', // 企业年报

  // IpoBusinessData 业务数据
  ShowIpoYield = 'showIpoYield', // 产量
  ShowIpoSales = 'showIpoSales', // 销量
  ShowIpoBusiness = 'showIpoBusiness', // 业务量
  ShowIpoStock = 'showIpoStock', // 库存

  // PublishFundData 公募基金
  ShowFundSize = 'showFundSize', // 基金规模
  ShowItsFunds = 'showItsFunds', // 基金数量

  // PrivateFundData
  ShowPrivateFundInfo = 'showPrivateFundInfo', // 私募基金信息

  // Financing 金融行为
  ShowShares = 'showShares', // 发行股票
  showSharesOther = 'showSharesOther', // 发行股票
  ShowDeclarCompany = 'showDeclarcompany', // 待上市信息
  ShowBond = 'showBond', // 发行债券
  ShowComBondRate = 'showComBondRate', // 发债主体评级
  ShowInvestmentAgency = 'showInvestmentAgency', // 投资机构
  ShowInvestmentEvent = 'showInvestmentEvent', // 投资事件
  ShowPVEC = 'showPVEC', // PEVC融资
  PvecOut = 'pvecOut', // PEVC退出
  ShowMerge = 'showMerge', // 并购信息
  ShowGrantCredit = 'showGrantcredit', // 银行授信
  AbsInfo = 'absinfo', // ABS信息
  ShowChattleFinancing = 'showChattleFinancing', // 动产融资
  ShowChattelMortgage = 'showChattelmortgage', // 动产抵押
  ShowInsurance = 'showInsurance', // 保险产品

  // Bussiness 经营信息
  FinancialData = 'FinancialData', //财务数据
  Financeanalysis = 'Financeanalysis', //财务分析
  BusinessScope = 'businessScope', // 主营构成
  ShowComBuInfo = 'showComBuInfo', // 企业业务
  ShowApp = 'showApp', //APP产品
  ShowHotels = 'showHotels', //旗下酒店
  ResearchReport01 = 'researchReport01', //公司研报
  MajorGovProject = 'majorGovProject', //政府重大项目
  BiddingInfo = 'biddingInfo', //招投标 - 招标
  TiddingInfo = 'tiddingInfo', //招投标 - 投标
  Jobs = 'jobs', //招聘
  ShowLandInfo = 'showLandInfo', //土地信息
  GetFundPe = 'getfundpe', //私募基金
  ShowCustomersSup = 'showCustomersSup', //客户和供应商
  GetRelatedParty = 'getrelatedparty', //业务关联方
  GovernmentSupport01 = 'governmentSupport01', //政府补贴
  GetGovSupport = 'getgovsupport', //政府支持

  // Qualifications 资质荣誉
  Getpermission = 'getpermission', // 行政许可[信用中国]
  GetPermission02 = 'getpermission02', // 行政许可[工商局]
  Credit = 'credit', // 征信备案
  Jrxx = 'jrxx', // 金融信息服务备案
  ShowFranchise = 'showfranchise', // 商业特许经营
  GetFinancialLicence = 'getfinanciallicence', // 金融许可
  GetTeleLics = 'getteleLics', // 电信许可
  GetGameApproval = 'getgameapproval', // 游戏审批
  ShowBuildOrder = 'showBuildOrder', // 建筑资质
  EnterpriseDevelopment = 'enterpriseDevelopment', // 房企开发资质
  LogisticsCreditRating = 'logisticsCreditRating', // 物流信用评级
  GetImpexp = 'getimpexp', // 进出口信用
  GetAuthentication = 'getauthentication', // 认证认可
  GetTaxCredit1 = 'gettaxcredit1', // A级纳税人
  Hzpscxk = 'hzpscxk', // 化妆品生产许可
  SelectList = 'selectList', // 入选名录
  ListInformation = 'listInformation', // 上榜信息

  // Intellectual 知识产权
  GetTechScore = 'gettechscore', // 科创分
  GetBrand = 'getbrand', // 商标
  GetPatent = 'getpatent', // 专利
  GetProductionCopyright = 'getproductioncopyright', // 作品著作权
  GetSoftwareCopyright = 'getsoftwarecopyright', // 软件著作权
  GetIntegratedCircuitLayout = 'getIntegratedCircuitLayout', // 集成电路布图
  GetStandardPlan = 'getStandardPlan', // 标准信息
  GetDomainName = 'getdomainname', // 网站备案
  GetWeixin = 'getweixin', // 微信公众号
  GetWeibo = 'getweibo', // 微博账号
  GetToutiao = 'gettoutiao', // 头条号

  // Risk 司法风险
  GetCourtDecision = 'getcourtdecision', // 裁判文书
  GetFilingInfo = 'getfilinginfo', // 立案信息
  GetCourtOpenAnnouncement = 'getcourtopenannouncement', // 开庭公告
  ShowDeliveryAnnouncement = 'showDeliveryAnnouncement', // 送达公告
  GetCourtAnnouncement = 'getcourtannouncement', // 法院公告
  GetPersonEnforced = 'getpersonenforced', // 被执行人
  GetDishonesty = 'getdishonesty', // 失信被执行人
  GetEndCase = 'getendcase', // 终本案件
  GetCorpConsumption = 'getcorpconsumption', // 限制高消费
  GetJudicialSale = 'getjudicialsale', // 司法拍卖
  ShowBankruptcy = 'showBankruptcy', // 破产重整
  GetEvaluation = 'getevaluation', // 询价评估

  // BusinessRisk 经营风险
  ShowViolationsPenalties = 'showViolationsPenalties', // 诚信信息
  GetOperationException = 'getoperationexception', // 经营异常
  GetCancelFiling = 'getcancelfiling', // 注销备案
  GetClearInfo = 'getclearinfo', // 清算信息
  GetOwingTax = 'getowingtax', // 欠税信息
  GetTaxIllegal = 'gettaxillegal', // 税收违法
  GetIllegal = 'getillegal', // 严重违法
  GetNoStandard = 'getnostandard', // 非标违约
  GetInspection = 'getinspection', // 抽查检查
  GetDoubleRandom = 'getdoublerandom', // 双随机抽查
  GetProdRecall = 'getprodrecall', // 产品召回
  ShowGuarantee = 'showguarantee', // 担保信息
  ShowStockMortgage = 'showStockMortgage', // 股票质押
  ShowPledgedStock = 'showPledgedstock', // 股权出质
  GetDefaultBond = 'getdefaultbond', // 债券违约
  ShowIntellectualPropertyRights = 'showIntellectualPropertyRights', // 知识产权出质

  // History 历史信息
  HistoryCompany = 'historycompany', // 历史工商信息
  HistoryChange = 'showHistoryChange', // 变更历史
  HistoryShareholder = 'historyshareholder', // 历史股东信息
  HistoryLegalPerson = 'historylegalperson', // 历史法人和高管
  HistoryInvest = 'historyinvest', // 历史对外投资
  HistoryPermission02 = 'historypermission02', // 历史行政许可
  HistoryDomainName = 'historydomainname', // 历史网站备案
  HistoryShowPledgedStock = 'historyshowPledgedstock', // 历史股权出质
  GetLandMortgage = 'getlandmortgage', // 历史土地抵押
  GetMultipleCertificate = 'getmultiplecertificate', // 历史多证合一
  GetVoidAgeStatement = 'getvoidagestatement', // 历史作废声明
  Beneficiary = 'beneficiary', // 历史最终受益人
  UltimateController = 'ultimatecontroller', // 历史实际控制人
  HistoryPatent = 'historypatent', // 历史专利
}

// 二级菜单 type
export type TCorpDetailSubModule = `${ECorpDetailSubModule}`

// 定义企业详情二级菜单下的各表格
export enum ECorpDetailTable {
  // 股东信息-公告披露
  ShareholderDisclosure = 'shareholderDisclosure',

  // 股东信息-非定期公告披露
  ShareholderIrregularDisclosure = 'shareholderIrregularDisclosure',

  // 股东信息-大股东公告披露
  ShareholderMajorShareholderDisclosure = 'shareholderMajorShareholderDisclosure',

  // 股东信息-工商登记
  ShareholderBusinessRegistration = 'shareholderBusinessRegistration',

  // 主要人员-最新公示
  MainMemberLatestDisclosure = 'mainMemberLatestDisclosure',

  // 主要人员-登记信息
  MainMemberRegistration = 'mainMemberRegistration',

  // 财务报表-资产负债表
  BalanceSheet = 'balanceSheet',

  // 财务报表-利润表
  ProfitSheet = 'profitSheet',

  // 财务报表-现金流表
  CashFlowSheet = 'cashFlowSheet',
}

// 企业详情表格 type
export type TCorpDetailTable = `${ECorpDetailTable}`
