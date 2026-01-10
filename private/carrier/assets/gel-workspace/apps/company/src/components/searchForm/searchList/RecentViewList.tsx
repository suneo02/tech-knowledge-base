import React, { FC } from 'react'

import { CloseO, DeleteO } from '@wind/icons'
import './HistoryList.less'
import { RecentViewListProps } from './type'
import { Button, Modal } from '@wind/wind-ui'
import { t } from 'gel-util/intl'

/**
 * 最近浏览列表组件
 * @author 刘兴华<xhliu.liu@wind.com.cn>
 * @component RecentViewList
 * @param props.list 最近浏览列表数据
 * @param props.onItemClick 列表项点击回调
 * @param props.listFlag 列表显隐
 * @param props.onClearRecentView 清空最近浏览回调
 * @param props.onDeleteRecentViewItem 删除单个最近浏览项回调
 */
const RecentViewList: FC<RecentViewListProps> = ({
  list,
  onItemClick,
  listFlag,
  onClearRecentView,
  onDeleteRecentViewItem,
}) => {
  return (
    <div className={listFlag ? 'input-toolbar-search-list' : 'input-toolbar-search-list hide'}>
      {list.length > 0 && (
        <div className="search-list-title">
          {t('108694', '最近浏览')}
          <Button
            type="text"
            className="search-list-icon"
            icon={
              <DeleteO style={{ fontSize: 20 }} onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} />
            }
            onMouseDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (!onClearRecentView) return
              Modal.confirm({
                title: t('', '是否清空最近浏览？'),
                // content: t('478638', '此操作不可撤销，请确认。'),
                okText: t('12238', '确定'),
                cancelText: t('372173', '取消'),
                onOk: () => onClearRecentView?.(),
              })
            }}
            data-uc-id="Su919k0Gsj"
            data-uc-ct="span"
          ></Button>
        </div>
      )}
      {list &&
        list.length > 0 &&
        list.map((item, index) => {
          const key = item.entityId + index
          return (
            <div
              key={key}
              className="search-list-div"
              onMouseDown={() => onItemClick(item)}
              data-uc-id="zbFy-hLAyd"
              data-uc-ct="div"
              data-uc-x={key}
            >
              <span className="name">{item.entityName}</span>
              {onDeleteRecentViewItem && (
                <Button
                  className="delete-item"
                  type="text"
                  icon={
                    <CloseO
                      style={{ fontSize: 20 }}
                      onPointerEnterCapture={() => {}}
                      onPointerLeaveCapture={() => {}}
                    />
                  }
                  onMouseDown={(e) => {
                    e.stopPropagation()
                    onDeleteRecentViewItem(item)
                  }}
                  data-uc-id="delete-recent-item"
                  data-uc-ct="span"
                ></Button>
              )}
            </div>
          )
        })}
    </div>
  )
}

export default RecentViewList
