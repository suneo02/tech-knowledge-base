// 企业库首页tab
import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils'

/**
 * @deprecated
 */
export const classifySearch = [
  {
    key: 'company',
    value: intl('437304', '查公司'),
  },
  {
    key: 'people',
    value: intl('138432', '查人物'),
  },
  {
    key: 'group',
    value: intl('247482', '查集团'),
  },
  {
    key: 'risk',
    value: intl('339154', '查司法'),
    url: wftCommon.usedInClient()
      ? '/wind.risk.platform/index.html#/check/special/judicature'
      : 'https://erm.wind.com.cn/wind.risk.platform/index.html#/login',
  },
  {
    key: 'relation',
    value: intl('422046', '查关系'),
  },
]
