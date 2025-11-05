import React from 'react'
import { Card } from '@wind/wind-ui'
import Table from '@wind/wind-ui-table'
import { wftCommon } from '../../utils/utils'

const { HorizontalTable } = Table

function Discredit(props) {
  const rows = [
    [
      { title: '失信被执行人', dataIndex: 'companyName', contentAlign: 'left', titleAlign: 'left', colSpan: 2 },
      { title: '案号', dataIndex: 'referenceNumber', contentAlign: 'left', titleAlign: 'left', colSpan: 2 },
    ],
    [
      {
        title: '执行依据案号',
        dataIndex: 'executionBasisNumber',
        contentAlign: 'left',
        titleAlign: 'left',
        colSpan: 2,
      },
      { title: '执行法院', dataIndex: 'courtOfExecution', contentAlign: 'left', titleAlign: 'left', colSpan: 2 },
    ],
    [
      { title: '作出执行依据单位', dataIndex: 'executionOrg', contentAlign: 'left', titleAlign: 'left', colSpan: 2 },
      {
        title: '立案日期',
        dataIndex: 'filingTime',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          return wftCommon.formatTime(text)
        },
      },
    ],
    [
      {
        title: '发布日期',
        dataIndex: 'publishDate',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          return wftCommon.formatTime(text)
        },
      },
      { title: '被执行人履行情况', dataIndex: 'executionStatus', contentAlign: 'left', titleAlign: 'left', colSpan: 2 },
    ],
    [{ title: '失信行为', dataIndex: 'specificCircumstances', contentAlign: 'left', titleAlign: 'left', colSpan: 5 }],
    [
      {
        title: '生效法律文书确定的义务',
        dataIndex: 'effectiveLegalInstruments',
        contentAlign: 'left',
        titleAlign: 'left',
        colSpan: 5,
      },
    ],
  ]

  const { info, isLoading } = props
  console.log('info', info)

  return (
    <Card title={'失信被执行人'} style={{ width: 1366 }}>
      <HorizontalTable
        bordered={'dotted'}
        loading={isLoading}
        title={null}
        size={'default'}
        // @ts-expect-error ttt
        rows={rows}
        dataSource={info}
      ></HorizontalTable>
    </Card>
  )
}

export default Discredit
