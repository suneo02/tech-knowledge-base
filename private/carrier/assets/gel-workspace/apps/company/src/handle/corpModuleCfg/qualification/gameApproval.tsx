import CompanyLink from '@/components/company/CompanyLink.tsx'
import { vipDescDefault } from '@/handle/corpModuleCfg/common/vipDesc.ts'
import { CommonAggParam } from '@/handle/table/aggregation/config.ts'
import { CorpSubModuleVipCfg } from '@/types/corpDetail'
import intl from '@/utils/intl'
import { wftCommonQueryStringObjs } from '@/utils/links/url'
import { Link } from '@wind/wind-ui'
import React from 'react'

export const CorpDetailQualificationGetGameApprovalCfg: CorpSubModuleVipCfg = {
  fn: 'getgameapproval',
  cmd: 'detail/company/getGameApprovalList',
  title: intl('354853', '游戏审批'),
  moreLink: 'getgameapproval',
  modelNum: 'gameLicenseCount',
  notVipTitle: intl('354853', '游戏审批'),
  notVipTips: vipDescDefault,
  thWidthRadio: ['5.2%', '12%', '15%', '10%', '15%', '15%', '15%', '10%', '10%'],
  thName: [
    intl('28846', '序号'),
    intl('354858', '游戏名称'),
    intl('354818', '审批类型'),
    intl('149321', '申报类别'),
    intl('354819', '运营单位'),
    intl('354820', '出版单位'),
    intl('354821', '文号'),
    intl('354855', '出版物号'),
    intl('148644', '批准日期'),
  ],
  align: [1, 0, 0, 0, 0, 0, 0, 0, 0],
  fields: [
    'NO.',
    'gameName',
    'approvalType',
    'declarationCategory',
    'operatingUnit',
    'publisher',
    'documentNumber',
    'publicationNumber',
    'year|formatTime',
  ],
  skipTransFieldsInKeyMode: ['operatingUnit', 'publisher'],
  columns: [
    null,
    {
      render: (txt, row) => {
        const url = `#/gameapproval?id=${row.detailId}&companycode=${wftCommonQueryStringObjs()['companycode'] || ''}`
        return (
          <Link
            href={url}
            // @ts-expect-error ttt
            target="_blank"
            dangerouslySetInnerHTML={{ __html: txt || '--' }}
            data-uc-id="NG62aTHiO"
            data-uc-ct="link"
          ></Link>
        )
      },
    },
    {
      render: (txt) => {
        return <span dangerouslySetInnerHTML={{ __html: txt || '--' }}></span>
      },
    },
    {
      render: (txt) => {
        return <span dangerouslySetInnerHTML={{ __html: txt || '--' }}></span>
      },
    },
    {
      render: (txt, row) => {
        return <CompanyLink name={txt || '--'} id={row.operatingUnitId}></CompanyLink>
      },
    },
    {
      render: (txt, row) => {
        return <CompanyLink name={txt || '--'} id={row.publisherId}></CompanyLink>
      },
    },
    {
      render: (txt) => {
        return <span dangerouslySetInnerHTML={{ __html: txt || '--' }}></span>
      },
    },
    {
      render: (txt) => {
        return <span dangerouslySetInnerHTML={{ __html: txt || '--' }}></span>
      },
    },
  ],

  searchOptionApi: 'detail/company/getGameApprovalListCount',
  searchOptions: [
    {
      default: '审批类型',
      defaultId: '354823',
      key: 'approvalType',
      type: 'select',
      aggsKey: 'agg_approvalType',
      width: 120,
      aggsParams: CommonAggParam,
    },
    {
      default: '申报类别',
      defaultId: '354854',
      key: 'declarationCategory',
      type: 'select',
      aggsKey: 'agg_declarationCategory',
      width: 120,
      aggsParams: CommonAggParam,
    },
    {
      default: '身份不限',
      defaultId: '354822',
      key: 'identity',
      type: 'select',
      aggsKey: 'agg_identity',
      width: 120,
      aggsParams: CommonAggParam,
    },
    {
      default: '批准年份',
      defaultId: '354856',
      key: 'year',
      type: 'select',
      aggsKey: 'agg_year',
      width: 120,
      aggsParams: CommonAggParam,
    },
    {
      type: 'search',
      key: 'searchKey',
      placeholder: '点击搜索', // TODO
      width: 120,
      placeholderId: '354857',
    },
  ],
  extraParams: (param) => ({
    ...param,
    __primaryKey: param.companycode,
  }),
  dataCallback: (data) => {
    try {
      data.map((t, idx) => {
        t.key = idx
      })
      return data
    } catch (e) {
      console.error(e)
    }
  },
}
