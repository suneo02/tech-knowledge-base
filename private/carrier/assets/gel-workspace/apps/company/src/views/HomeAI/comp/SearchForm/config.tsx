import { HomeSearchTabKeys } from '@/domain/home'
import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils'

/**
 * 获取首页搜索 tab 配置
 * 使用函数形式以确保在调用时能获取到正确的 window.is_overseas_config 值
 */
export const getHomeSearchTabCfg = () => {
  return [
    {
      key: HomeSearchTabKeys.Company,
      value: intl('421562', '查企业'),
    },
    {
      key: HomeSearchTabKeys.People,
      value: intl('138432', '查人物'),
      disable: wftCommon.is_overseas_config,
    },
    {
      key: HomeSearchTabKeys.Group,
      value: intl('247482', '查集团'),
    },
    {
      key: HomeSearchTabKeys.Relation,
      value: intl('422046', '查关系'),
    },
  ]
    .map((item) => {
      return item.disable ? null : item
    })
    .filter(Boolean)
}
