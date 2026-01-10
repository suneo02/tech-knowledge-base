import { CorpMenuModuleCfg } from '@/types/corpDetail'
import intl from '@/utils/intl'

export const corpDetailBusinessRiskMenu: CorpMenuModuleCfg = {
  title: intl('138415', '经营风险'),
  children: [
    {
      countKey: 'violationPunish',
      showModule: 'showViolationsPenalties',
      showName: intl('118780', '诚信信息'),
    },
    {
      countKey: 'default_num',
      showModule: 'getdefaultbond',
      showName: intl('440355', '债券违约'),
    },
    {
      countKey: 'defaultonnonstandardassetsNum',
      showModule: 'getnostandard',
      showName: intl('440354', '非标违约'),
    },
    {
      countKey: 'debtOverdueCount',
      showModule: 'debtoverdue',
      showName: intl('475374', '债务逾期'),
    },
    {
      countKey: 'commercialBillOverdueCount',
      showModule: 'commercialoverdue',
      showName: intl('475357', '商票逾期'),
    },
    {
      countKey: 'taxdebtsCount',
      showModule: 'getowingtax',
      showName: intl('138424', '欠税信息'),
    },
    {
      countKey: 'manageabnormalCount',
      showModule: 'getoperationexception',
      showName: intl('138568', '经营异常'),
    },
    {
      countKey: 'illegal_num',
      showModule: 'getillegal',
      showName: intl('138335', '严重违法'),
    },
    {
      countKey: ['environmentalRatingCount', 'keyMonitoringCompanyCount'],
      showModule: 'environmentalcredit',
      showName: intl('475358', '环保信用'),
    },
    {
      countKey: ['equitypledgedCountbypledgor', 'equitypledgedCountbypledgee', 'equitypledgedCountbycomid'],
      showModule: 'showPledgedstock',
      showName: intl('138281', '股权出质'),
    },
    {
      countKey: ['companyEquityPledgedCount', 'heldEquityPledgedCount', 'pledgeeCount'],
      showModule: 'equitypledge',
      showName: intl('475375', '股权质押'),
    },
    {
      countKey: 'taxillegalCount',
      showModule: 'gettaxillegal',
      showName: intl('138533', '税收违法'),
    },
    {
      countKey: 'guaranteedetailCount',
      showModule: 'showguarantee',
      showName: intl('138320', '担保信息'),
    },
    {
      countKey: ['intellectual_pledgeds_num', 'ipPledgeCount'],
      showModule: 'showIntellectualPropertyRights',
      showName: intl('204944', '知识产权出质'),
    },
    {
      countKey: 'simpleCancellationCount',
      showModule: 'simplecancellation',
      showName: intl('475376', '简易注销'),
    },
    {
      countKey: 'inspection_num',
      showModule: 'getinspection',
      showName: intl('138467', '抽查检查'),
    },
    {
      countKey: 'cancelrecord_num',
      showModule: 'getcancelfiling',
      showName: intl('229150', '注销备案'),
    },
    {
      countKey: 'liquidation_num',
      showModule: 'getclearinfo',
      showName: intl('145873', '清算信息'),
    },
    {
      countKey: 'spot_check_num',
      showModule: 'getdoublerandom',
      showName: intl('145855', '双随机抽查'),
    },
    {
      countKey: 'prodrecall_num',
      showModule: 'getprodrecall',
      showName: intl('120790', '产品召回'),
    },
    {
      countKey: ['stock_pledgers_num', 'stock_pledgees_num', 'stock_plexes_num'],
      showModule: 'showStockMortgage',
      showName: intl('132933', '股票质押'),
    },
  ],
}
