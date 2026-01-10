import React, { FC } from 'react'

import { CloseO, DeleteO } from '@wind/icons'
import './HistoryList.less'
import { SearchItem } from './type'
import { Button, Modal } from '@wind/wind-ui'
import { t } from 'gel-util/intl'

/**
 * 历史搜索列表
 * @author 刘兴华<xhliu.liu@wind.com.cn>
 * @component HistoryList
 * @param props.list 列表数据
 * @param props.onItemClick 列表项点击回调
 * @param props.listFlag 列表显隐
 * @param props.onClearHistory 清空历史回调
 * @param props.onDeleteHistoryItem 删除单个历史记录回调
 */
export interface HistoryListProps {
  list: SearchItem[]
  onItemClick: (item: SearchItem) => void
  listFlag: boolean
  onClearHistory?: () => void
  onDeleteHistoryItem?: (item: SearchItem) => void
}

const HistoryList: FC<HistoryListProps> = ({ list, onItemClick, listFlag, onClearHistory, onDeleteHistoryItem }) => {
  const setName = (data: SearchItem) => {
    const anyData = data as any
    let highLitKey = anyData?.name || anyData?.corp_name || anyData?.corpName || anyData?.groupsystem_name
    if ('highlight' in anyData && Object.keys(anyData.highlight).length > 0) {
      if (Object.keys(anyData.highlight)[0] === 'corp_name') {
        highLitKey = anyData.highlight[Object.keys(anyData.highlight)[0]]
      }
    }
    return highLitKey
  }

  return (
    <>
      <div className={listFlag ? 'input-toolbar-search-list' : 'input-toolbar-search-list hide'}>
        {list.length > 0 && (
          <div className="search-list-title">
            {t('437396', '历史搜索')}
            <Button
              type="text"
              icon={
                <DeleteO style={{ fontSize: 20 }} onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} />
              }
              className="search-list-icon"
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (!onClearHistory) return
                Modal.confirm({
                  title: t('', '是否清空历史搜索？'),
                  content: t('478638', '此操作不可撤销，请确认。'),
                  okText: t('12238', '确定'),
                  cancelText: t('372173', '取消'),
                  onOk: () => onClearHistory?.(),
                })
              }}
              data-uc-id="Su919k0Gsj"
              data-uc-ct="span"
            ></Button>
          </div>
        )}
        {list &&
          list.length > 0 &&
          list.map((item: any) => {
            const key = item.value || item.id || item.name
            return (
              <div key={key} className="search-list-div" data-uc-id="zbFy-hLAyd" data-uc-ct="div" data-uc-x={key}>
                <span
                  className="name"
                  dangerouslySetInnerHTML={{ __html: setName(item) }}
                  onMouseDown={() => onItemClick(item)}
                />
                {onDeleteHistoryItem && (
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
                      onDeleteHistoryItem(item)
                    }}
                    data-uc-id="delete-history-item"
                    data-uc-ct="span"
                  ></Button>
                )}
              </div>
            )
          })}
      </div>
    </>
  )
}

export default HistoryList
