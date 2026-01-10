// 越南企业 自定义模块
import CompanyLink from '@/components/company/CompanyLink.tsx'
import { CorpPrimaryModuleCfg } from '@/types/corpDetail'
import { intlNoIndex } from '@/utils/intl'
import React from 'react'

const intl = intlNoIndex
export const vieRowConfig: CorpPrimaryModuleCfg = {
  showCompanyBranchInfo: {
    cmd: '/detail/company/getnewcompanybranchinfo_branch',
    title: intl('138183', '分支机构'),
    modelNum: 'new_branch_num',
    thWidthRadio: ['4%', '38%', '30%', '28%'],
    thName: [
      intl('28846', '序号'),
      intl('138677', '企业名称'),
      window.en_access_config ? 'Company Number' : '企业编号',
      window.en_access_config ? 'Legal Person' : '代表人',
    ],
    align: [1, 0, 0, 0],
    fields: ['NO.', 'branch_name', 'branch_corp_number', 'branch_person'],
    columns: [
      null,
      null,
      null,
      {
        render: (txt, row, idx) => {
          return <CompanyLink name={txt} id={row.branch_id} />
        },
      },
    ],
    extraParams: (param) => {
      return {
        ...param,
        __primaryKey: param.companycode,
      }
    },
  },
}
