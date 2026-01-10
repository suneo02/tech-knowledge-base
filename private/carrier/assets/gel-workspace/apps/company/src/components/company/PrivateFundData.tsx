/** @format */
import { showInvestedFund, showSelfManagedFund } from '@/handle/corpModuleCfg/fund/selfManaged'
import { CorpPrimaryModuleCfg } from '@/types/corpDetail'
import { t } from 'gel-util/intl'

export const PrivateFundData: CorpPrimaryModuleCfg = {
  moduleTitle: {
    title: t('39902', '基金数据'),
    moduleKey: 'PrivateFundData', // 与左侧大菜单齐名
    noneData: t('348954', '暂无基金数据'),
  },
  showSelfManagedFund,
  showInvestedFund,
}
