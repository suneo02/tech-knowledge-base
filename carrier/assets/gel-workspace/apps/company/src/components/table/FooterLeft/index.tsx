import intl from '../../../utils/intl'
import styles from './index.module.less'
import React, { FC } from 'react'

/**
 * 左下方的tips 只展示最近三年的数据
 */
export const TableFooterLeft: FC<{
  footerLeftRender?: React.ReactNode
  total: number
  ifRecentThreeYears?: boolean
}> = ({ footerLeftRender, total, ifRecentThreeYears }) => {
  let content: React.ReactNode
  if (footerLeftRender) {
    content = footerLeftRender
  } else if (ifRecentThreeYears) {
    content =
      total > 5000
        ? intl(393224, '仅展示近3年数据，最多展示5000条，如需获取更多数据内容，请联系客户经理，购买定制服务')
        : intl(393225, '仅展示近3年数据')
  } else {
    // 此处为之前逻辑
    content =
      total > 5000 ? intl('265692', '注：最多展示5000条数据，如需获取更多数据内容，请联系客户经理，购买定制服务') : null
  }
  return content && <div className={styles.tips}>{content}</div>
}
