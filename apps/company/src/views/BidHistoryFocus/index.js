import { MailO } from '@wind/icons'
import { Button, Modal, message } from '@wind/wind-ui'
import Table from '@wind/wind-ui-table'
import React, { useEffect, useState, useImperativeHandle } from 'react'
import {
  deleteAllSubscribe,
  deleteSingleSubscribe,
  getAllBidSubscribe,
  getBidSubscribeDetail,
} from '../../api/searchListApi'
import { HistoryList } from '../../components/searchListComponents/searchListComponents'
import intl from '../../utils/intl'
import { wftCommon } from '../../utils/utils'
import './index.less'

const BidHistoryFocus = React.forwardRef(({ onApplySub }, ref) => {
  const [subscribeList, setSubscribeList] = useState([])
  const [visibleSubList, setVisibleSubList] = useState(false)
  const [visible, setVisible] = useState(false)
  const [modalType, setModalType] = useState('')
  const [nowSubId, setNowSubId] = useState('')
  const [nowSubName, setNowSubName] = useState('')

  useEffect(() => {
    getAllSub()
  }, [])

  useImperativeHandle(ref, () => ({
    getAllSub: () => {
      getAllBidSubscribe().then((res) => {
        if (res && res.Data?.length > 0) {
          setSubscribeList(res.Data)
        }
      })
    },
  }))

  // 获取订阅列表
  const getAllSub = () => {
    getAllBidSubscribe().then((res) => {
      if (res && res.Data?.length > 0) {
        setSubscribeList(res.Data)
      }
    })
  }

  // 删除单个订阅
  const deleteSubscribeOne = (id) => {
    if (id) {
      const param = {
        conditionIds: id,
      }
      deleteSingleSubscribe(param).then((res) => {
        if (res.ErrorCode === '0') {
          setSubscribeList((prev) => prev.filter((item) => item.id !== id))
          setVisible(false)
          setNowSubId('')
          setNowSubName('')
          message.success(intl('135057', '删除成功!'))
        } else {
          setVisible(false)
          message.error(intl('349079', '清除失败!'))
        }
      })
    }
  }

  // 删除所有订阅
  const deleteAllSub = () => {
    deleteAllSubscribe().then((res) => {
      if (res.ErrorCode === '0') {
        setSubscribeList([])
        setVisible(false)
        message.success(intl('478664', '清除成功'))
      } else {
        message.warning(intl('349079', '清除失败!'))
      }
    })
  }

  // 应用订阅条件
  const appSub = async (id, name) => {
    setNowSubId(id)
    setNowSubName(name)
    setVisibleSubList(false)

    const param = { id }
    const res = await getBidSubscribeDetail(param)
    if (res && res.Data.queryCondition) {
      const callBack = JSON.parse(res.Data.queryCondition)
      console.log('🚀 ~ appSub ~ callBack:', callBack)
      onApplySub(callBack, name, id)
    }
  }

  const columns = [
    {
      title: intl('5026', '订阅名称'),
      dataIndex: 'conditionName',
      align: 'center',
      render: (txt, record) => {
        const icon = record.emailReminder ? (
          <span>
            <MailO style={{ marginRight: '4px' }} data-uc-id="plsNXAEAVj" data-uc-ct="mailo" />
            {wftCommon.formatCont(txt)}
          </span>
        ) : (
          wftCommon.formatCont(txt)
        )
        return icon
      },
    },
    {
      title: intl('349080', '订阅时间'),
      dataIndex: 'createTime',
      align: 'center',
      render: (txt) => wftCommon.formatTime(txt),
    },
    {
      title: intl('36348', '操作'),
      dataIndex: '',
      align: 'center',
      render: (_, record) => (
        <div>
          <Button
            type="text"
            className="table-app"
            onClick={() => appSub(record.id, record.conditionName)}
            data-uc-id="D3bLFg5pe7"
            data-uc-ct="button"
          >
            {intl('16576', '应用')}
          </Button>
          <Button
            type="text"
            onClick={() => {
              setNowSubId(record.id)
              setNowSubName(record.conditionName)
              setModalType('delSingleSub')
              setVisible(true)
            }}
            data-uc-id="CX7Alr0_h6"
            data-uc-ct="button"
          >
            {intl('19853', '删除')}
          </Button>
        </div>
      ),
    },
  ]

  // 渲染订阅列表项
  const viewSubscribe = (item, isDelete, index) => {
    if (index > 10) return null
    return (
      <li className="subscribe-bid" key={item.id}>
        <span
          className="subscribe-bidName"
          title={item.conditionName}
          onClick={() => appSub(item.id, item.conditionName)}
          data-uc-id="8zx27UZBUYK"
          data-uc-ct="span"
        >
          {item.emailReminder ? (
            <MailO style={{ marginRight: '4px' }} data-uc-id="7gRWnq-L2D" data-uc-ct="mailo" />
          ) : null}
          {item.conditionName}
        </span>
        {isDelete && (
          <span
            className="del-history"
            onClick={() => {
              setNowSubId(item.id)
              setNowSubName(item.conditionName)
              setModalType('delSingleSub')
              setVisible(true)
            }}
            data-uc-id="aVYF9Hl-JDC"
            data-uc-ct="span"
          />
        )}
      </li>
    )
  }

  // 渲染确认弹窗内容
  const renderModalContent = () => {
    if (modalType === 'delAllSub') {
      return <span>{intl('349074', '确认要清空所有招投标订阅么?')}</span>
    }
    if (modalType === 'delSingleSub') {
      return (
        <div>
          {intl('349093', '确认要删除招投标订阅')}&ldquo;{nowSubName}&rdquo;?
        </div>
      )
    }
    return null
  }

  // 处理弹窗确认
  const handleOk = () => {
    if (modalType === 'delAllSub') {
      deleteAllSub()
    } else if (modalType === 'delSingleSub') {
      deleteSubscribeOne(nowSubId)
    }
  }

  if (!subscribeList.length) return null

  return (
    <div id="historyFocusList" className="search-r-model">
      <HistoryList
        list={subscribeList}
        title={intl('272478', '我的订阅')}
        allDelete
        listShowFun={viewSubscribe}
        isDelete
        showModal={() => {
          setModalType('delAllSub')
          setVisible(true)
        }}
      />
      {subscribeList.length > 10 && (
        <div className="subscribe-more">
          <span onClick={() => setVisibleSubList(true)} data-uc-id="nPEnExg37AK" data-uc-ct="span">
            {intl('138650', '查看全部')}
          </span>
        </div>
      )}
      <Modal
        title={intl('349133', '招投标订阅')}
        visible={visible}
        onOk={handleOk}
        onCancel={() => setVisible(false)}
        destroyOnClose
        data-uc-id="-efuK8NLHd"
        data-uc-ct="modal"
      >
        {renderModalContent()}
      </Modal>
      <Modal
        title={intl('349133', '招投标订阅')}
        visible={visibleSubList}
        width="600px"
        onCancel={() => setVisibleSubList(false)}
        footer={null}
        data-uc-id="2it8ZxYgsP"
        data-uc-ct="modal"
      >
        <Table
          columns={columns}
          dataSource={subscribeList}
          pagination={false}
          data-uc-id="1R_bvojbrR"
          data-uc-ct="table"
        />
      </Modal>
    </div>
  )
})

BidHistoryFocus.displayName = 'BidHistoryFocus'

export default BidHistoryFocus
