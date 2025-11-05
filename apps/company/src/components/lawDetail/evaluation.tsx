import React from 'react'
import { Card } from '@wind/wind-ui'
import Table from '@wind/wind-ui-table'
import { wftCommon } from '../../utils/utils'
import CompanyLink from '../company/CompanyLink'

const { HorizontalTable } = Table

function Evaluation(props) {
  const { info, isLoading } = props
  const rows = {
    info: {
      columns: [
        [
          {
            title: '标的物名称',
            dataIndex: 'subjectName',
            colSpan: 5,
            contentAlign: 'left',
            titleAlign: 'left',
          },
        ],
        [
          {
            title: '案号',
            dataIndex: 'caseNo',
            colSpan: 2,
            contentAlign: 'left',
            titleAlign: 'left',
          },
          {
            title: '标的物类型',
            dataIndex: 'propertyType',
            colSpan: 2,
            contentAlign: 'left',
            titleAlign: 'left',
          },
        ],
        [
          {
            title: '法院',
            dataIndex: 'courtName',
            colSpan: 2,
            contentAlign: 'left',
            titleAlign: 'left',
          },
          {
            title: '确定参考价方式',
            dataIndex: 'deterRefer',
            colSpan: 2,
            contentAlign: 'left',
            titleAlign: 'left',
          },
        ],
        [
          {
            title: '公示日期',
            dataIndex: 'date',
            colSpan: 2,
            render: (text) => {
              return wftCommon.formatTime(text)
            },
            contentAlign: 'left',
            titleAlign: 'left',
          },
          {
            title: '原文',
            dataIndex: 'executedCourt',
            colSpan: 2,
            contentAlign: 'left',
            titleAlign: 'left',
          },
        ],
      ],
      horizontal: true,
      name: '基本信息',
    },
    roles: {
      columns: [
        {
          title: '',
          dataIndex: 'companyName',
          align: 'left',
          width: '5%',
          render: (text, row, index) => {
            return index + 1
          },
        },
        {
          title: '角色名称',
          dataIndex: 'companyName',
          contentAlign: 'left',
          titleAlign: 'left',
          width: '55%',
        },
        {
          title: '角色类型',
          dataIndex: 'roleName',
          contentAlign: 'left',
          titleAlign: 'left',
          width: '40%',
        },
      ],
      horizontal: false,
      name: '角色信息',
    },
    orgs: {
      columns: [
        {
          title: '',
          dataIndex: 'companyName',
          align: 'left',
          width: '5%',
          render: (text, row, index) => {
            return index + 1
          },
        },
        {
          title: '评估机构',
          dataIndex: 'companyName',
          align: 'left',
          width: '55%',
        },
        {
          title: '询价评估金额',
          dataIndex: 'evalAmount',
          width: '40%',
          align: 'left',
        },
      ],
      horizontal: false,
      name: '选定评估机构',
    },
  }

  return (
    <Card title={'开庭公告'} style={{ width: 1366 }}>
      {Object.keys(rows).map((i) => {
        return rows[i].horizontal ? (
          <HorizontalTable
            bordered={'dotted'}
            loading={isLoading}
            title={rows[i].name}
            size={'default'}
            rows={rows[i].columns}
            dataSource={info[i]}
          ></HorizontalTable>
        ) : (
          <Table
            bordered={'dotted'}
            loading={isLoading}
            title={rows[i].name}
            size={'default'}
            columns={rows[i].columns}
            dataSource={info[i]}
          ></Table>
        )
      })}
    </Card>
  )
}

export default Evaluation
