import React, { FC } from 'react'
import classNames from 'classnames'
import HistoryList from './HistoryList'
import RecentViewList from './RecentViewList'
import { HistoryAndRecentViewProps } from './type'
import './HistoryAndRecentView.less'

/**
 * 历史搜索和最近浏览容器组件
 * @author 刘兴华<xhliu.liu@wind.com.cn>
 * @component HistoryAndRecentView
 * @param props.historyList 历史搜索列表数据
 * @param props.onHistoryItemClick 历史搜索项点击回调
 * @param props.onClearHistory 清空历史搜索回调
 * @param props.onDeleteHistoryItem 删除单个历史搜索项回调
 * @param props.recentViewList 最近浏览列表数据
 * @param props.onRecentViewItemClick 最近浏览项点击回调
 * @param props.onClearRecentView 清空最近浏览回调
 * @param props.onDeleteRecentViewItem 删除单个最近浏览项回调
 * @param props.listFlag 列表显隐
 */
const HistoryAndRecentView: FC<HistoryAndRecentViewProps> = ({
  historyList,
  onHistoryItemClick,
  onClearHistory,
  onDeleteHistoryItem,
  recentViewList,
  onRecentViewItemClick,
  onClearRecentView,
  onDeleteRecentViewItem,
  listFlag,
}) => {
  const hasHistory = historyList && historyList.length > 0
  const hasRecentView = recentViewList && recentViewList.length > 0

  // 如果两个列表都没有数据，则不显示
  if (!hasHistory && !hasRecentView) {
    return null
  }

  const containerClassName = classNames('history-recent-container', {
    'history-only': hasHistory && !hasRecentView,
    'recent-only': !hasHistory && hasRecentView,
    'both-columns': hasHistory && hasRecentView,
    hide: !listFlag,
  })

  return (
    <div className={containerClassName}>
      {hasHistory && (
        <div className="history-column">
          <HistoryList
            list={historyList}
            onItemClick={onHistoryItemClick}
            listFlag={true} // 内部总是显示，由容器控制
            onClearHistory={onClearHistory}
            onDeleteHistoryItem={onDeleteHistoryItem}
          />
        </div>
      )}
      {hasRecentView && (
        <div className="recent-column">
          <RecentViewList
            list={recentViewList}
            onItemClick={onRecentViewItemClick}
            listFlag={true} // 内部总是显示，由容器控制
            onClearRecentView={onClearRecentView}
            onDeleteRecentViewItem={onDeleteRecentViewItem}
          />
        </div>
      )}
    </div>
  )
}

export default HistoryAndRecentView
