import { Modal, message } from '@wind/wind-ui'
import React, { useEffect, useState } from 'react'
import { deleteBidSingleHis, getBidHistory } from '../../api/searchListApi'
import { HistoryList } from '../../components/searchListComponents/searchListComponents'
import intl from '../../utils/intl'
import { wftCommon } from '../../utils/utils'
import './index.less'

const HistoryFocusList = () => {
  const [historyList, setHistoryList] = useState([])
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    getHistoryList()
  }, [])

  // 获取历史记录列表
  const getHistoryList = () => {
    getBidHistory().then((res) => {
      if (res.ErrorCode == 0 && res.Data && res.Data.length) {
        setHistoryList(res.Data)
      }
    })
  }

  // 删除单条历史记录
  const deleteSingleHistory = (id) => {
    if (id) {
      const param = {
        type: 'one',
        detailId: id,
      }
      deleteBidSingleHis(param).then((res) => {
        if (res.Data === 'success') {
          setHistoryList((prev) => prev.filter((item) => item.detailId !== id))
          message.success(intl('176605', '清除成功'))
        } else {
          message.error(intl('349079', '清除失败!'))
        }
      })
    }
  }

  // 删除所有历史记录
  const deleteAllHistory = () => {
    const param = {
      type: 'all',
    }
    deleteBidSingleHis(param).then((res) => {
      if (res.Data === 'success') {
        setHistoryList([])
        setVisible(false)
        message.success(intl('176605', '清除成功'))
      } else {
        message.error(intl('349079', '清除失败!'))
      }
    })
  }

  // 渲染历史记录列表项
  const viewHistory = (item, isDelete, index) => {
    if (index > 7) return null
    const detailId = item.detailId || ''
    const jumpUrl = 'index.html#/biddingDetail?type=bid&detailid=' + detailId + '&title=' + (item.keyword || '')

    return (
      <li className="history-bidList" key={detailId}>
        <span
          className="bid-history-title"
          title={item.keyword}
          onClick={() => wftCommon.jumpJqueryPage(jumpUrl)}
          data-uc-id="4XxZkuFDL_L"
          data-uc-ct="span"
        >
          {item.keyword}
        </span>
        {isDelete && (
          <span
            className="del-history"
            onClick={() => deleteSingleHistory(detailId)}
            data-uc-id="0mv0wSjgfO7"
            data-uc-ct="span"
          />
        )}
      </li>
    )
  }

  if (!historyList.length) return null

  return (
    <div id="historyFocusList" className="search-r-model">
      <HistoryList
        list={historyList}
        title={intl('108694', '最近浏览')}
        allDelete
        listShowFun={viewHistory}
        isDelete
        showModal={() => setVisible(true)}
      />
      <Modal
        title={intl('108694', '最近浏览')}
        visible={visible}
        onOk={deleteAllHistory}
        onCancel={() => setVisible(false)}
        destroyOnClose
        data-uc-id="dIpePvQALX4"
        data-uc-ct="modal"
      >
        <span>{intl('349118', '全部清除最近浏览招投标公告?')}</span>
      </Modal>
    </div>
  )
}

HistoryFocusList.propTypes = {}

export default HistoryFocusList
