import { getPayInvoice } from '@/api/userApi'
import { TableProps } from '@wind//wind-ui-table'
import { UserOrder } from 'gel-api/*'
import React from 'react'
import intl from '../../../utils/intl'

export const useOrderColumns = ({
  pageNo,
  pageSize,
  tickPopup,
  openInvoiceModal,
}: {
  pageNo: number
  pageSize: number
  tickPopup: (data: any) => void
  openInvoiceModal: (orderId: string) => void
}) => {
  // 订单列表Column
  const orderColumn: TableProps<UserOrder>['columns'] = [
    {
      title: intl('28846', '序号'),
      dataIndex: '',
      width: '8%',
      render: (_data, _row, index) => {
        return (pageNo - 1) * pageSize + index + 1
      },
    },
    {
      title: intl('437754', '订单类型'),
      dataIndex: 'name',
      width: '23%',
      render: (data) => {
        return data || '--'
      },
    },
    {
      title: intl('437756', '订单时间'),
      dataIndex: 'date',
      width: '13%',
      render: (data) => {
        return data || '--'
      },
    },
    {
      title: intl('437755', '支付金额（元）'),
      dataIndex: 'priceYuan',
      width: '14%',
      align: 'right',
      render: (data) => {
        return data.toFixed(2) || '--'
      },
    },
    {
      title: intl('437732', '支付方式'),
      dataIndex: 'type',
      width: '12%',
      render: (data) => {
        return data?.desc || '--'
      },
    },
    {
      title: intl('32098', '状态'),
      dataIndex: 'status',
      width: '12%',
      render: (data) => {
        if (data?.code == 2) {
          return data?.desc
        }
        return data?.desc || '--'
      },
    },
    {
      title: intl('36348', '操作'),
      dataIndex: 'applyInvoice',
      width: '18%',
      render: (_data, full) => {
        const hasInvoiced = full.applyInvoice // 1 已开 0 未开
        const orderId = full.orderId || ''

        if (!orderId) {
          console.error('没有 order id')
          return '--'
        }

        if (hasInvoiced) {
          return (
            <span
              onClick={() => {
                if (orderId) {
                  getPayInvoice(orderId).then((res) => {
                    res.Data && (res.Data.orderId = orderId)
                    tickPopup(res.Data || {})
                  })
                }
              }}
              className="gel-vip-tick-create"
              data-uc-id="j3hJ-Qe3l"
              data-uc-ct="span"
            >
              {intl('307843', '发票信息')}
            </span>
          )
        }

        // 未开票，则显示补开发票按钮
        if (!hasInvoiced) {
          return (
            <span
              onClick={() => {
                if (orderId) {
                  openInvoiceModal(orderId)
                }
              }}
              className="gel-vip-tick-create"
              data-uc-id="cjaeHRIeEL"
              data-uc-ct="span"
            >
              {intl('517997', '补开发票')}
            </span>
          )
        }
      },
    },
  ]

  return orderColumn
}
