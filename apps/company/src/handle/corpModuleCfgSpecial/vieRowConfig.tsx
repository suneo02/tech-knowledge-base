// 越南企业 自定义模块
import CompanyLink from '@/components/company/CompanyLink.tsx'
import React from 'react'
import { intlNoIndex } from '@/utils/intl'
import { ICorpPrimaryModuleCfg } from '@/components/company/type'

const intl = intlNoIndex
export const vieRowConfig: ICorpPrimaryModuleCfg = {
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
