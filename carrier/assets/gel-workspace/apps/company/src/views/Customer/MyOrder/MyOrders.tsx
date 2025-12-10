import { getWsid } from '@/utils/env'
import { Modal } from '@wind/wind-ui'
import Table from '@wind/wind-ui-table'
import { isEn } from 'gel-util/intl'
import { getPayWebLink, PayWebModule } from 'gel-util/link'
import QRCode from 'qrcode'
import React, { useEffect, useState } from 'react'
import { listPayOrder } from '../../../api/userApi'
import intl from '../../../utils/intl'
import { wftCommon } from '../../../utils/utils'
import { corpRows } from './corpRows'
import styles from './myOrder.module.less'
import { useOrderColumns } from './orderColumns'
import { personRows } from './personRows'

const { HorizontalTable } = Table
const pageSize = 10

export const MyOrders = () => {
  const [loading, setLoading] = useState(false)
  const [orderDatas, setOrderDatas] = useState([]) // 我的订单
  const [pageNo, setPageNo] = useState(1)
  const [total, setTotal] = useState(0)

  // 发票详情
  const [orderVisible, setOrderVisible] = useState(false)
  const [dataSource, setDataSource] = useState<any>({})

  // 开具发票弹窗
  const [invoiceModalVisible, setInvoiceModalVisible] = useState(false)
  const [invoiceUrl, setInvoiceUrl] = useState('')

  const pagination = {
    current: pageNo,
    pageSize: pageSize,
    total: total,
    onChange: (page) => {
      setPageNo(page)
    },
    hideOnSinglePage: false,
    showSizeChanger: false,
    showQuickJumper: true,
  }

  const getMyOrders = () => {
    setLoading(true)
    listPayOrder({
      pageNo: pageNo - 1,
      pageSize: pageSize,
    })
      .then((res) => {
        wftCommon.zh2enAlwaysCallback(res.Data, (newData) => {
          setOrderDatas(newData || [])
        })
        setTotal(res.Page?.Records || 0)
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    getMyOrders()
  }, [pageNo])

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type } = event.data
      if (type === 'close') {
        setInvoiceModalVisible(false)
      } else if (type === 'confirm') {
        setInvoiceModalVisible(false)
        getMyOrders() // Refresh data
      }
    }

    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  const tickPopup = (tick) => {
    setOrderVisible(true)
    setDataSource(tick)

    if (!tick?.status || tick.status?.code !== 2) {
      // 开票中
      if (tick?.invoiceType && tick.invoiceType?.code == 1) {
      } else {
      }
    }
    setTimeout(function () {
      const canvas = document.querySelector('.tick-code')
      if (canvas) {
        QRCode.toCanvas(canvas, tick?.downLoadUrl, { width: 169 }, function (error) {
          if (error) {
            console.error('qcode error', tick?.downLoadUrl)
            console.error(error)
          } else {
            console.log('success!')
          }
        })
      }
    }, 200)
  }

  const openInvoiceModal = (orderId: string) => {
    const url = getPayWebLink(PayWebModule.CHECK, {
      orderNo: orderId,
      invoiceMode: 'append',
      'wind.sessionid': getWsid(),
    })
    if (url) {
      setInvoiceUrl(url)
      setInvoiceModalVisible(true)
    } else {
      console.error('没有发票链接', orderId)
    }
  }

  const orderColumn = useOrderColumns({
    pageNo,
    pageSize,
    tickPopup,
    openInvoiceModal,
  })

  return (
    <div>
      <div className="customer-title">{intl('153389', '我的订单')}</div>
      <div className="customer-orderList-header">
        <div className="customer-orderList-header-title">
          {' '}
          {intl('358873', '订单和发票须知')} {isEn() ? ':' : '：'}{' '}
        </div>
        <div>1. {intl('358874', '“我的订单”页面仅展示在线支付的订单信息')}</div>
        <div>
          2.{' '}
          {isEn()
            ? 'Currently, invoices can only be issued when doing online payments. If you did not request an invoice at the time of payment, please contact your customer manager to have the invoice reissued.'
            : '当前仅支持在线支付时开具发票，如果支付时未申请发票，请联系专属客户经理补开发票'}
        </div>
        <div>3. {intl('358875', '发票开具后会自动发送到您的邮箱，同时您也可以点击“查看发票”重新扫码获取发票文件')}</div>
      </div>
      <Table
        columns={orderColumn}
        dataSource={orderDatas}
        size="large"
        loading={loading}
        pagination={total > pageSize ? pagination : null}
        data-uc-id="11-1SIcz1u"
        data-uc-ct="table"
      ></Table>
      <Modal
        title={intl('416983', '发票详情')}
        visible={orderVisible}
        onOk={() => {
          setOrderVisible(false)
        }}
        onCancel={() => {
          setOrderVisible(false)
        }}
        footer={null}
        data-uc-id="egkepqswJo"
        data-uc-ct="modal"
      >
        <HorizontalTable
          rows={dataSource?.invoiceType?.code == 1 ? corpRows : personRows}
          dataSource={dataSource}
          data-uc-id="4DzXVi-t0G"
          data-uc-ct="horizontaltable"
        ></HorizontalTable>
        {dataSource?.status?.code == 2 ? (
          <>
            <div className="tab-tickdetail-bottom">{intl('419894', '扫描下方链接可下载发票：')}</div>
            <div style={{ textAlign: 'center' }}>
              {' '}
              <canvas className="tick-code"></canvas>{' '}
            </div>
          </>
        ) : (
          <>
            <div className="tab-tickdetail-bottom">{intl('419788', '发票开具中，开具完成后可在此处查看二维码')}</div>
          </>
        )}
      </Modal>
      {invoiceModalVisible && <iframe src={invoiceUrl} className={styles['my-order-invoice-iframe']} />}
    </div>
  )
}
