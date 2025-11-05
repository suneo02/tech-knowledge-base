// 英国企业 自定义模块
import React from 'react'
import { intlNoIndex } from '@/utils/intl'
import CompanyLink from '@/components/company/CompanyLink.tsx'
import { ICorpPrimaryModuleCfg } from '@/components/company/type'
import { ECorpDetailTable } from '@/handle/corp/detail/module/type.ts'
import {
  corpDetailIndustrialRegist,
  corpDetailLastNotice,
  corpDetailMainMember,
} from '@/handle/corpModuleCfg/base/mainMember.ts'

const intl = intlNoIndex

export const englandRowConfig: ICorpPrimaryModuleCfg = {
  showShareholder: {
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
            title: window.en_access_config ? intl('231780') : '控制情况',
            dataIndex: 'holdShareRatioStatement',
            render: (txt) => {
              if (!txt) return '--'
              const txts = txt?.split(';') || ''
              if (txts?.length) {
                return txts.map((t, idx) => {
                  if (!idx) return t
                  return (
                    <>
                      <br /> {t}
                    </>
                  )
                })
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
  showMainMemberInfo: {
    title: intl('138503', '主要人员'),
    modelNum: corpDetailMainMember.modelNum,
    children: [
      {
        enumKey: ECorpDetailTable.MainMemberLatestDisclosure,
        cmd: 'detail/company/getprimarymembers',
        modelNum: corpDetailLastNotice.modelNum,
        title: intl('342094', '最新公示'),
        thWidthRadio: ['4%', '26%', '15%', '15%', '40%'],
        thName: [
          intl('28846', '序号'),
          intl('34979', '姓名'),
          intl('210032', '职务'),
          intl('138691', '任职日期'),
          intl('149538', '联系地址'),
        ],
        align: [1, 0, 0, 0, 0],
        fields: ['NO.', 'personName', 'personTitle', 'startDate', 'contactAddress'],
        extraParams: (param) => {
          param.source = 1
          param.__primaryKey = param.companycode
          return param
        },
      },
      {
        enumKey: ECorpDetailTable.MainMemberRegistration,
        cmd: 'detail/company/getprimarymembers',
        modelNum: corpDetailIndustrialRegist.modelNum,
        title: window.en_access_config ? intl('312175') : '登记信息',
        thWidthRadio: ['4%', '26%', '15%', '15%', '40%'],
        thName: [
          intl('28846', '序号'),
          intl('34979', '姓名'),
          intl('210032', '职务'),
          intl('138691', '任职日期'),
          intl('149538', '联系地址'),
        ],
        align: [1, 0, 0, 0, 0],
        fields: ['NO.', 'personName', 'personTitle', 'startDate', 'contactAddress'],
        extraParams: (param) => {
          param.source = 2
          param.__primaryKey = param.companycode
          return param
        },
      },
    ],
  },
  historylegalperson: {
    cmd: 'detail/company/gethismanager',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    title: intl('208386', '历史法人和高管'),
    modelNum: 'his_manager_num',
    thWidthRadio: ['5.2%', '24%', '10%', '10%', '10%', '30%'],
    thName: [
      intl('28846', '序号'),
      intl('34979', '姓名'),
      intl('138728', '职务'),
      intl('138691', '任职日期'),
      window.en_access_config ? intl('259985') : '卸任日期',
      intl('149538', '联系地址'),
    ],
    align: [1, 0, 0, 0, 0, 0],
    fields: [
      'NO.',
      'person_name',
      'person_position',
      'employment_date|formatTime',
      'departure_date|formatTime',
      'contactAddress',
    ],
    notVipTitle: intl('208386', '历史法人和高管'),
    notVipTips: intl(392536, '购买企业套餐，即可查看该企业历史法人和高管信息'),
  },
}
