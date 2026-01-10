// 定义企业详情一级菜单及其对应的二级菜单

// 一级菜单字面量类型
export type TCorpDetailModule =
  | 'overview'
  | 'IpoBusinessData'
  | 'PublishFundData'
  | 'PrivateFundData'
  | 'financing'
  | 'financialData'
  | 'bussiness'
  | 'qualifications'
  | 'intellectual'
  | 'risk'
  | 'businessRisk'
  | 'history'

// 定义企业详情各一级菜单下的二级菜单

// 二级菜单字面量类型
export type TCorpDetailSubModule =
  // Overview 基础信息
  | 'showCompanyInfo' // 工商信息
  | 'HKCorpInfo' // 公司资料
  | 'showIndustry' // 所属行业/产业
  | 'showActualController' // 实际控制人
  | 'showShareholder' // 股东信息
  | 'showVietnamIndustry' // 所属行业 只有越南国家才有
  | 'showShareSearch' // 股东穿透
  | 'getShareAndInvest' // 股东穿透图
  | 'showshareholderchange' // 股东变更
  | 'showCompanyBranchInfo' // 分支机构
  | 'showControllerCompany' // 控股企业
  | 'showDirectInvestment' // 对外投资
  | 'structuralEntities' // 结构性主体
  | 'showFinalBeneficiary' // 最终受益人
  | 'showMainMemberInfo' // 主要人员
  | 'showCoreTeam' // 核心团队
  | 'showGroupSystem' // 集团系
  | 'showHeadOffice' // 总公司
  | 'getcomparable' // 竞争对手
  | 'showCompanyChange' // 公司变更
  | 'gettaxpayer' // 纳税人信息
  | 'showCompanyNotice' // 企业公示
  | 'showYearReport' // 企业年报
  // IpoBusinessData 业务数据
  | 'showIpoYield' // 产量
  | 'showIpoSales' // 销量
  | 'showIpoBusiness' // 业务量
  | 'showIpoStock' // 库存
  // PublishFundData 公募基金
  | 'showFundSize' // 基金规模
  | 'showItsFunds' // 基金数量
  // PrivateFundData
  // | 'showPrivateFundInfo' // 私募基金信息
  | 'showSelfManagedFund' // 自管基金
  | 'showInvestedFund' // 已投资基金
  // Financing 金融行为
  | 'showShares' // 发行股票
  | 'showSharesOther' // 发行股票
  | 'showDeclarcompany' // 待上市信息
  | 'showBond' // 发行债券
  | 'showComBondRate' // 发债主体评级
  | 'showInvestmentAgency' // 投资机构
  | 'showInvestmentEvent' // 投资事件
  | 'showPVEC' // PEVC融资
  | 'pvecOut' // PEVC退出
  | 'showMerge' // 并购信息
  | 'showGrantcredit' // 银行授信
  | 'absinfo' // ABS信息
  | 'showChattleFinancing' // 动产融资
  | 'showChattelmortgage' // 动产抵押
  | 'showInsurance' // 保险产品
  // Bussiness 经营信息
  | 'FinancialData' // 财务数据
  | 'Financeanalysis' // 财务分析
  | 'businessScope' // 主营构成
  | 'showComBuInfo' // 企业业务
  | 'showApp' // APP产品
  | 'showHotels' // 旗下酒店
  | 'researchReport01' // 公司研报
  | 'majorGovProject' // 政府重大项目
  | 'biddingInfo' // 招投标 - 招标
  | 'tiddingInfo' // 招投标 - 投标
  | 'jobs' // 招聘
  | 'showLandInfo' // 土地信息
  | 'getfundpe' // 私募基金
  | 'showCustomersSup' // 客户和供应商
  | 'getrelatedparty' // 业务关联方
  | 'governmentSupport01' // 政府补贴
  | 'getgovsupport' // 政府支持
  // Qualifications 资质荣誉
  | 'getpermission' // 行政许可[信用中国]
  | 'getpermission02' // 行政许可[工商局]
  | 'credit' // 征信备案
  | 'jrxx' // 金融信息服务备案
  | 'showfranchise' // 商业特许经营
  | 'getfinanciallicence' // 金融许可
  | 'getteleLics' // 电信许可
  | 'getgameapproval' // 游戏审批
  | 'showBuildOrder' // 建筑资质
  | 'enterpriseDevelopment' // 房企开发资质
  | 'logisticsCreditRating' // 物流信用评级
  | 'getimpexp' // 进出口信用
  | 'getauthentication' // 认证认可
  | 'gettaxcredit1' // A级纳税人
  | 'hzpscxk' // 化妆品生产许可
  | 'selectList' // 入选名录
  | 'listInformation' // 上榜信息
  // Intellectual 知识产权
  | 'gettechscore' // 科创分
  | 'getbrand' // 商标
  | 'getpatent' // 专利
  | 'getproductioncopyright' // 作品著作权
  | 'getsoftwarecopyright' // 软件著作权
  | 'getIntegratedCircuitLayout' // 集成电路布图
  | 'getStandardPlan' // 标准信息
  | 'getdomainname' // 网站备案
  | 'getweixin' // 微信公众号
  | 'getweibo' // 微博账号
  | 'gettoutiao' // 头条号
  // Risk 司法风险
  | 'getcourtdecision' // 裁判文书
  | 'getfilinginfo' // 立案信息
  | 'getcourtopenannouncement' // 开庭公告
  | 'showDeliveryAnnouncement' // 送达公告
  | 'getcourtannouncement' // 法院公告
  | 'getpersonenforced' // 被执行人
  | 'getdishonesty' // 失信被执行人
  | 'getendcase' // 终本案件
  | 'getcorpconsumption' // 限制高消费
  | 'equityfreeze' // 股权冻结
  | 'getjudicialsale' // 司法拍卖
  | 'showBankruptcy' // 破产重整
  | 'rewardnotice' // 悬赏公告
  | 'exitrestriction' // 限制出境
  | 'getevaluation' // 询价评估
  // BusinessRisk 经营风险
  | 'showViolationsPenalties' // 诚信信息
  | 'getdefaultbond' // 债券违约
  | 'getnostandard' // 非标违约
  | 'debtoverdue' // 债务逾期
  | 'commercialoverdue' // 商票逾期
  | 'getowingtax' // 欠税信息
  | 'getoperationexception' // 经营异常
  | 'getillegal' // 严重违法
  | 'environmentalcredit' // 环保信用
  | 'showPledgedstock' // 股权出质
  | 'equitypledge' // 股权质押
  | 'gettaxillegal' // 税收违法
  | 'showguarantee' // 担保信息
  | 'showIntellectualPropertyRights' // 知识产权出质
  | 'simplecancellation' // 简易注销
  | 'getinspection' // 抽查检查
  | 'getcancelfiling' // 注销备案
  | 'getclearinfo' // 清算信息
  | 'getdoublerandom' // 双随机抽查
  | 'getprodrecall' // 产品召回
  | 'showStockMortgage' // 股票质押
  // History 历史信息
  | 'historycompany' // 历史工商信息
  | 'showHistoryChange' // 变更历史
  | 'historyshareholder' // 历史股东信息
  | 'historylegalperson' // 历史法人和高管
  | 'historyinvest' // 历史对外投资
  | 'historypermission02' // 历史行政许可
  | 'historydomainname' // 历史网站备案
  | 'historyshowPledgedstock' // 历史股权出质
  | 'getlandmortgage' // 历史土地抵押
  | 'getmultiplecertificate' // 历史多证合一
  | 'getvoidagestatement' // 历史作废声明
  | 'beneficiary' // 历史最终受益人
  | 'ultimatecontroller' // 历史实际控制人
  | 'historypatent' // 历史专利

// 定义企业详情二级菜单下的各表格

// 企业详情表格字面量类型
export type TCorpDetailTable =
  | 'shareholderDisclosure' // 股东信息-公告披露
  | 'shareholderIrregularDisclosure' // 股东信息-非定期公告披露
  | 'shareholderMajorShareholderDisclosure' // 股东信息-大股东公告披露
  | 'shareholderBusinessRegistration' // 股东信息-工商登记
  | 'mainMemberLatestDisclosure' // 主要人员-最新公示
  | 'mainMemberRegistration' // 主要人员-登记信息
  // | 'balanceSheet' // 财务报表-资产负债表
  // | 'profitSheet' // 财务报表-利润表
  // | 'cashFlowSheet' // 财务报表-现金流表
  | 'overseasFinancialReportNum' // 境外财务报告
  | 'domesticFinancialReportNum' // 境内财务报告
  | 'domesticFinancialIndicatorNum' // 境内财务指标
  | 'overseasFinancialIndicatorNum' // 境外财务指标
