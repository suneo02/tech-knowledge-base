import { CorpMenuModuleCfg } from '@/types/corpDetail'
import intl from '@/utils/intl'

/**
 * IPO 业务数据菜单配置
 */
export const corpDetailIpoMenu: CorpMenuModuleCfg = {
  title: intl('64824', '业务数据'),
  children: [
    {
      countKey: 'outputCount',
      showModule: 'showIpoYield',
      showName: intl('49513', '产量'),
    },
    {
      countKey: 'salesCount',
      showModule: 'showIpoSales',
      showName: intl('46834', '销量'),
    },
    {
      countKey: 'businessCount',
      showModule: 'showIpoBusiness',
      showName: intl('46883', '业务量'),
    },
    {
      countKey: 'stockCount',
      showModule: 'showIpoStock',
      showName: intl('44662', '库存'),
    },
  ],
}
