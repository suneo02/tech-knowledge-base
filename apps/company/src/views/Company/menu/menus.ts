import { ECorpDetailSubModule, TCorpDetailSubModule } from '@/handle/corp/detail/module/type.ts'
import {
  corpDetailEquityPledge,
  corpDetailEvaluation,
  corpDetailHisEquityPledge,
  corpDetailInvestigationFiling,
  corpDetailStockPledge,
} from '@/handle/corpModuleCfg'
import intl from '@/utils/intl'
import { corpDetailBusinessMenu } from './configs/business.ts'
import { corpDetailFinanceMenu } from './configs/finance.ts'
import { overviewConfig } from './configs/overview'
import { convertCorpDetailNewMenuToOldMenu } from './handle.ts'
import { ICorpMenuCfg } from './type.ts'

/**
 * 在左侧菜单需要隐藏统计数字展示的模块
 *
 * 在此处更新后，在具体模块配置需要一并配置
 */
export const corpDetailBaseMenuNumHide: TCorpDetailSubModule[] = [
  ECorpDetailSubModule.ShowIndustry, // 所属行业/产业
  ECorpDetailSubModule.ShowShareholder, // 股东信息
  ECorpDetailSubModule.ShowFinalBeneficiary, // 最终受益人
  ECorpDetailSubModule.ShowMainMemberInfo, // 主要人员
  ECorpDetailSubModule.FinancialData, // 财务数据
  ECorpDetailSubModule.ShowActualController, // 实际控制人
  ECorpDetailSubModule.GetTechScore, // 科创分
  ECorpDetailSubModule.ShowYearReport, // 年报
  ECorpDetailSubModule.ResearchReport01, //公司研报
  ECorpDetailSubModule.HKCorpInfo, // 香港公司信息
  ECorpDetailSubModule.ShowControllerCompany, // 控股企业
]

export const CompanyDetailBaseMenus: ICorpMenuCfg = {
  overview: overviewConfig,
  // 业务数据
  IpoBusinessData: {
    title: intl('64824', '业务数据'),
    showList: ['showIpoYield', 'showIpoSales', 'showIpoBusiness', 'showIpoStock'],
    showName: [intl('49513', '产量'), intl('46834', '销量'), intl('46883', '业务量'), intl('44662', '库存')],
    numArr: ['outputCount', 'salesCount', 'businessCount', 'stockCount'],
  },
  // 基金数据
  PublishFundData: {
    // 该模块统计数字会特殊处理
    hide: true,
    title: intl('39902', '基金数据'),
    showList: ['showFundSize', 'showItsFunds'],
    showName: [intl('37109', '基金规模'), intl('11546', '旗下基金')],
    numArr: [true, true],
  },
  PrivateFundData: {
    // 该模块统计数字会特殊处理
    hide: true,
    title: intl('39902', '基金数据'),
    showList: ['showPrivateFundInfo'],
    showName: [intl('205468', '基本信息')],
    numArr: [true],
  },
  // 金融行为
  financing: convertCorpDetailNewMenuToOldMenu(corpDetailFinanceMenu),
  // 经营状况
  bussiness: convertCorpDetailNewMenuToOldMenu(corpDetailBusinessMenu),
  //资质荣誉
  qualifications: {
    title: intl('284064', '资质荣誉'),
    showList: [
      'getpermission02',
      'getpermission',
      'credit',
      'jrxx',
      'showfranchise',
      'getfinanciallicence',
      'getteleLics',
      'getgameapproval',
      'showBuildOrder',
      'enterpriseDevelopment',
      'logisticsCreditRating',
      'getimpexp',
      'getauthentication',
      'gettaxcredit1',
      'hzpscxk',
      'selectList',
      'listInformation',
    ],
    showName: [
      intl('222481', '行政许可[信用中国]'),
      intl('222480', '行政许可[工商局]'),
      intl('99999693', '征信备案'),
      intl('99999690', '金融信息服务备案'),
      intl('216405', '商业特许经营'),
      intl('222483', '金融许可'),
      intl('205397', '电信许可'),
      intl('354853', '游戏审批'),
      intl('216392', '建筑资质'),
      intl('348191', '房企开发资质'),
      window.en_access_config ? 'Logistics Credit Rating' : '物流信用评级',
      intl('205419', '进出口信用'),
      intl('332373', '认证认可'),
      intl('332374', 'A级纳税人'),
      intl('368136', '化妆品生产许可'),
      intl('286256', '入选名录'),
      intl('138468', '上榜信息'),
    ],
    numArr: [
      'admin_licence_num',
      'adminLicenceCount',
      corpDetailInvestigationFiling.modelNum,
      'financialRecordNum',
      'commercial_franchise_info_num',
      'financial_licence_num',
      'telelic_num',
      'gameLicenseCount',
      'build_qualification_num',
      'realestateCertificate',
      'logisticsCreditRate',
      'impexp_num',
      'certification_merge_num',
      'taxaCreditCount',
      'cosmeticslicenseNum',
      'listingTagsDataCount',
      'ranked_num',
    ],
  },
  // 知识产权
  intellectual: {
    title: intl('120665', '知识产权'),
    showList: [
      'gettechscore',
      'getbrand',
      'getpatent',
      'getIntegratedCircuitLayout',
      'getproductioncopyright',
      'getsoftwarecopyright',
      'getStandardPlan',
      'getdomainname',
      'getweixin',
      'getweibo',
      'gettoutiao',
    ],
    showName: [
      intl('451195', '科创分'),
      intl('138799', '商标'),
      intl('124585', '专利'),
      intl('452482', '集成电路布图'),
      intl('138756', '作品著作权'),
      intl('138788', '软件著作权'),
      intl('326113', '标准信息'),
      intl('138804', '网站备案'),
      intl('138581', '微信公众号'),
      intl('138579', '微博账号'),
      intl('138559', '头条号'),
    ],
    numArr: [
      'technologicalInnovationCount',
      true,
      true,
      'ic_layout_num',
      'workcopyr_num',
      'softwarecopyright_num',
      'standardInfo',
      'domain_num',
      'webchat_public_num',
      'micro_blog_num',
      'today_headline_num',
    ],
  },
  // 法律诉讼
  risk: {
    title: intl('228331', '司法风险'),
    showList: [
      'getcourtdecision',
      'getfilinginfo',
      'getcourtopenannouncement',
      'showDeliveryAnnouncement',
      'getcourtannouncement',
      'getpersonenforced',
      'getdishonesty',
      'getendcase',
      'getcorpconsumption',
      'getjudicialsale',
      'showBankruptcy',
      'getevaluation',
    ],
    showName: [
      intl('138731', '裁判文书'),
      intl('205388', '立案信息'),
      intl('138657', '开庭公告'),
      intl('204947', '送达公告'),
      intl('138226', '法院公告'),
      intl('138592', '被执行人'),
      intl('283600', '失信被执行人'),
      intl('216398', '终本案件'),
      intl('209064', '限制高消费'),
      intl('138359', '司法拍卖'),
      intl('216410', '破产重整'),
      intl('216400', '询价评估'),
    ],
    numArr: [
      'judgeinfo_num',
      'filing_info_num',
      'trialnotice_num',
      'delivery_anns_num',
      'coutnotice_num',
      'cur_debetor_num',
      'breakpromise_num',
      'end_case_num',
      'corp_consumption_num',
      'judicialsaleinfoCount',
      'bankruptcyeventCount',
      corpDetailEvaluation.modelNum,
    ],
  },
  // 经营风险
  businessRisk: {
    title: intl('138415', '经营风险'),
    showList: [
      'showViolationsPenalties',
      'getoperationexception',
      'getcancelfiling',
      'getclearinfo',
      'getowingtax',
      'gettaxillegal',
      'getillegal',
      'getnostandard', // 非标违约
      'getinspection',
      'getdoublerandom',
      'getprodrecall',
      'showguarantee', // 担保信息
      'showStockMortgage',
      'showPledgedstock',
      'getdefaultbond', // 债券违约
      'showIntellectualPropertyRights',
    ],
    showName: [
      intl('118780', '诚信信息'),
      intl('138568', '经营异常'),
      intl('229150', '注销备案'),
      intl('145873', '清算信息'),
      intl('138424', '欠税信息'),
      intl('138533', '税收违法'),
      intl('138335', '严重违法'),
      intl('440354', '非标违约'), // 非标违约
      intl('138467', '抽查检查'),
      intl('145855', '双随机抽查'),
      intl('120790', '产品召回'),
      intl('138320', '担保信息'), // 担保信息
      intl('132933', '股票质押'),
      intl('138281', '股权出质'),
      intl('440355', '债券违约'), // 债券违约
      intl('204944', '知识产权出质'),
    ],
    numArr: [
      'violationPunish',
      'manageabnormalCount',
      'cancelrecord_num',
      'liquidation_num',
      'taxdebtsCount',
      'taxillegalCount',
      'illegal_num',
      'defaultonnonstandardassetsNum', // 非标违约
      'inspection_num',
      'spot_check_num',
      'prodrecall_num',
      'guaranteedetailCount', // 担保信息
      corpDetailStockPledge.modelNum,
      corpDetailEquityPledge.modelNum,
      'default_num', // 债券违约
      ['intellectual_pledgeds_num', 'ipPledgeCount'],
    ],
  },
  // 历史数据
  history: {
    title: intl('33638', '历史数据'),
    showList: [
      'historycompany',
      'showHistoryChange',
      'historyshareholder',
      'historylegalperson',
      'historyinvest',
      'historydomainname',
      'historyshowPledgedstock',
      'getlandmortgage',
      'getmultiplecertificate',
      'getvoidagestatement',
      'beneficiary',
      'ultimatecontroller',
      'historypatent',
    ],
    showName: [
      intl('257705', '工商信息'),
      window.en_access_config ? 'History Changes' : '变更历史',
      intl('138506', '股东信息'),
      intl('138370', '法人和高管'),
      intl('138724', '对外投资'),
      // intl('222481', '行政许可'),  // 20240531 todo 牛庆睿 反馈，临时屏蔽
      intl('138804', '网站备案'),
      intl('138281', '股权出质'),
      intl('205406', '土地抵押'),
      intl('145871', '多证合一'),
      intl('145865', '作废声明'),
      intl('439434', '历史最终受益人'),
      intl('439454', '历史实际控制人'),
      intl('390634', '历史专利'),
    ],
    numArr: [
      'his_business_info_num',
      'changeHistoryCount',
      'his_shareholder_num',
      'his_manager_num',
      'his_invest_num',
      'his_domain_num',
      corpDetailHisEquityPledge.modelNum,
      'landmortgage_num',
      'company_certificate_num',
      'license_abolish_num',
      'historicalbeneficiaryCount',
      'historicalcontrollerCount',
      'hisPatentNum',
    ],
  },
}

/**
 * 检查配置是否正确
 */
function checkConfigLengths(): void {
  for (const key in CompanyDetailBaseMenus) {
    const item = CompanyDetailBaseMenus[key]
    if (!item) continue

    const numArrLength = item.numArr.length
    const showListLength = item.showList.length
    const showNameLength = item.showName.length

    if (numArrLength !== showListLength || numArrLength !== showNameLength) {
      console.warn(
        `~ Warning: In corp detail menu config item '${item.title}', the lengths of 'numArr', 'showList', and 'showName' are not equal.`
      )
    }
  }
}

/**
 * 个体工商户 menu
 */
export const getCorpDetailIndividualMenus = (): ICorpMenuCfg => {
  // 删除金融行为、资质荣誉、司法风险、经营风险大目录，其余目录没有数据时隐藏
  const menuToDel = ['financing', 'qualifications', 'risk', 'businessRisk']
  const res = { ...CompanyDetailBaseMenus }
  menuToDel.forEach((key) => {
    delete res[key]
  })
  return res
}

checkConfigLengths()
