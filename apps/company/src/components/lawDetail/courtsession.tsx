import { Card } from '@wind/wind-ui'
import Table from '@wind/wind-ui-table'
import React from 'react'
import { usePageTitle } from '../../handle/siteTitle'
import { wftCommon } from '../../utils/utils'
import CompanyLink from '../company/CompanyLink'

const { HorizontalTable } = Table

function CourtSession(props) {
  const { info, isLoading } = props
  usePageTitle('CourtNoticeDetail', [info?.caseId, info?.caseReason])

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
            render: () => {
              return item.list.map((ele, index) => {
                const text = index === item.list.length - 1 ? ele.name : ele.name + ','
                return ele.id && ele.id.length ? <CompanyLink name={ele.name} id={ele.id} /> : text
              })
              // return <a href={"./companyDetail?needtoolbar=1&companycode=" + item.id}>{item.name}</a>
              // return item.name
            },
            contentAlign: 'left',
            titleAlign: 'left',
          },
        ])
      : null

  const rows = [
    [
      { title: '案由', dataIndex: 'caseReason', colSpan: 2, contentAlign: 'left', titleAlign: 'left' },
      { title: '案件类型', dataIndex: 'noticeType', colSpan: 2, contentAlign: 'left', titleAlign: 'left' },
    ],
    [
      { title: '案号', dataIndex: 'caseId', colSpan: 2, contentAlign: 'left', titleAlign: 'left' },
      {
        title: '开庭日期',
        dataIndex: 'courtDate',
        colSpan: 2,
        render: (text) => {
          return wftCommon.formatTime(text)
        },
        contentAlign: 'left',
        titleAlign: 'left',
      },
    ],
    [
      { title: '法院', dataIndex: 'courtName', colSpan: 2, contentAlign: 'left', titleAlign: 'left' },
      { title: '法庭', dataIndex: 'executedCourt', colSpan: 2, contentAlign: 'left', titleAlign: 'left' },
    ],
  ]

  return (
    <Card title={'开庭公告'} style={{ width: 1366 }}>
      <HorizontalTable
        bordered={'dotted'}
        loading={isLoading}
        title={null}
        size={'default'}
        // @ts-expect-error ttt
        rows={rows.concat(parties)}
        dataSource={info}
        data-uc-id="zVhITzglAF"
        data-uc-ct="horizontaltable"
      ></HorizontalTable>
    </Card>
  )
}

export default CourtSession
