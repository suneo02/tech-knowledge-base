import React from 'react'
import { Card } from '@wind/wind-ui'
import Table from '@wind/wind-ui-table'
import { wftCommon } from '../../utils/utils'
import { usePageTitle } from '../../handle/siteTitle'

const { HorizontalTable } = Table

function ReachingAnnouncement(props) {
  const { info, isLoading } = props
  usePageTitle('DeliveryNoticeDetails', [info?.caseNo, info?.caseReason])
  const formatterParties = (list) => {
    const obj = {}
    list.forEach((item) => {
      if (!obj[item.roleTypeCode]) {
        obj[item.roleTypeCode] = {}
        obj[item.roleTypeCode]['list'] = []
        obj[item.roleTypeCode]['roleType'] = item.roleType
        obj[item.roleTypeCode]['roleTypeCode'] = item.roleTypeCode
        obj[item.roleTypeCode]['list'].push({
          name: item.name,
          id: item.id,
        })
      } else {
        obj[item.roleTypeCode]['list'].push({
          name: item.name,
          id: item.id,
        })
      }
    })
    const result = []
    for (const key in obj) {
      result.push(obj[key])
    }
    console.log('obj', obj)
    return result
  }

  const parties =
    info && info.roles
      ? formatterParties(info.roles).map((item) => [
          {
            title: item.roleType,
            dataIndex: item.roleTypeCode,
            colSpan: 5,
            render: () => {
              return item.list.map((ele, index) => {
                const text = index === item.list.length - 1 ? ele.name : ele.name + ','
                return ele.id && ele.id.length ? (
                  <a href={'../../Company/Company.html?companycode=' + item.id} target="_blank" rel="noreferrer">
                    {text}
                  </a>
                ) : (
                  text
                )
              })
              // return <a href={"./companyDetail?needtoolbar=1&companycode=" + item.id}>{item.name}</a>
              // return item.name
            },
            contentAlign: 'left',
            titleAlign: 'left',
          },
        ])
      : []

  const rows = [
    [
      { title: '案由', dataIndex: 'caseReason', contentAlign: 'left', titleAlign: 'left', colSpan: 2 },
      { title: '案例类型', dataIndex: 'caseName', contentAlign: 'left', titleAlign: 'left', colSpan: 2 },
    ],
    [
      { title: '案号', dataIndex: 'caseNo', contentAlign: 'left', titleAlign: 'left', colSpan: 2 },
      {
        title: '公告日期',
        dataIndex: 'publishDate',
        contentAlign: 'left',
        titleAlign: 'left',
        colSpan: 2,
        render: (text) => {
          return wftCommon.formatTime(text)
        },
      },
    ],
    [{ title: '法院', dataIndex: 'courtName', contentAlign: 'left', titleAlign: 'left', colSpan: 5 }],
  ]

  const append = [
    [{ title: '公告内容', dataIndex: 'noticeContent', colSpan: 5, contentAlign: 'left', titleAlign: 'left' }],
  ]

  return (
    <Card title={'送达公告'} style={{ width: 1366 }}>
      <HorizontalTable
        bordered={'dotted'}
        loading={isLoading}
        title={null}
        size={'default'}
        // @ts-expect-error ttt
        rows={rows.concat(parties).concat(append)}
        dataSource={info}
      ></HorizontalTable>
    </Card>
  )
}

export default ReachingAnnouncement
