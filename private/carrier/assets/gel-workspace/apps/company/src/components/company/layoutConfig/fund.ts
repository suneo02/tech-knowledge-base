import { CorpMenuModuleCfg } from '@/types/corpDetail'
import intl from '@/utils/intl'

/**
 * 公募基金数据菜单配置
 */
export const corpDetailPublicFundMenu: CorpMenuModuleCfg = {
  title: intl('39902', '基金数据'),
  children: [
    {
      countKey: true,
      showModule: 'showFundSize',
      showName: intl('37109', '基金规模'),
    },
    {
      countKey: true,
      showModule: 'showItsFunds',
      showName: intl('11546', '旗下基金'),
    },
  ],
}

/**
 * 私募基金数据菜单配置
 */
export const corpDetailPrivateFundMenu: CorpMenuModuleCfg = {
  title: intl('39902', '基金数据'),
  children: [
    {
      countKey: 'pe_amac_fundmanager_self_managed_fund_num',
      showModule: 'showSelfManagedFund',
      showName: intl('', '自管基金'),
      // hideMenuNum: true,
    },
    {
      countKey: 'pe_enterpriselp_invested_fund_num',
      showModule: 'showInvestedFund',
      showName: intl('431417', '已投基金'),
      // hideMenuNum: true,
    },
  ],
}
