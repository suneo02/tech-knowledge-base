import CompanyLink from '@/components/company/CompanyLink'
import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils'
import { FilePdfO } from '@wind/icons'
import React from 'react'

const COMPANY_TYPE = 489 //判断数据是否是企业类型

export const evaluationDetailRows = {
  1: {
    info: {
      columns: [
        [
          {
            title: intl('370006', '标的物名称'),
            dataIndex: 'subjectName',
            colSpan: 5,
            contentAlign: 'left',
            titleAlign: 'left',
          },
        ],
        [
          {
            title: intl('138190'),
            dataIndex: 'caseNo',
            colSpan: 2,
            contentAlign: 'left',
            titleAlign: 'left',
          },
          {
            title: intl('370007', '标的物类型'),
            dataIndex: 'propertyType',
            colSpan: 2,
            contentAlign: 'left',
            titleAlign: 'left',
          },
        ],
        [
          {
            title: intl('216403'),
            dataIndex: 'courtName',
            colSpan: 2,
            contentAlign: 'left',
            titleAlign: 'left',
          },
          {
            title: intl('370008', '确定参考价方式'),
            dataIndex: 'deterRefer',
            colSpan: 2,
            contentAlign: 'left',
            titleAlign: 'left',
          },
        ],
        [
          {
            title: intl('138143'),
            dataIndex: 'date',
            colSpan: 2,
            render: (text) => {
              return wftCommon.formatTime(text)
            },
            contentAlign: 'left',
            titleAlign: 'left',
          },
          {
            title: intl('370009', '原文'),
            dataIndex: 'rowkey',
            colSpan: 2,
            contentAlign: 'left',
            titleAlign: 'left',
            render: (txt, _row) => {
              return (
                <a href={`/ns/imagebase/10165/${txt}`} target="__blank" data-uc-id="PzTGEjtd1O" data-uc-ct="a">
                  <FilePdfO
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    data-uc-id="GIQxZeowT"
                    data-uc-ct="filepdfo"
                  />
                </a>
              ) //TODO
            },
          },
        ],
      ],
      horizontal: true,
      name: intl('205468'),
    },
    roles: {
      columns: [
        {
          title: '',
          dataIndex: 'companyName',
          align: 'left',
          width: '5%',
          render: (_text, _row, index) => {
            return index + 1
          },
        },
        {
          title: intl('370010', '角色名称'),
          dataIndex: 'companyName',
          contentAlign: 'left',
          titleAlign: 'left',
          width: '55%',
          render: (txt, row) => {
            const { entityType } = row
            return entityType === COMPANY_TYPE ? (
              <CompanyLink name={txt} id={row.companyCode} />
            ) : (
              <span>{row.companyName}</span>
            ) // 如果是企业类型则支持跳转，如果是人物类型不支持跳转
          },
        },
        {
          title: intl('370011', '角色类型'),
          dataIndex: 'roleName',
          contentAlign: 'left',
          titleAlign: 'left',
          width: '40%',
        },
      ],
      horizontal: false,
      name: intl('370012', '角色信息'),
    },
    orgs: {
      columns: [
        {
          title: '',
          dataIndex: 'companyName',
          align: 'left',
          width: '5%',
          render: (_txt, _row, index) => {
            return index + 1
          },
        },
        {
          title: intl('11253'),
          dataIndex: 'companyName',
          align: 'left',
          width: '55%',
          render: (txt, row) => <CompanyLink name={txt} id={row.companyCode} />,
        },
        {
          title: intl('370013'),
          dataIndex: 'evalAmount',
          width: '40%',
          onHeaderCell: () => {
            return {
              style: {
                textAlign: 'left',
              },
            }
          },
          onCell: () => {
            return {
              style: {
                textAlign: 'left',
              },
            }
          },
          render: (_txt, row) => <span>{wftCommon.formatMoneyComma(row.evalAmount)}</span>,
        },
      ],
      horizontal: false,
      name: intl('348574'),
    },
  },
  2: {
    info: {
      columns: [
        [
          {
            title: intl('370006'),
            dataIndex: 'subjectName',
            colSpan: 5,
            contentAlign: 'left',
            titleAlign: 'left',
          },
        ],
        [
          {
            title: intl('138190'),
            dataIndex: 'caseNo',
            colSpan: 2,
            contentAlign: 'left',
            titleAlign: 'left',
          },
          {
            title: intl('370007'),
            dataIndex: 'propertyType',
            colSpan: 2,
            contentAlign: 'left',
            titleAlign: 'left',
          },
        ],
        [
          {
            title: intl('216403'),
            dataIndex: 'courtName',
            colSpan: 2,
            contentAlign: 'left',
            titleAlign: 'left',
          },
          {
            title: intl('216402'),
            dataIndex: 'date',
            colSpan: 2,
            render: (text) => {
              return wftCommon.formatTime(text)
            },
            contentAlign: 'left',
            titleAlign: 'left',
          },
        ],
      ],
      horizontal: true,
      name: intl('257642'),
    },
    roles: {
      columns: [
        {
          title: '',
          dataIndex: 'companyName',
          align: 'left',
          width: '5%',
          render: (_text, _row, index) => {
            return index + 1
          },
        },
        {
          title: intl('370010', '角色名称'),
          dataIndex: 'companyName',
          contentAlign: 'left',
          titleAlign: 'left',
          width: '55%',
          render: (txt, row) => {
            const { entityType } = row
            return entityType === COMPANY_TYPE ? (
              <CompanyLink name={txt} id={row.companyCode} />
            ) : (
              <span>{row.companyName}</span>
            ) // 如果是企业类型则支持跳转，如果是人物类型不支持跳转
          },
        },
        {
          title: intl('370011', '角色类型'),
          dataIndex: 'roleName',
          contentAlign: 'left',
          titleAlign: 'left',
          width: '40%',
        },
      ],
      horizontal: false,
      name: intl('370012', '角色信息'),
    },
    orgs: {
      columns: [
        {
          title: '',
          dataIndex: 'companyName',
          align: 'left',
          width: '5%',
          render: (_txt, _row, index) => {
            return index + 1
          },
        },
        {
          title: intl('11253'),
          dataIndex: 'companyName',
          align: 'left',
          width: '95%',
          render: (txt, row) => <CompanyLink name={txt} id={row.companyCode} />,
        },
      ],
      horizontal: false,
      name: intl('439854', '选定评估机构'),
    },
  },
}
