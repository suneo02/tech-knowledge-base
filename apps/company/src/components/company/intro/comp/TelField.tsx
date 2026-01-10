import { CorpCardInfo } from 'gel-types'
import React from 'react'
import intl from '../../../../utils/intl'

/**
 * TelField 组件
 * - 统一企业电话展示区域的渲染逻辑与“更多”入口
 * - 兼容没有官方电话但存在多条来源电话的场景，提示“暂无官方联系电话”
 *
 * Props
 * - headerInfo: 企业头部信息（包含 `tel`, `telCount` 等字段）
 * - showMore: 是否展示“更多”入口（默认 false）
 * - ucId: 埋点 ID（不传使用默认值）
 * - onMoreClick: 点击“更多”入口的回调
 */
export const TelField: React.FC<{
  headerInfo: Partial<CorpCardInfo>
  showMore?: boolean
  onMoreClick?: () => void
}> = ({ headerInfo, showMore = false, onMoreClick }) => {
  // 来源电话数量，优先使用后端统计字段
  const count = headerInfo.telCount || 0
  // 官方电话优先展示第一项（逗号分隔）
  const telFirst = headerInfo?.tel ? headerInfo.tel.split(',')[0] : ''
  // 没有官方电话但存在多条来源电话且需要展示“更多”时，提示“暂无官方联系电话”
  const showNoOfficial = !telFirst && showMore && count > 1
  return (
    <>
      {/* 标题与主值展示 */}
      <span className="itemTitle">{intl('4944', '电话')} :</span>{' '}
      <span className={showNoOfficial ? 'tel-no-official' : ''}>{showNoOfficial ? intl('479834', '暂无官方联系电话') : telFirst || '--'}</span>
      {/* “更多”入口：显示数量并触发回调 */}
      {showMore && count > 1 ? (
        <span className="morecontact" onClick={onMoreClick} data-uc-id={'8JyYIstWY6M'} data-uc-ct="span">
          {intl('272167', '更多')} ({count})
        </span>
      ) : null}
    </>
  )
}
