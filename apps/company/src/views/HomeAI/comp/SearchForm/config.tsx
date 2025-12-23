// 企业库首页用于判断当前选中的查询类型
export const PEOPLE = 'people' // 查人物
export const COMPANY = 'company' // 查公司
export const GROUP = 'group' // 查集团
export const RELATION = 'relation' // 查关系

// 企业库首页tab
import intl from '@/utils/intl'

export const homeSearchTabCfg = [
  {
    key: 'company',
    value: intl('421562', '查企业'),
  },
  {
    key: 'people',
    value: intl('138432', '查人物'),
    disable: window.is_overseas_config,
  },
  {
    key: 'group',
    value: intl('247482', '查集团'),
  },

  {
    key: 'relation',
    value: intl('422046', '查关系'),
  },
]
  .map((item) => {
    return item.disable ? null : item
  })
  .filter(Boolean)
