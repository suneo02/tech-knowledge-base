import React from 'react'
import { Card } from '@wind/wind-ui'
import Table from '@wind/wind-ui-table'
import { FilePdfO } from '@wind/icons'
import { wftCommon } from '../../utils/utils'
import { usePageTitle } from '../../handle/siteTitle'

const { HorizontalTable } = Table

function Highconsume(props) {
  const { info, isLoading } = props
  usePageTitle('HighConsumptionRestrictions', info?.judicialId)

  const rows = [
    [
      { title: '被限制高消费人员', dataIndex: 'personName', contentAlign: 'left', titleAlign: 'left', colSpan: 2 },
      {
        title: '所属企业',
        dataIndex: 'companyName',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text, record) => {
          return (
            <a
              target="_blank"
              href={'../../Company/Company.html?companycode=' + record.companyCode}
              rel="noreferrer"
              data-uc-id="8Dd-SXthV9"
              data-uc-ct="a"
            >
              {text}
            </a>
          )
        },
      },
    ],
    [
      { title: '案号', dataIndex: 'judicialId', contentAlign: 'left', titleAlign: 'left', colSpan: 2 },
      { title: '执行法院', dataIndex: 'courtName', contentAlign: 'left', titleAlign: 'left', colSpan: 2 },
    ],
    [
      {
        title: '发布日期',
        dataIndex: 'pubTime',
        contentAlign: 'left',
        titleAlign: 'left',
        colSpan: 2,
        render: (text) => {
          return wftCommon.formatTime(text)
        },
      },
      {
        title: '立案日期',
        dataIndex: 'firstAnnouncementDate',
        contentAlign: 'left',
        titleAlign: 'left',
        colSpan: 2,
        render: (text) => {
          return wftCommon.formatTime(text)
        },
      },
    ],
    [
      {
        title: '原文内容',
        dataIndex: 'url',
        contentAlign: 'left',
        titleAlign: 'left',
        colSpan: 2,
        render: (text) => {
          return (
            <a href={text} target="_blank" rel="noreferrer" data-uc-id="0gMHELLesV" data-uc-ct="a">
              <FilePdfO
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                data-uc-id="CcOd3kAosF"
                data-uc-ct="filepdfo"
              />
            </a>
          )
        },
      },
      { title: '执行状态', dataIndex: 'statusType', contentAlign: 'left', titleAlign: 'left', colSpan: 2 },
    ],
  ]

  return (
    <Card title={'限制高消费'} style={{ width: 1366 }}>
      <HorizontalTable
        bordered={'dotted'}
        loading={isLoading}
        title={null}
        size={'default'}
        // @ts-expect-error ttt
        rows={rows}
        dataSource={info}
        data-uc-id="hPNs8QBJBD"
        data-uc-ct="horizontaltable"
      ></HorizontalTable>
    </Card>
  )
}

export default Highconsume
