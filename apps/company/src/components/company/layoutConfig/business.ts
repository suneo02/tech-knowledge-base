import { corpDetailCommonCorpBus, corpDetailLandInfo } from '@/handle/corpModuleCfg'
import { CorpMenuModuleCfg } from '@/types/corpDetail'
import intl from '@/utils/intl'

export const corpDetailBusinessMenu: CorpMenuModuleCfg = {
  title: intl('120663', '经营信息'),
  children: [
    {
      countKey: 'mainbusinessstruct_num',
      showModule: 'businessScope',
      showName: intl('138753', '主营构成'),
    },
    {
      countKey: corpDetailCommonCorpBus.modelNum,
      showModule: 'showComBuInfo',
      showName: intl('205500', '企业业务'),
    },
    {
      countKey: 'product_num',
      showModule: 'showApp',
      showName: intl('232865', 'APP产品'),
    },
    {
      countKey: 'hotel_num',
      showModule: 'showHotels',
      showName: intl('222478', '旗下酒店'),
    },
    {
      countKey: 'report_num',
      showModule: 'researchReport01',
      showName: intl('138775', '公司研报'),
      hideMenuNum: true,
    },
    {
      countKey: 'gov_major_project_num',
      showModule: 'majorGovProject',
      showName: intl('314693', '政府重大项目'),
    },
    {
      countKey: true,
      showModule: 'biddingInfo',
      showName: intl('271633', '招投标'),
    },
    {
      countKey: 'recruitt_num',
      showModule: 'jobs',
      showName: intl('138356', '招聘'),
    },
    {
      countKey: corpDetailLandInfo.modelNum,
      showModule: 'showLandInfo',
      showName: intl('114647', '土地信息'),
    },
    {
      countKey: 'fundpe_num',
      showModule: 'getfundpe',
      showName: intl('119142', '私募基金'),
    },
    {
      countKey: ['customer_num', 'supplier_num'],
      showModule: 'showCustomersSup',
      showName: intl('205516', '客户和供应商'),
    },
    {
      countKey: 'relate_dparty_num',
      showModule: 'getrelatedparty',
      showName: intl('222763', '业务关联方'),
    },
    {
      countKey: 'governmentgrants_num',
      showModule: 'governmentSupport01',
      showName: intl('138315', '政府补贴'),
    },
    {
      countKey: 'gov_support_num',
      showModule: 'getgovsupport',
      showName: intl('222475', '政府扶持'),
    },
  ],
}
