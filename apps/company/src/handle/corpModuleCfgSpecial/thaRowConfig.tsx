// 泰国企业 自定义模块
import { wftCommon } from '@/utils/utils.tsx'
import CompanyLink from '@/components/company/CompanyLink.tsx'
import React from 'react'
import { intlNoIndex } from '@/utils/intl'
import { ICorpPrimaryModuleCfg } from '@/components/company/type'
import { ECorpDetailTable } from '@/handle/corp/detail/module/type.ts'

const intl = intlNoIndex
export const thaRowConfig: ICorpPrimaryModuleCfg = {
  showShareholder: {
    enumKey: ECorpDetailTable.ShareholderBusinessRegistration,
    title: intl('138506', '股东信息'),
    modelNum: 'businessregisterCount',
    children: [
      {
        title: window.en_access_config ? intl('312175') : '登记信息',
        modelNum: 'businessregisterCount',
        enumKey: ECorpDetailTable.ShareholderBusinessRegistration,
        columns: [
          {
            title: '',
            dataIndex: 'NO.',
            width: '4%',
            align: 'center',
          },
          {
            title: intl('34979', '姓名'),
            dataIndex: 'shareholder',
            width: '48%',
            render: (txt, row, idx) => {
              return (
                <CompanyLink
                  name={txt}
                  id={row.shareholderId}
                  isBenifciary={row.benifciary}
                  isChangeName={row.nameChanged}
                  isActCtrl={row.actContrl}
                />
              )
            },
          },
          {
            title: intl('451204', '认缴出资（万元）'),
            dataIndex: 'promiseMoneyAmount',
            align: 'right',
            render: (txt, row) => {
              if (txt == 0 || !txt) {
                return '--'
              } else {
                return wftCommon.formatMoney(txt, [4, ' ']) + (row.promiseMoneyCurrency ? row.promiseMoneyCurrency : '')
              }
            },
          },
        ],
        cmd: '/detail/company/getshareholderinfomation',
        extraParams: (param) => {
          return {
            ...param,
            expoVer: 1,
            __primaryKey: param.companycode,
          }
        },
      },
    ],
  },
}
