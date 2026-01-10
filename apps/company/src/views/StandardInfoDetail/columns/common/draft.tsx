import intl from '../../../../utils/intl'
import CompanyLink from '../../../../components/company/CompanyLink'
import { wftCommon } from '../../../../utils/utils'
import React from 'react'

export const DraftUnit = {
  title: intl('478702', '起草单位'),
  dataIndex: 'draftingUnit',
  width: '40%',
  render: (text, row) => {
    return <CompanyLink name={text} id={row.windId} />
  },
}

export const DraftNum = {
  title: intl('478721', '参与起草标准数量'),
  dataIndex: 'standardNum',
  render: (text) => {
    return text
  },
}

export const RegisterCapital = {
  title: intl('35779', '注册资本'),
  dataIndex: 'registeredCapital',
  align: 'right',
  render: (text, row) => {
    return wftCommon.formatMoney(text) + (row.currency ? row.currency : '')
  },
}

export const EstablishDate = {
  title: intl('138860', '成立日期'),
  dataIndex: 'establishmentDate',
  render: (text) => {
    return wftCommon.formatTime(text)
  },
}
