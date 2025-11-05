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
  // Overview
  ShowCompanyInfo = 'showCompanyInfo',
  HKCorpInfo = 'HKCorpInfo',
  ShowIndustry = 'showIndustry',
  ShowActualController = 'showActualController',
  ShowShareholder = 'showShareholder',
  ShowVietnamIndustry = 'showVietnamIndustry',
  ShowShareSearch = 'showShareSearch',
  GetShareAndInvest = 'getShareAndInvest',
  ShowShareholderChange = 'showshareholderchange',
  ShowCompanyBranchInfo = 'showCompanyBranchInfo',
  ShowControllerCompany = 'showControllerCompany',
  ShowDirectInvestment = 'showDirectInvestment',
  // 结构性主体
  StructuralEntities = 'structuralEntities',
  ShowFinalBeneficiary = 'showFinalBeneficiary',
  ShowMainMemberInfo = 'showMainMemberInfo',
  ShowCoreTeam = 'showCoreTeam',
  ShowGroupSystem = 'showGroupSystem',
  ShowHeadOffice = 'showHeadOffice',
  GetComparable = 'getcomparable',
  ShowCompanyChange = 'showCompanyChange',
  GetTaxpayer = 'gettaxpayer',
  ShowCompanyNotice = 'showCompanyNotice',
  ShowYearReport = 'showYearReport',

  // IpoBusinessData
  ShowIpoYield = 'showIpoYield',
  ShowIpoSales = 'showIpoSales',
  ShowIpoBusiness = 'showIpoBusiness',
  ShowIpoStock = 'showIpoStock',

  // PublishFundData
  ShowFundSize = 'showFundSize',
  ShowItsFunds = 'showItsFunds',

  // PrivateFundData
  ShowPrivateFundInfo = 'showPrivateFundInfo',

  // Financing
  ShowShares = 'showShares',
  showSharesOther = 'showSharesOther',
  ShowDeclarCompany = 'showDeclarcompany',
  ShowBond = 'showBond',
  ShowComBondRate = 'showComBondRate',
  ShowInvestmentAgency = 'showInvestmentAgency',
  ShowInvestmentEvent = 'showInvestmentEvent',
  ShowPVEC = 'showPVEC',
  PvecOut = 'pvecOut',
  ShowMerge = 'showMerge',
  ShowGrantCredit = 'showGrantcredit',
  AbsInfo = 'absinfo',
  ShowChattleFinancing = 'showChattleFinancing',
  ShowChattelMortgage = 'showChattelmortgage',
  ShowInsurance = 'showInsurance',

  // Bussiness
  FinancialData = 'FinancialData',
  Financeanalysis = 'Financeanalysis',
  BusinessScope = 'businessScope',
  ShowComBuInfo = 'showComBuInfo',
  ShowApp = 'showApp',
  ShowHotels = 'showHotels',
  ResearchReport01 = 'researchReport01',
  MajorGovProject = 'majorGovProject',
  BiddingInfo = 'biddingInfo',
  TiddingInfo = 'tiddingInfo',
  Jobs = 'jobs',
  ShowLandInfo = 'showLandInfo',
  GetFundPe = 'getfundpe',
  ShowCustomersSup = 'showCustomersSup',
  GetRelatedParty = 'getrelatedparty',
  GovernmentSupport01 = 'governmentSupport01',
  GetGovSupport = 'getgovsupport',

  // Qualifications
  Getpermission = 'getpermission',
  GetPermission02 = 'getpermission02',
  Credit = 'credit',
  Jrxx = 'jrxx',
  ShowFranchise = 'showfranchise',
  GetFinancialLicence = 'getfinanciallicence',
  GetTeleLics = 'getteleLics',
  GetGameApproval = 'getgameapproval',
  ShowBuildOrder = 'showBuildOrder',
  EnterpriseDevelopment = 'enterpriseDevelopment',
  LogisticsCreditRating = 'logisticsCreditRating',
  GetImpexp = 'getimpexp',
  GetAuthentication = 'getauthentication',
  GetTaxCredit1 = 'gettaxcredit1',
  Hzpscxk = 'hzpscxk',
  SelectList = 'selectList',
  ListInformation = 'listInformation',

  // Intellectual
  GetTechScore = 'gettechscore',
  GetBrand = 'getbrand',
  GetPatent = 'getpatent',
  GetProductionCopyright = 'getproductioncopyright',
  GetSoftwareCopyright = 'getsoftwarecopyright',
  GetIntegratedCircuitLayout = 'getIntegratedCircuitLayout',
  GetStandardPlan = 'getStandardPlan',
  GetDomainName = 'getdomainname',
  GetWeixin = 'getweixin',
  GetWeibo = 'getweibo',
  GetToutiao = 'gettoutiao',

  // Risk
  GetCourtDecision = 'getcourtdecision',
  GetFilingInfo = 'getfilinginfo',
  GetCourtOpenAnnouncement = 'getcourtopenannouncement',
  ShowDeliveryAnnouncement = 'showDeliveryAnnouncement',
  GetCourtAnnouncement = 'getcourtannouncement',
  GetPersonEnforced = 'getpersonenforced',
  GetDishonesty = 'getdishonesty',
  GetEndCase = 'getendcase',
  GetCorpConsumption = 'getcorpconsumption',
  GetJudicialSale = 'getjudicialsale',
  ShowBankruptcy = 'showBankruptcy',
  GetEvaluation = 'getevaluation',

  // BusinessRisk
  ShowViolationsPenalties = 'showViolationsPenalties',
  GetOperationException = 'getoperationexception',
  GetCancelFiling = 'getcancelfiling',
  GetClearInfo = 'getclearinfo',
  GetOwingTax = 'getowingtax',
  GetTaxIllegal = 'gettaxillegal',
  GetIllegal = 'getillegal',
  GetNoStandard = 'getnostandard',
  GetInspection = 'getinspection',
  GetDoubleRandom = 'getdoublerandom',
  GetProdRecall = 'getprodrecall',
  ShowGuarantee = 'showguarantee',
  ShowStockMortgage = 'showStockMortgage',
  ShowPledgedStock = 'showPledgedstock',
  GetDefaultBond = 'getdefaultbond',
  ShowIntellectualPropertyRights = 'showIntellectualPropertyRights',

  // History
  HistoryCompany = 'historycompany',
  HistoryChange = 'showHistoryChange',
  HistoryShareholder = 'historyshareholder',
  HistoryLegalPerson = 'historylegalperson',
  HistoryInvest = 'historyinvest',
  HistoryPermission02 = 'historypermission02',
  HistoryDomainName = 'historydomainname',
  HistoryShowPledgedStock = 'historyshowPledgedstock',
  GetLandMortgage = 'getlandmortgage',
  GetMultipleCertificate = 'getmultiplecertificate',
  GetVoidAgeStatement = 'getvoidagestatement',
  Beneficiary = 'beneficiary',
  UltimateController = 'ultimatecontroller',
  HistoryPatent = 'historypatent',
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
}

// 企业详情表格 type
export type TCorpDetailTable = `${ECorpDetailTable}`
