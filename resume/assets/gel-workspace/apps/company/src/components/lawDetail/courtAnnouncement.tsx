import { Card } from '@wind/wind-ui'
import Table from '@wind/wind-ui-table'
import React from 'react'
import { usePageTitle } from '../../handle/siteTitle'
import { wftCommon } from '../../utils/utils'
import CompanyLink from '../company/CompanyLink'

const { HorizontalTable } = Table

function CourtAnnouncement(props) {
  const { info, isLoading } = props
  usePageTitle('CourtAnnouncementDetails', [info?.caseId, info?.caseReason])
  const rows = [
    [
      { title: '案由', dataIndex: 'caseReason', colSpan: 2, contentAlign: 'left', titleAlign: 'left' },
      { title: '案例类型', dataIndex: '', colSpan: 2, contentAlign: 'left', titleAlign: 'left' },
    ],
    [
      { title: '案号', dataIndex: 'caseId', colSpan: 2, contentAlign: 'left', titleAlign: 'left' },
      {
        title: '公告日期',
        dataIndex: 'time',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          return wftCommon.formatTime(text)
        },
      },
    ],
    [
      { title: '法院', dataIndex: 'courtName', contentAlign: 'left', titleAlign: 'left', colSpan: 2 },
      { title: '公告类型', dataIndex: 'noticeType', contentAlign: 'left', titleAlign: 'left', colSpan: 2 },
    ],
  ]

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
    info && info.parties
      ? formatterParties(info.parties).map((item) => [
          {
            title: item.roleType,
            dataIndex: item.roleTypeCode,
            colSpan: 5,
            contentAlign: 'left',
            titleAlign: 'left',
            render: () => {
              return item.list.map((ele, index) => {
                const text = index === item.list.length - 1 ? ele.name : ele.name + ','
                return ele.id && ele.id.length ? <CompanyLink name={ele.name} id={ele.id} /> : text
                // return ele.id && ele.id.length?<a target="_blank" href={"../../Company/Company.html?companycode=" + item.id}>{text}</a> :text
              })
              // return <a href={"./companyDetail?needtoolbar=1&companycode=" + item.id}>{item.name}</a>
              // return item.name
            },
          },
        ])
      : []

  const append = [
    [{ title: '公告内容', dataIndex: 'noticeContent', colSpan: 5, contentAlign: 'left', titleAlign: 'left' }],
  ]

  return (
    <Card title={'法院公告'} style={{ width: 1366 }}>
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

export default CourtAnnouncement
