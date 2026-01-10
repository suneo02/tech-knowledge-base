import { corpDetailInvestigationFiling } from '@/handle/corpModuleCfg'
import { CorpMenuModuleCfg } from '@/types/corpDetail'
import intl from '@/utils/intl'
import { isEn } from 'gel-util/intl'

export const corpDetailQualificationsMenu: CorpMenuModuleCfg = {
  title: intl('284064', '资质荣誉'),
  children: [
    {
      countKey: 'admin_licence_num',
      showModule: 'getpermission02',
      showName: intl('222481', '行政许可[信用中国]'),
    },
    {
      countKey: 'adminLicenceCount',
      showModule: 'getpermission',
      showName: intl('222480', '行政许可[工商局]'),
    },
    {
      countKey: corpDetailInvestigationFiling.modelNum,
      showModule: 'credit',
      showName: intl('448360', '征信备案'),
    },
    {
      countKey: 'financialRecordNum',
      showModule: 'jrxx',
      showName: intl('448339', '金融信息服务备案'),
    },
    {
      countKey: 'commercial_franchise_info_num',
      showModule: 'showfranchise',
      showName: intl('216405', '商业特许经营'),
    },
    {
      countKey: 'financial_licence_num',
      showModule: 'getfinanciallicence',
      showName: intl('222483', '金融许可'),
    },
    {
      countKey: 'telelic_num',
      showModule: 'getteleLics',
      showName: intl('205397', '电信许可'),
    },
    {
      countKey: 'gameLicenseCount',
      showModule: 'getgameapproval',
      showName: intl('354853', '游戏审批'),
    },
    {
      countKey: 'build_qualification_num',
      showModule: 'showBuildOrder',
      showName: intl('216392', '建筑资质'),
    },
    {
      countKey: 'realestateCertificate',
      showModule: 'enterpriseDevelopment',
      showName: intl('348191', '房企开发资质'),
    },
    {
      countKey: 'logisticsCreditRate',
      showModule: 'logisticsCreditRating',
      showName: isEn() ? 'Logistics Credit Rating' : '物流信用评级',
    },
    {
      countKey: 'impexp_num',
      showModule: 'getimpexp',
      showName: intl('205419', '进出口信用'),
    },
    {
      countKey: 'certification_merge_num',
      showModule: 'getauthentication',
      showName: intl('332373', '认证认可'),
    },
    {
      countKey: 'taxaCreditCount',
      showModule: 'gettaxcredit1',
      showName: intl('332374', 'A级纳税人'),
    },
    {
      countKey: 'cosmeticslicenseNum',
      showModule: 'hzpscxk',
      showName: intl('368136', '化妆品生产许可'),
    },
    {
      countKey: 'listingTagsDataCount',
      showModule: 'selectList',
      showName: intl('286256', '入选名录'),
    },
    {
      countKey: 'ranked_num',
      showModule: 'listInformation',
      showName: intl('138468', '上榜信息'),
    },
  ],
}
