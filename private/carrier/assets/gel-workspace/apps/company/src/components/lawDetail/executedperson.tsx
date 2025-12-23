import React from 'react'
import { Card } from '@wind/wind-ui'
import Table from '@wind/wind-ui-table'
import { wftCommon } from '../../utils/utils'

const { HorizontalTable } = Table

function ExecutePerson(props) {
  const { info, isLoading } = props
  console.log('info', info)

  const rows = [
    [
      { title: '被执行人', dataIndex: 'companyName', contentAlign: 'left', titleAlign: 'left', colSpan: 2 },
      { title: '案号', dataIndex: 'caseNo', contentAlign: 'left', titleAlign: 'left', colSpan: 2 },
    ],
    [
      {
        title: '立案日期',
        dataIndex: 'caseDate',
        contentAlign: 'left',
        titleAlign: 'left',
        colSpan: 2,
        render: (text) => {
          return wftCommon.formatTime(text)
        },
      },
      {
        title: '执行标的(元)',
        dataIndex: 'amount',
        contentAlign: 'left',
        titleAlign: 'left',
        colSpan: 2,
        render: (text) => {
          // return wftCommon.formatMoney(text);
          return wftCommon.formatMoney(text, [4, ' '])
        },
        // titleAlign:'right'
      },
    ],
    [
      { title: '执行法院', dataIndex: 'court', contentAlign: 'left', titleAlign: 'left', colSpan: 2 },
      { title: '执行状态', dataIndex: 'statusType', contentAlign: 'left', titleAlign: 'left', colSpan: 2 },
    ],
  ]

  return (
    <Card title={'被执行人'} style={{ width: 1366 }}>
      <HorizontalTable
        bordered={'dotted'}
        loading={isLoading}
        title={null}
        size={'default'}
        // @ts-expect-error ttt
        rows={rows}
        dataSource={info}
        data-uc-id="c6AdGdeFnT"
        data-uc-ct="horizontaltable"
      ></HorizontalTable>
    </Card>
  )
}

export default ExecutePerson
